import { IMesa } from './IMesa.interface';

export interface IAmbiente {
    id: string;
    nome: string;
    mesas: IMesa[];
  }