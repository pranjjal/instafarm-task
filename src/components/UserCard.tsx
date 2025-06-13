
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types/User';
import { useUsers } from '../context/UserContext';
import { UserPlus, UserMinus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UserCardProps {
  user: User;
  currentUserId?: string;
  onDelete?: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, currentUserId, onDelete }) => {
  const { followUser, unfollowUser, getUser } = useUsers();

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const currentUser = currentUserId ? getUser(currentUserId) : null;
  const isFollowing = currentUser?.following.includes(user.id) || false;
  const canFollow = currentUserId && currentUserId !== user.id;

  const handleFollow = () => {
    if (!currentUserId) return;
    if (isFollowing) {
      unfollowUser(currentUserId, user.id);
    } else {
      followUser(currentUserId, user.id);
    }
  };

  return (
    <Card className="group bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={user.profilePicture || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Age {calculateAge(user.dateOfBirth)}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <span className="font-medium text-blue-600">{user.followers.length}</span>
                <span className="ml-1">followers</span>
              </span>
              <span className="flex items-center">
                <span className="font-medium text-purple-600">{user.following.length}</span>
                <span className="ml-1">following</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {canFollow && (
              <Button
                onClick={handleFollow}
                size="sm"
                variant={isFollowing ? "outline" : "default"}
                className={`transition-all duration-200 ${
                  isFollowing 
                    ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus size={14} className="mr-1" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={14} className="mr-1" />
                    Follow
                  </>
                )}
              </Button>
            )}
            
            <div className="flex space-x-1">
              <Link to={`/edit/${user.id}`}>
                <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:text-blue-600">
                  <Edit size={14} />
                </Button>
              </Link>
              
              {onDelete && (
                <Button
                  onClick={() => onDelete(user.id)}
                  size="sm"
                  variant="outline"
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
