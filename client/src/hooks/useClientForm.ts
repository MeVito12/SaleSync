
import { useState, useEffect } from 'react';

interface Client {
  id?: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  email: string;
  estado: string;
}

export const useClientForm = (client?: Client) => {
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    nome_fantasia: '',
    razao_social: '',
    cnpj: '',
    email: '',
    estado: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        nome_fantasia: client.nome_fantasia,
        razao_social: client.razao_social,
        cnpj: client.cnpj,
        email: client.email,
        estado: client.estado
      });
    }
  }, [client]);

  const resetForm = () => {
    setFormData({
      nome_fantasia: '',
      razao_social: '',
      cnpj: '',
      email: '',
      estado: ''
    });
  };

  const updateField = (field: keyof Omit<Client, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    setFormData,
    resetForm,
    updateField
  };
};
