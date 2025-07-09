
-- Aplicar novas otimizações de performance e remover funcionalidade WhatsApp

-- 1. Adicionar índices para chaves estrangeiras ainda sem cobertura
CREATE INDEX IF NOT EXISTS idx_receivables_sale_id ON public.receivables(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_products_sale_id ON public.sale_products(sale_id);
CREATE INDEX IF NOT EXISTS idx_sales_cliente_id ON public.sales(cliente_id);

-- 2. Remover índices não utilizados que foram criados anteriormente
DROP INDEX IF EXISTS public.idx_ai_detections_contact_id;
DROP INDEX IF EXISTS public.idx_ai_detections_conversation_id;
DROP INDEX IF EXISTS public.idx_audit_log_user_id;
DROP INDEX IF EXISTS public.idx_commission_rules_categoria_id;
DROP INDEX IF EXISTS public.idx_commission_rules_industria_id;
DROP INDEX IF EXISTS public.idx_sales_industria_id;
DROP INDEX IF EXISTS public.idx_whatsapp_messages_contact_id;

-- 3. Tabelas do WhatsApp e IA já foram removidas
-- DROP TABLE IF EXISTS public.ai_detections CASCADE;
-- DROP TABLE IF EXISTS public.whatsapp_messages CASCADE;
-- DROP TABLE IF EXISTS public.whatsapp_conversations CASCADE;
-- DROP TABLE IF EXISTS public.whatsapp_contacts CASCADE;
-- DROP TABLE IF EXISTS public.whatsapp_config CASCADE;
