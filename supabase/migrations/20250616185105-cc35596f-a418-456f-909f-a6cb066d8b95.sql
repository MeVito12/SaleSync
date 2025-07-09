
-- Criar uma tabela para armazenar informações dos representantes se não existir
CREATE TABLE IF NOT EXISTS public.representatives (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nome character varying NOT NULL,
  email character varying,
  telefone character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela representatives
ALTER TABLE public.representatives ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Anyone can view representatives" ON public.representatives;
DROP POLICY IF EXISTS "Authenticated users can manage representatives" ON public.representatives;

-- Política para permitir que usuários autenticados vejam representantes
CREATE POLICY "Authenticated users can view representatives" 
ON public.representatives 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Política para permitir que usuários autenticados criem/editem representantes
CREATE POLICY "Authenticated users can insert representatives" 
ON public.representatives 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update representatives" 
ON public.representatives 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete representatives" 
ON public.representatives 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Adicionar uma nova coluna para referenciar representantes por UUID
ALTER TABLE commission_rules ADD COLUMN IF NOT EXISTS new_representante_id uuid;

-- Adicionar foreign key para a nova coluna se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'commission_rules_new_representante_id_fkey') THEN
        ALTER TABLE commission_rules 
        ADD CONSTRAINT commission_rules_new_representante_id_fkey 
        FOREIGN KEY (new_representante_id) REFERENCES representatives(id);
    END IF;
END $$;

-- Inserir alguns representantes de exemplo para teste
INSERT INTO public.representatives (nome, email) VALUES 
('CLAUDIO NAMURA', 'claudio@example.com'),
('João Silva', 'joao@example.com'),
('Maria Santos', 'maria@example.com')
ON CONFLICT DO NOTHING;
