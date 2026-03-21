export interface LoginResponse {
  /** Pode vir vazio se o JWT vier só em cookie httpOnly. */
  token: string;
  nome: string;
  id: string;
  imagem?: string | null;

  idVerificacao?: string;
  mensagem?: string;

  /** Campos crus do backend (antes de normalizar). */
  userId?: string;
  email?: string;
  dadosExtras?: Record<string, unknown>;
}

export interface RegisterResponse {
  idVerificacao: string;
  mensagem: string;
}
