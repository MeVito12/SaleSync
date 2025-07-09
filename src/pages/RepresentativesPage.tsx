
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Representative {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  regiao: string;
  status: 'Ativo' | 'Inativo';
}

const RepresentativesPage = () => {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredRepresentatives = representatives.filter(rep =>
    rep.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rep.regiao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRepresentative = (id: number) => {
    setRepresentatives(representatives.filter(rep => rep.id !== id));
    toast({
      title: "Sucesso",
      description: "Representante removido com sucesso"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Representantes</h1>
          <p className="text-muted-foreground">
            Gerencie os representantes de vendas
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar representantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button>
          Novo Representante
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ações</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Região</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRepresentatives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  <UserCheck className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">Nenhum representante cadastrado</p>
                  <p className="text-sm">Adicione seu primeiro representante</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRepresentatives.map((representative) => (
                <TableRow key={representative.id}>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRepresentative(representative.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{representative.nome}</TableCell>
                  <TableCell>{representative.email}</TableCell>
                  <TableCell>{representative.telefone}</TableCell>
                  <TableCell>{representative.regiao}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      representative.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {representative.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RepresentativesPage;
