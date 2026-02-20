import { IPedidoItem } from './IPedidoItem.interface';

export interface IPedido {
  id: string;
  mesaId: string;
  mesaNome: string;
  status: 'ATIVO' | 'PREPARANDO' | 'PRONTO' | 'ENTREGUE';
  itens: IPedidoItem[];
  total: number;
  dataCriacao: Date;
  garcomId: string;
}





