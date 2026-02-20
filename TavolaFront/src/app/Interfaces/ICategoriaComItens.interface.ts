import { IItemCardapio } from "./IItem-cardapio";

export interface ICategoriaComItens {
    id: string;
    nome: string;
    itens: IItemCardapio[];
  }