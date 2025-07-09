
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SaleProduct {
  id: string;
  sale_id: string;
  produto_id?: string;
  produto_nome: string;
  codigo?: string;
  quantidade: number;
  preco_unitario: number;
  valor_ipi?: number;
  percentual_ipi?: number;
  subtotal?: number;
  total: number;
  comissao?: number;
  dropped: boolean;
}

interface InvoiceProductSelectionProps {
  products: SaleProduct[];
  selectedProducts: { [key: string]: boolean };
  quantities: { [key: string]: number };
  onProductSelection: (productId: string, checked: boolean) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export const InvoiceProductSelection = ({
  products,
  selectedProducts,
  quantities,
  onProductSelection,
  onQuantityChange
}: InvoiceProductSelectionProps) => {
  return (
    <div>
      <Label className="text-base font-semibold">
        Produtos da Venda ({products.length} encontrados)
      </Label>
      <div className="mt-3 space-y-3 border rounded-lg p-4 max-h-60 overflow-y-auto">
        {products.map((product) => (
          <div key={product.id} className="flex items-center space-x-4 p-3 border rounded">
            <Checkbox
              checked={selectedProducts[product.id] || false}
              onCheckedChange={(checked) => onProductSelection(product.id, !!checked)}
            />
            <div className="flex-1">
              <p className="font-medium">{product.produto_nome}</p>
              {product.codigo && (
                <p className="text-sm text-gray-600">Código: {product.codigo}</p>
              )}
              <p className="text-sm text-gray-600">
                Preço unitário: R$ {product.preco_unitario.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Quantidade disponível: {product.quantidade}
              </p>
              <p className="text-sm text-gray-600">
                Total: R$ {product.total.toFixed(2)}
              </p>
            </div>
            {selectedProducts[product.id] && (
              <div className="w-24">
                <Label htmlFor={`qty-${product.id}`} className="text-xs">Qtd. Faturar</Label>
                <Input
                  id={`qty-${product.id}`}
                  type="number"
                  min="1"
                  max={product.quantidade}
                  value={quantities[product.id] || product.quantidade}
                  onChange={(e) => onQuantityChange(product.id, parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
