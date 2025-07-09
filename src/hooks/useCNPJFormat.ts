
import { useState, useCallback } from 'react';

export const useCNPJFormat = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const formatCNPJ = useCallback((cnpj: string): string => {
    // Remove tudo que não é número
    const numbers = cnpj.replace(/\D/g, '');
    
    // Aplica a máscara: 00.000.000/0000-00
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
  }, []);

  const handleCNPJChange = useCallback((inputValue: string) => {
    const formatted = formatCNPJ(inputValue);
    setValue(formatted);
    return formatted;
  }, [formatCNPJ]);

  const getCleanCNPJ = useCallback(() => {
    return value.replace(/\D/g, '');
  }, [value]);

  return {
    value,
    setValue,
    formatCNPJ,
    handleCNPJChange,
    getCleanCNPJ
  };
};
