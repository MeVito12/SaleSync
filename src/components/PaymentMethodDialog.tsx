
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PaymentInstallment {
  id: string;
  days: number;
}

interface PaymentMethod {
  id?: number;
  description: string;
  installments: PaymentInstallment[];
  active: boolean;
  taxaPercentual?: number;
  taxaFixa?: number;
  prazoDias?: number;
}

interface PaymentMethodDialogProps {
  paymentMethod?: PaymentMethod;
  onSave: (paymentMethod: PaymentMethod) => void;
  trigger?: React.ReactNode;
}

export const PaymentMethodDialog = ({ paymentMethod, onSave, trigger }: PaymentMethodDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PaymentMethod>({
    description: '',
    installments: [],
    active: true,
    taxaPercentual: 0,
    taxaFixa: 0,
    prazoDias: 0
  });
  const { toast } = useToast();

  const formatNumericValue = (value: number) => {
    return value === 0 ? '' : value.toString();
  };

  const handleNumericChange = (id: string, inputValue: string) => {
    const numericValue = inputValue === '' ? 0 : parseInt(inputValue) || 0;
    handleInstallmentChange(id, numericValue);
  };

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        description: paymentMethod.description,
        installments: paymentMethod.installments || [],
        active: paymentMethod.active,
        taxaPercentual: paymentMethod.taxaPercentual || 0,
        taxaFixa: paymentMethod.taxaFixa || 0,
        prazoDias: paymentMethod.prazoDias || 0
      });
    } else {
      setFormData({
        description: '',
        installments: [],
        active: true,
        taxaPercentual: 0,
        taxaFixa: 0,
        prazoDias: 0
      });
    }
  }, [paymentMethod, open]);

  const handleAddInstallment = () => {
    const newInstallment: PaymentInstallment = {
      id: Date.now().toString(),
      days: 0
    };
    setFormData({
      ...formData,
      installments: [...formData.installments, newInstallment]
    });
  };

  const handleRemoveInstallment = (id: string) => {
    setFormData({
      ...formData,
      installments: formData.installments.filter(inst => inst.id !== id)
    });
  };

  const handleInstallmentChange = (id: string, days: number) => {
    setFormData({
      ...formData,
      installments: formData.installments.map(inst =>
        inst.id === id ? { ...inst, days } : inst
      )
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast({
        title: "Erro",
        description: "Preencha a descrição da condição de pagamento",
        variant: "destructive"
      });
      return;
    }

    // Validar parcelas
    for (const installment of formData.installments) {
      if (installment.days < 0) {
        toast({
          title: "Erro",
          description: "Todos os prazos das parcelas devem ser maior ou igual a 0",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      onSave(formData);
      setOpen(false);
      toast({
        title: "Sucesso",
        description: paymentMethod ? "Condição de pagamento atualizada com sucesso" : "Condição de pagamento cadastrada com sucesso"
      });
      
      if (!paymentMethod) {
        setFormData({
          description: '',
          installments: [],
          active: true,
          taxaPercentual: 0,
          taxaFixa: 0,
          prazoDias: 0
        });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Nova Condição
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {paymentMethod ? 'Editar Condição de Pagamento' : 'Nova Condição de Pagamento'}
          </DialogTitle>
          <DialogDescription>
            {paymentMethod ? 'Atualize os dados da condição de pagamento' : 'Cadastre uma nova condição de pagamento no sistema'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: À vista, 30 dias, 60 dias..."
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: !!checked })}
            />
            <Label htmlFor="active">Ativo</Label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Parcelas</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddInstallment}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Parcela
              </Button>
            </div>

            {formData.installments.length > 0 && (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ações</TableHead>
                      <TableHead>Dias</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.installments.map((installment) => (
                      <TableRow key={installment.id}>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveInstallment(installment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={formatNumericValue(installment.days)}
                            onChange={(e) => handleNumericChange(installment.id, e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {paymentMethod ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
