
import { SaleDialog } from '@/components/SaleDialog';

interface SalesHeaderProps {
  salesCount: number;
  filteredCount: number;
  onSaveSale: (saleData: any) => void;
}

export const SalesHeader = ({ salesCount, filteredCount, onSaveSale }: SalesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
        <p className="text-gray-600">
          {salesCount > 0 
            ? `${salesCount} vendas cadastradas - ${filteredCount} vendas filtradas`
            : 'Nenhuma venda cadastrada ainda'
          }
        </p>
      </div>
      <SaleDialog onSave={onSaveSale} />
    </div>
  );
};
