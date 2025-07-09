
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User, AuthContextType } from '@/types/auth';
import { fetchUserProfile } from '@/utils/authUtils';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { cleanupAuthState } from '@/utils/authCleanup';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { createUser, changePassword, fetchAllUsers, updateUserRole } = useAuthOperations();

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get current session first
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          cleanupAuthState();
          if (mounted) {
            setSession(null);
            setUser(null);
            setIsLoading(false);
            setIsInitialized(true);
          }
          return;
        }
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          try {
            const userData = await fetchUserProfile(session.user);
            if (mounted && userData) {
              setUser(userData);
            }
          } catch (error) {
            console.error('Error fetching user profile during init:', error);
            if (mounted) {
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
        
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          cleanupAuthState();
          setSession(null);
          setUser(null);
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Set up auth state listener after initialization
    const setupAuthListener = () => {
      authSubscription = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted || !isInitialized) return;
          
          console.log('Auth state change:', event, session?.user?.email);
          
          setSession(session);
          
          if (event === 'SIGNED_IN' && session?.user) {
            try {
              const userData = await fetchUserProfile(session.user);
              if (mounted && userData) {
                setUser(userData);
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              if (mounted) {
                setUser(null);
              }
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        }
      );
    };

    // Initialize auth first, then set up listener
    initializeAuth().then(() => {
      if (mounted) {
        setupAuthListener();
      }
    });

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.data?.subscription?.unsubscribe?.();
      }
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      console.log('Starting login process...');
      
      // Clean up any existing auth state before attempting login
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('Login error:', error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user && data.session) {
        console.log('Login successful, redirecting...');
        // Force immediate redirect without waiting for auth state change
        window.location.href = '/';
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login exception:', error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('Logging out...');
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Signout error (ignoring):', err);
      }
      
      setUser(null);
      setSession(null);
      
      // Force page reload for clean state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setSession(null);
      window.location.href = '/login';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading,
      createUser,
      changePassword,
      fetchAllUsers,
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
