
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useUsers } from '../context/UserContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Edit, Save, ArrowLeft, UserMinus, Users } from 'lucide-react';
import { toast } from 'sonner';

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, updateUser, getUser, unfollowUser } = useUsers();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    profilePicture: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = id ? getUser(id) : null;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, dateOfBirth } = formData;
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !dateOfBirth) {
      toast.error('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser(id, formData);
      toast.success('User updated successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to update user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnfollow = (targetUserId: string) => {
    if (!id) return;
    unfollowUser(id, targetUserId);
    toast.success('Unfollowed user');
  };

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-500 to-purple-500">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const followingUsers = users.filter(u => user.following.includes(u.id));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-4 hover:bg-white/60"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Edit User Profile
            </h1>
            <p className="text-gray-600">
              Update user information and manage following list
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Information Form */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="text-blue-600" size={24} />
                <span>User Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-white/60 border-white/20"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-white/60 border-white/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/60 border-white/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white/60 border-white/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="bg-white/60 border-white/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  <Input
                    id="profilePicture"
                    name="profilePicture"
                    type="url"
                    value={formData.profilePicture}
                    onChange={handleInputChange}
                    className="bg-white/60 border-white/20"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="hover:bg-white/60"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Following List */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="text-purple-600" size={24} />
                <span>Following ({followingUsers.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {followingUsers.length > 0 ? (
                <div className="space-y-3">
                  {followingUsers.map(followedUser => (
                    <div key={followedUser.id} className="flex items-center justify-between p-3 bg-white/40 rounded-lg border border-white/20">
                      <div className="flex items-center space-x-3">
                        <img
                          src={followedUser.profilePicture || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
                          alt={`${followedUser.firstName} ${followedUser.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {followedUser.firstName} {followedUser.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{followedUser.email}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleUnfollow(followedUser.id)}
                        size="sm"
                        variant="outline"
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      >
                        <UserMinus size={14} className="mr-1" />
                        Unfollow
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Not following anyone yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EditUser;
