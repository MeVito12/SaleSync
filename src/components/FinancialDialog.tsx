import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFinancialFormat } from '@/hooks/useFinancialFormat';

interface Sale {
  id: number;
  cliente: string;
  valor: number;
  metodoPagamento: string;
  comissao: number;
  dataVenda: string;
}

interface FinancialDialogProps {
  sale: Sale;
  trigger: React.ReactNode;
}

export const FinancialDialog = ({ sale, trigger }: FinancialDialogProps) => {
  const [open, setOpen] = useState(false);
  const { formatCurrency } = useFinancialFormat();

  // Dados simulados baseados na imagem
  const invoiceData = {
    nfe: '2733666',
    emissao: '23/05/2025',
    entrega: '06/06/2025',
    vrMerc: 923.30,
    vrIpi: 90.02,
    impostos: 0.00,
    suframa: 0.00,
    vrTotal: 1013.32,
    recebido: 0.00,
    pedido: '9012',
    status: 'FATURADO TOTAL',
    condPagto: '30/60 DDE',
    industria: 'MULTI EXTREMA',
    representante: 'YASMIM HENRIQUE',
    valorComissaoInd: 53.91,
    valorComissaoRep: 5.07
  };

  const produtos = [
    {
      quant: 10.00,
      partNumber: 'MO384',
      produto: 'MOUSE SEM FIO ERGONOMICO MS800 USB 1600DPI AJUSTAVEL 6BOT VERTICAL PT',
      pedCliente: 'qlv09f713gk9'
    },
    {
      quant: 20.00,
      partNumber: 'TC193',
      produto: 'TECLADO TF100 USB 120CM PT',
      pedCliente: 'qlv09f713gk9'
    }
  ];

  const parcelas = [
    {
      id: 14331,
      dataVcto: '21/07/2025',
      vrParcelaBaseMerc: 923.30,
      vrParcelaBaseNota: 1013.32,
      status: 'Em Aberto',
      vrComissaoInd: 53.91,
      vrComissaoRep: 5.07
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Financeiro - {sale.cliente}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cabeçalho da NFe */}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NFe</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead>Entrega</TableHead>
                    <TableHead>Despacho</TableHead>
                    <TableHead>Vr. Merc.</TableHead>
                    <TableHead>Vr. IPI</TableHead>
                    <TableHead>Impostos</TableHead>
                    <TableHead>Suframa</TableHead>
                    <TableHead>Vr. Total</TableHead>
                    <TableHead>Recebido</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cond.Pagto.</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Industria</TableHead>
                    <TableHead>Representante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{invoiceData.nfe}</TableCell>
                    <TableCell>{invoiceData.emissao}</TableCell>
                    <TableCell>{invoiceData.entrega}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>R$ {formatCurrency(invoiceData.vrMerc)}</TableCell>
                    <TableCell>R$ {formatCurrency(invoiceData.vrIpi)}</TableCell>
                    <TableCell>R$ {formatCurrency(invoiceData.impostos)}</TableCell>
                    <TableCell>R$ {formatCurrency(invoiceData.suframa)}</TableCell>
                    <TableCell className="font-medium">R$ {formatCurrency(invoiceData.vrTotal)}</TableCell>
                    <TableCell>R$ {formatCurrency(invoiceData.recebido)}</TableCell>
                    <TableCell>{invoiceData.pedido}</TableCell>
                    <TableCell>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {invoiceData.status}
                      </span>
                    </TableCell>
                    <TableCell>{invoiceData.condPagto}</TableCell>
                    <TableCell>{sale.cliente}</TableCell>
                    <TableCell>{invoiceData.industria}</TableCell>
                    <TableCell>{invoiceData.representante}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Informações de Comissão */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Indústria</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{invoiceData.industria}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Valor Comissão Ind.</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">R$ {formatCurrency(invoiceData.valorComissaoInd)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Representante</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{invoiceData.representante}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Valor Comissão Rep.</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">R$ {formatCurrency(invoiceData.valorComissaoRep)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Produtos */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quant.</TableHead>
                    <TableHead>Part Number</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Ped.Cliente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto, index) => (
                    <TableRow key={index}>
                      <TableCell>{produto.quant.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">{produto.partNumber}</TableCell>
                      <TableCell>{produto.produto}</TableCell>
                      <TableCell>{produto.pedCliente}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Parcelas */}
          <Card>
            <CardHeader>
              <CardTitle>Parcelas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data Vcto.</TableHead>
                    <TableHead>Vr.Parcela Base Merc.</TableHead>
                    <TableHead>Vr.Parcela Base Nota</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vr.Comissão Ind.</TableHead>
                    <TableHead>Vr.Comissão Rep.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parcelas.map((parcela) => (
                    <TableRow key={parcela.id}>
                      <TableCell className="font-medium">{parcela.id}</TableCell>
                      <TableCell>{parcela.dataVcto}</TableCell>
                      <TableCell>R$ {formatCurrency(parcela.vrParcelaBaseMerc)}</TableCell>
                      <TableCell>R$ {formatCurrency(parcela.vrParcelaBaseNota)}</TableCell>
                      <TableCell>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          {parcela.status}
                        </span>
                      </TableCell>
                      <TableCell>R$ {formatCurrency(parcela.vrComissaoInd)}</TableCell>
                      <TableCell>R$ {formatCurrency(parcela.vrComissaoRep)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
