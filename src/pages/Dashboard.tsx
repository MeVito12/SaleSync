
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinancialFormat } from '@/hooks/useFinancialFormat';
import { useSales } from '@/hooks/useSales';
import { useReceivables } from '@/hooks/useReceivables';
import { useMemo } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const { formatCurrency } = useFinancialFormat();
  const { sales, loading: salesLoading } = useSales();
  const { receivables, loading: receivablesLoading } = useReceivables();

  const dashboardData = useMemo(() => {
    if (salesLoading || receivablesLoading) return null;

    const totalSales = sales.reduce((sum, sale) => sum + sale.valor, 0);
    const approvedSales = sales.filter(sale => sale.status === 'Aprovado').reduce((sum, sale) => sum + sale.valor, 0);
    const scheduledSales = sales.filter(sale => sale.status === 'Agendado').reduce((sum, sale) => sum + sale.valor, 0);
    const invoicedSales = sales.filter(sale => sale.status === 'Faturado').reduce((sum, sale) => sum + sale.valor, 0);

    // Dados dos últimos 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const salesByMonth = sales
      .filter(sale => new Date(sale.data_emissao) >= sixMonthsAgo)
      .reduce((acc, sale) => {
        const month = new Date(sale.data_emissao).toLocaleDateString('pt-BR', { 
          month: 'short', 
          year: 'numeric' 
        });
        acc[month] = (acc[month] || 0) + sale.valor;
        return acc;
      }, {} as Record<string, number>);

    const chartData = Object.entries(salesByMonth).map(([month, value]) => ({
      month,
      vendas: value,
      meta: value * 1.2 // Meta 20% maior que as vendas atuais
    }));

    // Vendas recentes (últimas 5)
    const recentSales = sales
      .sort((a, b) => new Date(b.data_emissao).getTime() - new Date(a.data_emissao).getTime())
      .slice(0, 5);

    return {
      totalSales,
      approvedSales,
      scheduledSales,
      invoicedSales,
      chartData,
      recentSales
    };
  }, [sales, salesLoading, receivables, receivablesLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado': return 'bg-green-100 text-green-800';
      case 'Agendado': return 'bg-yellow-100 text-yellow-800';
      case 'Faturado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (salesLoading || receivablesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo de volta, {user?.name}!</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData?.totalSales || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {sales.length} vendas realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData?.approvedSales || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Prontas para processamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Agendadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData?.scheduledSales || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Faturadas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData?.invoicedSales || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Faturamento concluído
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas dos Últimos 6 Meses</CardTitle>
            <CardDescription>Vendas vs Meta</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.chartData && dashboardData.chartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="vendas" fill="#3b82f6" name="Vendas" />
                    <Bar dataKey="meta" fill="#e5e7eb" name="Meta" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Nenhum dado de vendas</p>
                  <p className="text-sm">Os gráficos aparecerão aqui quando houver dados</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products - This would need product data from sales */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Produtos</CardTitle>
            <CardDescription>Mais vendidos por quantidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Dados de produtos em desenvolvimento</p>
                <p className="text-sm">O ranking de produtos aparecerá aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Recentes</CardTitle>
          <CardDescription>Últimas 5 vendas realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData?.recentSales && dashboardData.recentSales.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{sale.clients?.nome_fantasia || 'Cliente não identificado'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sale.data_emissao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(sale.valor)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Nenhuma venda recente</p>
                <p className="text-sm">As vendas recentes aparecerão aqui</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
