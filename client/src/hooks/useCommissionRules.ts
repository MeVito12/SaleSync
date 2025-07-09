
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommissionRule {
  id: string;
  representante_id?: string;
  new_representante_id?: string;
  industria_id?: string;
  categoria_id?: string;
  percentual_industria: number;
  percentual_repasse: number;
  base_calculo: 'produto' | 'total';
  created_at: string;
  updated_at: string;
  representative?: {
    id: string;
    nome: string;
    is_master?: boolean;
  };
  industry?: {
    id: string;
    nome: string;
  };
  category?: {
    id: string;
    nome: string;
  };
}

export const useCommissionRules = () => {
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCommissionRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('commission_rules')
        .select(`
          *,
          representative:new_representante_id(id, nome, is_master),
          industry:industria_id(id, nome),
          category:categoria_id(id, nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Garantir que base_calculo seja do tipo correto e filtrar dados válidos
      const validData = (data || [])
        .filter(rule => rule.representative !== null) // Filtrar regras sem representante válido
        .map(rule => ({
          ...rule,
          base_calculo: (rule.base_calculo === 'produto' || rule.base_calculo === 'total') 
            ? rule.base_calculo as 'produto' | 'total'
            : 'total' as 'produto' | 'total'
        }));
      
      setCommissionRules(validData);
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

  const createCommissionRule = async (ruleData: Omit<CommissionRule, 'id' | 'created_at' | 'updated_at' | 'representative' | 'industry' | 'category'>) => {
    try {
      // Verificar se o representante é master
      const { data: representative, error: repError } = await supabase
        .from('representatives')
        .select('is_master')
        .eq('id', ruleData.new_representante_id)
        .single();

      if (repError) {
        console.error('Error fetching representative:', repError);
        throw new Error('Representante não encontrado');
      }

      // Para representantes master, o percentual_repasse deve ser igual ao percentual_industria (não dividido)
      const percentual_repasse = representative?.is_master ? ruleData.percentual_industria : ruleData.percentual_repasse;

      const { data, error } = await supabase
        .from('commission_rules')
        .insert([{
          new_representante_id: ruleData.new_representante_id,
          industria_id: ruleData.industria_id,
          categoria_id: ruleData.categoria_id,
          percentual_industria: ruleData.percentual_industria,
          percentual_repasse: percentual_repasse,
          base_calculo: ruleData.base_calculo,
          representante_id: ruleData.new_representante_id // Adicionar para compatibilidade
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchCommissionRules();
      toast({
        title: "Sucesso",
        description: "Regra de comissão criada com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error creating commission rule:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar regra de comissão",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCommissionRule = async (id: string, ruleData: Omit<CommissionRule, 'id' | 'created_at' | 'updated_at' | 'representative' | 'industry' | 'category'>) => {
    try {
      // Verificar se o representante é master
      const { data: representative, error: repError } = await supabase
        .from('representatives')
        .select('is_master')
        .eq('id', ruleData.new_representante_id)
        .single();

      if (repError) {
        console.error('Error fetching representative:', repError);
        throw new Error('Representante não encontrado');
      }

      // Para representantes master, o percentual_repasse deve ser igual ao percentual_industria (não dividido)
      const percentual_repasse = representative?.is_master ? ruleData.percentual_industria : ruleData.percentual_repasse;

      const { data, error } = await supabase
        .from('commission_rules')
        .update({ 
          new_representante_id: ruleData.new_representante_id,
          industria_id: ruleData.industria_id,
          categoria_id: ruleData.categoria_id,
          percentual_industria: ruleData.percentual_industria,
          percentual_repasse: percentual_repasse,
          base_calculo: ruleData.base_calculo,
          representante_id: ruleData.new_representante_id, // Adicionar para compatibilidade
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchCommissionRules();
      toast({
        title: "Sucesso",
        description: "Regra de comissão atualizada com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error updating commission rule:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar regra de comissão",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCommissionRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('commission_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCommissionRules();
      toast({
        title: "Sucesso",
        description: "Regra de comissão removida com sucesso"
      });
    } catch (error) {
      console.error('Error deleting commission rule:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover regra de comissão",
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
    updateCommissionRule,
    deleteCommissionRule,
    refetch: fetchCommissionRules
  };
};
