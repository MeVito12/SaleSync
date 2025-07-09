
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSaleStatus } from '@/hooks/useSaleStatus';

interface SaleDatePickersProps {
  dataEmissao?: Date;
  previsaoEntrega?: Date;
  onDataEmissaoChange: (date: Date | undefined) => void;
  onPrevisaoEntregaChange: (date: Date | undefined) => void;
}

export const SaleDatePickers = ({
  dataEmissao,
  previsaoEntrega,
  onDataEmissaoChange,
  onPrevisaoEntregaChange
}: SaleDatePickersProps) => {
  const { daysDifference } = useSaleStatus(dataEmissao, previsaoEntrega);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Emissão *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dataEmissao && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dataEmissao ? format(dataEmissao, "dd/MM/yyyy") : "dd/mm/aaaa"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dataEmissao}
              onSelect={onDataEmissaoChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <Label>Previsão de Entrega</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !previsaoEntrega && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {previsaoEntrega ? format(previsaoEntrega, "dd/MM/yyyy") : "dd/mm/aaaa"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={previsaoEntrega}
              onSelect={onPrevisaoEntregaChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {daysDifference && (
          <p className="text-xs text-gray-500 mt-1">
            Prazo: {daysDifference} dias
            {daysDifference <= 15 
              ? " (Status: Aprovado)" 
              : " (Status: Agendado)"}
          </p>
        )}
      </div>
    </div>
  );
};
