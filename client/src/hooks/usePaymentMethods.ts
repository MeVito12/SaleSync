import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockPaymentMethods } from '@/data/mockData';

interface PaymentMethod {
  id: number;
  nome: string;
  tipo: string;
  descricao: string;
  ativo: boolean;
  taxaPercentual: number;
  taxaFixa: number;
  prazoDias: number;
  parcelas: Array<{ id: string; days: number }>;
}

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPaymentMethods(mockPaymentMethods);
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

  const createPaymentMethod = async (paymentMethodData: Omit<PaymentMethod, 'id'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newPaymentMethod = {
        ...paymentMethodData,
        id: Date.now()
      };
      
      mockPaymentMethods.push(newPaymentMethod);
      await fetchPaymentMethods();
      
      toast({
        title: "Sucesso",
        description: "Método de pagamento criado com sucesso"
      });
      return newPaymentMethod;
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

  const updatePaymentMethod = async (id: number, paymentMethodData: Partial<PaymentMethod>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const methodIndex = mockPaymentMethods.findIndex(pm => pm.id === id);
      if (methodIndex === -1) throw new Error('Método de pagamento não encontrado');
      
      const updatedMethod = {
        ...mockPaymentMethods[methodIndex],
        ...paymentMethodData
      };
      
      mockPaymentMethods[methodIndex] = updatedMethod;
      await fetchPaymentMethods();
      
      toast({
        title: "Sucesso",
        description: "Método de pagamento atualizado com sucesso"
      });
      return updatedMethod;
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar método de pagamento",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deletePaymentMethod = async (id: number) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const methodIndex = mockPaymentMethods.findIndex(pm => pm.id === id);
      if (methodIndex === -1) throw new Error('Método de pagamento não encontrado');
      
      mockPaymentMethods.splice(methodIndex, 1);
      await fetchPaymentMethods();
      
      toast({
        title: "Sucesso",
        description: "Método de pagamento removido com sucesso"
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover método de pagamento",
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