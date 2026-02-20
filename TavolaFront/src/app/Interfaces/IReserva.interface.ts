export interface IReserva {
  id: string;
  clienteId: string;
  cliente: string;
  mesaIds: string[];
  data: Date;
  horario: string;
  periodo: "Almoço" | "Jantar";
  pessoas: number;
  status: "PENDENTE" | "CONFIRMADA" | "ATIVA" | "LISTA_ESPERA" | "CANCELADA_RESTAURANTE" | "CONCLUIDA" | "NAO_COMPARECEU";
  preferencias: string;
  restaurante: string;
  emailCliente: string;
  telefoneCliente: string;
  imagemPerfilCliente: string | null;
  nomesMesas: string[] | null;
} 