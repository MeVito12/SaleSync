
-- Atualizar políticas RLS para categories
DROP POLICY IF EXISTS "Authenticated users can view categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;

CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert categories" ON public.categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update categories" ON public.categories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete categories" ON public.categories
  FOR DELETE USING (true);

-- Atualizar políticas RLS para industries
DROP POLICY IF EXISTS "Authenticated users can view industries" ON public.industries;
DROP POLICY IF EXISTS "Authenticated users can insert industries" ON public.industries;
DROP POLICY IF EXISTS "Authenticated users can update industries" ON public.industries;
DROP POLICY IF EXISTS "Authenticated users can delete industries" ON public.industries;

CREATE POLICY "Anyone can view industries" ON public.industries
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert industries" ON public.industries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update industries" ON public.industries
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete industries" ON public.industries
  FOR DELETE USING (true);

-- Atualizar políticas RLS para clients (já foram atualizadas mas garantindo consistência)
DROP POLICY IF EXISTS "Anyone can view clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can update clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can delete clients" ON public.clients;

CREATE POLICY "Anyone can view clients" ON public.clients
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert clients" ON public.clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update clients" ON public.clients
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete clients" ON public.clients
  FOR DELETE USING (true);

-- Atualizar políticas RLS para payment_methods
DROP POLICY IF EXISTS "Anyone can view payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.payment_methods;
DROP POLICY IF EXISTS "Allow update for all users" ON public.payment_methods;
DROP POLICY IF EXISTS "Allow delete for all users" ON public.payment_methods;

CREATE POLICY "Anyone can view payment methods" ON public.payment_methods
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert payment methods" ON public.payment_methods
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update payment methods" ON public.payment_methods
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete payment methods" ON public.payment_methods
  FOR DELETE USING (true);

-- Atualizar políticas RLS para commission_rules
DROP POLICY IF EXISTS "Authenticated users can view commission_rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Authenticated users can insert commission_rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Authenticated users can update commission_rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Authenticated users can delete commission_rules" ON public.commission_rules;

CREATE POLICY "Anyone can view commission_rules" ON public.commission_rules
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert commission_rules" ON public.commission_rules
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update commission_rules" ON public.commission_rules
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete commission_rules" ON public.commission_rules
  FOR DELETE USING (true);

-- Atualizar políticas RLS para sales
DROP POLICY IF EXISTS "Users can view sales" ON public.sales;
DROP POLICY IF EXISTS "Users can insert sales" ON public.sales;
DROP POLICY IF EXISTS "Users can update own sales" ON public.sales;
DROP POLICY IF EXISTS "Users can delete own sales" ON public.sales;

CREATE POLICY "Anyone can view sales" ON public.sales
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert sales" ON public.sales
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update sales" ON public.sales
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete sales" ON public.sales
  FOR DELETE USING (true);

-- Atualizar políticas RLS para sale_products
DROP POLICY IF EXISTS "Users can view sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Users can insert sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Users can update sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Users can delete sale_products" ON public.sale_products;

CREATE POLICY "Anyone can view sale_products" ON public.sale_products
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert sale_products" ON public.sale_products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update sale_products" ON public.sale_products
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete sale_products" ON public.sale_products
  FOR DELETE USING (true);

-- Atualizar políticas RLS para receivables
DROP POLICY IF EXISTS "Users can view receivables" ON public.receivables;
DROP POLICY IF EXISTS "Users can insert receivables" ON public.receivables;
DROP POLICY IF EXISTS "Users can update own receivables" ON public.receivables;
DROP POLICY IF EXISTS "Users can delete own receivables" ON public.receivables;

CREATE POLICY "Anyone can view receivables" ON public.receivables
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert receivables" ON public.receivables
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update receivables" ON public.receivables
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete receivables" ON public.receivables
  FOR DELETE USING (true);

-- Atualizar políticas RLS para audit_log
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_log;

CREATE POLICY "Anyone can view audit_log" ON public.audit_log
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert audit_log" ON public.audit_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update audit_log" ON public.audit_log
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete audit_log" ON public.audit_log
  FOR DELETE USING (true);
