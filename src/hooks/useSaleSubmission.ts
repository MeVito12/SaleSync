
import { useState } from 'react';
import { CartItem } from '@/types/cart';
import { useToast } from '@/hooks/use-toast';

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

interface UseSaleSubmissionProps {
  sale?: Sale;
  onSave: (sale: Omit<Sale, 'id' | 'clients' | 'industries'> & { produtos?: any[] }) => void;
  handleSubmit: (e: React.FormEvent, dataToSave?: any) => Promise<boolean>;
  resetForm: () => void;
  formData: any;
}

export const useSaleSubmission = ({ 
  sale, 
  onSave, 
  handleSubmit, 
  resetForm, 
  formData 
}: UseSaleSubmissionProps) => {
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent, cartItems: CartItem[]) => {
    console.log('Starting sale submission...');
    console.log('Form data:', formData);
    console.log('Cart items:', cartItems);
    
    try {
      e.preventDefault();
      
      // Validar se há produtos no carrinho
      if (cartItems.length === 0) {
        console.warn('No products in cart');
        toast({
          title: "Erro",
          description: "Adicione pelo menos um produto ao pedido",
          variant: "destructive"
        });
        return false;
      }

      // Converter itens do carrinho para o formato esperado pelo banco
      const produtos = cartItems.map(item => {
        console.log('Converting cart item:', item);
        return {
          produto_id: item.produto_id,
          produto_nome: item.produto?.nome || '',
          codigo: item.produto?.codigo || '',
          quantidade: item.quantidade || 0,
          preco_unitario: item.precoUnitario || 0,
          valor_ipi: item.ipi || 0,
          percentual_ipi: item.percentualIpi || 0,
          subtotal: item.subtotal || 0,
          total: item.total || 0,
          comissao: item.comissao || 0
        };
      });

      console.log('Products converted with complete data:', produtos);

      // Adicionar produtos ao formData
      const saleDataWithProducts = {
        ...formData,
        produtos
      };

      console.log('Final sale data with products:', saleDataWithProducts);

      const success = await handleSubmit(e, saleDataWithProducts);
      console.log('Submit result:', success);
      
      if (success) {
        console.log('Sale saved successfully');
        if (!sale) {
          resetForm();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error in sale submission:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar pedido. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { onSubmit };
};
