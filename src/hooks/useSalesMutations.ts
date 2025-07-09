
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getCachedUser } from './useSalesCache';

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
  comissao: number;
  numero_pedido?: string;
  created_at: string;
  updated_at: string;
  clients?: { nome_fantasia: string };
  industries?: { nome: string };
}

interface SaleProduct {
  id: string;
  sale_id: string;
  produto_id?: string;
  produto_nome: string;
  codigo?: string;
  quantidade: number;
  preco_unitario: number;
  valor_ipi?: number;
  percentual_ipi?: number;
  subtotal?: number;
  total: number;
  comissao?: number;
  dropped: boolean;
}

export const useSalesMutations = (setSales: React.Dispatch<React.SetStateAction<Sale[]>>) => {
  const { toast } = useToast();

  // Otimizar createSale com better error handling
  const createSale = useCallback(async (
    saleData: Omit<Sale, 'id' | 'created_at' | 'updated_at' | 'clients' | 'industries'>, 
    products: Omit<SaleProduct, 'id' | 'sale_id'>[]
  ) => {
    console.log('CreateSale called with:', { saleData, products });
    
    try {
      const user = await getCachedUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Validar dados obrigatórios
      if (!saleData.cliente_id || !saleData.industria_id || !saleData.tipo_pedido) {
        throw new Error('Dados obrigatórios não preenchidos');
      }

      const saleDataWithAuth = {
        ...saleData,
        representante_id: user.id
      };

      console.log('Creating sale with data:', saleDataWithAuth);

      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([saleDataWithAuth])
        .select()
        .single();

      if (saleError) {
        console.error('Sale creation error:', saleError);
        
        const errorMessages = {
          'P0001': 'Erro de validação personalizado',
          '23514': 'Dados inválidos. Verifique se todos os dados estão corretos',
          '23503': 'Referência inválida. Verifique cliente, indústria e condição de pagamento',
          'default': 'Erro ao criar venda. Verifique os dados e tente novamente.'
        };
        
        const message = errorMessages[saleError.code as keyof typeof errorMessages] || errorMessages.default;
        
        toast({
          title: "Erro",
          description: message,
          variant: "destructive"
        });
        throw saleError;
      }

      console.log('Sale created successfully:', sale);

      // Inserir produtos apenas se existirem
      if (products && products.length > 0) {
        console.log('Inserting products:', products);
        
        const productsWithSaleId = products.map(product => ({
          ...product,
          sale_id: sale.id
        }));

        const { error: productsError } = await supabase
          .from('sale_products')
          .insert(productsWithSaleId);

        if (productsError) {
          console.error('Products creation error:', productsError);
          // Reverter a venda se os produtos falharam
          await supabase.from('sales').delete().eq('id', sale.id);
          
          toast({
            title: "Erro",
            description: "Erro ao salvar produtos da venda",
            variant: "destructive"
          });
          throw productsError;
        }

        console.log('Products inserted successfully');
      }

      // Atualizar lista local instead of refetch completo
      setSales(prev => [sale, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Venda criada com sucesso"
      });
      return sale;
    } catch (error: any) {
      console.error('Error creating sale:', error);
      if (!error.message?.includes('Erro')) {
        toast({
          title: "Erro",
          description: error.message || "Erro ao criar venda",
          variant: "destructive"
        });
      }
      throw error;
    }
  }, [toast, setSales]);

  const updateSale = useCallback(async (id: string, saleData: Partial<Sale>) => {
    try {
      const user = await getCachedUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('sales')
        .update(saleData)
        .eq('id', id);

      if (error) {
        console.error('Sale update error:', error);
        
        const errorMessages = {
          'P0001': 'Erro de validação',
          'PGRST116': 'Você não tem permissão para editar esta venda',
          'default': 'Erro ao atualizar venda'
        };
        
        const message = errorMessages[error.code as keyof typeof errorMessages] || errorMessages.default;
        
        toast({
          title: "Erro",
          description: message,
          variant: "destructive"
        });
        throw error;
      }

      // Atualizar lista local
      setSales(prev => prev.map(sale => 
        sale.id === id ? { ...sale, ...saleData } : sale
      ));
      
      toast({
        title: "Sucesso",
        description: "Venda atualizada com sucesso"
      });
    } catch (error: any) {
      console.error('Error updating sale:', error);
      if (!error.message?.includes('Erro')) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar venda",
          variant: "destructive"
        });
      }
      throw error;
    }
  }, [toast, setSales]);

  const deleteSale = useCallback(async (id: string) => {
    try {
      const user = await getCachedUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Primeiro deletar produtos da venda
      const { error: productsError } = await supabase
        .from('sale_products')
        .delete()
        .eq('sale_id', id);

      if (productsError) {
        console.error('Error deleting sale products:', productsError);
        throw productsError;
      }

      // Depois deletar a venda
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Sale deletion error:', error);
        
        const errorMessages = {
          'PGRST116': 'Você não tem permissão para excluir esta venda',
          'default': 'Erro ao excluir venda'
        };
        
        const message = errorMessages[error.code as keyof typeof errorMessages] || errorMessages.default;
        
        toast({
          title: "Erro",
          description: message,
          variant: "destructive"
        });
        throw error;
      }

      // Atualizar lista local
      setSales(prev => prev.filter(sale => sale.id !== id));
      
    } catch (error: any) {
      console.error('Error deleting sale:', error);
      if (!error.message?.includes('Erro')) {
        toast({
          title: "Erro",
          description: "Erro ao excluir venda",
          variant: "destructive"
        });
      }
      throw error;
    }
  }, [toast, setSales]);

  const dropSaleItems = useCallback(async (saleId: string, productIds: string[]) => {
    try {
      const { error } = await supabase
        .from('sale_products')
        .update({ dropped: true })
        .eq('sale_id', saleId)
        .in('id', productIds);

      if (error) {
        console.error('Drop items error:', error);
        toast({
          title: "Erro",
          description: "Erro ao derrubar itens",
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Itens derrubados com sucesso"
      });
    } catch (error) {
      console.error('Error dropping items:', error);
      throw error;
    }
  }, [toast]);

  return {
    createSale,
    updateSale,
    deleteSale,
    dropSaleItems
  };
};
