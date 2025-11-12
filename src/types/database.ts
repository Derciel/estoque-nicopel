export interface Profile {
  id: string;
  role: 'admin' | 'operador' | 'visualizador';
  nome: string;
  created_at: string;
}

export interface Produto {
  id: string;
  sku: string;
  nome: string;
  descricao?: string;
  categoria: string;
  subcategoria?: string;
  cnpj_fornecedor?: string;
  nome_fornecedor?: string;
  unidade_medida: string;
  preco_custo?: number;
  preco_venda?: number;
  localizacao?: string;
  estoque_atual: number;
  estoque_minimo: number;
  estoque_maximo?: number;
  ponto_reposicao: number;
  data_primeira_entrada?: string;
  data_ultima_saida?: string;
  created_at: string;
  updated_at: string;
}

export interface Movimentacao {
  id: string;
  produto_id: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data_hora: string;
  lote?: string;
  data_fabricacao?: string;
  data_validade?: string;
  nota_fiscal?: string;
  valor_unitario?: number;
  destino?: string;
  numero_pedido?: string;
  usuario_id?: string;
}