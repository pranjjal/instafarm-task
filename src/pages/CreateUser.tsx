
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useUsers } from '../context/UserContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserPlus, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const { addUser } = useUsers();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    profilePicture: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    if (birthDate >= today) {
      toast.error('Date of birth must be in the past');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await addUser(formData);
      navigate('/');
    } catch (error) {
      console.error('Failed to create user:', error);
      // Toast error is already shown in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
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
              Create New User
            </h1>
            <p className="text-gray-600">
              Add a new user to your community
            </p>
          </div>
        </div>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="text-blue-600" size={24} />
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
                    placeholder="Enter first name"
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
                    placeholder="Enter last name"
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
                  placeholder="Enter email address"
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
                  placeholder="Enter phone number"
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
                  placeholder="Enter profile picture URL (optional)"
                  className="bg-white/60 border-white/20"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="hover:bg-white/60"
                  disabled={isSubmitting}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateUser;
