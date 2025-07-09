
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

interface UpdateUserRoleData {
  userId: string;
  newRole: UserRole;
}

interface ChangePasswordData {
  newPassword: string;
}

const callAdminFunction = async (action: string, data: any = {}) => {
  console.log('Calling admin function with action:', action, 'data:', data);
  
  try {
    const session = await supabase.auth.getSession();
    
    if (!session.data.session) {
      throw new Error('Nenhuma sessão ativa encontrada');
    }

    console.log('Session found, making request to admin function');
    
    const requestBody = { action, ...data };
    console.log('Request body:', JSON.stringify(requestBody));

    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.data.session.access_token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Admin function response:', result);

    if (!result.success) {
      throw new Error(result.error || 'Erro desconhecido');
    }

    return result;
  } catch (error: any) {
    console.error('Error calling admin function:', error);
    throw new Error('Erro de comunicação com o servidor. Tente novamente.');
  }
};

export const useAuthOperations = () => {
  const createUser = async (userData: CreateUserData) => {
    try {
      const result = await callAdminFunction('createUser', userData);
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('Create user error:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao criar usuário' 
      };
    }
  };

  const fetchAllUsers = async (): Promise<{ users: User[], error?: string }> => {
    try {
      console.log('Fetching all users');
      const result = await callAdminFunction('fetchAllUsers', {});
      console.log('Fetch users result:', result);
      
      // Ensure role is properly typed as UserRole
      const users: User[] = (result.users || []).map((user: any) => ({
        ...user,
        role: user.role as UserRole
      }));
      
      return { users };
    } catch (error: any) {
      console.error('Fetch users error:', error);
      return { 
        users: [], 
        error: error.message || 'Erro ao buscar usuários' 
      };
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const data: UpdateUserRoleData = { userId, newRole };
      const result = await callAdminFunction('updateUserRole', data);
      return { success: true };
    } catch (error: any) {
      console.error('Update user role error:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao atualizar função do usuário' 
      };
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao alterar senha' 
      };
    }
  };

  return {
    createUser,
    fetchAllUsers,
    updateUserRole,
    changePassword
  };
};
