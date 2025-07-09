
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  FileText,
  Receipt,
  Percent,
  DollarSign,
  Wallet,
  Factory,
  Tag
} from 'lucide-react';
import { UserRole } from '@/types/auth';

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
}

export const getMainNavigation = (userRole?: UserRole): NavigationItem[] => {
  const baseNavigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Vendas', href: '/sales', icon: ShoppingCart },
  ];

  // Only add Reports for admin and master users (representante cannot access)
  if (userRole === 'admin' || userRole === 'master') {
    baseNavigation.push({ name: 'Relatórios', href: '/reports', icon: FileText });
  }

  return baseNavigation;
};

export const cadastrosNavigation: NavigationItem[] = [
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Indústrias', href: '/industries', icon: Factory },
  { name: 'Categorias', href: '/categories', icon: Tag },
];

export const getFinanceiroNavigation = (userRole?: UserRole): NavigationItem[] => {
  const baseFinanceiro = [
    { name: 'Condições de Pagamento', href: '/financial/payment-methods', icon: Receipt },
    { name: 'Regras de Comissão', href: '/financial/commission-rules', icon: Percent },
    { name: 'Saldo', href: '/financial/saldo', icon: Wallet },
  ];

  // Only add Recebimentos for master users (admin cannot access)
  if (userRole === 'master') {
    baseFinanceiro.splice(2, 0, { name: 'Recebimentos', href: '/financial/receivables', icon: DollarSign });
  }

  return baseFinanceiro;
};

export const hasFinancialAccess = (userRole?: UserRole): boolean => {
  return userRole === 'admin' || userRole === 'master';
};
