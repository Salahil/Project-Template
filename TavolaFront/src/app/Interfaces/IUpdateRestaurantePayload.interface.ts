export interface IUpdateRestaurantePayload {
  tipoCozinha?: string;
  descricao?: string;
  horariosFuncionamento?: { diaSemana: string; abertura: string; fechamento: string }[];
  nomesServicos?: string[];
  imagens?: string[];
  
  // Campos de usuário para atualização de restaurante
  nomeUsuario?: string;
  emailUsuario?: string;
  senhaUsuario?: string;
  telefoneUsuario?: string;
  enderecoUsuario?: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
  };
}
