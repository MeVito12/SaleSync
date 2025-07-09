
-- Criar tabela para vendas
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clients(id),
  representante_id VARCHAR(255) NOT NULL,
  industria_id UUID REFERENCES public.industries(id),
  tipo_pedido VARCHAR(50) NOT NULL,
  data_emissao DATE NOT NULL,
  previsao_entrega DATE,
  condicao_pagamento VARCHAR(255) NOT NULL,
  observacao TEXT,
  valor DECIMAL(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'Aprovado',
  comissao DECIMAL(12,2) NOT NULL DEFAULT 0,
  numero_pedido VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para produtos das vendas
CREATE TABLE public.sale_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE,
  produto_nome VARCHAR(255) NOT NULL,
  quantidade INTEGER NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  dropped BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para recebimentos
CREATE TABLE public.receivables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES public.sales(id),
  valor_recebido DECIMAL(12,2) NOT NULL,
  data_recebimento DATE NOT NULL,
  data_vencimento DATE,
  nfe VARCHAR(100),
  pedido VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Recebido',
  comissao_industria DECIMAL(12,2) DEFAULT 0,
  representante_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Atualizar tabela payment_methods para ser compatível com o sistema
ALTER TABLE public.payment_methods 
ADD COLUMN IF NOT EXISTS descricao VARCHAR(255),
ADD COLUMN IF NOT EXISTS parcelas JSONB DEFAULT '[]'::jsonb;

-- Habilitar RLS para as novas tabelas
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receivables ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para sales
CREATE POLICY "Authenticated users can view sales" ON public.sales
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert sales" ON public.sales
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update sales" ON public.sales
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete sales" ON public.sales
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas RLS para sale_products
CREATE POLICY "Authenticated users can view sale_products" ON public.sale_products
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert sale_products" ON public.sale_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update sale_products" ON public.sale_products
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete sale_products" ON public.sale_products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas RLS para receivables
CREATE POLICY "Authenticated users can view receivables" ON public.receivables
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert receivables" ON public.receivables
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update receivables" ON public.receivables
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete receivables" ON public.receivables
  FOR DELETE USING (auth.role() = 'authenticated');

-- Criar índices para performance
CREATE INDEX idx_sales_representante ON public.sales(representante_id);
CREATE INDEX idx_sales_cliente ON public.sales(cliente_id);
CREATE INDEX idx_sales_status ON public.sales(status);
CREATE INDEX idx_sale_products_sale ON public.sale_products(sale_id);
CREATE INDEX idx_receivables_sale ON public.receivables(sale_id);
CREATE INDEX idx_receivables_representante ON public.receivables(representante_id);
