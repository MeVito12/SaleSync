
import { useState, useCallback } from 'react';

export const useCurrencyFormat = (initialValue: number = 0) => {
  const [value, setValue] = useState(initialValue);

  const formatCurrency = useCallback((num: number): string => {
    return num.toLocaleString('pt-BR', {
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
    return isNaN(parsed) ? 0 : Math.max(parsed, 0);
  }, []);

  const handleCurrencyChange = useCallback((inputValue: string) => {
    const numericValue = parseCurrency(inputValue);
    setValue(numericValue);
    return numericValue;
  }, [parseCurrency]);

  const getDisplayValue = useCallback(() => {
    return formatCurrency(value);
  }, [value, formatCurrency]);

  return {
    value,
    setValue,
    formatCurrency,
    parseCurrency,
    handleCurrencyChange,
    getDisplayValue
  };
};
