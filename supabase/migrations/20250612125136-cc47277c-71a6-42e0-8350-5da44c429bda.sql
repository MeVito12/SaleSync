
-- Otimizações de performance sugeridas pelo linter do Supabase

-- 1. Adicionar índices para chaves estrangeiras sem cobertura
CREATE INDEX IF NOT EXISTS idx_ai_detections_contact_id ON public.ai_detections(contact_id);
CREATE INDEX IF NOT EXISTS idx_ai_detections_conversation_id ON public.ai_detections(conversation_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_commission_rules_categoria_id ON public.commission_rules(categoria_id);
CREATE INDEX IF NOT EXISTS idx_commission_rules_industria_id ON public.commission_rules(industria_id);
CREATE INDEX IF NOT EXISTS idx_sales_industria_id ON public.sales(industria_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_contact_id ON public.whatsapp_messages(contact_id);

-- 2. Remover índices não utilizados
DROP INDEX IF EXISTS public.idx_whatsapp_contacts_phone;
DROP INDEX IF EXISTS public.idx_whatsapp_messages_conversation;
DROP INDEX IF EXISTS public.idx_whatsapp_conversations_contact;
DROP INDEX IF EXISTS public.idx_categories_nome;
DROP INDEX IF EXISTS public.idx_industries_nome;
DROP INDEX IF EXISTS public.idx_clients_nome_fantasia;
DROP INDEX IF EXISTS public.idx_commission_rules_representante;
DROP INDEX IF EXISTS public.idx_sales_representante;
DROP INDEX IF EXISTS public.idx_sales_cliente;
DROP INDEX IF EXISTS public.idx_sales_status;
DROP INDEX IF EXISTS public.idx_sale_products_sale;
DROP INDEX IF EXISTS public.idx_receivables_sale;
DROP INDEX IF EXISTS public.idx_receivables_representante;
DROP INDEX IF EXISTS public.idx_sales_auth_user;
DROP INDEX IF EXISTS public.idx_receivables_auth_user;
DROP INDEX IF EXISTS public.idx_sales_data_emissao;
DROP INDEX IF EXISTS public.idx_receivables_data_recebimento;
