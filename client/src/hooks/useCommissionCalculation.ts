
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CommissionRule {
  id: string;
  new_representante_id: string;
  industria_id?: string;
  categoria_id?: string;
  percentual_industria: number;
  percentual_repasse: number;
  base_calculo: 'produto' | 'total';
  representative?: {
    is_master?: boolean;
  };
}

export const useCommissionCalculation = () => {
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);

  const fetchCommissionRules = async () => {
    try {
      const { data, error } = await supabase
        .from('commission_rules')
        .select(`
          *,
          representative:new_representante_id(is_master)
        `);

      if (error) throw error;
      
      const typedData = (data || []).map(rule => ({
        ...rule,
        base_calculo: (rule.base_calculo === 'produto' || rule.base_calculo === 'total') 
          ? rule.base_calculo as 'produto' | 'total'
          : 'total' as 'produto' | 'total'
      }));
      
      setCommissionRules(typedData);
      console.log('Commission rules loaded:', typedData);
    } catch (error) {
      console.error('Error fetching commission rules:', error);
    }
  };

  useEffect(() => {
    fetchCommissionRules();
  }, []);

  const findCommissionRule = (
    representanteId: string,
    industriaId: string,
    categoriaId?: string
  ) => {
    console.log('Searching commission rule for:', { representanteId, industriaId, categoriaId });

    // 1. Buscar regra específica: representante + indústria + categoria
    if (categoriaId) {
      let rule = commissionRules.find(r => 
        r.new_representante_id === representanteId && 
        r.industria_id === industriaId &&
        r.categoria_id === categoriaId
      );
      
      if (rule) {
        console.log('Found specific rule (rep + ind + cat):', rule);
        return rule;
      }
    }

    // 2. Buscar regra por representante + indústria (sem categoria específica)
    let rule = commissionRules.find(r => 
      r.new_representante_id === representanteId && 
      r.industria_id === industriaId &&
      !r.categoria_id
    );
    
    if (rule) {
      console.log('Found industry rule (rep + ind):', rule);
      return rule;
    }

    // 3. Buscar regra geral para o representante (sem indústria nem categoria)
    rule = commissionRules.find(r => 
      r.new_representante_id === representanteId && 
      !r.industria_id &&
      !r.categoria_id
    );

    if (rule) {
      console.log('Found general rule (rep only):', rule);
      return rule;
    }

    console.log('No commission rule found');
    return null;
  };

  const calculateCommission = (
    representanteId: string,
    industriaId: string,
    valor: number,
    categoriaId?: string,
    baseCalculo: 'produto' | 'total' = 'total',
    enableRepasse: boolean = false
  ) => {
    const rule = findCommissionRule(representanteId, industriaId, categoriaId);

    if (!rule) {
      return { percent: 0, value: 0, rule: null };
    }

    const baseValue = baseCalculo === 'produto' ? valor : valor;
    let commissionPercent = rule.percentual_industria;

    // Aplicar repasse se habilitado e se o representante não for master
    const isMaster = rule.representative?.is_master;
    if (enableRepasse && !isMaster) {
      commissionPercent = rule.percentual_repasse;
    }

    const commissionValue = (baseValue * commissionPercent) / 100;

    console.log('Commission calculated:', { 
      percent: commissionPercent, 
      value: commissionValue, 
      isMaster, 
      enableRepasse,
      rule 
    });

    return { percent: commissionPercent, value: commissionValue, rule };
  };

  const getCommissionPercent = (
    representanteId: string,
    industriaId: string,
    categoriaId?: string,
    enableRepasse: boolean = false
  ) => {
    const rule = findCommissionRule(representanteId, industriaId, categoriaId);

    if (!rule) return 0;

    // Aplicar repasse se habilitado e se o representante não for master
    const isMaster = rule.representative?.is_master;
    let percent = rule.percentual_industria;
    
    if (enableRepasse && !isMaster) {
      percent = rule.percentual_repasse;
    }

    return percent;
  };

  const getCommissionRuleInfo = (
    representanteId: string,
    industriaId: string,
    categoriaId?: string,
    enableRepasse: boolean = false
  ) => {
    const rule = findCommissionRule(representanteId, industriaId, categoriaId);

    if (!rule) return { percent: 0, rule: null };

    // Aplicar repasse se habilitado e se o representante não for master
    const isMaster = rule.representative?.is_master;
    let percent = rule.percentual_industria;
    
    if (enableRepasse && !isMaster) {
      percent = rule.percentual_repasse;
    }

    return { percent, rule };
  };

  return {
    calculateCommission,
    getCommissionPercent,
    getCommissionRuleInfo,
    findCommissionRule,
    refetchRules: fetchCommissionRules
  };
};
