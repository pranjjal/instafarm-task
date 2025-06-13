
import React, { useState } from 'react';
import Layout from '../components/Layout';
import UserCard from '../components/UserCard';
import { useUsers } from '../context/UserContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { users, loading, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>(''); // Will be set when users load

  // Set default selected user when users load
  React.useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId]);

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading users...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            User Management Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your user community with ease. View profiles, track followers, and build connections.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{users.length}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {users.reduce((acc, user) => acc + user.followers.length, 0)}
            </div>
            <div className="text-gray-600">Total Connections</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-600">
              {users.length > 0 ? Math.round(users.reduce((acc, user) => acc + user.followers.length, 0) / users.length) : 0}
            </div>
            <div className="text-gray-600">Avg. Followers</div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/60 border-white/20 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {/* User Selection for Follow Demo */}
        {users.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Viewing as user (for follow functionality):
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white/80 text-sm"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              currentUserId={selectedUserId}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search terms or create a new user.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
