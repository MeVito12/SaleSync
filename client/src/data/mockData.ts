// Mock data for the application - simulating all database entities

export const mockClients = [
  {
    id: '1',
    nome_fantasia: 'Empresa ABC Ltda',
    razao_social: 'ABC Comércio e Indústria Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@abc.com.br',
    estado: 'SP',
    telefone: '(11) 1234-5678',
    segmento: 'Varejo'
  },
  {
    id: '2',
    nome_fantasia: 'Distribuidora XYZ',
    razao_social: 'XYZ Distribuição S.A.',
    cnpj: '98.765.432/0001-10',
    email: 'vendas@xyz.com.br',
    estado: 'RJ',
    telefone: '(21) 9876-5432',
    segmento: 'Distribuição'
  }
];

export const mockIndustries = [
  {
    id: '1',
    nome: 'Indústria Alpha',
    grupo: 'Grupo Alpha',
    cnpj: '11.222.333/0001-44',
    estado: 'SP'
  },
  {
    id: '2',
    nome: 'Indústria Beta',
    grupo: 'Grupo Beta',
    cnpj: '55.666.777/0001-88',
    estado: 'MG'
  }
];

export const mockCategories = [
  {
    id: '1',
    nome: 'Eletrônicos',
    descricao: 'Produtos eletrônicos diversos'
  },
  {
    id: '2',
    nome: 'Eletrodomésticos',
    descricao: 'Eletrodomésticos para casa'
  }
];

export const mockProducts = [
  {
    id: '1',
    codigo: 'PROD001',
    nome: 'Smartphone Premium',
    ean: '7891234567890',
    ncm: '85171210',
    preco_base: 1299.99,
    percentual_ipi: 15,
    categoria_id: '1',
    industria_id: '1'
  },
  {
    id: '2',
    codigo: 'PROD002',
    nome: 'Notebook Gamer',
    ean: '7891234567891',
    ncm: '84713000',
    preco_base: 3499.99,
    percentual_ipi: 18,
    categoria_id: '1',
    industria_id: '1'
  }
];

export const mockSales = [
  {
    id: '1',
    cliente_id: '1',
    representante_id: 'rep1',
    industria_id: '1',
    tipo_pedido: 'Venda',
    data_emissao: '2025-01-08',
    previsao_entrega: '2025-01-15',
    condicao_pagamento: '30 dias',
    observacao: 'Primeira venda do ano',
    valor: 1560.00,
    status: 'Aprovado',
    numero_pedido: 'PED-2025-001',
    comissao: 78.00,
    clients: { nome_fantasia: 'Empresa ABC Ltda' },
    industries: { nome: 'Indústria Alpha' }
  }
];

export const mockPaymentMethods = [
  {
    id: 1,
    nome: 'À Vista',
    tipo: 'avista',
    descricao: 'Pagamento à vista',
    ativo: true,
    taxaPercentual: 0,
    taxaFixa: 0,
    prazoDias: 0,
    parcelas: []
  },
  {
    id: 2,
    nome: '30 dias',
    tipo: 'prazo',
    descricao: 'Pagamento em 30 dias',
    ativo: true,
    taxaPercentual: 2.5,
    taxaFixa: 0,
    prazoDias: 30,
    parcelas: [{ id: '1', days: 30 }]
  }
];

export const mockCommissionRules = [
  {
    id: '1',
    representante_id: 'rep1',
    industria_id: '1',
    categoria_id: '1',
    percentual_industria: 5,
    percentual_repasse: 60,
    base_calculo: 'produto' as const
  }
];

export const mockReceivables = [
  {
    id: '1',
    representante_id: 'rep1',
    sale_id: '1',
    data_recebimento: '2025-01-08',
    data_vencimento: '2025-02-08',
    valor_recebido: 1560.00,
    comissao_industria: 78.00,
    status: 'Recebido',
    nfe: 'NFE-123456',
    pedido: 'PED-2025-001'
  }
];

export const mockRepresentatives = [
  {
    id: 'rep1',
    nome: 'João Silva',
    email: 'joao@representante.com',
    telefone: '(11) 99999-9999',
    is_master: false,
    user_id: '2'
  }
];

// Mock API functions
export const mockAPI = {
  // Clients
  getClients: () => Promise.resolve(mockClients),
  createClient: (client: any) => Promise.resolve({ ...client, id: Date.now().toString() }),
  updateClient: (id: string, client: any) => Promise.resolve({ ...client, id }),
  deleteClient: (id: string) => Promise.resolve({ success: true }),

  // Industries
  getIndustries: () => Promise.resolve(mockIndustries),
  createIndustry: (industry: any) => Promise.resolve({ ...industry, id: Date.now().toString() }),
  updateIndustry: (id: string, industry: any) => Promise.resolve({ ...industry, id }),
  deleteIndustry: (id: string) => Promise.resolve({ success: true }),

  // Categories
  getCategories: () => Promise.resolve(mockCategories),
  createCategory: (category: any) => Promise.resolve({ ...category, id: Date.now().toString() }),
  updateCategory: (id: string, category: any) => Promise.resolve({ ...category, id }),
  deleteCategory: (id: string) => Promise.resolve({ success: true }),

  // Products
  getProducts: () => Promise.resolve(mockProducts),
  createProduct: (product: any) => Promise.resolve({ ...product, id: Date.now().toString() }),
  updateProduct: (id: string, product: any) => Promise.resolve({ ...product, id }),
  deleteProduct: (id: string) => Promise.resolve({ success: true }),

  // Sales
  getSales: () => Promise.resolve(mockSales),
  createSale: (sale: any) => Promise.resolve({ ...sale, id: Date.now().toString() }),
  updateSale: (id: string, sale: any) => Promise.resolve({ ...sale, id }),
  deleteSale: (id: string) => Promise.resolve({ success: true }),

  // Payment Methods
  getPaymentMethods: () => Promise.resolve(mockPaymentMethods),
  createPaymentMethod: (method: any) => Promise.resolve({ ...method, id: Date.now() }),
  updatePaymentMethod: (id: number, method: any) => Promise.resolve({ ...method, id }),
  deletePaymentMethod: (id: number) => Promise.resolve({ success: true }),

  // Commission Rules
  getCommissionRules: () => Promise.resolve(mockCommissionRules),
  createCommissionRule: (rule: any) => Promise.resolve({ ...rule, id: Date.now().toString() }),
  updateCommissionRule: (id: string, rule: any) => Promise.resolve({ ...rule, id }),
  deleteCommissionRule: (id: string) => Promise.resolve({ success: true }),

  // Receivables
  getReceivables: () => Promise.resolve(mockReceivables),
  createReceivable: (receivable: any) => Promise.resolve({ ...receivable, id: Date.now().toString() }),
  updateReceivable: (id: string, receivable: any) => Promise.resolve({ ...receivable, id }),
  deleteReceivable: (id: string) => Promise.resolve({ success: true }),

  // Representatives
  getRepresentatives: () => Promise.resolve(mockRepresentatives),
  createRepresentative: (rep: any) => Promise.resolve({ ...rep, id: Date.now().toString() }),
  updateRepresentative: (id: string, rep: any) => Promise.resolve({ ...rep, id }),
  deleteRepresentative: (id: string) => Promise.resolve({ success: true })
};