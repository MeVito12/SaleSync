import { useState } from 'react';
import { useAuth } from '@/contexts/MockAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Lock, Info } from 'lucide-react';
import { useLocation } from 'wouter';

const LoginPage = () => {
  const [, navigate] = useLocation();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Erro no login');
    }
  };

  const handleQuickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  const exampleUsers = [
    {
      role: 'Master',
      email: 'master@empresa.com',
      password: 'master123',
      description: 'Acesso completo a todas as funcionalidades',
      permissions: ['Vendas', 'Relatórios', 'Cadastros', 'Financeiro', 'Recebimentos', 'Gestão de Usuários']
    },
    {
      role: 'Admin',
      email: 'admin@empresa.com',
      password: 'admin123',
      description: 'Acesso administrativo sem recebimentos',
      permissions: ['Vendas', 'Relatórios', 'Cadastros', 'Financeiro', 'Gestão de Usuários']
    },
    {
      role: 'Representante',
      email: 'representante@empresa.com',
      password: 'rep123',
      description: 'Acesso limitado para representantes',
      permissions: ['Vendas', 'Cadastros']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sistema de Gestão
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para acessar o sistema
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Entre com suas credenciais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Example Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Usuários de Demonstração
              </CardTitle>
              <CardDescription>
                Clique em qualquer usuário para preencher automaticamente as credenciais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exampleUsers.map((user, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleQuickLogin(user.email, user.password)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{user.role}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Clique para usar
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{user.description}</p>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Senha:</strong> {user.password}</div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Permissões:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;