export type TipoUsuario = 'CLIENTE' | 'RESTAURANTE' | 'FUNCIONARIO';

export interface LoginResponse {
  /** Pode vir vazio: o backend pode enviar JWT só em cookie httpOnly (`@JsonIgnore` no Java). */
  token: string;
  tipoUsuario: TipoUsuario;
  nome: string;
  id: string;
  imagem?: string | null;
  restauranteId?: string;

  // Campos opcionais usados nos fluxos de verificação/cadastro
  idVerificacao?: string;
  mensagem?: string;

  /** Nome da propriedade no JSON do `LoginResponse` Java (antes de normalizar). */
  userId?: string;
  email?: string;
  dadosExtras?: Record<string, unknown>;
}

export interface RegisterResponse {
  idVerificacao: string;
  mensagem: string;
}

