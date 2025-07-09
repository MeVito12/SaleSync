
-- Otimizar performance do banco seguindo sugestões do linter Supabase

-- 1. Adicionar índices para chaves estrangeiras sem cobertura
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_commission_rules_categoria_id ON public.commission_rules(categoria_id);
CREATE INDEX IF NOT EXISTS idx_commission_rules_industria_id ON public.commission_rules(industria_id);
CREATE INDEX IF NOT EXISTS idx_sales_industria_id ON public.sales(industria_id);

-- 2. Remover índices não utilizados
DROP INDEX IF EXISTS public.idx_receivables_sale_id;
DROP INDEX IF EXISTS public.idx_sale_products_sale_id;
DROP INDEX IF EXISTS public.idx_sales_cliente_id;
