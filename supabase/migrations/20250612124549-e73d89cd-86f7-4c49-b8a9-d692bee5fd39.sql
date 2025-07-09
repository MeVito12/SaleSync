
-- Otimizar políticas RLS para melhor performance
-- Substituindo auth.uid() por (select auth.uid()) para evitar reavaliação por linha

-- Categories table policies
DROP POLICY IF EXISTS "Authenticated users can view categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;

CREATE POLICY "Authenticated users can view categories" ON public.categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert categories" ON public.categories
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" ON public.categories
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete categories" ON public.categories
  FOR DELETE TO authenticated USING (true);

-- Industries table policies
DROP POLICY IF EXISTS "Authenticated users can view industries" ON public.industries;
DROP POLICY IF EXISTS "Authenticated users can insert industries" ON public.industries;
DROP POLICY IF EXISTS "Authenticated users can update industries" ON public.industries;
DROP POLICY IF EXISTS "Authenticated users can delete industries" ON public.industries;

CREATE POLICY "Authenticated users can view industries" ON public.industries
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert industries" ON public.industries
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update industries" ON public.industries
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete industries" ON public.industries
  FOR DELETE TO authenticated USING (true);

-- Clients table policies
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON public.clients;

CREATE POLICY "Authenticated users can view clients" ON public.clients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert clients" ON public.clients
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients" ON public.clients
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete clients" ON public.clients
  FOR DELETE TO authenticated USING (true);

-- Payment methods table policies
DROP POLICY IF EXISTS "Authenticated users can view payment_methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can insert payment_methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can update payment_methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Authenticated users can delete payment_methods" ON public.payment_methods;

CREATE POLICY "Authenticated users can view payment_methods" ON public.payment_methods
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert payment_methods" ON public.payment_methods
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update payment_methods" ON public.payment_methods
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete payment_methods" ON public.payment_methods
  FOR DELETE TO authenticated USING (true);

-- Commission rules table policies
DROP POLICY IF EXISTS "Authenticated users can view commission_rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Authenticated users can insert commission_rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Authenticated users can update commission_rules" ON public.commission_rules;
DROP POLICY IF EXISTS "Authenticated users can delete commission_rules" ON public.commission_rules;

CREATE POLICY "Authenticated users can view commission_rules" ON public.commission_rules
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert commission_rules" ON public.commission_rules
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update commission_rules" ON public.commission_rules
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete commission_rules" ON public.commission_rules
  FOR DELETE TO authenticated USING (true);

-- Sales table policies (otimizadas)
DROP POLICY IF EXISTS "Users can view sales" ON public.sales;
DROP POLICY IF EXISTS "Users can insert sales" ON public.sales;
DROP POLICY IF EXISTS "Users can update own sales" ON public.sales;
DROP POLICY IF EXISTS "Users can delete own sales" ON public.sales;

CREATE POLICY "Users can view sales" ON public.sales
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert sales" ON public.sales
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid())::text = representante_id);

CREATE POLICY "Users can update own sales" ON public.sales
  FOR UPDATE TO authenticated USING ((select auth.uid())::text = representante_id);

CREATE POLICY "Users can delete own sales" ON public.sales
  FOR DELETE TO authenticated USING ((select auth.uid())::text = representante_id);

-- Receivables table policies (otimizadas)
DROP POLICY IF EXISTS "Users can view receivables" ON public.receivables;
DROP POLICY IF EXISTS "Users can insert receivables" ON public.receivables;
DROP POLICY IF EXISTS "Users can update own receivables" ON public.receivables;
DROP POLICY IF EXISTS "Users can delete own receivables" ON public.receivables;

CREATE POLICY "Users can view receivables" ON public.receivables
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert receivables" ON public.receivables
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid())::text = representante_id);

CREATE POLICY "Users can update own receivables" ON public.receivables
  FOR UPDATE TO authenticated USING ((select auth.uid())::text = representante_id);

CREATE POLICY "Users can delete own receivables" ON public.receivables
  FOR DELETE TO authenticated USING ((select auth.uid())::text = representante_id);

-- Sale products table policies (otimizadas)
DROP POLICY IF EXISTS "Users can view sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Users can insert sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Users can update sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Users can delete sale_products" ON public.sale_products;

CREATE POLICY "Users can view sale_products" ON public.sale_products
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.sales 
      WHERE sales.id = sale_products.sale_id 
      AND ((select auth.uid())::text = sales.representante_id OR true)
    )
  );

CREATE POLICY "Users can insert sale_products" ON public.sale_products
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sales 
      WHERE sales.id = sale_products.sale_id 
      AND (select auth.uid())::text = sales.representante_id
    )
  );

CREATE POLICY "Users can update sale_products" ON public.sale_products
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.sales 
      WHERE sales.id = sale_products.sale_id 
      AND (select auth.uid())::text = sales.representante_id
    )
  );

CREATE POLICY "Users can delete sale_products" ON public.sale_products
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.sales 
      WHERE sales.id = sale_products.sale_id 
      AND (select auth.uid())::text = sales.representante_id
    )
  );

-- Audit log table policies (otimizada)
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_log;

CREATE POLICY "Users can view their own audit logs" ON public.audit_log
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
