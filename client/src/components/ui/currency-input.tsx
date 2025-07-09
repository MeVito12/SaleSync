
import * as React from "react";
import { Input } from "@/components/ui/input";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, ...props }, ref) => {
    const { formatCurrency, handleCurrencyChange } = useCurrencyFormat(value);
    
    const [displayValue, setDisplayValue] = React.useState(() => {
      return value === 0 ? '' : formatCurrency(value);
    });

    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setDisplayValue(inputValue);
      
      const numericValue = handleCurrencyChange(inputValue);
      onChange?.(numericValue);
    }, [handleCurrencyChange, onChange]);

    const handleBlur = React.useCallback(() => {
      if (displayValue === '' || value === 0) {
        setDisplayValue('');
        return;
      }
      
      const formattedValue = formatCurrency(value);
      setDisplayValue(formattedValue);
    }, [value, formatCurrency, displayValue]);

    const handleFocus = React.useCallback(() => {
      if (value === 0) {
        setDisplayValue('');
      }
    }, [value]);

    React.useEffect(() => {
      if (value === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatCurrency(value));
      }
    }, [value, formatCurrency]);

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={cn(className)}
        placeholder="0,00"
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
