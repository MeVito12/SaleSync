
import { useEffect, useMemo } from 'react';
import { useSalesQueries } from './useSalesQueries';
import { useSalesMutations } from './useSalesMutations';

interface Sale {
  id: string;
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
  comissao: number;
  numero_pedido?: string;
  created_at: string;
  updated_at: string;
  clients?: { nome_fantasia: string };
  industries?: { nome: string };
}

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

export const useSales = () => {
  const { sales, setSales, loading, error, fetchSales } = useSalesQueries();
  const { createSale, updateSale, deleteSale, dropSaleItems } = useSalesMutations(setSales);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Memoizar o retorno para evitar re-renderizações desnecessárias
  return useMemo(() => ({
    sales,
    loading,
    error,
    createSale,
    updateSale,
    deleteSale,
    dropSaleItems,
    refetch: fetchSales
  }), [sales, loading, error, createSale, updateSale, deleteSale, dropSaleItems, fetchSales]);
};

export type { Sale, SaleProduct };
