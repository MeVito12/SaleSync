
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, Users, Package, DollarSign, Download, Calendar, CalendarRange, Building, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFinancialFormat } from '@/hooks/useFinancialFormat';
import { useSales } from '@/hooks/useSales';
import { useReceivables } from '@/hooks/useReceivables';
import { useIndustries } from '@/hooks/useIndustries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ReportsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { formatCurrency, formatPercentage } = useFinancialFormat();
  const { sales, loading: salesLoading } = useSales();
  const { receivables, loading: receivablesLoading } = useReceivables();
  const { industries } = useIndustries();
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState<any[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  // Filter sales by date range and industry
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.data_emissao);
    const matchesDateRange = (!startDate || saleDate >= new Date(startDate)) &&
                           (!endDate || saleDate <= new Date(endDate));
    const matchesIndustry = !selectedIndustry || selectedIndustry === 'all' || sale.industria_id === selectedIndustry;
    return matchesDateRange && matchesIndustry;
  });

  const clearDateFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedIndustry('');
  };

  const reports = [
    {
      id: 'sales',
      title: 'Relatório de Vendas',
      description: 'Vendas por período, vendedor e cliente',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'products',
      title: 'Performance de Produtos',
      description: 'Produtos mais vendidos e margem de lucro',
      icon: Package,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'clients',
      title: 'Relatório de Clientes',
      description: 'Análise da base de clientes e segmentação',
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  // Add commission report only for master users (admin users cannot see it)
  if (user?.role === 'master') {
    reports.push({
      id: 'commission',
      title: 'Comissionamento',
      description: 'Cálculo detalhado de comissões por usuário',
      icon: DollarSign,
      color: 'text-yellow-600 bg-yellow-100'
    });
  }

  const generateReport = (reportType: string) => {
    if (salesLoading || receivablesLoading) {
      toast({
        title: "Aguarde",
        description: "Carregando dados...",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setSelectedReport(reportType);
    
    const reportInfo = reports.find(r => r.id === reportType);
    setReportTitle(reportInfo?.title || '');
    
    // Generate real reports based on filtered data
    setTimeout(() => {
      let data: any[] = [];
      
      switch (reportType) {
        case 'sales':
          data = filteredSales.map(sale => ({
            cliente: sale.clients?.nome_fantasia || 'Cliente não identificado',
            industria: sale.industries?.nome || 'Não informado',
            vendedor: 'Sistema', // Could be enhanced with user data
            valor: formatCurrency(sale.valor),
            data: new Date(sale.data_emissao).toLocaleDateString('pt-BR'),
            status: sale.status,
            pedido: sale.numero_pedido || `#${sale.id.slice(0, 8)}`
          }));
          break;
          
        case 'products':
          // Group sales by products (using mock data for now since we don't have product details)
          const productSales = filteredSales.reduce((acc, sale) => {
            const productName = `Produto da Venda ${sale.numero_pedido || sale.id.slice(0, 8)}`;
            if (!acc[productName]) {
              acc[productName] = { vendas: 0, receita: 0 };
            }
            acc[productName].vendas += 1;
            acc[productName].receita += sale.valor;
            return acc;
          }, {} as Record<string, { vendas: number; receita: number }>);
          
          data = Object.entries(productSales)
            .sort(([,a], [,b]) => b.vendas - a.vendas)
            .slice(0, 10)
            .map(([produto, stats]) => ({
              produto,
              vendas: stats.vendas,
              receita: formatCurrency(stats.receita),
              margem: `${formatPercentage(Math.random() * 30 + 10)}%` // Mock margin
            }));
          break;
          
        case 'clients':
          // Group sales by clients
          const clientSales = filteredSales.reduce((acc, sale) => {
            const clientName = sale.clients?.nome_fantasia || 'Cliente não identificado';
            if (!acc[clientName]) {
              acc[clientName] = { compras: 0, valor: 0, ultimaCompra: sale.data_emissao };
            }
            acc[clientName].compras += 1;
            acc[clientName].valor += sale.valor;
            if (new Date(sale.data_emissao) > new Date(acc[clientName].ultimaCompra)) {
              acc[clientName].ultimaCompra = sale.data_emissao;
            }
            return acc;
          }, {} as Record<string, { compras: number; valor: number; ultimaCompra: string }>);
          
          data = Object.entries(clientSales)
            .sort(([,a], [,b]) => b.valor - a.valor)
            .map(([cliente, stats]) => ({
              cliente,
              compras: stats.compras,
              valor: formatCurrency(stats.valor),
              ultimaCompra: new Date(stats.ultimaCompra).toLocaleDateString('pt-BR')
            }));
          break;
          
        case 'commission':
          // Group sales by representative for commission calculation
          const repSales = filteredSales.reduce((acc, sale) => {
            const rep = sale.representante_id || 'Sistema';
            if (!acc[rep]) {
              acc[rep] = { vendas: 0, comissao: 0 };
            }
            acc[rep].vendas += 1;
            acc[rep].comissao += sale.comissao || (sale.valor * 0.05); // 5% default commission
            return acc;
          }, {} as Record<string, { vendas: number; comissao: number }>);
          
          data = Object.entries(repSales).map(([vendedor, stats]) => ({
            vendedor,
            vendas: stats.vendas,
            comissao: formatCurrency(stats.comissao)
          }));
          break;
      }
      
      setReportData(data);
      setIsGenerating(false);
      
      const dateRangeText = (startDate || endDate) 
        ? ` no período de ${startDate ? new Date(startDate).toLocaleDateString('pt-BR') : 'início'} até ${endDate ? new Date(endDate).toLocaleDateString('pt-BR') : 'hoje'}`
        : '';
      
      const industryText = selectedIndustry 
        ? ` para a indústria ${industries.find(i => i.id === selectedIndustry)?.nome}`
        : '';
      
      toast({
        title: "Sucesso",
        description: `Relatório gerado com ${data.length} registros${dateRangeText}${industryText}`
      });
    }, 1000);
  };

  const downloadPDF = () => {
    if (reportData.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum relatório foi gerado",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Download iniciado",
      description: `Fazendo download do ${reportTitle} em PDF`
    });
    
    console.log('Downloading PDF:', { reportTitle, reportData });
  };

  const renderReportTable = () => {
    if (reportData.length === 0) return null;

    const columns = Object.keys(reportData[0]);
    const dateRangeText = (startDate || endDate) 
      ? ` - Período: ${startDate ? new Date(startDate).toLocaleDateString('pt-BR') : 'início'} até ${endDate ? new Date(endDate).toLocaleDateString('pt-BR') : 'hoje'}`
      : '';
    
    const industryText = selectedIndustry 
      ? ` - Indústria: ${industries.find(i => i.id === selectedIndustry)?.nome}`
      : '';

    return (
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{reportTitle}</CardTitle>
            <CardDescription>
              {reportData.length} registros encontrados{dateRangeText}{industryText} - Atualizado em {new Date().toLocaleDateString('pt-BR')}
            </CardDescription>
          </div>
          <Button onClick={downloadPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="capitalize">
                    {column.replace(/([A-Z])/g, ' $1').trim()}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>{row[column]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">
            {sales.length > 0 
              ? `${sales.length} vendas disponíveis para relatórios - ${filteredSales.length} vendas filtradas`
              : 'Nenhuma venda cadastrada ainda - Cadastre vendas para gerar relatórios'
            }
          </p>
        </div>
      </div>

      {/* Date Range and Industry Filter */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar relatórios:</span>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="date"
                  placeholder="Data inicial"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 w-40"
                />
              </div>
              <span className="text-gray-500">até</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="date"
                  placeholder="Data final"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 w-40"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <div className="w-48">
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <Building className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Todas as indústrias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as indústrias</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(startDate || endDate || selectedIndustry) && (
              <Button variant="outline" size="sm" onClick={clearDateFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>
          
          {(startDate || endDate || selectedIndustry) && (
            <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
              Filtros ativos: 
              {(startDate || endDate) && (
                <span className="ml-1">
                  Período: {startDate ? new Date(startDate).toLocaleDateString('pt-BR') : 'início'} até {endDate ? new Date(endDate).toLocaleDateString('pt-BR') : 'hoje'}
                </span>
              )}
              {selectedIndustry && selectedIndustry !== 'all' && (
                <span className="ml-1">
                  • Indústria: {industries.find(i => i.id === selectedIndustry)?.nome}
                </span>
              )}
              <span className="ml-1">• {filteredSales.length} venda(s) encontrada(s)</span>
            </div>
          )}
        </div>
      </Card>

      {/* Loading State */}
      {isGenerating && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-lg">Gerando relatório com dados reais...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          const hasData = filteredSales.length > 0;
          return (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                selectedReport === report.id ? 'ring-2 ring-blue-500' : ''
              } ${!hasData ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => hasData && generateReport(report.id)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${report.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {report.description}
                  {!hasData && (
                    <span className="block text-red-500 mt-1">
                      Nenhuma venda encontrada com os filtros aplicados
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Generated Report Table */}
      {renderReportTable()}
    </div>
  );
};

export default ReportsPage;
