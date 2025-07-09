
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Loader2 } from 'lucide-react';
import { useFinancialFormat } from '@/hooks/useFinancialFormat';
import { useReceivables } from '@/hooks/useReceivables';

const ReceivablesPage = () => {
  const { receivables, loading } = useReceivables();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('2025-05-20');
  const [dateTo, setDateTo] = useState('2025-06-19');
  const [selectedReceivables, setSelectedReceivables] = useState<string[]>([]);
  const { formatCurrency } = useFinancialFormat();

  const filteredReceivables = receivables.filter(receivable =>
    receivable.sales?.clients?.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receivable.nfe?.includes(searchTerm) ||
    receivable.pedido?.includes(searchTerm)
  );

  const checkedReceivables = receivables.filter(receivable => 
    selectedReceivables.includes(receivable.id)
  );
  
  const totalFaturado = checkedReceivables.reduce((sum, receivable) => sum + receivable.valor_recebido, 0);
  const totalComissaoIndustria = checkedReceivables.reduce((sum, receivable) => sum + receivable.comissao_industria, 0);

  const handleReceivableCheck = (receivableId: string, checked: boolean) => {
    if (checked) {
      setSelectedReceivables([...selectedReceivables, receivableId]);
    } else {
      setSelectedReceivables(selectedReceivables.filter(id => id !== receivableId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReceivables(filteredReceivables.map(r => r.id));
    } else {
      setSelectedReceivables([]);
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
          <h1 className="text-3xl font-bold tracking-tight">Recebimentos</h1>
          <p className="text-muted-foreground">
            Gerencie os recebimentos e lançamentos financeiros
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Vencimento De:</span>
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
              placeholder="Pesquisa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Input placeholder="Ind." className="w-20" />
          <Button>
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline">Voltar</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Lançar Recebimentos</CardTitle>
                <CardDescription>
                  Total: R$ {formatCurrency(totalFaturado)} - Vr. Comissão Ind. Total: R$ {formatCurrency(totalComissaoIndustria)}
                </CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                Total de {filteredReceivables.length} Registros
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedReceivables.length === filteredReceivables.length && filteredReceivables.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[100px]">Vcto.</TableHead>
              <TableHead className="w-[120px]">Dt.Receb.</TableHead>
              <TableHead className="w-[120px]">Vr.Receb.</TableHead>
              <TableHead className="w-[100px]">Vr.a Receb.</TableHead>
              <TableHead className="w-[120px]">Vr.Comis.Ind.</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">NFe</TableHead>
              <TableHead className="w-[80px]">Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Indústria</TableHead>
              <TableHead>Representante</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceivables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                  Nenhum recebimento disponível
                </TableCell>
              </TableRow>
            ) : (
              filteredReceivables.map((receivable) => (
                <TableRow key={receivable.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReceivables.includes(receivable.id)}
                      onCheckedChange={(checked) => handleReceivableCheck(receivable.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>{receivable.id.slice(0, 8)}</TableCell>
                  <TableCell>{receivable.data_vencimento ? new Date(receivable.data_vencimento).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell>{new Date(receivable.data_recebimento).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>R$ {receivable.valor_recebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ 0,00</TableCell>
                  <TableCell>R$ {receivable.comissao_industria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{receivable.status}</TableCell>
                  <TableCell>{receivable.nfe || '-'}</TableCell>
                  <TableCell>{receivable.pedido || receivable.sales?.numero_pedido || '-'}</TableCell>
                  <TableCell>{receivable.sales?.clients?.nome_fantasia}</TableCell>
                  <TableCell>{receivable.sales?.industries?.nome}</TableCell>
                  <TableCell>{receivable.representante_id}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReceivablesPage;
