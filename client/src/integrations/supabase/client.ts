// Mock authentication client for development
export interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    role: string;
  };
}

interface MockSession {
  access_token: string;
  user: MockUser;
}

// Mock users data
const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@test.com',
    user_metadata: {
      name: 'Administrador',
      role: 'master'
    }
  },
  {
    id: '2', 
    email: 'user@test.com',
    user_metadata: {
      name: 'Usuário Teste',
      role: 'representante'
    }
  }
];

let currentSession: MockSession | null = null;

export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      console.log('Mock login attempt:', email);
      
      // Simple mock authentication
      const user = mockUsers.find(u => u.email === email);
      if (user && password === '123456') {
        const session: MockSession = {
          access_token: 'mock-token-' + Date.now(),
          user
        };
        currentSession = session;
        
        return {
          data: { user, session },
          error: null
        };
      }
      
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      };
    },

    getSession: async () => {
      return {
        data: { session: currentSession },
        error: null
      };
    },

    signOut: async () => {
      currentSession = null;
      return { error: null };
    },

    updateUser: async (updates: any) => {
      if (currentSession && updates.password) {
        return { data: { user: currentSession.user }, error: null };
      }
      return { error: { message: 'No session' } };
    },

    getUser: async (token?: string) => {
      if (currentSession) {
        return {
          data: { user: currentSession.user },
          error: null
        };
      }
      return {
        data: { user: null },
        error: { message: 'No user found' }
      };
    },

    onAuthStateChange: (callback: (event: string, session: MockSession | null) => void) => {
      // Mock auth state change listener
      console.log('Auth state change listener set up');
      
      // Return a mock subscription object
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              console.log('Auth listener unsubscribed');
            }
          }
        }
      };
    }
  }
};