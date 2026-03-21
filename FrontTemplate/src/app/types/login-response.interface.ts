/** Envelope padrão do LogApi (Java `ApiResponse<T>`). */
export interface ApiResponseBody<T = unknown> {
  sucesso: boolean;
  mensagem: string;
  dados?: T;
}

export interface LoginResponse {
  /** O LogApi não serializa o JWT no JSON (@JsonIgnore); fica no cookie `logapi-token`. */
  token: string;
  nome: string;
  id: string;
  imagem?: string | null;

  idVerificacao?: string;
  mensagem?: string;

  userId?: string;
  email?: string;
  dadosExtras?: Record<string, unknown>;
}

/** Resposta de POST /auth/register: `dados` costuma ser a string "Sucesso". */
export interface RegisterResponse {
  sucesso?: boolean;
  mensagem: string;
  dados?: unknown;
}
