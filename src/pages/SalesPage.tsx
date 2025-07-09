
import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSales } from '@/hooks/useSales';
import { useIndustries } from '@/hooks/useIndustries';
import { useReceivables } from '@/hooks/useReceivables';
import { SalesHeader } from '@/components/sales/SalesHeader';
import { SalesFilters } from '@/components/sales/SalesFilters';
import { SalesTable } from '@/components/sales/SalesTable';

const statusOptions = [
  'Aprovado',
  'Agendado',
  'Faturado Total',
  'Faturado Parcial'
];

const SalesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { sales, loading, createSale, updateSale, deleteSale } = useSales();
  const { industries } = useIndustries();
  const { deleteReceivableBySale } = useReceivables();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Memoizar vendas filtradas para evitar recálculos desnecessários
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.data_emissao);
      const matchesSearch = sale.clients?.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sale.numero_pedido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sale.observacao?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDateRange = (!startDate || saleDate >= new Date(startDate)) &&
                             (!endDate || saleDate <= new Date(endDate));
      const matchesIndustry = !selectedIndustry || selectedIndustry === 'all' || sale.industria_id === selectedIndustry;
      const matchesStatus = !selectedStatus || selectedStatus === 'all' || sale.status === selectedStatus;
      
      return matchesSearch && matchesDateRange && matchesIndustry && matchesStatus;
    });
  }, [sales, searchTerm, startDate, endDate, selectedIndustry, selectedStatus]);

  // Memoizar funções de callback para evitar re-renderizações
  const clearFilters = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setSelectedIndustry('');
    setSelectedStatus('');
    setSearchTerm('');
  }, []);

  const handleSaveSale = useCallback(async (saleData: any) => {
    try {
      const { produtos, ...saleDataWithoutProducts } = saleData;
      // Remove comissao do objeto antes de salvar
      const { comissao, ...finalSaleData } = saleDataWithoutProducts;
      await createSale(finalSaleData, produtos || []);
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  }, [createSale]);

  const handleUpdateSale = useCallback(async (saleData: any) => {
    try {
      const { produtos, id, comissao, ...saleDataWithoutProducts } = saleData;
      await updateSale(id, saleDataWithoutProducts);
    } catch (error) {
      console.error('Error updating sale:', error);
    }
  }, [updateSale]);

  const handleDeleteSale = useCallback(async (id: string) => {
    try {
      await deleteSale(id);
      toast({
        title: "Sucesso",
        description: "Venda excluída com sucesso"
      });
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  }, [deleteSale, toast]);

  const handleInvoiceSale = useCallback((saleId: string, invoiceData: any) => {
    console.log('Invoicing sale:', saleId, invoiceData);
    // Aqui seria implementada a lógica de faturamento
    toast({
      title: "Sucesso",
      description: "Venda faturada com sucesso"
    });
  }, [toast]);

  const handleCancelInvoice = useCallback(async (saleId: string) => {
    try {
      // Primeiro, deletar os recebimentos relacionados à venda
      await deleteReceivableBySale(saleId);
      
      // Depois, atualizar o status da venda para "Aprovado"
      await updateSale(saleId, { status: 'Aprovado' });
      
      toast({
        title: "Sucesso",
        description: "Nota fiscal excluída com sucesso. Venda retornou ao status 'Aprovado'."
      });
    } catch (error) {
      console.error('Error canceling invoice:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir nota fiscal. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [updateSale, deleteReceivableBySale, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SalesHeader 
        salesCount={sales.length}
        filteredCount={filteredSales.length}
        onSaveSale={handleSaveSale}
      />

      <SalesFilters
        searchTerm={searchTerm}
        startDate={startDate}
        endDate={endDate}
        selectedIndustry={selectedIndustry}
        selectedStatus={selectedStatus}
        industries={industries}
        statusOptions={statusOptions}
        onSearchChange={setSearchTerm}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onIndustryChange={setSelectedIndustry}
        onStatusChange={setSelectedStatus}
        onClearFilters={clearFilters}
      />

      <SalesTable
        sales={filteredSales}
        onUpdateSale={handleUpdateSale}
        onDeleteSale={handleDeleteSale}
        onInvoiceSale={handleInvoiceSale}
        onCancelInvoice={handleCancelInvoice}
      />
    </div>
  );
};

export default SalesPage;
