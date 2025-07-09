
import { useState, useCallback } from 'react';
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

export const useSalesQueries = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Memoizar a função de fetch para evitar recriações desnecessárias
  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await getCachedUser();
      if (!user) {
        console.log('Usuário não autenticado');
        setSales([]);
        return;
      }

      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          clients:cliente_id(nome_fantasia),
          industries:industria_id(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Aviso",
            description: "Nenhuma venda encontrada ou sem permissão para visualizar",
            variant: "default"
          });
          setSales([]);
        } else {
          throw error;
        }
      } else {
        setSales(data || []);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      setError('Erro ao carregar vendas');
      toast({
        title: "Erro",
        description: "Erro ao carregar vendas. Tente novamente.",
        variant: "destructive"
      });
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    sales,
    setSales,
    loading,
    error,
    fetchSales
  };
};
