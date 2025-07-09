
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface PaymentMethod {
  id: string;
  nome: string;
  tipo: string;
  taxa_percentual: number;
  taxa_fixa: number;
  prazo_dias: number;
  ativo: boolean;
  descricao?: string;
  parcelas?: Json;
}

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar métodos de pagamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPaymentMethod = async (methodData: Omit<PaymentMethod, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert([methodData])
        .select()
        .single();

      if (error) throw error;

      await fetchPaymentMethods();
      toast({
        title: "Sucesso",
        description: "Método de pagamento criado com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error creating payment method:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar método de pagamento",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
    loading,
    createPaymentMethod,
    refetch: fetchPaymentMethods
  };
};
