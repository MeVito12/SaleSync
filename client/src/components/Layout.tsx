
import { useState } from 'react';
import { Sidebar } from './layout/Sidebar';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';
import { CreateUserDialog } from '@/components/CreateUserDialog';
import { ManageUsersDialog } from '@/components/ManageUsersDialog';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [manageUsersOpen, setManageUsersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onChangePassword={() => setChangePasswordOpen(true)}
        onCreateUser={() => setCreateUserOpen(true)}
        onManageUsers={() => setManageUsersOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Dialogs */}
      <ChangePasswordDialog 
        open={changePasswordOpen} 
        onOpenChange={setChangePasswordOpen} 
      />
      <CreateUserDialog 
        open={createUserOpen} 
        onOpenChange={setCreateUserOpen} 
      />
      <ManageUsersDialog 
        open={manageUsersOpen} 
        onOpenChange={setManageUsersOpen} 
      />
    </div>
  );
};

export default Layout;
