
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Receivable {
  id: string;
  sale_id?: string;
  valor_recebido: number;
  data_recebimento: string;
  data_vencimento?: string;
  status?: string;
  representante_id: string;
  nfe?: string;
  pedido?: string;
  comissao_industria?: number;
  created_at: string;
  updated_at: string;
}

export const useReceivables = () => {
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReceivables = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('receivables')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceivables(data || []);
    } catch (error) {
      console.error('Error fetching receivables:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar recebimentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createReceivable = useCallback(async (receivableData: Omit<Receivable, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('receivables')
        .insert([receivableData])
        .select()
        .single();

      if (error) throw error;

      setReceivables(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Recebimento criado com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error creating receivable:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar recebimento",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const updateReceivable = useCallback(async (id: string, receivableData: Partial<Receivable>) => {
    try {
      const { error } = await supabase
        .from('receivables')
        .update(receivableData)
        .eq('id', id);

      if (error) throw error;

      setReceivables(prev => 
        prev.map(receivable => 
          receivable.id === id ? { ...receivable, ...receivableData } : receivable
        )
      );

      toast({
        title: "Sucesso",
        description: "Recebimento atualizado com sucesso"
      });
    } catch (error) {
      console.error('Error updating receivable:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar recebimento",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const deleteReceivable = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('receivables')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReceivables(prev => prev.filter(receivable => receivable.id !== id));
      toast({
        title: "Sucesso",
        description: "Recebimento excluído com sucesso"
      });
    } catch (error) {
      console.error('Error deleting receivable:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir recebimento",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const deleteReceivableBySale = useCallback(async (saleId: string) => {
    try {
      const { error } = await supabase
        .from('receivables')
        .delete()
        .eq('sale_id', saleId);

      if (error) throw error;

      // Atualizar lista local removendo recebimentos da venda
      setReceivables(prev => prev.filter(receivable => receivable.sale_id !== saleId));
      
      console.log('Receivables deleted for sale:', saleId);
    } catch (error) {
      console.error('Error deleting receivables by sale:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchReceivables();
  }, [fetchReceivables]);

  return {
    receivables,
    loading,
    createReceivable,
    updateReceivable,
    deleteReceivable,
    deleteReceivableBySale,
    refetch: fetchReceivables
  };
};
