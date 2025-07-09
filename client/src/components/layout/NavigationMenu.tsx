
import { 
  CreditCard,
  Package,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavigationItem } from './NavigationConfig';

interface NavigationMenuProps {
  mainNavigation: NavigationItem[];
  financeiroNavigation: NavigationItem[];
  cadastrosNavigation: NavigationItem[];
  location: string;
  sidebarOpen: boolean;
  cadastrosOpen: boolean;
  financeiroOpen: boolean;
  hasFinancialAccess: boolean;
  onLocationChange: (href: string) => void;
  onCadastrosToggle: (open: boolean) => void;
  onFinanceiroToggle: (open: boolean) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  mainNavigation,
  financeiroNavigation,
  cadastrosNavigation,
  location,
  sidebarOpen,
  cadastrosOpen,
  financeiroOpen,
  hasFinancialAccess,
  onLocationChange,
  onCadastrosToggle,
  onFinanceiroToggle
}) => {
  const isActiveCadastros = location === '/clients' || location === '/products' || location === '/industries' || location === '/categories';
  const isActiveFinanceiro = location.startsWith('/financial');

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {/* Main navigation items */}
        {mainNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <li key={item.name}>
              <button
                onClick={() => onLocationChange(item.href)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-blue-100 text-blue-700" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  !sidebarOpen && "justify-center px-2"
                )}
              >
                <Icon className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            </li>
          );
        })}

        {/* Financeiro collapsible section - only for admin and master */}
        {hasFinancialAccess && (
          <li>
            <Collapsible open={financeiroOpen} onOpenChange={onFinanceiroToggle}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActiveFinanceiro 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    !sidebarOpen && "justify-center px-2"
                  )}
                >
                  <CreditCard className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">Financeiro</span>
                      {financeiroOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              {sidebarOpen && (
                <CollapsibleContent className="space-y-1 mt-1">
                  {financeiroNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href;
                    
                    return (
                      <button
                        key={item.name}
                        onClick={() => onLocationChange(item.href)}
                        className={cn(
                          "w-full flex items-center pl-6 pr-3 py-2 text-sm rounded-md transition-colors",
                          isActive 
                            ? "bg-blue-100 text-blue-700" 
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </CollapsibleContent>
              )}
            </Collapsible>
          </li>
        )}

        {/* Cadastros collapsible section */}
        <li>
          <Collapsible open={cadastrosOpen} onOpenChange={onCadastrosToggle}>
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActiveCadastros 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  !sidebarOpen && "justify-center px-2"
                )}
              >
                <Package className={cn("h-5 w-5", sidebarOpen && "mr-3")} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">Cadastros</span>
                    {cadastrosOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </>
                )}
              </button>
            </CollapsibleTrigger>
            {sidebarOpen && (
              <CollapsibleContent className="space-y-1 mt-1">
                {cadastrosNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  
                  return (
                    <button
                      key={item.name}
                      onClick={() => onLocationChange(item.href)}
                      className={cn(
                        "w-full flex items-center pl-6 pr-3 py-2 text-sm rounded-md transition-colors",
                        isActive 
                          ? "bg-blue-100 text-blue-700" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </CollapsibleContent>
            )}
          </Collapsible>
        </li>
      </ul>
    </nav>
  );
};
