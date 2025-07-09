
-- Criar tabela de produtos para armazenar os produtos cadastrados
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR NOT NULL UNIQUE,
  nome VARCHAR NOT NULL,
  ean VARCHAR,
  ncm VARCHAR,
  preco_base NUMERIC DEFAULT 0,
  percentual_ipi NUMERIC DEFAULT 0,
  categoria_id UUID REFERENCES public.categories(id),
  industria_id UUID REFERENCES public.industries(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para products
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert products" ON public.products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update products" ON public.products
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete products" ON public.products
  FOR DELETE USING (true);

-- Remover coluna subcategoria da tabela sale_products se existir
ALTER TABLE public.sale_products DROP COLUMN IF EXISTS subcategoria;

-- Se houver outras tabelas com subcategoria, também remover
-- (não vejo outras no schema atual, mas incluindo por segurança)
