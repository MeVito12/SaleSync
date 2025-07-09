import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
// import { useSaleProducts } from '@/hooks/useSaleProducts';
import { useReceivables } from '@/hooks/useReceivables';
import { InvoiceFormFields } from './invoice/InvoiceFormFields';
import { InvoiceProductSelection } from './invoice/InvoiceProductSelection';

interface Sale {
  id: string;
  cliente: string;
  status: 'Aprovado' | 'Agendado' | 'Faturado';
}

interface InvoiceDialogProps {
  sale: Sale;
  onInvoice: (saleId: string, invoiceData: any) => void;
  trigger: React.ReactNode;
}

export const InvoiceDialog = ({ sale, onInvoice, trigger }: InvoiceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: boolean }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [extraTax, setExtraTax] = useState(0);
  const [fiscalNote, setFiscalNote] = useState('');
  const [suframa, setSuframa] = useState(0);
  const { toast } = useToast();
  const { createReceivable } = useReceivables();

  // Buscar produtos da venda usando o hook
  // const { products: saleProducts, loading: productsLoading } = useSaleProducts(sale.id);
  const saleProducts: any[] = [];
  const productsLoading = false;

  // Verificar se existem produtos na venda
  const hasProducts = saleProducts && saleProducts.length > 0;

  // Resetar formulário quando o diálogo abrir
  useEffect(() => {
    if (open) {
      setSelectedProducts({});
      setQuantities({});
      setExtraTax(0);
      setFiscalNote('');
      setSuframa(0);
    }
  }, [open]);

  const handleProductSelection = (productId: string, checked: boolean) => {
    setSelectedProducts(prev => ({ ...prev, [productId]: checked }));
    if (checked && saleProducts) {
      const product = saleProducts.find(p => p.id === productId);
      if (product) {
        setQuantities(prev => ({ ...prev, [productId]: product.quantidade }));
      }
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleExtraTaxChange = (inputValue: string) => {
    const numericValue = inputValue === '' ? 0 : parseFloat(inputValue) || 0;
    setExtraTax(numericValue);
  };

  const handleSuframaChange = (inputValue: string) => {
    const numericValue = inputValue === '' ? 0 : parseFloat(inputValue) || 0;
    setSuframa(numericValue);
    console.log('Suframa value changed to:', numericValue);
  };

  const calculateTotalValue = () => {
    const selectedProductsList = Object.keys(selectedProducts).filter(id => selectedProducts[id]);
    
    let totalProductValue = 0;
    if (hasProducts && selectedProductsList.length > 0) {
      totalProductValue = selectedProductsList.reduce((sum, id) => {
        const product = saleProducts.find(p => p.id === id);
        const quantity = quantities[id] || 0;
        const unitPrice = product?.preco_unitario || 0;
        return sum + (quantity * unitPrice);
      }, 0);
    }

    // Aplicar desconto Suframa ANTES de somar impostos extras
    const valueAfterSuframa = Math.max(0, totalProductValue - suframa);
    const finalValue = valueAfterSuframa + extraTax;
    
    console.log('Invoice calculation:', {
      totalProductValue,
      suframa,
      valueAfterSuframa,
      extraTax,
      finalValue
    });

    return finalValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se não há produtos ou nenhum foi selecionado, verificar se pelo menos tem nota fiscal
    const selectedProductsList = Object.keys(selectedProducts).filter(id => selectedProducts[id]);
    
    if (!hasProducts && !fiscalNote.trim()) {
      toast({
        title: "Erro",
        description: "Para vendas sem produtos cadastrados, é obrigatório informar o número da nota fiscal",
        variant: "destructive"
      });
      return;
    }

    if (hasProducts && selectedProductsList.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um produto para faturar",
        variant: "destructive"
      });
      return;
    }

    const totalValue = calculateTotalValue();

    const invoiceData = {
      products: selectedProductsList.map(id => {
        const product = saleProducts.find(p => p.id === id);
        const quantity = quantities[id] || 0;
        const unitTotal = quantity * (product?.preco_unitario || 0);
        return {
          id,
          produto_id: product?.produto_id,
          nome: product?.produto_nome,
          codigo: product?.codigo,
          quantity,
          preco_unitario: product?.preco_unitario || 0,
          total: unitTotal,
          comissao: product?.comissao || 0
        };
      }),
      invoiceDate,
      extraTax,
      fiscalNote: fiscalNote.trim(),
      suframa,
      totalValue
    };

    try {
      // Criar recebimento com os dados do faturamento
      const receivableData = {
        sale_id: sale.id,
        valor_recebido: totalValue,
        data_recebimento: invoiceDate,
        data_vencimento: invoiceDate,
        nfe: fiscalNote.trim(),
        pedido: '',
        status: 'Faturado',
        comissao_industria: 0,
        representante_id: ''
      };

      console.log('Creating receivable with data:', receivableData);
      await createReceivable(receivableData);
      
      console.log('Invoice processed successfully:', invoiceData);
      onInvoice(sale.id, invoiceData);
      setOpen(false);
      
      // Reset form
      setSelectedProducts({});
      setQuantities({});
      setFiscalNote('');
      setSuframa(0);
      setExtraTax(0);
      
      toast({
        title: "Sucesso",
        description: `Venda faturada com sucesso! Valor total: R$ ${totalValue.toFixed(2)}`
      });
    } catch (error) {
      console.error('Error creating receivable:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar faturamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (productsLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Carregando produtos...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const totalValue = calculateTotalValue();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Faturar Venda - {sale.cliente}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InvoiceFormFields
            invoiceDate={invoiceDate}
            extraTax={extraTax}
            fiscalNote={fiscalNote}
            suframa={suframa}
            hasProducts={hasProducts}
            onInvoiceDateChange={setInvoiceDate}
            onExtraTaxChange={handleExtraTaxChange}
            onFiscalNoteChange={setFiscalNote}
            onSuframaChange={handleSuframaChange}
          />

          {/* Lista de Produtos - só exibir se existirem produtos */}
          {hasProducts && (
            <InvoiceProductSelection
              products={saleProducts}
              selectedProducts={selectedProducts}
              quantities={quantities}
              onProductSelection={handleProductSelection}
              onQuantityChange={handleQuantityChange}
            />
          )}

          {/* Mensagem quando não há produtos */}
          {!hasProducts && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <p className="text-sm text-yellow-800 font-medium">
                  Esta venda não possui produtos cadastrados
                </p>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Para faturar, é obrigatório informar o número da nota fiscal
              </p>
            </div>
          )}

          {/* Resumo detalhado */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Resumo do Faturamento</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Produtos selecionados:</span>
                <span>{hasProducts ? Object.values(selectedProducts).filter(Boolean).length : 'N/A'}</span>
              </div>
              
              {suframa > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Desconto Suframa:</span>
                  <span>- R$ {suframa.toFixed(2)}</span>
                </div>
              )}
              
              {extraTax > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Impostos extras:</span>
                  <span>+ R$ {extraTax.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Valor total a faturar:</span>
                <span className="text-green-600">R$ {totalValue.toFixed(2)}</span>
              </div>
              
              {fiscalNote && (
                <div className="flex justify-between">
                  <span>Número da nota fiscal:</span>
                  <span className="font-medium">{fiscalNote}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Faturar Venda
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
