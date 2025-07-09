
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentInstallment {
  id: string;
  days: number;
}

interface PaymentMethod {
  id: string;
  nome: string;
  tipo: string;
  descricao?: string;
  parcelas: PaymentInstallment[];
  ativo: boolean;
  taxa_percentual: number;
  taxa_fixa: number;
  prazo_dias: number;
  created_at: string;
  updated_at: string;
}

export const useSupabasePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      console.log('Fetching payment methods...');

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Error fetching payment methods:', error);
        throw error;
      }
      
      console.log('Payment methods fetched successfully:', data);
      
      const transformedData = data?.map(method => ({
        id: method.id,
        nome: method.nome,
        tipo: method.tipo,
        descricao: method.descricao || undefined,
        parcelas: Array.isArray(method.parcelas) 
          ? (method.parcelas as unknown as PaymentInstallment[])
          : [],
        ativo: method.ativo || false,
        taxa_percentual: method.taxa_percentual || 0,
        taxa_fixa: method.taxa_fixa || 0,
        prazo_dias: method.prazo_dias || 0,
        created_at: method.created_at,
        updated_at: method.updated_at
      })) || [];
      
      setPaymentMethods(transformedData);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar condições de pagamento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPaymentMethod = async (methodData: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating payment method with data:', methodData);

      const insertData = {
        nome: methodData.nome,
        tipo: methodData.tipo,
        descricao: methodData.descricao || null,
        parcelas: methodData.parcelas as any,
        ativo: methodData.ativo,
        taxa_percentual: methodData.taxa_percentual,
        taxa_fixa: methodData.taxa_fixa,
        prazo_dias: methodData.prazo_dias
      };

      console.log('Inserting data:', insertData);

      const { data, error } = await supabase
        .from('payment_methods')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Payment method created successfully:', data);
      await fetchPaymentMethods();
      
      toast({
        title: "Sucesso",
        description: "Condição de pagamento criada com sucesso"
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating payment method:', error);
      
      let errorMessage = 'Erro desconhecido';
      
      if (error.code === '42501') {
        errorMessage = 'Sem permissão para criar condições de pagamento. Verifique as políticas de segurança.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro",
        description: `Erro ao criar condição de pagamento: ${errorMessage}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePaymentMethod = async (id: string, methodData: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Updating payment method:', id, methodData);
      
      const { data, error } = await supabase
        .from('payment_methods')
        .update({
          nome: methodData.nome,
          tipo: methodData.tipo,
          descricao: methodData.descricao || null,
          parcelas: methodData.parcelas as any,
          ativo: methodData.ativo,
          taxa_percentual: methodData.taxa_percentual,
          taxa_fixa: methodData.taxa_fixa,
          prazo_dias: methodData.prazo_dias,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating payment method:', error);
        throw error;
      }

      await fetchPaymentMethods();
      toast({
        title: "Sucesso",
        description: "Condição de pagamento atualizada com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar condição de pagamento",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      console.log('Deleting payment method:', id);
      
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting payment method:', error);
        throw error;
      }

      await fetchPaymentMethods();
      toast({
        title: "Sucesso",
        description: "Condição de pagamento removida com sucesso"
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover condição de pagamento",
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
    updatePaymentMethod,
    deletePaymentMethod,
    refetch: fetchPaymentMethods
  };
};
