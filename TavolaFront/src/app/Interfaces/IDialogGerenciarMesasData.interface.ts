import { IMesa } from './IMesa.interface';
import { ICliente } from './ICliente.interface';
import { IAmbiente } from './IAmbiente.interface';

export interface IDialogGerenciarMesasData {
  modo: 'criar' | 'editar';
  mesa?: IMesa | null;
  areas: string[];
  clientesDoDia: ICliente[];
  idAmbiente?: string;
  ambientes?: IAmbiente[];
} 