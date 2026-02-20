export interface IReservaHistorico {
    idReserva: string;
    idRestaurante: string;
    nomeRestaurante: string;
    imagemRestaurante: string | null;
    enderecoResumido: string;
    data: string;
    horario: string;
    quantidadePessoas: number;
    status: 'PENDENTE' | 'CONFIRMADA' | 'ATIVA' | 'LISTA_ESPERA' | 'CANCELADA_CLIENTE' | 'CANCELADA_RESTAURANTE' | 'CONCLUIDA' | 'NAO_COMPARECEU';
    comentariosPreferenciaReserva?: string;
    horariosFuncionamento?: {
      diaSemana: string;
      abertura: string;
      fechamento: string;
    }[];
  }