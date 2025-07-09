
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockIndustries } from '@/data/mockData';

interface Industry {
  id: string;
  nome: string;
  cnpj: string;
  estado: string;
  grupo: string;
  created_at: string;
  updated_at: string;
}

export const useIndustries = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const sortedIndustries = [...mockIndustries].sort((a, b) => 
        a.nome.localeCompare(b.nome)
      );
      setIndustries(sortedIndustries);
    } catch (error) {
      console.error('Error fetching industries:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar indústrias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createIndustry = async (industryData: Omit<Industry, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('industries')
        .insert([industryData])
        .select()
        .single();

      if (error) throw error;

      await fetchIndustries();
      toast({
        title: "Sucesso",
        description: "Indústria criada com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error creating industry:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar indústria",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateIndustry = async (id: string, industryData: Omit<Industry, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('industries')
        .update({ ...industryData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchIndustries();
      toast({
        title: "Sucesso",
        description: "Indústria atualizada com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error updating industry:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar indústria",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteIndustry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('industries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchIndustries();
      toast({
        title: "Sucesso",
        description: "Indústria removida com sucesso"
      });
    } catch (error) {
      console.error('Error deleting industry:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover indústria",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  return {
    industries,
    loading,
    createIndustry,
    updateIndustry,
    deleteIndustry,
    refetch: fetchIndustries
  };
};
