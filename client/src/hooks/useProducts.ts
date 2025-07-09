import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  codigo: string;
  nome: string;
  ean: string | null;
  ncm: string | null;
  preco_base: number | null;
  percentual_ipi: number | null;
  categoria_id: string | null;
  industria_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductWithRelations extends Product {
  categories?: { nome: string };
  industries?: { nome: string };
}

export const useProducts = (industriaId?: string, searchTerm?: string) => {
  const [allProducts, setAllProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(nome),
          industries(nome)
        `)
        .order('nome');

      if (error) throw error;
      setAllProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar produtos baseado na indústria e termo de pesquisa
  const products = useMemo(() => {
    let filtered = allProducts;

    // Filtrar por indústria se especificada
    if (industriaId) {
      filtered = filtered.filter(product => product.industria_id === industriaId);
    }

    // Filtrar por termo de pesquisa
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.nome.toLowerCase().includes(term) ||
        product.codigo.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [allProducts, industriaId, searchTerm]);

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar produto",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...productData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover produto",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};
