
import { supabase } from '@/integrations/supabase/client';

// Cache do usuário para evitar múltiplas chamadas
let cachedUser: any = null;
let userCacheTime = 0;
const USER_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const getCachedUser = async () => {
  const now = Date.now();
  if (cachedUser && (now - userCacheTime) < USER_CACHE_DURATION) {
    return cachedUser;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  cachedUser = user;
  userCacheTime = now;
  return user;
};
