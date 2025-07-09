
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search } from 'lucide-react';
import { PaymentMethodDialog } from '@/components/PaymentMethodDialog';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';

const PaymentMethodsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    paymentMethods, 
    loading, 
    createPaymentMethod, 
    updatePaymentMethod, 
    deletePaymentMethod 
  } = usePaymentMethods();

  const filteredPaymentMethods = paymentMethods.filter(method =>
    method.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (method.descricao && method.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatInstallments = (installments: any[]) => {
    if (!Array.isArray(installments) || installments.length === 0) return 'À vista';
    return installments.map(inst => `${inst.days}d`).join(', ');
  };

  const handleSavePaymentMethod = async (paymentMethodData: any) => {
    try {
      console.log('Saving payment method:', paymentMethodData);
      
      const transformedData = {
        nome: paymentMethodData.description,
        tipo: 'Padrão',
        descricao: paymentMethodData.description,
        parcelas: paymentMethodData.installments || [],
        ativo: paymentMethodData.active,
        taxa_percentual: Number(paymentMethodData.taxaPercentual || 0),
        taxa_fixa: Number(paymentMethodData.taxaFixa || 0),
        prazo_dias: Number(paymentMethodData.prazoDias || 0)
      };
      
      console.log('Transformed data:', transformedData);
      await createPaymentMethod(transformedData);
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const handleUpdatePaymentMethod = async (id: string, paymentMethodData: any) => {
    try {
      console.log('Updating payment method:', id, paymentMethodData);
      
      const transformedData = {
        nome: paymentMethodData.description,
        tipo: 'Padrão',
        descricao: paymentMethodData.description,
        parcelas: paymentMethodData.installments || [],
        ativo: paymentMethodData.active,
        taxa_percentual: Number(paymentMethodData.taxaPercentual || 0),
        taxa_fixa: Number(paymentMethodData.taxaFixa || 0),
        prazo_dias: Number(paymentMethodData.prazoDias || 0)
      };
      
      await updatePaymentMethod(id, transformedData);
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta condição de pagamento?')) {
      try {
        await deletePaymentMethod(id);
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando condições de pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Condições de Pagamento</h1>
          <p className="text-muted-foreground">
            Gerencie as condições de pagamento disponíveis
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar condições..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <PaymentMethodDialog onSave={handleSavePaymentMethod} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ações</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[200px]">Parcelas</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaymentMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhuma condição cadastrada
                </TableCell>
              </TableRow>
            ) : (
              filteredPaymentMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PaymentMethodDialog
                        paymentMethod={{
                          id: Number(method.id),
                          description: method.nome,
                          installments: method.parcelas,
                          active: method.ativo,
                          taxaPercentual: method.taxa_percentual,
                          taxaFixa: method.taxa_fixa,
                          prazoDias: method.prazo_dias
                        }}
                        onSave={(data) => handleUpdatePaymentMethod(method.id, data)}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{method.nome}</TableCell>
                  <TableCell>{formatInstallments(method.parcelas)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      method.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {method.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
