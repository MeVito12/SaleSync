
-- Remover usuários de exemplo da tabela representatives
DELETE FROM public.representatives 
WHERE email IN ('claudio@example.com', 'joao@example.com', 'maria@example.com')
   OR nome IN ('CLAUDIO NAMURA', 'João Silva', 'Maria Santos');

-- Limpar qualquer outro dado de teste que possa ter sido inserido
DELETE FROM public.representatives 
WHERE email LIKE '%@example.com';
