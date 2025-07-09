
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CNPJInput } from '@/components/ui/cnpj-input';

interface Client {
  id?: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  email: string;
  estado: string;
}

interface ClientFormFieldsProps {
  formData: Omit<Client, 'id'>;
  updateField: (field: keyof Omit<Client, 'id'>, value: string) => void;
}

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const ClientFormFields = ({ formData, updateField }: ClientFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome_fantasia">Nome Fantasia *</Label>
          <Input
            id="nome_fantasia"
            value={formData.nome_fantasia}
            onChange={(e) => updateField('nome_fantasia', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="razao_social">Razão Social *</Label>
          <Input
            id="razao_social"
            value={formData.razao_social}
            onChange={(e) => updateField('razao_social', e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cnpj">CNPJ *</Label>
          <CNPJInput
            id="cnpj"
            value={formData.cnpj}
            onChange={(value) => updateField('cnpj', value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="estado">Estado</Label>
        <Select value={formData.estado} onValueChange={(value) => updateField('estado', value)}>
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
    </div>
  );
};
