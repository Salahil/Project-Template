import { IReservaPainel } from './IReservaPainel.interface';

export interface IMesaPainel {
  id: string;
  nome: string;
  capacidade: number;
  tipo: 'retangular' | 'circular';
  vip: boolean;
  status: 'LIVRE' | 'OCUPADA' | 'RESERVADA' | 'EM_ATENDIMENTO';
  inicioOcupacao?: Date;
  tempoOcupacaoDisplay?: string;
  reserva?: IReservaPainel;
  garcomsAtendendo?: string[];
  clienteNome?: string; // Nome do cliente quando a mesa foi ocupada
}

