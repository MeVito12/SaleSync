import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockSales } from '@/data/mockData';

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
  numero_pedido?: string;
  comissao?: number;
  clients?: { nome_fantasia: string };
  industries?: { nome: string };
}

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSales = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSales(mockSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar vendas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (saleData: Omit<Sale, 'id'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newSale = {
        ...saleData,
        id: `sale_${Date.now()}`
      };
      
      mockSales.push(newSale);
      await fetchSales();
      
      toast({
        title: "Sucesso",
        description: "Venda criada com sucesso"
      });
      return newSale;
    } catch (error) {
      console.error('Error creating sale:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar venda",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateSale = async (id: string, saleData: Partial<Sale>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const saleIndex = mockSales.findIndex(s => s.id === id);
      if (saleIndex === -1) throw new Error('Venda não encontrada');
      
      const updatedSale = {
        ...mockSales[saleIndex],
        ...saleData
      };
      
      mockSales[saleIndex] = updatedSale;
      await fetchSales();
      
      toast({
        title: "Sucesso",
        description: "Venda atualizada com sucesso"
      });
      return updatedSale;
    } catch (error) {
      console.error('Error updating sale:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar venda",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteSale = async (id: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const saleIndex = mockSales.findIndex(s => s.id === id);
      if (saleIndex === -1) throw new Error('Venda não encontrada');
      
      mockSales.splice(saleIndex, 1);
      await fetchSales();
      
      toast({
        title: "Sucesso",
        description: "Venda removida com sucesso"
      });
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover venda",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    createSale,
    updateSale,
    deleteSale,
    refetch: fetchSales
  };
};