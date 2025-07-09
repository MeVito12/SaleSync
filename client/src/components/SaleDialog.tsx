
import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SaleDialogContent } from './SaleDialogContent';

interface Sale {
  id?: string;
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
  clients?: { nome_fantasia: string };
  industries?: { nome: string };
}

interface SaleDialogProps {
  sale?: Sale;
  onSave: (sale: Omit<Sale, 'id' | 'clients' | 'industries'> & { produtos?: any[] }) => void;
  trigger?: React.ReactNode;
}

export const SaleDialog = ({ sale, onSave, trigger }: SaleDialogProps) => {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Incluir Pedido
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <SaleDialogContent 
        sale={sale} 
        onSave={onSave} 
        onClose={() => setOpen(false)} 
      />
    </Dialog>
  );
};
