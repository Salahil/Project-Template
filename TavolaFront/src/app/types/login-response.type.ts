export interface LoginResponse {
  id: string
  token: string;
  refreshToken: string;
  nome: string;
  tipoUsuario: 'CLIENTE' | 'RESTAURANTE' | 'FUNCIONARIO';
  imagem: string;
  email?: string;
  imagemBackground?: string | null;
  restauranteId?: string; // ID do restaurante (usado quando tipoUsuario é FUNCIONARIO ou RESTAURANTE)
  idVerificacao?: string; // Para quando a conta precisa de verificação
  mensagem?: string; // Mensagem de resposta do backend
}

export interface RegisterResponse {
  mensagem: string;
  idVerificacao: string;
}
