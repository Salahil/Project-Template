export interface IEndereco {
  cep: string;
  pais: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
}

export interface IHoraFuncionamento {
  diaSemana: string;
  abertura: string;
  fechamento: string;
}

export interface IUserData {
  nome: string;
  email: string;
  senha: string;
  endereco: IEndereco;
  tipo: string;
  telefone: string;
  tipoCozinha?: string;
  quantidadeMesas?: number;
  horaFuncionamento?: IHoraFuncionamento[];
  descricao?: string;
  servicos?: string[];
  imagens?: string[];
  imagemPerfil?: string;
  imagemUsuario?: string;
} 