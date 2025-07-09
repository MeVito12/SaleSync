
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useSaleProducts = (saleId?: string) => {
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSaleProducts = async () => {
    if (!saleId) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching products for sale:', saleId);

      const { data, error } = await supabase
        .from('sale_products')
        .select('*')
        .eq('sale_id', saleId)
        .eq('dropped', false)
        .order('created_at');

      if (error) {
        console.error('Error fetching sale products:', error);
        throw error;
      }

      console.log('Sale products fetched:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos da venda",
        variant: "destructive"
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleProducts();
  }, [saleId]);

  return {
    products,
    loading,
    refetch: fetchSaleProducts
  };
};
