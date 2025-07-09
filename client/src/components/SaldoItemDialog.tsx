
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useFinancialFormat } from '@/hooks/useFinancialFormat';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import type { Sale } from '@/hooks/useSales';

interface SaleItem {
  id: string;
  produto: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  status: 'Em Aberto' | 'Parcialmente Faturado' | 'Faturado';
  isDropped: boolean;
}

interface SaldoItemDialogProps {
  sale: Sale;
  onDropItems: (saleId: string, itemIds: string[]) => void;
}

export const SaldoItemDialog = ({ sale, onDropItems }: SaldoItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { formatCurrency } = useFinancialFormat();
  const { toast } = useToast();

  // Convert sale products to sale items format
  const saleItems: SaleItem[] = [
    {
      id: '1',
      produto: 'Produto de Exemplo',
      quantidade: 1,
      valorUnitario: sale.valor,
      valorTotal: sale.valor,
      status: sale.status === 'Faturado' ? 'Faturado' : 'Em Aberto',
      isDropped: false
    }
  ];

  const availableItems = saleItems.filter(item => !item.isDropped);
  const totalSelectedValue = availableItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.valorTotal, 0);

  const handleItemCheck = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(availableItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleDropItems = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um item para derrubar",
        variant: "destructive"
      });
      return;
    }

    onDropItems(sale.id, selectedItems);
    setSelectedItems([]);
    setOpen(false);
    
    toast({
      title: "Sucesso",
      description: `${selectedItems.length} item(s) derrubado(s) com sucesso`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Aberto': return 'bg-red-100 text-red-800';
      case 'Parcialmente Faturado': return 'bg-yellow-100 text-yellow-800';
      case 'Faturado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Derrubar Itens
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Itens para Derrubar - {sale.clients?.nome_fantasia}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Pedido:</span>
              <p>{sale.numero_pedido || `#${sale.id}`}</p>
            </div>
            <div>
              <span className="font-medium">Data:</span>
              <p>{new Date(sale.data_emissao).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                sale.status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                sale.status === 'Agendado' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {sale.status}
              </span>
            </div>
            <div>
              <span className="font-medium">Valor Total:</span>
              <p className="text-green-600 font-semibold">R$ {sale.valor.toLocaleString()}</p>
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">
                <strong>{selectedItems.length} item(s) selecionado(s)</strong> - 
                Valor: R$ {formatCurrency(totalSelectedValue)}
              </p>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedItems.length === availableItems.length && availableItems.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="w-[80px]">Qtd.</TableHead>
                  <TableHead className="w-[100px]">Vr. Unit.</TableHead>
                  <TableHead className="w-[100px]">Vr. Total</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum item disponível para derrubar
                    </TableCell>
                  </TableRow>
                ) : (
                  availableItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => handleItemCheck(item.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell>{item.produto}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>R$ {formatCurrency(item.valorUnitario)}</TableCell>
                      <TableCell className="font-medium">R$ {formatCurrency(item.valorTotal)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-start space-x-3 bg-yellow-50 border border-yellow-200 rounded p-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Atenção
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Itens derrubados serão impedidos de serem faturados e removidos de relatórios, 
                mas não serão excluídos permanentemente do sistema.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDropItems}
            disabled={selectedItems.length === 0}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Derrubar Selecionados
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
