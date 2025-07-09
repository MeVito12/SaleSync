
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockCategories } from '@/data/mockData';

interface Category {
  id: string;
  nome: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const sortedCategories = [...mockCategories].sort((a, b) => 
        a.nome.localeCompare(b.nome)
      );
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newCategory = {
        ...categoryData,
        id: `category_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockCategories.push(newCategory);
      await fetchCategories();
      
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso"
      });
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar categoria",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const categoryIndex = mockCategories.findIndex(c => c.id === id);
      if (categoryIndex === -1) throw new Error('Categoria não encontrada');
      
      const updatedCategory = {
        ...mockCategories[categoryIndex],
        ...categoryData,
        updated_at: new Date().toISOString()
      };
      
      mockCategories[categoryIndex] = updatedCategory;
      await fetchCategories();
      
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso"
      });
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const categoryIndex = mockCategories.findIndex(c => c.id === id);
      if (categoryIndex === -1) throw new Error('Categoria não encontrada');
      
      mockCategories.splice(categoryIndex, 1);
      await fetchCategories();
      
      toast({
        title: "Sucesso",
        description: "Categoria removida com sucesso"
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover categoria",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories
  };
};
