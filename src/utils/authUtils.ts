
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '@/types/auth';

export const getUserRole = (supabaseUser: SupabaseUser): UserRole => {
  // Check user_metadata for role first
  if (supabaseUser.user_metadata?.role) {
    return supabaseUser.user_metadata.role;
  }
  
  // Fallback to email-based role determination
  const email = supabaseUser.email || '';
  if (email === 'auxiliar@ldsnews.com.br') return 'master';
  if (email.includes('admin')) return 'admin';
  return 'representante';
};

export const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
  try {
    // Get role from user metadata or email
    const role = getUserRole(supabaseUser);
    
    // Create basic user object first for faster initial load
    const basicUser = {
      id: supabaseUser.id,
      name: supabaseUser.email?.split('@')[0] || 'Usuário',
      email: supabaseUser.email || '',
      role
    };
    
    // Try to fetch profile name only if we have a user id
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', supabaseUser.id)
        .single();

      if (profile?.name) {
        return {
          ...basicUser,
          name: profile.name
        };
      }
    } catch (profileError) {
      // Continue with email-based name if profile fetch fails
      console.log('Profile fetch failed, using email-based name:', profileError);
    }
    
    return basicUser;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    
    // Return a basic user object even if everything fails
    return {
      id: supabaseUser.id,
      name: supabaseUser.email?.split('@')[0] || 'Usuário',
      email: supabaseUser.email || '',
      role: getUserRole(supabaseUser)
    };
  }
};
