
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface InvoiceFormFieldsProps {
  invoiceDate: string;
  extraTax: number;
  fiscalNote: string;
  suframa: number;
  hasProducts: boolean;
  onInvoiceDateChange: (date: string) => void;
  onExtraTaxChange: (value: string) => void;
  onFiscalNoteChange: (value: string) => void;
  onSuframaChange: (value: string) => void;
}

export const InvoiceFormFields = ({
  invoiceDate,
  extraTax,
  fiscalNote,
  suframa,
  hasProducts,
  onInvoiceDateChange,
  onExtraTaxChange,
  onFiscalNoteChange,
  onSuframaChange
}: InvoiceFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="invoice-date">Data do Faturamento</Label>
        <Input
          id="invoice-date"
          type="date"
          value={invoiceDate}
          onChange={(e) => onInvoiceDateChange(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="extra-tax">Valor Extra de Imposto (R$)</Label>
        <Input
          id="extra-tax"
          type="number"
          step="0.01"
          min="0"
          value={extraTax === 0 ? '' : extraTax.toString()}
          onChange={(e) => onExtraTaxChange(e.target.value)}
          placeholder="0,00"
        />
      </div>
      
      <div className="md:col-span-2">
        <Label htmlFor="fiscal-note">
          Número da Nota Fiscal {!hasProducts && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="fiscal-note"
          type="text"
          value={fiscalNote}
          onChange={(e) => onFiscalNoteChange(e.target.value)}
          placeholder="Digite o número da nota fiscal"
          required={!hasProducts}
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="suframa">Suframa - Valor de Desconto (R$)</Label>
        <Input
          id="suframa"
          type="number"
          step="0.01"
          min="0"
          value={suframa === 0 ? '' : suframa.toString()}
          onChange={(e) => onSuframaChange(e.target.value)}
          placeholder="0,00"
        />
        <p className="text-xs text-gray-500 mt-1">
          Valor em reais que será subtraído do total da venda (benefícios da Zona Franca de Manaus)
        </p>
      </div>
    </div>
  );
};
