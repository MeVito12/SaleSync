import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, UserRole } from '@/types/auth';

// Usuários de exemplo para cada role
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Master',
    email: 'master@empresa.com',
    role: 'master'
  },
  {
    id: '2',
    name: 'João Admin',
    email: 'admin@empresa.com',
    role: 'admin'
  },
  {
    id: '3',
    name: 'Maria Representante',
    email: 'representante@empresa.com',
    role: 'representante'
  }
];

// Credenciais de exemplo (email:senha)
const mockCredentials = {
  'master@empresa.com': 'master123',
  'admin@empresa.com': 'admin123',
  'representante@empresa.com': 'rep123'
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);

  // Função para encontrar usuário por email
  const findUserByEmail = (email: string): User | null => {
    return mockUsers.find(u => u.email === email) || null;
  };

  // Função para validar credenciais
  const validateCredentials = (email: string, password: string): boolean => {
    return mockCredentials[email as keyof typeof mockCredentials] === password;
  };

  const contextValue: AuthContextType = {
    user,
    session: null,
    isLoading,
    isInitialized,
    login: async (email: string, password: string) => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula delay de autenticação
      
      // Valida credenciais
      if (!validateCredentials(email, password)) {
        setIsLoading(false);
        return { success: false, error: 'Email ou senha incorretos' };
      }

      // Encontra o usuário
      const foundUser = findUserByEmail(email);
      if (!foundUser) {
        setIsLoading(false);
        return { success: false, error: 'Usuário não encontrado' };
      }

      setUser(foundUser);
      setIsLoading(false);
      
      // Salva no localStorage para persistir a sessão
      localStorage.setItem('mockUser', JSON.stringify(foundUser));
      
      return { success: true, user: foundUser };
    },
    logout: async () => {
      setUser(null);
      localStorage.removeItem('mockUser');
      return { success: true };
    },
    createUser: async (userData: any) => {
      // Verifica se o email já existe
      if (findUserByEmail(userData.email)) {
        return { success: false, error: 'Email já cadastrado' };
      }
      
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role
      };
      
      mockUsers.push(newUser);
      return { success: true, user: newUser };
    },
    changePassword: async (passwordData: any) => {
      // Simula mudança de senha
      return { success: true };
    },
    fetchAllUsers: async () => {
      return { users: mockUsers };
    },
    updateUserRole: async (userId: string, newRole: UserRole) => {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].role = newRole;
        // Se for o usuário atual, atualiza o contexto
        if (user && user.id === userId) {
          const updatedUser = { ...user, role: newRole };
          setUser(updatedUser);
          localStorage.setItem('mockUser', JSON.stringify(updatedUser));
        }
        return { success: true };
      }
      return { success: false, error: 'Usuário não encontrado' };
    }
  };

  // Restaura usuário do localStorage na inicialização
  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error);
        localStorage.removeItem('mockUser');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};