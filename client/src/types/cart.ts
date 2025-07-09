
export interface CartItem {
  id: string;
  produto: {
    id: string;
    nome: string;
    codigo: string;
    preco_base: number | null;
    percentual_ipi: number | null;
    categoria_id?: string | null;
    industria_id?: string | null;
    ean?: string | null;
    ncm?: string | null;
  } | null;
  quantidade: number;
  precoUnitario: number;
  ipi: number;
  percentualIpi: number;
  total: number;
  comissao: number; // Valor da comissão em reais
  percentualComissao: number; // Percentual da comissão
  produto_id: string;
  subtotal: number;
}
