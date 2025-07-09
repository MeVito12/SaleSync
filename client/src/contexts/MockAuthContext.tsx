import React, { createContext, useContext } from 'react';
import { User, AuthContextType } from '@/types/auth';

// Mock user data for testing
const mockUser: User = {
  id: '1',
  name: 'Usuário Teste',
  email: 'test@example.com',
  role: 'master'
};

// Mock auth context that provides all the needed functions
const mockAuthContext: AuthContextType = {
  user: mockUser,
  isLoading: false,
  login: async () => true,
  logout: () => {},
  createUser: async () => ({ success: true }),
  changePassword: async () => ({ success: true }),
  fetchAllUsers: async () => ({ users: [mockUser] }),
  updateUserRole: async () => ({ success: true })
};

const MockAuthContext = createContext<AuthContextType>(mockAuthContext);

export const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
};

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockAuthContext.Provider value={mockAuthContext}>
      {children}
    </MockAuthContext.Provider>
  );
};