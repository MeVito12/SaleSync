
-- Adicionar coluna is_master na tabela representatives
ALTER TABLE public.representatives 
ADD COLUMN is_master BOOLEAN DEFAULT false;

-- Comentário: Esta coluna será usada para identificar representantes master 
-- que recebem 100% da comissão (não dividem)
