
-- Adicionar campos necessários para sale_products
ALTER TABLE sale_products 
ADD COLUMN IF NOT EXISTS produto_id uuid,
ADD COLUMN IF NOT EXISTS codigo character varying,
ADD COLUMN IF NOT EXISTS valor_ipi numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS percentual_ipi numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS comissao numeric DEFAULT 0;

-- Adicionar foreign key para produtos
ALTER TABLE sale_products 
ADD CONSTRAINT fk_sale_products_produto 
FOREIGN KEY (produto_id) REFERENCES products(id) ON DELETE SET NULL;
