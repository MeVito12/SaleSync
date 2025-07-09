
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, AlertTriangle, Calendar, Target, Loader2 } from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import { SaldoItemDialog } from '@/components/SaldoItemDialog';

const SaldoPage = () => {
  const { sales, loading, dropSaleItems } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('2024-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');

  // Filter sales that have items that can be dropped (not fully dropped)
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.clients?.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sale.numero_pedido && sale.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDateRange = (!dateFrom || sale.data_emissao >= dateFrom) &&
                            (!dateTo || sale.data_emissao <= dateTo);
    
    // Only show sales that are not faturado and can have items dropped
    return matchesSearch && matchesDateRange && 
           (sale.status === 'Aprovado' || sale.status === 'Agendado');
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'bg-green-100 text-green-800';
      case 'Agendado': return 'bg-yellow-100 text-yellow-800';
      case 'Faturado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDropItems = async (saleId: string, itemIds: string[]) => {
    try {
      await dropSaleItems(saleId, itemIds);
    } catch (error) {
      console.error('Error dropping items:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saldo</h1>
          <p className="text-muted-foreground">
            Gerencie itens de vendas em aberto e agendadas - derrubar itens para remover de relatórios
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">De:</span>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Até:</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar cliente ou pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Vendas Disponíveis para Saldo</CardTitle>
            <CardDescription>
              Vendas em aberto e agendadas com itens disponíveis para derrubar
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredSales.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nenhuma venda encontrada</h3>
                <p className="text-sm">
                  Não há vendas disponíveis para derrubar itens
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredSales.map((sale) => (
            <Card key={sale.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{sale.clients?.nome_fantasia}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                        {sale.status}
                      </span>
                      {sale.numero_pedido && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sale.numero_pedido}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Data de Emissão:</span>
                        <p>{new Date(sale.data_emissao).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="font-medium">Indústria:</span>
                        <p>{sale.industries?.nome}</p>
                      </div>
                      <div>
                        <span className="font-medium">Valor Total:</span>
                        <p className="text-green-600 font-semibold">R$ {sale.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <SaldoItemDialog 
                      sale={sale}
                      onDropItems={handleDropItems}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Aviso sobre itens derrubados */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Sobre a função de derrubar itens
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Itens derrubados não são excluídos permanentemente. Eles apenas ficam impedidos de serem faturados 
                e são removidos de relatórios e dashboards de vendas. Esta ação é útil para controlar 
                o saldo de vendas sem perder o histórico. Apenas vendas em status "Aprovado" ou "Agendado" 
                podem ter itens derrubados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaldoPage;
