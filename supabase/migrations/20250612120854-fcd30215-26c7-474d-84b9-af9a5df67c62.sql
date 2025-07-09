
-- Criar tabela para categorias
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para indústrias
CREATE TABLE public.industries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  grupo VARCHAR(100) NOT NULL,
  cnpj VARCHAR(18) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para clientes
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_fantasia VARCHAR(255) NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  estado VARCHAR(2),
  segmento VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para métodos de pagamento
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  taxa_percentual DECIMAL(5,2) DEFAULT 0,
  taxa_fixa DECIMAL(10,2) DEFAULT 0,
  prazo_dias INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para regras de comissão
CREATE TABLE public.commission_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  representante_id VARCHAR(255) NOT NULL,
  industria_id UUID REFERENCES public.industries(id),
  categoria_id UUID REFERENCES public.categories(id),
  percentual_industria DECIMAL(5,2) NOT NULL,
  percentual_repasse DECIMAL(5,2) NOT NULL,
  base_calculo VARCHAR(20) NOT NULL DEFAULT 'total',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS) para todas as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS permissivas para todos os usuários autenticados
-- (você pode ajustar essas políticas conforme suas necessidades de segurança)

-- Políticas para categories
CREATE POLICY "Authenticated users can view categories" ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update categories" ON public.categories
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete categories" ON public.categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para industries
CREATE POLICY "Authenticated users can view industries" ON public.industries
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert industries" ON public.industries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update industries" ON public.industries
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete industries" ON public.industries
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para clients
CREATE POLICY "Authenticated users can view clients" ON public.clients
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert clients" ON public.clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update clients" ON public.clients
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete clients" ON public.clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para payment_methods
CREATE POLICY "Authenticated users can view payment_methods" ON public.payment_methods
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert payment_methods" ON public.payment_methods
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update payment_methods" ON public.payment_methods
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete payment_methods" ON public.payment_methods
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para commission_rules
CREATE POLICY "Authenticated users can view commission_rules" ON public.commission_rules
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert commission_rules" ON public.commission_rules
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update commission_rules" ON public.commission_rules
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete commission_rules" ON public.commission_rules
  FOR DELETE USING (auth.role() = 'authenticated');

-- Criar índices para melhor performance
CREATE INDEX idx_categories_nome ON public.categories(nome);
CREATE INDEX idx_industries_nome ON public.industries(nome);
CREATE INDEX idx_clients_nome_fantasia ON public.clients(nome_fantasia);
CREATE INDEX idx_commission_rules_representante ON public.commission_rules(representante_id);
