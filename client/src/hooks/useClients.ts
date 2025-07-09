
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockClients } from '@/data/mockData';

interface Client {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  estado?: string;
  segmento?: string;
  created_at: string;
  updated_at: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const sortedClients = [...mockClients].sort((a, b) => 
        a.nome_fantasia.localeCompare(b.nome_fantasia)
      );
      setClients(sortedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newClient = {
        ...clientData,
        id: `client_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockClients.push(newClient);
      await fetchClients();
      
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso"
      });
      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar cliente",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateClient = async (id: string, clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const clientIndex = mockClients.findIndex(c => c.id === id);
      if (clientIndex === -1) throw new Error('Cliente não encontrado');
      
      const updatedClient = {
        ...mockClients[clientIndex],
        ...clientData,
        updated_at: new Date().toISOString()
      };
      
      mockClients[clientIndex] = updatedClient;
      await fetchClients();
      
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso"
      });
      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const clientIndex = mockClients.findIndex(c => c.id === id);
      if (clientIndex === -1) throw new Error('Cliente não encontrado');
      
      mockClients.splice(clientIndex, 1);
      await fetchClients();
      
      toast({
        title: "Sucesso",
        description: "Cliente removido com sucesso"
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover cliente",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
};
