
import React, { createContext, useContext, ReactNode } from 'react';
import { User, UserContextType } from '../types/User';
import { useSupabaseUsers } from '../hooks/useSupabaseUsers';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    followUser,
    unfollowUser,
    getUser
  } = useSupabaseUsers();

  return (
    <UserContext.Provider value={{
      users,
      loading,
      addUser,
      updateUser,
      deleteUser,
      followUser,
      unfollowUser,
      getUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
