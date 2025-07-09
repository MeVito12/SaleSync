import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Mock data for development
const mockUsers = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@test.com',
    role: 'master'
  },
  {
    id: '2',
    name: 'Usuário Teste',
    email: 'user@test.com',
    role: 'representante'
  },
  {
    id: '3',
    name: 'Representante',
    email: 'rep@test.com',
    role: 'representante'
  }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock admin user management routes
  app.post('/api/admin/users', async (req, res) => {
    try {
      // Simple auth check - just verify token exists
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ success: false, error: 'No authorization header' });
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

          // Mock user creation
          const newUser = {
            id: 'user-' + Date.now(),
            email,
            name,
            role,
            created_at: new Date().toISOString()
          };

          // Add to mock users list
          mockUsers.push({
            id: newUser.id,
            name,
            email,
            role
          });

          return res.json({ success: true, user: newUser });
        }

        case 'fetchAllUsers': {
          console.log('Fetching mock users');
          return res.json({ success: true, users: mockUsers });
        }

        case 'updateUserRole': {
          const { userId, newRole } = data;
          
          if (!userId || !newRole) {
            return res.status(400).json({ 
              success: false, 
              error: 'Missing required fields: userId, newRole' 
            });
          }

          // Find and update mock user
          const userIndex = mockUsers.findIndex(u => u.id === userId);
          if (userIndex === -1) {
            return res.status(404).json({ success: false, error: 'User not found' });
          }

          mockUsers[userIndex].role = newRole;
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
