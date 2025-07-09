
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, Users } from 'lucide-react';
import { ClientDialog } from '@/components/ClientDialog';
import { useClients } from '@/hooks/useClients';

interface Client {
  id: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  email: string;
  estado: string;
}

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { clients, loading, createClient, updateClient, deleteClient } = useClients();

  const filteredClients = clients.filter(client =>
    client.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cnpj.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveClient = async (clientData: Omit<Client, 'id'>) => {
    await createClient(clientData);
  };

  const handleUpdateClient = async (id: string, clientData: Omit<Client, 'id'>) => {
    await updateClient(id, clientData);
  };

  const handleDeleteClient = async (id: string) => {
    await deleteClient(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e suas informações
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <ClientDialog onSave={handleSaveClient} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ações</TableHead>
              <TableHead>Nome Fantasia</TableHead>
              <TableHead>Razão Social</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">Nenhum cliente cadastrado</p>
                  <p className="text-sm">Adicione seu primeiro cliente</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex space-x-2">
                      <ClientDialog
                        client={client}
                        onSave={(data) => handleUpdateClient(client.id, data)}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{client.nome_fantasia}</TableCell>
                  <TableCell>{client.razao_social}</TableCell>
                  <TableCell>{client.cnpj}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.estado}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsPage;
