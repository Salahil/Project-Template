import { IMesa } from './IMesa.interface';
import { IReserva } from './IReserva.interface';

export interface IMesaDashboard {
  mesa: IMesa;
  reservas: IReserva[];
  atendimentos: IAtendimentoDashboard[];
}

export interface IGarcomAtendimento {
  id: string;
  nome: string;
  imagem?: string;
  codigoIdentidade?: string;
}

export interface IAtendimentoDashboard {
  id: string;
  mesaId?: string;
  ativo?: boolean;
  horaInicio?: string;
  nomeCliente?: string;
  garcomId?: string; // Mantido para compatibilidade
  garcons?: IGarcomAtendimento[]; // Array de garçons do atendimento
  inicioAtendimento?: Date | string;
  fimAtendimento?: Date | string;
  status: string;
}

export interface IAmbienteDashboard {
  id: string;
  nome: string;
  mesas: IMesaDashboard[];
}
