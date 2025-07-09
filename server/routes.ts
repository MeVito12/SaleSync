import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin user management routes
  app.post('/api/admin/users', async (req, res) => {
    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ success: false, error: 'No authorization header' });
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (authError || !user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { action, ...data } = req.body;
      
      switch (action) {
        case 'createUser': {
          const { email, password, name, role } = data;
          
          if (!email || !password || !name || !role) {
            return res.status(400).json({ 
              success: false, 
              error: 'Missing required fields: email, password, name, role' 
            });
          }

          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
              name,
              role
            }
          });

          if (createError) {
            return res.status(400).json({ success: false, error: createError.message });
          }

          // Create profile entry
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: newUser.user.id,
              name
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }

          return res.json({ success: true, user: newUser.user });
        }

        case 'fetchAllUsers': {
          const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

          if (authError) {
            return res.status(400).json({ success: false, error: authError.message });
          }

          const userIds = authUsers.users.map(u => u.id);
          let profiles = [];
          
          if (userIds.length > 0) {
            const { data: profilesData, error: profileError } = await supabaseAdmin
              .from('profiles')
              .select('id, name')
              .in('id', userIds);

            if (!profileError) {
              profiles = profilesData || [];
            }
          }

          const users = authUsers.users.map(authUser => {
            const profile = profiles.find(p => p.id === authUser.id);
            const role = authUser.user_metadata?.role || 'representante';
            
            let userName = profile?.name || authUser.user_metadata?.name;
            if (!userName && authUser.email) {
              userName = authUser.email.split('@')[0];
            }
            if (!userName) {
              userName = 'Usuário';
            }
            
            return {
              id: authUser.id,
              name: userName,
              email: authUser.email || '',
              role
            };
          });

          return res.json({ success: true, users });
        }

        case 'updateUserRole': {
          const { userId, newRole } = data;
          
          if (!userId || !newRole) {
            return res.status(400).json({ 
              success: false, 
              error: 'Missing required fields: userId, newRole' 
            });
          }

          const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(userId);
          if (!targetUser?.user) {
            return res.status(404).json({ success: false, error: 'User not found' });
          }

          const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { 
              ...targetUser.user.user_metadata,
              role: newRole 
            }
          });

          if (error) {
            return res.status(400).json({ success: false, error: error.message });
          }

          return res.json({ success: true });
        }

        default:
          return res.status(400).json({ success: false, error: `Invalid action: ${action}` });
      }
    } catch (error) {
      console.error('Admin users error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
