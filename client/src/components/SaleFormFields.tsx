import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClients } from '@/hooks/useClients';
import { useIndustries } from '@/hooks/useIndustries';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useAuth } from '@/contexts/MockAuthContext';
import { useRepresentatives } from '@/hooks/useRepresentatives';

interface FormData {
  representante_id: string;
  cliente_id: string;
  industria_id: string;
  condicao_pagamento: string;
  tipo_pedido: string;
  valor: number;
  numero_pedido?: string;
  observacao: string;
  status: string;
}

interface SaleFormFieldsProps {
  formData: FormData;
  onFieldChange: (field: string, value: any) => void;
}

const tiposPedido = [
  'Venda',
  'Bonificação',
  'Troca',
  'Demonstração'
];

export const SaleFormFields = ({ formData, onFieldChange }: SaleFormFieldsProps) => {
  const { clients, loading: clientsLoading } = useClients();
  const { industries, loading: industriesLoading } = useIndustries();
  const { paymentMethods } = usePaymentMethods();
  const { representatives, loading: usersLoading } = useRepresentatives();

  return (
    <div className="space-y-6">
      {/* Primeira linha: Representante, Indústria, Cliente */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="representante">Representante *</Label>
          <Select value={formData.representante_id} onValueChange={(value) => onFieldChange('representante_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {usersLoading ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  Carregando...
                </div>
              ) : !representatives || representatives.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  Nenhum usuário cadastrado
                </div>
              ) : (
                representatives.map((rep) => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.nome}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="industria">Indústria *</Label>
          <Select value={formData.industria_id} onValueChange={(value) => onFieldChange('industria_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {industriesLoading ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  Carregando...
                </div>
              ) : industries.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  Nenhuma indústria cadastrada
                </div>
              ) : (
                industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id}>
                    {industry.nome}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="cliente">Cliente *</Label>
          <Select value={formData.cliente_id} onValueChange={(value) => onFieldChange('cliente_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {clientsLoading ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  Carregando...
                </div>
              ) : clients.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  Nenhum cliente cadastrado
                </div>
              ) : (
                clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nome_fantasia}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Número do Pedido */}
      <div>
        <Label htmlFor="numeroPedido">OC/Número do Pedido</Label>
        <Input
          id="numeroPedido"
          value={formData.numero_pedido || ''}
          onChange={(e) => onFieldChange('numero_pedido', e.target.value)}
          placeholder="Digite o número da ordem de compra ou pedido..."
        />
      </div>

      {/* Condição de Pagamento e Tipo Pedido */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="condicaoPagamento">Cond. Pagamento *</Label>
          <Select value={formData.condicao_pagamento} onValueChange={(value) => onFieldChange('condicao_pagamento', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.nome}>
                  {method.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="tipoPedido">Tipo Pedido *</Label>
          <Select value={formData.tipo_pedido} onValueChange={(value) => onFieldChange('tipo_pedido', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {tiposPedido.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Observação */}
      <div>
        <Label htmlFor="observacao">Observação</Label>
        <Textarea
          id="observacao"
          value={formData.observacao}
          onChange={(e) => onFieldChange('observacao', e.target.value)}
          placeholder="Digite suas observações aqui..."
          rows={4}
        />
      </div>

      {/* Status */}
      <div>
        <Label htmlFor="status">Status</Label>
        <Input
          id="status"
          value={formData.status}
          readOnly
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500 mt-1">Definido automaticamente pelo prazo de entrega</p>
      </div>
    </div>
  );
};
