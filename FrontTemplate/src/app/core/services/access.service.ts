import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { LoginResponse, RegisterResponse } from '../../types/login-response.interface';

/** Padrão: métodos HTTP com prefixo do verbo (post, get, put, delete). */
@Injectable({
  providedIn: 'root'
})
export class AcessService {
  apiUrl: string = `${environment.apiUrl}/auth`;

  constructor(private httpClient: HttpClient, private auth: AuthService) {}

  postLogin(email: string, senha: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, { email, senha }, { withCredentials: true }).pipe(
      tap((value) => {
        this.auth.setToken(value.token);
        this.auth.setPerfil({
          tipo: value.tipoUsuario,
          nome: value.nome,
          id: value.id,
          imagem: value.imagem,
          restauranteId: value.restauranteId
        });
      })
    );
  }

  /**
   * Login com token do Google (idToken). Envia o token para o backend e salva JWT + perfil.
   */
  postLoginWithGoogle(idToken: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login/google`, { token: idToken }, { withCredentials: true }).pipe(
      tap((value) => {
        this.auth.setToken(value.token);
        this.auth.setPerfil({
          tipo: value.tipoUsuario,
          nome: value.nome,
          id: value.id,
          imagem: value.imagem,
          restauranteId: value.restauranteId
        });
      })
    );
  }

  postSignup(data: any): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${this.apiUrl}/register`, data, { withCredentials: true });
  }

  postRefreshToken(): Observable<LoginResponse> {
    console.log('[AcessService] calling /auth/refresh');
    return this.httpClient
      .post<LoginResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(res => {
          console.log('[AcessService] refresh response received:', res);
          this.auth.setToken(res.token);
          this.auth.setPerfil({
            tipo: res.tipoUsuario,
            nome: res.nome,
            imagem: res.imagem,
            id: res.id,
            restauranteId: res.restauranteId
          });
        })
      );
  }

  postReenviarCodigo(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/reenviar-codigo`, { email });
  }

  postEsqueciMinhaSenha(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/esqueci-senha`, { email });
  }

  postVerificarCodigo(idVerificacao: string, codigo: string, mantenhaMeConectado: boolean): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/verificar`, {
      idVerificacao,
      codigo,
      mantenhaMeConectado
    }, { withCredentials: true }).pipe(
      tap((value) => {
        if (value.token) {
          this.auth.setToken(value.token);
          this.auth.setPerfil({
            tipo: value.tipoUsuario,
            nome: value.nome,
            id: value.id,
            imagem: value.imagem,
            restauranteId: value.restauranteId
          });
        }
      })
    );
  }

  postLogout(): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.auth.clearAuthData();
      })
    );
  }

  /**
   * Envia a nova senha para o backend para concluir a redefinição.
   * O token é passado na URL como path parameter.
   */
  postRedefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/mudar-senha/${token}`, { novaSenha }, { withCredentials: true });
  }

  /**
   * Login específico para garçons/funcionários
   */
  postLoginGarcom(emailRestaurante: string, codigoIdentidade: string, senha: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login/garcom`, {
      emailRestaurante,
      codigoIdentidade,
      senha
    }, { withCredentials: true }).pipe(
      tap((value) => {
        console.log('[AcessService] postLoginGarcom - Response completo:', value);
        this.auth.setToken(value.token);
        const restauranteId = value.restauranteId;
        console.log('[AcessService] postLoginGarcom - restauranteId extraído:', restauranteId);
        console.log('[AcessService] postLoginGarcom - Dados do perfil a serem salvos:', {
          tipo: value.tipoUsuario,
          nome: value.nome,
          id: value.id,
          imagem: value.imagem,
          restauranteId: value.restauranteId
        });
        this.auth.setPerfil({
          tipo: value.tipoUsuario,
          nome: value.nome,
          id: value.id,
          imagem: value.imagem,
          restauranteId: value.restauranteId
        });
        console.log('[AcessService] postLoginGarcom - Perfil salvo. Verificando localStorage...');
        console.log('[AcessService] postLoginGarcom - localStorage após salvar:', {
          tipoUsuario: localStorage.getItem('tipoUsuario'),
          restauranteIdFuncionario: localStorage.getItem('restauranteIdFuncionario'),
          nome: localStorage.getItem('nome'),
          token: localStorage.getItem('token') ? 'presente' : 'ausente'
        });
      })
    );
  }
}
