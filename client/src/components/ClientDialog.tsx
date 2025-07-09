
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useClientForm } from '@/hooks/useClientForm';
import { ClientFormFields } from './ClientFormFields';

interface Client {
  id?: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  email: string;
  estado: string;
}

interface ClientDialogProps {
  client?: Client;
  onSave: (client: Omit<Client, 'id'>) => void;
  trigger?: React.ReactNode;
}

export const ClientDialog = ({ client, onSave, trigger }: ClientDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { formData, resetForm, updateField } = useClientForm(client);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_fantasia || !formData.razao_social || !formData.cnpj) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    setOpen(false);
    
    if (!client) {
      resetForm();
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Novo Cliente
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ClientFormFields formData={formData} updateField={updateField} />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {client ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
