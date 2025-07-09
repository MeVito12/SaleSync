import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockRepresentatives } from '@/data/mockData';

interface Representative {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  is_master: boolean;
  user_id: string;
}

export const useRepresentatives = () => {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRepresentatives = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRepresentatives(mockRepresentatives);
    } catch (error) {
      console.error('Error fetching representatives:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar representantes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepresentatives();
  }, []);

  return {
    representatives,
    loading,
    refetch: fetchRepresentatives
  };
};