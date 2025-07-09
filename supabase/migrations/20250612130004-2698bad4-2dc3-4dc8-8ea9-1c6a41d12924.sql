
-- Adicionar índice para a chave estrangeira sale_id na tabela receivables
CREATE INDEX IF NOT EXISTS idx_receivables_sale_id ON public.receivables(sale_id);
