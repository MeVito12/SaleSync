
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useCategories } from '@/hooks/useCategories';
import { useIndustries } from '@/hooks/useIndustries';

interface Product {
  id?: string;
  codigo: string;
  nome: string;
  ean: string;
  ncm: string;
  preco_base: number;
  percentual_ipi: number;
  categoria_id: string;
  industria_id: string;
}

interface ProductFormProps {
  product?: Product;
  onSave: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  existingProducts: Product[];
}

export const ProductForm = ({ product, onSave, onCancel, existingProducts }: ProductFormProps) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    codigo: '',
    nome: '',
    ean: '',
    ncm: '',
    preco_base: 0,
    percentual_ipi: 0,
    categoria_id: '',
    industria_id: ''
  });
  const [error, setError] = useState('');

  const { categories, loading: categoriesLoading } = useCategories();
  const { industries, loading: industriesLoading } = useIndustries();

  useEffect(() => {
    if (product) {
      setFormData({
        codigo: product.codigo,
        nome: product.nome,
        ean: product.ean,
        ncm: product.ncm,
        preco_base: product.preco_base,
        percentual_ipi: product.percentual_ipi,
        categoria_id: product.categoria_id,
        industria_id: product.industria_id
      });
    }
  }, [product]);

  const handleChange = (field: keyof Omit<Product, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.codigo || !formData.nome) {
      setError('Código e Nome são obrigatórios');
      return false;
    }

    // Verificar duplicação de código (exceto se for edição do mesmo produto)
    const duplicateCode = existingProducts.find(p => 
      p.codigo === formData.codigo && p.id !== product?.id
    );
    if (duplicateCode) {
      setError('Já existe um produto com este código');
      return false;
    }

    // Verificar duplicação de EAN (exceto se for edição do mesmo produto)
    if (formData.ean) {
      const duplicateEAN = existingProducts.find(p => 
        p.ean === formData.ean && p.id !== product?.id
      );
      if (duplicateEAN) {
        setError('Já existe um produto com este EAN');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Código *</label>
          <Input 
            placeholder="Ex: PROD001" 
            value={formData.codigo}
            onChange={(e) => handleChange('codigo', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome *</label>
          <Input 
            placeholder="Nome do produto" 
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">EAN</label>
          <Input 
            placeholder="Código de barras" 
            value={formData.ean}
            onChange={(e) => handleChange('ean', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">NCM</label>
          <Input 
            placeholder="Código NCM" 
            value={formData.ncm}
            onChange={(e) => handleChange('ncm', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Preço Base (R$)</label>
          <CurrencyInput 
            value={formData.preco_base}
            onChange={(value) => handleChange('preco_base', value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">IPI (%)</label>
          <Input 
            type="number" 
            step="0.01" 
            placeholder="0,00" 
            value={formData.percentual_ipi === 0 ? '' : formData.percentual_ipi.toString()}
            onChange={(e) => handleChange('percentual_ipi', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <Select value={formData.categoria_id} onValueChange={(value) => handleChange('categoria_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder={categoriesLoading ? "Carregando..." : "Selecione uma categoria"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Indústria</label>
          <Select value={formData.industria_id} onValueChange={(value) => handleChange('industria_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder={industriesLoading ? "Carregando..." : "Selecione uma indústria"} />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industria) => (
                <SelectItem key={industria.id} value={industria.id}>
                  {industria.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {product ? 'Atualizar Produto' : 'Salvar Produto'}
        </Button>
      </DialogFooter>
    </>
  );
};
