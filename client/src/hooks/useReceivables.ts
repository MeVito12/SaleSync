import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockReceivables } from '@/data/mockData';

interface Receivable {
  id: string;
  representante_id: string;
  sale_id: string;
  data_recebimento: string;
  data_vencimento: string;
  valor_recebido: number;
  comissao_industria: number;
  status: string;
  nfe: string;
  pedido: string;
}

export const useReceivables = () => {
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReceivables = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReceivables(mockReceivables);
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
  };

  useEffect(() => {
    fetchReceivables();
  }, []);

  return {
    receivables,
    loading,
    refetch: fetchReceivables
  };
};