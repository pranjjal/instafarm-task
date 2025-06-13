
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/User';
import { toast } from 'sonner';

export const useSupabaseUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
        return;
      }

      const formattedUsers: User[] = data.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.date_of_birth,
        profilePicture: user.profile_picture || undefined,
        followers: user.followers || [],
        following: user.following || [],
        createdAt: user.created_at
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Add user to Supabase
  const addUser = async (userData: Omit<User, 'id' | 'createdAt' | 'followers' | 'following'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          date_of_birth: userData.dateOfBirth,
          profile_picture: userData.profilePicture
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding user:', error);
        toast.error('Failed to create user');
        throw error;
      }

      console.log('User created successfully:', data);
      toast.success('User created successfully!');
      
      // The real-time subscription will handle updating the UI
      return data;
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  };

  // Update user in Supabase
  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const updateData: any = {};
      if (userData.firstName) updateData.first_name = userData.firstName;
      if (userData.lastName) updateData.last_name = userData.lastName;
      if (userData.email) updateData.email = userData.email;
      if (userData.phone) updateData.phone = userData.phone;
      if (userData.dateOfBirth) updateData.date_of_birth = userData.dateOfBirth;
      if (userData.profilePicture !== undefined) updateData.profile_picture = userData.profilePicture;
      if (userData.followers) updateData.followers = userData.followers;
      if (userData.following) updateData.following = userData.following;

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update user');
        throw error;
      }

      console.log('User updated successfully');
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  };

  // Delete user from Supabase
  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
        throw error;
      }

      console.log('User deleted successfully');
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      throw error;
    }
  };

  // Follow/unfollow functionality
  const followUser = async (userId: string, targetUserId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      const targetUser = users.find(u => u.id === targetUserId);
      
      if (!user || !targetUser) return;

      const newFollowing = [...user.following, targetUserId];
      const newFollowers = [...targetUser.followers, userId];

      await Promise.all([
        updateUser(userId, { following: newFollowing }),
        updateUser(targetUserId, { followers: newFollowers })
      ]);

      console.log('Follow operation completed');
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const unfollowUser = async (userId: string, targetUserId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      const targetUser = users.find(u => u.id === targetUserId);
      
      if (!user || !targetUser) return;

      const newFollowing = user.following.filter(id => id !== targetUserId);
      const newFollowers = targetUser.followers.filter(id => id !== userId);

      await Promise.all([
        updateUser(userId, { following: newFollowing }),
        updateUser(targetUserId, { followers: newFollowers })
      ]);

      console.log('Unfollow operation completed');
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Refetch users when any change occurs
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    followUser,
    unfollowUser,
    getUser,
    refetch: fetchUsers
  };
};
