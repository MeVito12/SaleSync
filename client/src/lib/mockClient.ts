// Mock client to replace Supabase integration
export const mockClient = {
  // Mock authentication functions
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      return {
        data: { user: null, session: null },
        error: { message: 'Mock auth - login disabled' }
      };
    },
    
    getSession: async () => {
      return {
        data: { session: null },
        error: null
      };
    },
    
    signOut: async () => {
      return { error: null };
    },
    
    updateUser: async (updates: any) => {
      return { error: { message: 'Mock auth - updates disabled' } };
    },
    
    getUser: async () => {
      return {
        data: { user: null },
        error: { message: 'Mock auth - no user' }
      };
    },
    
    onAuthStateChange: (callback: Function) => {
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },
  
  // Mock database functions
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Mock DB - no data' } }),
        order: (column: string) => Promise.resolve({ data: [], error: null })
      }),
      order: (column: string) => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: { message: 'Mock DB - no data' } })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: { message: 'Mock DB - insert disabled' } })
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Mock DB - update disabled' } })
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ error: { message: 'Mock DB - delete disabled' } })
    })
  })
};