
import { useState } from 'react';
import { useAuth } from '@/contexts/MockAuthContext';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { SidebarHeader } from './SidebarHeader';
import { NavigationMenu } from './NavigationMenu';
import { UserProfile } from './UserProfile';
import { 
  getMainNavigation, 
  cadastrosNavigation, 
  getFinanceiroNavigation, 
  hasFinancialAccess 
} from './NavigationConfig';

interface SidebarProps {
  sidebarOpen: boolean;
  onChangePassword: () => void;
  onCreateUser: () => void;
  onManageUsers: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  onChangePassword,
  onCreateUser,
  onManageUsers
}) => {
  const [cadastrosOpen, setCadastrosOpen] = useState(true);
  const [financeiroOpen, setFinanceiroOpen] = useState(true);
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const mainNavigation = getMainNavigation(user?.role);
  const financeiroNavigation = getFinanceiroNavigation(user?.role);
  const userHasFinancialAccess = hasFinancialAccess(user?.role);

  return (
    <div className={cn(
      "bg-white shadow-lg transition-all duration-300 flex flex-col",
      sidebarOpen ? "w-64" : "w-16"
    )}>
      <SidebarHeader
        sidebarOpen={sidebarOpen}
        userRole={user?.role}
        onChangePassword={onChangePassword}
        onCreateUser={onCreateUser}
        onManageUsers={onManageUsers}
      />

      <NavigationMenu
        mainNavigation={mainNavigation}
        financeiroNavigation={financeiroNavigation}
        cadastrosNavigation={cadastrosNavigation}
        location={location}
        sidebarOpen={sidebarOpen}
        cadastrosOpen={cadastrosOpen}
        financeiroOpen={financeiroOpen}
        hasFinancialAccess={userHasFinancialAccess}
        onLocationChange={setLocation}
        onCadastrosToggle={setCadastrosOpen}
        onFinanceiroToggle={setFinanceiroOpen}
      />

      <UserProfile
        user={user}
        sidebarOpen={sidebarOpen}
        onLogout={logout}
      />
    </div>
  );
};
