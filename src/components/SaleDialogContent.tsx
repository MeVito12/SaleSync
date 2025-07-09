
import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SaleFormFields } from './SaleFormFields';
import { SaleDatePickers } from './SaleDatePickers';
import { SaleValidationAlert } from './SaleValidationAlert';
import { SaleCartManager } from './SaleCartManager';
import { useSaleForm } from '@/hooks/useSaleForm';
import { useSaleSubmission } from '@/hooks/useSaleSubmission';
import { CartItem } from '@/types/cart';

interface Sale {
  id?: string;
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

interface SaleDialogContentProps {
  sale?: Sale;
  onSave: (sale: Omit<Sale, 'id' | 'clients' | 'industries'> & { produtos?: any[] }) => void;
  onClose: () => void;
}

export const SaleDialogContent = ({ sale, onSave, onClose }: SaleDialogContentProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const {
    formData,
    dataEmissao,
    previsaoEntrega,
    validationErrors,
    isValid,
    setDataEmissao,
    setPrevisaoEntrega,
    updateFormData,
    handleSubmit,
    resetForm
  } = useSaleForm(sale, onSave);

  const { onSubmit } = useSaleSubmission({ 
    sale, 
    onSave, 
    handleSubmit, 
    resetForm, 
    formData 
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    const success = await onSubmit(e, cartItems);
    if (success) {
      onClose();
      setCartItems([]);
    }
  };

  return (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {sale ? 'Editar Pedido' : 'Incluir Pedido'}
        </DialogTitle>
      </DialogHeader>

      <SaleValidationAlert errors={validationErrors} />

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <SaleFormFields 
          formData={formData} 
          onFieldChange={updateFormData} 
        />
        
        <SaleDatePickers
          dataEmissao={dataEmissao}
          previsaoEntrega={previsaoEntrega}
          onDataEmissaoChange={setDataEmissao}
          onPrevisaoEntregaChange={setPrevisaoEntrega}
        />

        <SaleCartManager
          sale={sale}
          representanteId={formData.representante_id}
          industriaId={formData.industria_id}
          onCartTotalChange={(total) => updateFormData('valor', total)}
          onCartItemsChange={setCartItems}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-400 hover:bg-blue-500"
            disabled={!isValid || cartItems.length === 0}
          >
            Salvar
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
