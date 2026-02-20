export interface IAtendimento {
  id: string;
  mesaId: string;
  garcomId: string;
  clienteNome?: string;
  inicioAtendimento?: Date | string;
  fimAtendimento?: Date | string;
  status: string;
}

export interface IIniciarAtendimentoPayload {
  clienteNome?: string;
}





