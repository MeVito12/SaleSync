
-- Verificar se RLS está habilitado e criar políticas para payment_methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos os usuários vejam métodos de pagamento
CREATE POLICY "Anyone can view payment methods" ON public.payment_methods
FOR SELECT USING (true);

-- Política para permitir que usuários autenticados criem métodos de pagamento
CREATE POLICY "Authenticated users can create payment methods" ON public.payment_methods
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política para permitir que usuários autenticados atualizem métodos de pagamento
CREATE POLICY "Authenticated users can update payment methods" ON public.payment_methods
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Política para permitir que usuários autenticados deletem métodos de pagamento
CREATE POLICY "Authenticated users can delete payment methods" ON public.payment_methods
FOR DELETE USING (auth.uid() IS NOT NULL);
