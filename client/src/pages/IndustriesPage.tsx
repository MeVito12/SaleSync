
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, Building } from 'lucide-react';
import { IndustryDialog } from '@/components/IndustryDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Industry {
  id: string;
  nome: string;
  grupo: string;
  cnpj: string;
  estado: string;
}

const IndustriesPage = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('nome');

      if (error) throw error;
      setIndustries(data || []);
    } catch (error) {
      console.error('Erro ao buscar indústrias:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar indústrias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredIndustries = industries.filter(industry =>
    industry.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    industry.grupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    industry.cnpj.includes(searchTerm)
  );

  const handleSaveIndustry = async (industryData: Omit<Industry, 'id'>) => {
    try {
      const { error } = await supabase
        .from('industries')
        .insert([industryData]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Indústria cadastrada com sucesso"
      });
      fetchIndustries();
    } catch (error) {
      console.error('Erro ao salvar indústria:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar indústria",
        variant: "destructive"
      });
    }
  };

  const handleUpdateIndustry = async (id: string, industryData: Omit<Industry, 'id'>) => {
    try {
      const { error } = await supabase
        .from('industries')
        .update(industryData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Indústria atualizada com sucesso"
      });
      fetchIndustries();
    } catch (error) {
      console.error('Erro ao atualizar indústria:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar indústria",
        variant: "destructive"
      });
    }
  };

  const handleDeleteIndustry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('industries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Indústria removida com sucesso"
      });
      fetchIndustries();
    } catch (error) {
      console.error('Erro ao deletar indústria:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover indústria",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando indústrias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Indústrias</h1>
          <p className="text-muted-foreground">
            Gerencie as indústrias parceiras
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar indústrias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <IndustryDialog onSave={handleSaveIndustry} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ações</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead className="w-[100px]">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIndustries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <Building className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">Nenhuma indústria cadastrada</p>
                  <p className="text-sm">Adicione sua primeira indústria</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredIndustries.map((industry) => (
                <TableRow key={industry.id}>
                  <TableCell>
                    <div className="flex space-x-2">
                      <IndustryDialog
                        industry={industry}
                        onSave={(data) => handleUpdateIndustry(industry.id, data)}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteIndustry(industry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{industry.nome}</TableCell>
                  <TableCell>{industry.grupo}</TableCell>
                  <TableCell className="font-mono">{industry.cnpj}</TableCell>
                  <TableCell>{industry.estado}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default IndustriesPage;
