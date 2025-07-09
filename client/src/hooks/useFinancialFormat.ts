
import { useState, useCallback, useMemo } from 'react';

export const useFinancialFormat = (initialValue: number = 0) => {
  const [value, setValue] = useState(initialValue);

  const formatCurrency = useCallback((num: number): string => {
    if (num === 0) return '0,00';
    
    // Validar se o número está dentro dos limites (até 999.999.999,99)
    const clampedNum = Math.min(Math.max(num, 0), 999999999.99);
    
    // Formatar com separador de milhares e duas casas decimais
    const formatted = clampedNum.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    });
    
    return formatted;
  }, []);

  const formatPercentage = useCallback((num: number): string => {
    if (num === 0) return '0,00';
    
    // Garantir máximo de 2 dígitos antes da vírgula e 2 depois (limitado a 99,99%)
    const clampedNum = Math.min(Math.max(num, 0), 99.99);
    
    return clampedNum.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false
    });
  }, []);

  const formatNumber = useCallback((num: number): string => {
    if (num === 0) return '0,00';
    
    // Aplicar o mesmo limite de moeda para números
    const clampedNum = Math.min(Math.max(num, 0), 999999999.99);
    
    return clampedNum.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    });
  }, []);

  const parseCurrency = useCallback((str: string): number => {
    if (!str || str.trim() === '') return 0;
    
    // Remove pontos (separadores de milhares) e substitui vírgula por ponto
    const cleanStr = str
      .replace(/\./g, '') // Remove pontos
      .replace(',', '.'); // Substitui vírgula por ponto
    
    const parsed = parseFloat(cleanStr);
    const result = isNaN(parsed) ? 0 : Math.min(parsed, 999999999.99);
    
    return result;
  }, []);

  const parsePercentage = useCallback((str: string): number => {
    if (!str || str.trim() === '') return 0;
    
    // Para porcentagem, apenas substitui vírgula por ponto
    const cleanStr = str.replace(',', '.');
    const parsed = parseFloat(cleanStr);
    
    // Limitar a 99.99%
    const clampedValue = Math.min(Math.max(parsed || 0, 0), 99.99);
    return isNaN(clampedValue) ? 0 : clampedValue;
  }, []);

  const handleCurrencyChange = useCallback((inputValue: string) => {
    const numericValue = parseCurrency(inputValue);
    setValue(numericValue);
    return numericValue;
  }, [parseCurrency]);

  const handlePercentageChange = useCallback((inputValue: string) => {
    const numericValue = parsePercentage(inputValue);
    setValue(numericValue);
    return numericValue;
  }, [parsePercentage]);

  const getDisplayValue = useCallback((type: 'currency' | 'percentage' | 'number' = 'currency') => {
    switch (type) {
      case 'percentage':
        return formatPercentage(value);
      case 'number':
        return formatNumber(value);
      default:
        return formatCurrency(value);
    }
  }, [value, formatCurrency, formatPercentage, formatNumber]);

  // Memoizar o objeto retornado para evitar re-renders desnecessários
  const memoizedReturn = useMemo(() => ({
    value,
    setValue,
    formatCurrency,
    formatPercentage,
    formatNumber,
    parseCurrency,
    parsePercentage,
    handleCurrencyChange,
    handlePercentageChange,
    getDisplayValue
  }), [
    value,
    setValue,
    formatCurrency,
    formatPercentage,
    formatNumber,
    parseCurrency,
    parsePercentage,
    handleCurrencyChange,
    handlePercentageChange,
    getDisplayValue
  ]);

  return memoizedReturn;
};
