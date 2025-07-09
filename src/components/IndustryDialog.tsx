
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Industry {
  id?: string;
  nome: string;
  grupo: string;
  cnpj: string;
  estado: string;
}

interface IndustryDialogProps {
  industry?: Industry;
  onSave: (industry: Omit<Industry, 'id'>) => void;
  trigger?: React.ReactNode;
}

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const IndustryDialog = ({ industry, onSave, trigger }: IndustryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Industry, 'id'>>({
    nome: '',
    grupo: '',
    cnpj: '',
    estado: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (industry) {
      setFormData({
        nome: industry.nome,
        grupo: industry.grupo,
        cnpj: industry.cnpj,
        estado: industry.estado
      });
    }
  }, [industry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.grupo || !formData.cnpj || !formData.estado) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    setOpen(false);
    
    if (!industry) {
      setFormData({
        nome: '',
        grupo: '',
        cnpj: '',
        estado: ''
      });
    }
  };

  const defaultTrigger = (
    <Button variant="outline">
      <Plus className="mr-2 h-4 w-4" />
      Nova Indústria
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {industry ? 'Editar Indústria' : 'Nova Indústria'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="grupo">Grupo *</Label>
            <Input
              id="grupo"
              value={formData.grupo}
              onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
              placeholder="Digite o grupo da indústria"
              required
            />
          </div>

          <div>
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              placeholder="00.000.000/0000-00"
              required
            />
          </div>

          <div>
            <Label htmlFor="estado">Estado *</Label>
            <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {industry ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
