import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSaleValidation } from './useSaleValidation';
import { useSaleStatus } from './useSaleStatus';

interface Sale {
  id?: string;
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
  numero_pedido?: string;
  clients?: { nome_fantasia: string };
  industries?: { nome: string };
}

const initialFormData = {
  cliente_id: '',
  representante_id: '',
  industria_id: '',
  tipo_pedido: '',
  data_emissao: new Date().toISOString().split('T')[0],
  previsao_entrega: '',
  condicao_pagamento: '',
  observacao: '',
  status: 'Aprovado',
  valor: 0,
  numero_pedido: ''
};

export const useSaleForm = (
  sale?: Sale,
  onSave?: (sale: any) => void
) => {
  const [formData, setFormData] = useState<Omit<Sale, 'id' | 'clients' | 'industries'>>(initialFormData);
  const [dataEmissao, setDataEmissao] = useState<Date>();
  const [previsaoEntrega, setPrevisaoEntrega] = useState<Date>();
  const { toast } = useToast();

  const { validationErrors, isValid } = useSaleValidation(
    formData,
    dataEmissao,
    previsaoEntrega
  );

  const { automaticStatus } = useSaleStatus(dataEmissao, previsaoEntrega);

  // Inicializar dados se estiver editando
  useEffect(() => {
    if (sale) {
      console.log('Initializing form with sale data:', sale);
      setFormData({
        cliente_id: sale.cliente_id,
        representante_id: sale.representante_id,
        industria_id: sale.industria_id,
        tipo_pedido: sale.tipo_pedido,
        data_emissao: sale.data_emissao,
        previsao_entrega: sale.previsao_entrega || '',
        condicao_pagamento: sale.condicao_pagamento,
        observacao: sale.observacao,
        status: sale.status,
        valor: sale.valor,
        numero_pedido: sale.numero_pedido || ''
      });
      setDataEmissao(new Date(sale.data_emissao));
      if (sale.previsao_entrega) {
        setPrevisaoEntrega(new Date(sale.previsao_entrega));
      }
    }
  }, [sale]);

  // Atualizar formData quando as datas mudarem
  useEffect(() => {
    if (dataEmissao) {
      const dateString = dataEmissao.toISOString().split('T')[0];
      console.log('Updating data_emissao:', dateString);
      setFormData(prev => ({ ...prev, data_emissao: dateString }));
    }
  }, [dataEmissao]);

  useEffect(() => {
    if (previsaoEntrega) {
      const dateString = previsaoEntrega.toISOString().split('T')[0];
      console.log('Updating previsao_entrega:', dateString);
      setFormData(prev => ({ ...prev, previsao_entrega: dateString }));
    }
  }, [previsaoEntrega]);

  // Atualizar status automaticamente
  useEffect(() => {
    console.log('Updating status to:', automaticStatus);
    setFormData(prev => ({ ...prev, status: automaticStatus }));
  }, [automaticStatus]);

  const updateFormData = (field: string, value: any) => {
    console.log(`Updating form field ${field}:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, dataToSave?: any) => {
    console.log('HandleSubmit called with data:', dataToSave);
    
    try {
      e.preventDefault();
      
      if (!isValid) {
        console.warn('Form validation failed:', validationErrors);
        toast({
          title: "Erro de Validação",
          description: validationErrors[0],
          variant: "destructive"
        });
        return false;
      }

      console.log('Calling onSave with data:', dataToSave || formData);
      await onSave?.(dataToSave || formData);
      
      console.log('Sale saved successfully');
      return true;
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar venda. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  const resetForm = () => {
    console.log('Resetting form to initial state');
    setFormData(initialFormData);
    setDataEmissao(new Date());
    setPrevisaoEntrega(undefined);
  };

  return {
    formData,
    dataEmissao,
    previsaoEntrega,
    validationErrors,
    isValid,
    setDataEmissao,
    setPrevisaoEntrega,
    updateFormData,
    handleSubmit,
    resetForm
  };
};
