
import { useState, useEffect } from 'react';
import { CartItem } from '@/types/cart';
import { ProductCart } from './ProductCart';
import { useSaleProducts } from '@/hooks/useSaleProducts';

interface Sale {
  id?: string;
  cliente_id: string;
  representante_id: string;
  industria_id: string;
  tipo_pedido: string;
  data_emissao: string;
  previsao_entrega?: string;
  condicao_pagamento: string;
  observacao: string;
  valor: number;
  status: string;
  numero_pedido?: string;
  clients?: { nome_fantasia: string };
  industries?: { nome: string };
}

interface SaleCartManagerProps {
  sale?: Sale;
  representanteId: string;
  industriaId: string;
  onCartTotalChange: (total: number) => void;
  onCartItemsChange: (items: CartItem[]) => void;
}

export const SaleCartManager = ({ 
  sale, 
  representanteId, 
  industriaId, 
  onCartTotalChange,
  onCartItemsChange 
}: SaleCartManagerProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Buscar produtos existentes quando editando uma venda
  const { products: existingProducts, loading: loadingProducts } = useSaleProducts(sale?.id);

  // Carregar produtos existentes no carrinho quando editando
  useEffect(() => {
    if (sale && existingProducts.length > 0 && !loadingProducts) {
      console.log('Loading existing products into cart:', existingProducts);
      
      const cartItemsFromExisting: CartItem[] = existingProducts.map(product => {
        // Calcular percentual de comissão baseado no valor da comissão e total
        const percentualComissao = product.total > 0 && product.comissao 
          ? (product.comissao / product.total) * 100 
          : 0;

        return {
          id: product.id,
          produto_id: product.produto_id || '',
          produto: {
            id: product.produto_id || '',
            nome: product.produto_nome,
            codigo: product.codigo || '',
            preco_base: product.preco_unitario,
            percentual_ipi: product.percentual_ipi || 0,
            categoria_id: null,
            industria_id: null,
            ean: null,
            ncm: null
          },
          quantidade: product.quantidade,
          precoUnitario: product.preco_unitario,
          ipi: product.valor_ipi || 0,
          percentualIpi: product.percentual_ipi || 0,
          subtotal: product.subtotal || (product.quantidade * product.preco_unitario),
          total: product.total,
          comissao: product.comissao || 0,
          percentualComissao: percentualComissao
        };
      });
      
      console.log('Cart items created from existing products:', cartItemsFromExisting);
      setCartItems(cartItemsFromExisting);
    }
  }, [sale, existingProducts, loadingProducts]);

  // Calcular totais do carrinho
  const calculateCartTotals = (items: CartItem[]) => {
    console.log('Calculating cart totals for items:', items);
    try {
      const subtotal = items.reduce((sum, item) => {
        const itemTotal = item.total || 0;
        console.log(`Item ${item.id} total: ${itemTotal}`);
        return sum + itemTotal;
      }, 0);
      
      console.log('Cart total calculated:', subtotal);
      return { subtotal };
    } catch (error) {
      console.error('Error calculating cart totals:', error);
      return { subtotal: 0 };
    }
  };

  // Atualizar valores do formulário quando o carrinho mudar
  const handleCartChange = (items: CartItem[]) => {
    console.log('Cart items changed:', items);
    try {
      setCartItems(items);
      onCartItemsChange(items);
      const { subtotal } = calculateCartTotals(items);
      console.log('Updating form data with total:', subtotal);
      onCartTotalChange(subtotal);
    } catch (error) {
      console.error('Error handling cart change:', error);
    }
  };

  return (
    <ProductCart
      cartItems={cartItems}
      onCartChange={handleCartChange}
      representanteId={representanteId}
      industriaId={industriaId}
    />
  );
};
