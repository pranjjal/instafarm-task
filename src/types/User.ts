
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profilePicture?: string;
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface UserContextType {
  users: User[];
  loading?: boolean;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'followers' | 'following'>) => Promise<any>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  followUser: (userId: string, targetUserId: string) => Promise<void>;
  unfollowUser: (userId: string, targetUserId: string) => Promise<void>;
  getUser: (id: string) => User | undefined;
}
