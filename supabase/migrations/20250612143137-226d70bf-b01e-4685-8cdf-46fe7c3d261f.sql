
-- Atualizar políticas RLS para permitir que usuários autenticados acessem e manipulem dados de clientes
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON public.clients;

-- Criar políticas mais permissivas para usuários autenticados
CREATE POLICY "Anyone can view clients" ON public.clients
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert clients" ON public.clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update clients" ON public.clients
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete clients" ON public.clients
  FOR DELETE USING (true);
