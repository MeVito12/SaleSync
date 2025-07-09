
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, FileText, XCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SaleDialog } from '@/components/SaleDialog';
import { InvoiceDialog } from '@/components/InvoiceDialog';
import { useFinancialFormat } from '@/hooks/useFinancialFormat';

interface Sale {
  id: string;
  cliente_id: string;
  representante_id: string;
  industria_id: string;
  tipo_pedido: string;
  data_emissao: string;
  previsao_entrega?: string;
  condicao_pagamento: string;
  observacao: string;
  valor: number;
  status: string; 
  numero_pedido?: string;
  clients?: { nome_fantasia: string };
  industries?: { nome: string };
}

interface SalesTableProps {
  sales: Sale[];
  onUpdateSale: (sale: any) => void;
  onDeleteSale: (id: string) => void;
  onInvoiceSale: (saleId: string, invoiceData: any) => void;
  onCancelInvoice?: (saleId: string) => void;
}

export const SalesTable = ({ sales, onUpdateSale, onDeleteSale, onInvoiceSale, onCancelInvoice }: SalesTableProps) => {
  const { formatCurrency } = useFinancialFormat();
  const [deleteId, setDeleteId] = useState<string>('');
  const [cancelInvoiceId, setCancelInvoiceId] = useState<string>('');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Aprovado': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      'Agendado': { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      'Faturado Total': { variant: 'default' as const, color: 'bg-purple-100 text-purple-800' },
      'Faturado Parcial': { variant: 'outline' as const, color: 'bg-orange-100 text-orange-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Aprovado'];
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {status}
      </Badge>
    );
  };

  const canEdit = (status: string) => {
    return status !== 'Faturado Total' && status !== 'Faturado Parcial';
  };

  const canInvoice = (status: string) => {
    return status === 'Aprovado' || status === 'Agendado';
  };

  const canCancelInvoice = (status: string) => {
    return status === 'Faturado Total' || status === 'Faturado Parcial';
  };

  const handleDelete = (id: string) => {
    onDeleteSale(id);
    setDeleteId('');
  };

  const handleCancelInvoice = (id: string) => {
    if (onCancelInvoice) {
      onCancelInvoice(id);
    }
    setCancelInvoiceId('');
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Indústria</TableHead>
            <TableHead>Nº Pedido</TableHead>
            <TableHead>Data Emissão</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">
                {sale.clients?.nome_fantasia || 'Cliente não informado'}
              </TableCell>
              <TableCell>
                {sale.industries?.nome || 'Indústria não informada'}
              </TableCell>
              <TableCell>{sale.numero_pedido || '-'}</TableCell>
              <TableCell>
                {new Date(sale.data_emissao).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>{formatCurrency(sale.valor)}</TableCell>
              <TableCell>
                {getStatusBadge(sale.status)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canEdit(sale.status) && (
                      <SaleDialog 
                        sale={sale} 
                        onSave={onUpdateSale}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        }
                      />
                    )}
                    
                    {canInvoice(sale.status) && (
                      <InvoiceDialog
                        sale={{
                          id: sale.id,
                          cliente: sale.clients?.nome_fantasia || 'Cliente não informado',
                          status: sale.status as 'Aprovado' | 'Agendado' | 'Faturado'
                        }}
                        onInvoice={onInvoiceSale}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <FileText className="mr-2 h-4 w-4" />
                            Faturar
                          </DropdownMenuItem>
                        }
                      />
                    )}

                    {canCancelInvoice(sale.status) && onCancelInvoice && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            onClick={() => setCancelInvoiceId(sale.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Excluir Nota Fiscal
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Nota Fiscal</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a nota fiscal desta venda? A venda retornará ao status "Aprovado" e poderá ser editada novamente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setCancelInvoiceId('')}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCancelInvoice(cancelInvoiceId)}>
                              Excluir Nota Fiscal
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    
                    {canEdit(sale.status) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            onClick={() => setDeleteId(sale.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Venda</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteId('')}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(deleteId)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
