
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { CartItem } from '@/types/cart';
import { ProductSearchPopover } from './ProductSearchPopover';
import { ProductCartTable } from './ProductCartTable';
import { CartTotalsDisplay } from './CartTotalsDisplay';
import { useCommissionCalculation } from '@/hooks/useCommissionCalculation';

interface ProductCartProps {
  cartItems: CartItem[];
  onCartChange: (items: CartItem[]) => void;
  representanteId: string;
  industriaId: string;
}

export const ProductCart = ({ cartItems, onCartChange, representanteId, industriaId }: ProductCartProps) => {
  const { products, loading: productsLoading } = useProducts(industriaId);
  const { getCommissionPercent } = useCommissionCalculation();

  // Resetar produto selecionado quando a indústria mudar
  useEffect(() => {
    // Reset logic if needed
  }, [industriaId]);

  const addToCart = (selectedProduct: any) => {
    if (!selectedProduct) return;

    // Usar valores padrão do produto
    const quantidade = 1;
    const precoUnitario = selectedProduct.preco_base || 0;
    const ipiPercentual = selectedProduct.percentual_ipi || 0;

    const subtotal = quantidade * precoUnitario;
    const valorIpi = subtotal * (ipiPercentual / 100);
    const total = subtotal + valorIpi;

    // Calcular comissão inicial baseada nas regras (sem repasse por padrão)
    let percentualComissao = 0;
    let valorComissao = 0;

    if (representanteId && industriaId) {
      percentualComissao = getCommissionPercent(
        representanteId, 
        industriaId, 
        selectedProduct.categoria_id
      );
      valorComissao = (total * percentualComissao) / 100;
    }

    const newItem: CartItem = {
      id: `${selectedProduct.id}-${Date.now()}`,
      produto_id: selectedProduct.id,
      produto: {
        id: selectedProduct.id,
        nome: selectedProduct.nome,
        codigo: selectedProduct.codigo,
        preco_base: selectedProduct.preco_base,
        percentual_ipi: selectedProduct.percentual_ipi,
        categoria_id: selectedProduct.categoria_id,
        industria_id: selectedProduct.industria_id,
        ean: selectedProduct.ean,
        ncm: selectedProduct.ncm
      },
      quantidade,
      precoUnitario,
      ipi: valorIpi,
      percentualIpi: ipiPercentual,
      subtotal,
      total,
      comissao: valorComissao,
      percentualComissao: percentualComissao
    };

    console.log('Adding item to cart with commission data:', newItem);
    onCartChange([...cartItems, newItem]);
  };

  const removeFromCart = (itemId: string) => {
    console.log('Removing item from cart:', itemId);
    onCartChange(cartItems.filter(item => item.id !== itemId));
  };

  const updateCartItem = (itemId: string, field: string, value: any) => {
    console.log(`Updating cart item ${itemId} field ${field}:`, value);
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalcular valores quando quantidade, preço ou IPI mudarem
        if (field === 'quantidade' || field === 'precoUnitario' || field === 'percentualIpi') {
          const subtotal = updatedItem.quantidade * updatedItem.precoUnitario;
          const valorIpi = subtotal * (updatedItem.percentualIpi / 100);
          updatedItem.ipi = valorIpi;
          updatedItem.subtotal = subtotal;
          updatedItem.total = subtotal + valorIpi;
          
          // Recalcular comissão baseada no percentual atual
          if (updatedItem.percentualComissao) {
            updatedItem.comissao = (updatedItem.total * updatedItem.percentualComissao) / 100;
          }
        }
        
        // Recalcular comissão quando o percentual de comissão mudar
        if (field === 'percentualComissao') {
          updatedItem.comissao = (updatedItem.total * value) / 100;
          console.log(`Commission recalculated: ${value}% of ${updatedItem.total} = ${updatedItem.comissao}`);
        }
        
        // Garantir que o valor da comissão seja atualizado quando passado diretamente
        if (field === 'comissao') {
          updatedItem.comissao = value;
          console.log(`Commission value set directly: ${value}`);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    onCartChange(updatedItems);
  };

  // Calcular totais (removido totalComissao)
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantidade * item.precoUnitario), 0);
    const totalIpi = cartItems.reduce((sum, item) => sum + (item.ipi || 0), 0);
    const totalGeral = subtotal + totalIpi;

    return {
      subtotal,
      totalIpi,
      totalGeral
    };
  }, [cartItems]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Produtos do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProductSearchPopover
          products={products}
          productsLoading={productsLoading}
          industriaId={industriaId}
          onProductAdd={addToCart}
        />

        {cartItems.length > 0 ? (
          <div className="space-y-4">
            <ProductCartTable
              cartItems={cartItems}
              onItemUpdate={updateCartItem}
              onItemRemove={removeFromCart}
              representanteId={representanteId}
              industriaId={industriaId}
            />
            <CartTotalsDisplay totals={totals} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Nenhum produto adicionado ainda</p>
            <p className="text-sm">Selecione uma indústria e adicione produtos ao pedido</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
