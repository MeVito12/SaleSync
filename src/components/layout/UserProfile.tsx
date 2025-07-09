
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/types/auth';

interface UserProfileProps {
  user: UserType | null;
  sidebarOpen: boolean;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  sidebarOpen,
  onLogout
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'master': return 'text-purple-600 bg-purple-100';
      case 'admin': return 'text-blue-600 bg-blue-100';
      case 'representante': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="p-4 border-t">
      <div className={cn("flex items-center", !sidebarOpen && "justify-center")}>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
        </div>
        {sidebarOpen && (
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
              getRoleColor(user?.role || '')
            )}>
              {getRoleLabel(user?.role || '')}
            </span>
          </div>
        )}
      </div>
      {sidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full mt-2 justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      )}
    </div>
  );
};
