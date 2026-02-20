export interface IMembroEquipe {
  id: string;
  nome: string;
  codigo: string;
  codigoIdentidade?: string; // Campo da API
  senha: string;
  imagem?: string | null;// Campo da API
  dataCriacao: string;
  ativo: boolean;
}

