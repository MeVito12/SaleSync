
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRepresentatives } from '@/hooks/useRepresentatives';
import { useIndustries } from '@/hooks/useIndustries';
import { useCategories } from '@/hooks/useCategories';

interface CommissionRule {
  id?: string;
  representanteId: string;
  industriaId: string;
  categoriaId: string;
  percentualIndustria: number;
  percentualRepasse: number;
  baseCalculo: 'produto' | 'total';
}

interface CommissionRuleDialogProps {
  commissionRule?: CommissionRule;
  onSave: (commissionRule: Omit<CommissionRule, 'id'>) => void;
  trigger?: React.ReactNode;
}

export const CommissionRuleDialog = ({ commissionRule, onSave, trigger }: CommissionRuleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<CommissionRule, 'id'>>({
    representanteId: '',
    industriaId: '',
    categoriaId: '',
    percentualIndustria: 0,
    percentualRepasse: 0,
    baseCalculo: 'total'
  });
  const [selectedRepresentative, setSelectedRepresentative] = useState<any>(null);
  const { toast } = useToast();
  const { representatives } = useRepresentatives();
  const { industries } = useIndustries();
  const { categories } = useCategories();

  // Função para formatar valores numéricos (mostrar vazio se for 0)
  const formatNumericValue = (value: number) => {
    return value === 0 ? '' : value.toString();
  };

  useEffect(() => {
    if (commissionRule) {
      setFormData({
        representanteId: commissionRule.representanteId,
        industriaId: commissionRule.industriaId,
        categoriaId: commissionRule.categoriaId,
        percentualIndustria: commissionRule.percentualIndustria,
        percentualRepasse: commissionRule.percentualRepasse,
        baseCalculo: commissionRule.baseCalculo || 'total'
      });
    }
  }, [commissionRule]);

  // Atualizar representante selecionado quando o ID mudar
  useEffect(() => {
    if (formData.representanteId && representatives.length > 0) {
      const rep = representatives.find(r => r.id === formData.representanteId);
      setSelectedRepresentative(rep);
    }
  }, [formData.representanteId, representatives]);

  // Automaticamente calcula o repasse - se for master fica com 100%, senão metade da indústria
  useEffect(() => {
    if (selectedRepresentative?.is_master) {
      // Master fica com o mesmo percentual da indústria (não divide)
      setFormData(prev => ({
        ...prev,
        percentualRepasse: prev.percentualIndustria
      }));
    } else {
      // Representante normal fica com metade
      setFormData(prev => ({
        ...prev,
        percentualRepasse: prev.percentualIndustria / 2
      }));
    }
  }, [formData.percentualIndustria, selectedRepresentative]);

  const handlePercentualIndustriaChange = (inputValue: string) => {
    const numericValue = inputValue === '' ? 0 : parseFloat(inputValue) || 0;
    setFormData(prev => ({ ...prev, percentualIndustria: numericValue }));
  };

  const handleRepresentanteChange = (representanteId: string) => {
    setFormData(prev => ({ ...prev, representanteId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.representanteId || !formData.industriaId || !formData.categoriaId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (formData.percentualIndustria <= 0) {
      toast({
        title: "Erro",
        description: "O percentual da indústria deve ser maior que 0",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    setOpen(false);
    toast({
      title: "Sucesso",
      description: commissionRule ? "Regra de comissão atualizada com sucesso" : "Regra de comissão cadastrada com sucesso"
    });
    
    if (!commissionRule) {
      setFormData({
        representanteId: '',
        industriaId: '',
        categoriaId: '',
        percentualIndustria: 0,
        percentualRepasse: 0,
        baseCalculo: 'total'
      });
      setSelectedRepresentative(null);
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Nova Regra
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {commissionRule ? 'Editar Regra de Comissão' : 'Nova Regra de Comissão'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="representante">Representante *</Label>
            <Select
              value={formData.representanteId}
              onValueChange={handleRepresentanteChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o representante" />
              </SelectTrigger>
              <SelectContent>
                {representatives.map((rep) => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.nome} {rep.is_master ? '(Master)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRepresentative?.is_master && (
              <p className="text-xs text-blue-600 mt-1">
                Perfil Master: Recebe 100% da comissão (não divide)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="industria">Indústria *</Label>
            <Select
              value={formData.industriaId}
              onValueChange={(value) => setFormData({ ...formData, industriaId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a indústria" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind.id} value={ind.id}>
                    {ind.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="categoria">Categoria *</Label>
            <Select
              value={formData.categoriaId}
              onValueChange={(value) => setFormData({ ...formData, categoriaId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seção para Base de Cálculo com textos atualizados */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Base de Cálculo da Comissão *</Label>
            <RadioGroup
              value={formData.baseCalculo}
              onValueChange={(value: 'produto' | 'total') => setFormData({ ...formData, baseCalculo: value })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="produto" id="produto" />
                <Label htmlFor="produto" className="text-sm font-normal">
                  Valor da Venda
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="total" id="total" />
                <Label htmlFor="total" className="text-sm font-normal">
                  Valor Total da NFe
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-gray-500">
              {formData.baseCalculo === 'produto' 
                ? 'A comissão será calculada sobre o valor da venda' 
                : 'A comissão será calculada sobre o valor total da NFe, incluindo IPI e outras taxas'
              }
            </p>
          </div>
          
          <div>
            <Label htmlFor="percentualIndustria">(%) Indústria *</Label>
            <Input
              id="percentualIndustria"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formatNumericValue(formData.percentualIndustria)}
              onChange={(e) => handlePercentualIndustriaChange(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="percentualRepasse">(%) Repasse</Label>
            <Input
              id="percentualRepasse"
              type="number"
              value={formatNumericValue(formData.percentualRepasse)}
              readOnly
              className="bg-gray-100"
              placeholder="Calculado automaticamente"
            />
            <p className="text-xs text-gray-500 mt-1">
              {selectedRepresentative?.is_master 
                ? 'Master: Fica com 100% da comissão' 
                : 'Sempre metade do percentual da indústria'
              }
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {commissionRule ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
