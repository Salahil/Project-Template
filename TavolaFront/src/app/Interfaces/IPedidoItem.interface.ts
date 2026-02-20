export interface IPedidoItem {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  observacoes?: string;
  status: 'PENDENTE' | 'PREPARANDO' | 'PRONTO' | 'ENTREGUE';
}





