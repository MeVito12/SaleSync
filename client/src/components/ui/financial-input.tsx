
import * as React from "react";
import { Input } from "@/components/ui/input";
import { useFinancialFormat } from "@/hooks/useFinancialFormat";
import { cn } from "@/lib/utils";

interface FinancialInputProps extends Omit<React.ComponentProps<"input">, 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  type?: 'currency' | 'percentage' | 'number';
  hideValueIndicator?: boolean;
}

const FinancialInput = React.forwardRef<HTMLInputElement, FinancialInputProps>(
  ({ className, value = 0, onChange, type = 'currency', hideValueIndicator = false, ...props }, ref) => {
    const { 
      handleCurrencyChange, 
      handlePercentageChange,
      formatCurrency, 
      formatPercentage, 
      formatNumber 
    } = useFinancialFormat(value);
    
    // Otimizar com useMemo para evitar recálculos desnecessários
    const initialDisplayValue = React.useMemo(() => {
      // Se o valor for 0, mostrar campo vazio para facilitar edição
      if (value === 0) return '';
      
      switch (type) {
        case 'percentage':
          return formatPercentage(value);
        case 'number':
          return formatNumber(value);
        default:
          return formatCurrency(value);
      }
    }, [value, type, formatCurrency, formatPercentage, formatNumber]);

    const [displayValue, setDisplayValue] = React.useState(initialDisplayValue);

    // Usar useCallback para otimizar a função de input
    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setDisplayValue(inputValue);
      
      let numericValue: number;
      
      if (type === 'percentage') {
        numericValue = handlePercentageChange(inputValue);
      } else {
        numericValue = handleCurrencyChange(inputValue);
      }
      
      onChange?.(numericValue);
    }, [type, handleCurrencyChange, handlePercentageChange, onChange]);

    // Usar useCallback para otimizar a função de blur
    const handleBlur = React.useCallback(() => {
      // Se o campo estiver vazio ou o valor for 0, manter vazio
      if (displayValue === '' || value === 0) {
        setDisplayValue('');
        return;
      }
      
      // Reformatar o valor quando o campo perde o foco
      let formattedValue: string;
      
      switch (type) {
        case 'percentage':
          formattedValue = formatPercentage(value);
          break;
        case 'number':
          formattedValue = formatNumber(value);
          break;
        default:
          formattedValue = formatCurrency(value);
      }
      
      setDisplayValue(formattedValue);
    }, [value, type, formatCurrency, formatPercentage, formatNumber, displayValue]);

    // Usar useCallback para otimizar a função de focus
    const handleFocus = React.useCallback(() => {
      // Quando focar no campo, se o valor for 0, limpar o campo
      if (value === 0) {
        setDisplayValue('');
      }
    }, [value]);

    // Atualizar displayValue quando value ou type mudarem
    React.useEffect(() => {
      setDisplayValue(initialDisplayValue);
    }, [initialDisplayValue]);

    const placeholder = React.useMemo(() => {
      return type === 'percentage' ? '0,00' : '0,00';
    }, [type]);

    return (
      <div className="space-y-1">
        <Input
          {...props}
          ref={ref}
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={cn(className)}
          placeholder={placeholder}
        />
        {!hideValueIndicator && type === 'currency' && value > 0 && (
          <div className="text-xs text-gray-500">
            {formatCurrency(value)}
          </div>
        )}
      </div>
    );
  }
);

FinancialInput.displayName = "FinancialInput";

export { FinancialInput };
