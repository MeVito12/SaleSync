
import * as React from "react";
import { Input } from "@/components/ui/input";
import { useCNPJFormat } from "@/hooks/useCNPJFormat";
import { cn } from "@/lib/utils";

interface CNPJInputProps extends Omit<React.ComponentProps<"input">, 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
}

const CNPJInput = React.forwardRef<HTMLInputElement, CNPJInputProps>(
  ({ className, value = '', onChange, ...props }, ref) => {
    const { handleCNPJChange } = useCNPJFormat(value);
    
    const [displayValue, setDisplayValue] = React.useState(value);

    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formatted = handleCNPJChange(inputValue);
      setDisplayValue(formatted);
      onChange?.(formatted);
    }, [handleCNPJChange, onChange]);

    React.useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleInputChange}
        className={cn(className)}
        placeholder="00.000.000/0000-00"
        maxLength={18}
      />
    );
  }
);

CNPJInput.displayName = "CNPJInput";

export { CNPJInput };
