
import { useMemo } from 'react';

// Função para calcular diferença em dias entre duas datas
const calculateDaysDifference = (startDate: Date, endDate: Date): number => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Função para determinar status automaticamente baseado no prazo de entrega
const getAutomaticStatus = (dataEmissao: Date, previsaoEntrega?: Date): string => {
  if (!previsaoEntrega) return 'Aprovado';
  
  const daysDifference = calculateDaysDifference(dataEmissao, previsaoEntrega);
  return daysDifference <= 15 ? 'Aprovado' : 'Agendado';
};

export const useSaleStatus = (dataEmissao?: Date, previsaoEntrega?: Date) => {
  const daysDifference = useMemo(() => {
    if (!dataEmissao || !previsaoEntrega) return null;
    return calculateDaysDifference(dataEmissao, previsaoEntrega);
  }, [dataEmissao, previsaoEntrega]);

  const automaticStatus = useMemo(() => {
    if (!dataEmissao) return 'Aprovado';
    return getAutomaticStatus(dataEmissao, previsaoEntrega);
  }, [dataEmissao, previsaoEntrega]);

  return {
    daysDifference,
    automaticStatus,
    calculateDaysDifference
  };
};
