
-- Remover todas as políticas duplicadas e antigas da tabela payment_methods
DROP POLICY IF EXISTS "Anyone can view payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Anyone can insert payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Anyone can update payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Anyone can delete payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can create payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can update payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can delete payment methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can view payment_methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can insert payment_methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can update payment_methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can delete payment_methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.payment_methods;
DROP POLICY IF EXISTS "Allow update for all users" ON public.payment_methods;
DROP POLICY IF EXISTS "Allow delete for all users" ON public.payment_methods;

-- Criar políticas limpas que exigem autenticação
CREATE POLICY "Authenticated users can view payment methods" ON public.payment_methods
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert payment methods" ON public.payment_methods
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update payment methods" ON public.payment_methods
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete payment methods" ON public.payment_methods
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Limpar e recriar políticas para todas as outras tabelas também
-- Categories
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can update categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can delete categories" ON public.categories;

CREATE POLICY "Authenticated users can view categories" ON public.categories
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update categories" ON public.categories
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete categories" ON public.categories
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Industries
DROP POLICY IF EXISTS "Anyone can view industries" ON public.industries;
DROP POLICY IF EXISTS "Anyone can insert industries" ON public.industries;
DROP POLICY IF EXISTS "Anyone can update industries" ON public.industries;
DROP POLICY IF EXISTS "Anyone can delete industries" ON public.industries;

CREATE POLICY "Authenticated users can view industries" ON public.industries
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert industries" ON public.industries
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update industries" ON public.industries
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete industries" ON public.industries
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Clients
DROP POLICY IF EXISTS "Anyone can view clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can update clients" ON public.clients;
DROP POLICY IF EXISTS "Anyone can delete clients" ON public.clients;

CREATE POLICY "Authenticated users can view clients" ON public.clients
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert clients" ON public.clients
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update clients" ON public.clients
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete clients" ON public.clients
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Commission Rules
DROP POLICY IF EXISTS "Anyone can view commission_rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Anyone can insert commission_rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Anyone can update commission_rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Anyone can delete commission_rules" ON public.commission_rules;

CREATE POLICY "Authenticated users can view commission_rules" ON public.commission_rules
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert commission_rules" ON public.commission_rules
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update commission_rules" ON public.commission_rules
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete commission_rules" ON public.commission_rules
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Sales
DROP POLICY IF EXISTS "Anyone can view sales" ON public.sales;
DROP POLICY IF EXISTS "Anyone can insert sales" ON public.sales;
DROP POLICY IF EXISTS "Anyone can update sales" ON public.sales;
DROP POLICY IF EXISTS "Anyone can delete sales" ON public.sales;

CREATE POLICY "Authenticated users can view sales" ON public.sales
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert sales" ON public.sales
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update sales" ON public.sales
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete sales" ON public.sales
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Sale Products
DROP POLICY IF EXISTS "Anyone can view sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Anyone can insert sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Anyone can update sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Anyone can delete sale_products" ON public.sale_products;

CREATE POLICY "Authenticated users can view sale_products" ON public.sale_products
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert sale_products" ON public.sale_products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update sale_products" ON public.sale_products
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete sale_products" ON public.sale_products
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Receivables
DROP POLICY IF EXISTS "Anyone can view receivables" ON public.receivables;
DROP POLICY IF EXISTS "Anyone can insert receivables" ON public.receivables;
DROP POLICY IF EXISTS "Anyone can update receivables" ON public.receivables;
DROP POLICY IF EXISTS "Anyone can delete receivables" ON public.receivables;

CREATE POLICY "Authenticated users can view receivables" ON public.receivables
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert receivables" ON public.receivables
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update receivables" ON public.receivables
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete receivables" ON public.receivables
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Audit Log
DROP POLICY IF EXISTS "Anyone can view audit_log" ON public.audit_log;
DROP POLICY IF EXISTS "Anyone can insert audit_log" ON public.audit_log;
DROP POLICY IF EXISTS "Anyone can update audit_log" ON public.audit_log;
DROP POLICY IF EXISTS "Anyone can delete audit_log" ON public.audit_log;

CREATE POLICY "Authenticated users can view audit_log" ON public.audit_log
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert audit_log" ON public.audit_log
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update audit_log" ON public.audit_log
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete audit_log" ON public.audit_log
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Products (garantindo que também tenha as políticas corretas)
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;
DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

CREATE POLICY "Authenticated users can view products" ON public.products
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete products" ON public.products
  FOR DELETE USING (auth.uid() IS NOT NULL);
