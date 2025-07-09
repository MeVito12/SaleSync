
-- Remover políticas antigas que podem estar causando conflito
DROP POLICY IF EXISTS "Anyone can view payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can create payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can update payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can delete payment methods" ON public.payment_methods;

-- Criar novas políticas mais permissivas para payment_methods
CREATE POLICY "Anyone can view payment methods" ON public.payment_methods
FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON public.payment_methods
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON public.payment_methods
FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" ON public.payment_methods
FOR DELETE USING (true);
