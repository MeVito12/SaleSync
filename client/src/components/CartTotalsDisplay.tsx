
import { useFinancialFormat } from '@/hooks/useFinancialFormat';

interface CartTotalsDisplayProps {
  totals: {
    subtotal: number;
    totalIpi: number;
    totalGeral: number;
  };
}

export const CartTotalsDisplay = ({ totals }: CartTotalsDisplayProps) => {
  const { formatCurrency } = useFinancialFormat();

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-sm text-gray-600">Subtotal</div>
        <div className="text-lg font-semibold">
          {formatCurrency(totals.subtotal)}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-sm text-gray-600">Total IPI</div>
        <div className="text-lg font-semibold text-orange-600">
          {formatCurrency(totals.totalIpi)}
        </div>
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-600">Total Geral</div>
        <div className="text-lg font-semibold text-green-600">
          {formatCurrency(totals.totalGeral)}
        </div>
      </div>
    </div>
  );
};
