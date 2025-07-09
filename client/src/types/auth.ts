
// import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'master' | 'admin' | 'representante';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface ChangePasswordData {
  newPassword: string;
}

export interface AuthContextType {
  user: User | null;
  session: any;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<{ success: boolean }>;
  createUser: (userData: CreateUserData) => Promise<{ success: boolean; user?: User; error?: string }>;
  changePassword: (data: ChangePasswordData) => Promise<{ success: boolean; error?: string }>;
  fetchAllUsers: () => Promise<{ users: User[]; error?: string }>;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<{ success: boolean; error?: string }>;
}
