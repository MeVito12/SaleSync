
-- Melhorar as políticas RLS existentes e adicionar validação de dados

-- 1. Atualizar políticas RLS para sales com verificação de usuário autenticado
DROP POLICY IF EXISTS "Authenticated users can view sales" ON public.sales;
DROP POLICY IF EXISTS "Authenticated users can insert sales" ON public.sales;
DROP POLICY IF EXISTS "Authenticated users can update sales" ON public.sales;
DROP POLICY IF EXISTS "Authenticated users can delete sales" ON public.sales;

CREATE POLICY "Users can view sales" ON public.sales
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert sales" ON public.sales
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND representante_id = auth.uid()::text);

CREATE POLICY "Users can update own sales" ON public.sales
  FOR UPDATE USING (auth.uid() IS NOT NULL AND representante_id = auth.uid()::text);

CREATE POLICY "Users can delete own sales" ON public.sales
  FOR DELETE USING (auth.uid() IS NOT NULL AND representante_id = auth.uid()::text);

-- 2. Atualizar políticas RLS para receivables
DROP POLICY IF EXISTS "Authenticated users can view receivables" ON public.receivables;
DROP POLICY IF EXISTS "Authenticated users can insert receivables" ON public.receivables;
DROP POLICY IF EXISTS "Authenticated users can update receivables" ON public.receivables;
DROP POLICY IF EXISTS "Authenticated users can delete receivables" ON public.receivables;

CREATE POLICY "Users can view receivables" ON public.receivables
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert receivables" ON public.receivables
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND representante_id = auth.uid()::text);

CREATE POLICY "Users can update own receivables" ON public.receivables
  FOR UPDATE USING (auth.uid() IS NOT NULL AND representante_id = auth.uid()::text);

CREATE POLICY "Users can delete own receivables" ON public.receivables
  FOR DELETE USING (auth.uid() IS NOT NULL AND representante_id = auth.uid()::text);

-- 3. Atualizar políticas RLS para sale_products
DROP POLICY IF EXISTS "Authenticated users can view sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Authenticated users can insert sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Authenticated users can update sale_products" ON public.sale_products;
DROP POLICY IF EXISTS "Authenticated users can delete sale_products" ON public.sale_products;

CREATE POLICY "Users can view sale_products" ON public.sale_products
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert sale_products" ON public.sale_products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update sale_products" ON public.sale_products
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete sale_products" ON public.sale_products
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. Adicionar função de validação para vendas
CREATE OR REPLACE FUNCTION validate_sale_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar que valor não pode ser negativo
  IF NEW.valor < 0 THEN
    RAISE EXCEPTION 'Valor da venda não pode ser negativo';
  END IF;
  
  -- Validar que data de emissão não pode ser futura
  IF NEW.data_emissao > CURRENT_DATE THEN
    RAISE EXCEPTION 'Data de emissão não pode ser futura';
  END IF;
  
  -- Validar que previsão de entrega não pode ser anterior à emissão
  IF NEW.previsao_entrega IS NOT NULL AND NEW.previsao_entrega < NEW.data_emissao THEN
    RAISE EXCEPTION 'Previsão de entrega não pode ser anterior à data de emissão';
  END IF;
  
  -- Validar que comissão não pode ser negativa
  IF NEW.comissao < 0 THEN
    RAISE EXCEPTION 'Comissão não pode ser negativa';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Criar trigger para validação de vendas
DROP TRIGGER IF EXISTS validate_sale_trigger ON public.sales;
CREATE TRIGGER validate_sale_trigger
  BEFORE INSERT OR UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION validate_sale_data();

-- 6. Adicionar função de validação para recebimentos
CREATE OR REPLACE FUNCTION validate_receivable_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar que valor recebido não pode ser negativo
  IF NEW.valor_recebido < 0 THEN
    RAISE EXCEPTION 'Valor recebido não pode ser negativo';
  END IF;
  
  -- Validar que data de recebimento não pode ser futura
  IF NEW.data_recebimento > CURRENT_DATE THEN
    RAISE EXCEPTION 'Data de recebimento não pode ser futura';
  END IF;
  
  -- Validar que data de vencimento não pode ser anterior ao recebimento (se informada)
  IF NEW.data_vencimento IS NOT NULL AND NEW.data_vencimento < NEW.data_recebimento THEN
    RAISE EXCEPTION 'Data de vencimento não pode ser anterior à data de recebimento';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar trigger para validação de recebimentos
DROP TRIGGER IF EXISTS validate_receivable_trigger ON public.receivables;
CREATE TRIGGER validate_receivable_trigger
  BEFORE INSERT OR UPDATE ON public.receivables
  FOR EACH ROW EXECUTE FUNCTION validate_receivable_data();

-- 8. Adicionar índices para melhor performance e segurança
CREATE INDEX IF NOT EXISTS idx_sales_auth_user ON public.sales(representante_id) WHERE representante_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_receivables_auth_user ON public.receivables(representante_id) WHERE representante_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sales_data_emissao ON public.sales(data_emissao);
CREATE INDEX IF NOT EXISTS idx_receivables_data_recebimento ON public.receivables(data_recebimento);

-- 9. Função para auditoria (registrar mudanças importantes)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela de auditoria
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Política para auditoria (apenas usuários autenticados podem ver seus próprios logs)
CREATE POLICY "Users can view their own audit logs" ON public.audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- 10. Função de auditoria para vendas
CREATE OR REPLACE FUNCTION audit_sales_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (table_name, operation, user_id, old_data)
    VALUES ('sales', 'DELETE', auth.uid(), row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (table_name, operation, user_id, old_data, new_data)
    VALUES ('sales', 'UPDATE', auth.uid(), row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (table_name, operation, user_id, new_data)
    VALUES ('sales', 'INSERT', auth.uid(), row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Trigger de auditoria para vendas
DROP TRIGGER IF EXISTS audit_sales_trigger ON public.sales;
CREATE TRIGGER audit_sales_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION audit_sales_changes();
