
import { useState, useEffect, useMemo } from 'react';

interface FormData {
  representante_id: string;
  cliente_id: string;
  industria_id: string;
  condicao_pagamento: string;
  tipo_pedido: string;
  valor: number;
}

export const useSaleValidation = (
  formData: FormData,
  dataEmissao?: Date,
  previsaoEntrega?: Date
) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = useMemo(() => (): string[] => {
    const errors: string[] = [];
    
    if (!formData.representante_id.trim()) {
      errors.push('Representante é obrigatório');
    }
    
    if (!formData.cliente_id) {
      errors.push('Cliente é obrigatório');
    }
    
    if (!formData.industria_id) {
      errors.push('Indústria é obrigatória');
    }
    
    if (!formData.condicao_pagamento) {
      errors.push('Condição de pagamento é obrigatória');
    }
    
    if (!formData.tipo_pedido) {
      errors.push('Tipo de pedido é obrigatório');
    }
    
    if (formData.valor < 0) {
      errors.push('Valor não pode ser negativo');
    }
    
    if (dataEmissao && dataEmissao > new Date()) {
      errors.push('Data de emissão não pode ser futura');
    }
    
    if (dataEmissao && previsaoEntrega && previsaoEntrega < dataEmissao) {
      errors.push('Previsão de entrega não pode ser anterior à data de emissão');
    }
    
    return errors;
  }, [formData, dataEmissao, previsaoEntrega]);

  useEffect(() => {
    const errors = validateForm();
    setValidationErrors(errors);
  }, [validateForm]);

  return {
    validationErrors,
    isValid: validationErrors.length === 0
  };
};
