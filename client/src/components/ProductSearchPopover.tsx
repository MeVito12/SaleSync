
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Plus } from 'lucide-react';
import { useFinancialFormat } from '@/hooks/useFinancialFormat';

interface Product {
  id: string;
  nome: string;
  codigo: string;
  preco_base: number | null;
  percentual_ipi: number | null;
  categoria_id: string | null;
  industria_id: string | null;
  ean: string | null;
  ncm: string | null;
}

interface ProductSearchPopoverProps {
  products: Product[];
  productsLoading: boolean;
  industriaId: string;
  onProductAdd: (product: Product) => void;
}

export const ProductSearchPopover = ({ 
  products, 
  productsLoading, 
  industriaId, 
  onProductAdd 
}: ProductSearchPopoverProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const { formatCurrency } = useFinancialFormat();

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    onProductAdd(selectedProduct);
    setSelectedProduct(null);
    setSearchTerm('');
    setOpen(false);
  };

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <Label htmlFor="produto">Produto</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={!industriaId}
            >
              {selectedProduct ? (
                `${selectedProduct.nome} - ${selectedProduct.codigo}`
              ) : (
                !industriaId ? 'Selecione uma indústria primeiro' : 'Pesquisar produto...'
              )}
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput 
                placeholder="Pesquisar produto..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>
                  {productsLoading ? 'Carregando...' : 'Nenhum produto encontrado.'}
                </CommandEmpty>
                <CommandGroup>
                  {products.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={`${product.nome} ${product.codigo}`}
                      onSelect={() => {
                        setSelectedProduct(product);
                        setOpen(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{product.nome}</span>
                        <span className="text-sm text-gray-500">{product.codigo}</span>
                        <span className="text-xs text-gray-400">
                          Preço: {formatCurrency(product.preco_base || 0)} | IPI: {product.percentual_ipi || 0}%
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex items-end">
        <Button 
          onClick={handleAddProduct}
          disabled={!selectedProduct}
          className="w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </div>
  );
};
