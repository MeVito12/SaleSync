
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from '@/types/auth';

interface SidebarHeaderProps {
  sidebarOpen: boolean;
  userRole?: UserRole;
  onChangePassword: () => void;
  onCreateUser: () => void;
  onManageUsers: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  sidebarOpen,
  userRole,
  onChangePassword,
  onCreateUser,
  onManageUsers
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center space-x-2", !sidebarOpen && "justify-center")}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          {sidebarOpen && (
            <span className="text-xl font-bold text-gray-900">SaleSync</span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onChangePassword}>
              Alterar Senha
            </DropdownMenuItem>
            {(userRole === 'admin' || userRole === 'master') && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onCreateUser}>
                  Cadastrar Usuário
                </DropdownMenuItem>
              </>
            )}
            {userRole === 'master' && (
              <DropdownMenuItem onClick={onManageUsers}>
                Gerenciar Usuários
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
