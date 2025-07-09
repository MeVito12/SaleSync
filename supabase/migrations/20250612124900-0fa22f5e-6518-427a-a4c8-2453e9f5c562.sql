
-- Corrigir problemas de segurança nas funções definindo search_path

-- 1. Corrigir função validate_sale_data
CREATE OR REPLACE FUNCTION public.validate_sale_data()
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
$$ LANGUAGE plpgsql
SET search_path = public;

-- 2. Corrigir função validate_receivable_data
CREATE OR REPLACE FUNCTION public.validate_receivable_data()
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
$$ LANGUAGE plpgsql
SET search_path = public;

-- 3. Corrigir função audit_sales_changes
CREATE OR REPLACE FUNCTION public.audit_sales_changes()
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
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;
