
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/MockAuthContext';
import { User, UserRole } from '@/types/auth';
import { Loader2 } from 'lucide-react';

interface ManageUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageUsersDialog: React.FC<ManageUsersDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchAllUsers, updateUserRole } = useAuth();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'master': return 'default';
      case 'admin': return 'secondary';
      case 'representante': return 'outline';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'master': return 'Master';
      case 'admin': return 'Admin';
      case 'representante': return 'Representante';
      default: return role;
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const result = await fetchAllUsers();
      if (result.error) {
        toast.error(result.error);
      } else {
        setUsers(result.users);
      }
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const result = await updateUserRole(userId, newRole);
      
      if (result.success) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        toast.success('Perfil alterado com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao alterar perfil');
      }
    } catch (error) {
      toast.error('Erro inesperado ao alterar perfil');
    }
  };

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Usuários</DialogTitle>
          <DialogDescription>
            Visualize e altere os perfis dos usuários do sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando usuários...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil Atual</TableHead>
                  <TableHead>Alterar Perfil</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(newRole: UserRole) => handleRoleChange(user.id, newRole)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="representante">Representante</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="master">Master</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum usuário encontrado
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
