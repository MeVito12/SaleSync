import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Representative {
  id: string;
  user_id?: string;
  nome: string;
  email?: string;
  telefone?: string;
  created_at: string;
  updated_at: string;
  is_master?: boolean;
}

export const useRepresentatives = () => {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRepresentatives = async () => {
    try {
      setLoading(true);
      
      // Buscar usuários reais do sistema através da tabela profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .order('name', { ascending: true });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Se não conseguir buscar profiles, usar tabela representatives como fallback
        const { data: reps, error: repsError } = await supabase
          .from('representatives')
          .select('*')
          .order('nome', { ascending: true });

        if (repsError) throw repsError;
        setRepresentatives(reps || []);
        return;
      }

      // Converter profiles para o formato de representantes e sincronizar com a tabela representatives
      const representativesFromProfiles = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Verificar se já existe na tabela representatives
          const { data: existingRep } = await supabase
            .from('representatives')
            .select('*')
            .eq('user_id', profile.id)
            .single();

          if (existingRep) {
            return existingRep;
          }

          // Se não existe, criar o representante
          const { data: newRep, error: insertError } = await supabase
            .from('representatives')
            .insert({
              user_id: profile.id,
              nome: profile.name,
              email: null,
              telefone: null
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating representative:', insertError);
            return {
              id: profile.id,
              user_id: profile.id,
              nome: profile.name,
              email: null,
              telefone: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }

          return newRep;
        })
      );

      setRepresentatives(representativesFromProfiles);
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

  const createRepresentative = async (representativeData: Omit<Representative, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('representatives')
        .insert([representativeData])
        .select()
        .single();

      if (error) throw error;

      await fetchRepresentatives();
      toast({
        title: "Sucesso",
        description: "Representante criado com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error creating representative:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar representante",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateRepresentative = async (id: string, representativeData: Omit<Representative, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('representatives')
        .update({ ...representativeData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchRepresentatives();
      toast({
        title: "Sucesso",
        description: "Representante atualizado com sucesso"
      });
      return data;
    } catch (error) {
      console.error('Error updating representative:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar representante",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteRepresentative = async (id: string) => {
    try {
      const { error } = await supabase
        .from('representatives')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchRepresentatives();
      toast({
        title: "Sucesso",
        description: "Representante removido com sucesso"
      });
    } catch (error) {
      console.error('Error deleting representative:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover representante",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchRepresentatives();
  }, []);

  return {
    representatives,
    loading,
    createRepresentative,
    updateRepresentative,
    deleteRepresentative,
    refetch: fetchRepresentatives
  };
};
