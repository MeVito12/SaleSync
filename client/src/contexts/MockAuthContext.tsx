import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';

const mockUser: User = {
  id: '1',
  name: 'Usuário Teste',
  email: 'usuario@teste.com',
  role: 'master'
};

const mockAuthContext: AuthContextType = {
  user: mockUser,
  session: null,
  isLoading: false,
  isInitialized: true,
  login: async (email: string, password: string) => {
    return { success: true, user: mockUser };
  },
  logout: async () => {
    return { success: true };
  },
  createUser: async (userData: any) => {
    return { success: true, user: mockUser };
  },
  changePassword: async (passwordData: any) => {
    return { success: true };
  },
  fetchAllUsers: async () => {
    return { users: [mockUser] };
  },
  updateUserRole: async (data: any) => {
    return { success: true };
  }
};

const AuthContext = createContext<AuthContextType>(mockAuthContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);

  const contextValue: AuthContextType = {
    user,
    session: null,
    isLoading,
    isInitialized,
    login: async (email: string, password: string) => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(mockUser);
      setIsLoading(false);
      return { success: true, user: mockUser };
    },
    logout: async () => {
      setUser(null);
      return { success: true };
    },
    createUser: async (userData: any) => {
      return { success: true, user: mockUser };
    },
    changePassword: async (passwordData: any) => {
      return { success: true };
    },
    fetchAllUsers: async () => {
      return { users: [mockUser] };
    },
    updateUserRole: async (data: any) => {
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};