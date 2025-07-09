import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockCommissionRules } from '@/data/mockData';

interface CommissionRule {
  id: string;
  new_representante_id: string;
  industria_id: string;
  categoria_id: string | null;
  percentual_industria: number;
  percentual_repasse: number;
  base_calculo: 'produto' | 'total';
  representative?: {
    is_master?: boolean;
  };
}

export const useCommissionRules = () => {
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCommissionRules = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCommissionRules(mockCommissionRules);
    } catch (error) {
      console.error('Error fetching commission rules:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar regras de comissão",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCommissionRule = async (ruleData: Omit<CommissionRule, 'id'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newRule = {
        ...ruleData,
        id: `rule_${Date.now()}`
      };
      
      mockCommissionRules.push(newRule);
      await fetchCommissionRules();
      
      toast({
        title: "Sucesso",
        description: "Regra de comissão criada com sucesso"
      });
      return newRule;
    } catch (error) {
      console.error('Error creating commission rule:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar regra de comissão",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCommissionRules();
  }, []);

  return {
    commissionRules,
    loading,
    createCommissionRule,
    refetch: fetchCommissionRules
  };
};