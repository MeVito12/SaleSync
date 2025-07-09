
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const FinancialPage = () => {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Se não estiver em uma sub-rota específica, redirecionar para payment-methods
    if (location === '/financial') {
      setLocation('/financial/payment-methods');
    }
  }, [location, setLocation]);

  const handleTabChange = (value: string) => {
    setLocation(`/financial/${value}`);
  };

  const getCurrentTab = () => {
    if (location.includes('/payment-methods')) return 'payment-methods';
    if (location.includes('/commission-rules')) return 'commission-rules';
    if (location.includes('/receivables')) return 'receivables';
    if (location.includes('/saldo')) return 'saldo';
    return 'payment-methods';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground">
          Gerencie aspectos financeiros do sistema
        </p>
      </div>

      <Tabs value={getCurrentTab()} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payment-methods">Condições de Pagamento</TabsTrigger>
          <TabsTrigger value="commission-rules">Regras de Comissão</TabsTrigger>
          <TabsTrigger value="receivables">Recebimentos</TabsTrigger>
          <TabsTrigger value="saldo">Saldo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment-methods" className="mt-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Redirecionando para Condições de Pagamento...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="commission-rules" className="mt-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Redirecionando para Regras de Comissão...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="receivables" className="mt-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Redirecionando para Recebimentos...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="saldo" className="mt-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Redirecionando para Saldo...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialPage;
