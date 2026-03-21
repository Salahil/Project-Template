import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { LoginResponse, RegisterResponse, TipoUsuario } from '../../types/login-response.interface';

/** Padrão: métodos HTTP com prefixo do verbo (post, get, put, delete). */
@Injectable({
  providedIn: 'root'
})
export class AcessService {
  apiUrl: string = `${environment.apiUrl}/auth`;

  constructor(private httpClient: HttpClient, private auth: AuthService) {}

  /**
   * Corpo HTTP pode vir direto como `LoginResponse` ou embrulhado em `ApiResponse` (`dados`).
   * O DTO Java também expõe `userId` e pode omitir `token` no JSON (JWT no cookie).
   */
  private normalizeLoginResponse(body: unknown): LoginResponse {
    const b = body as Record<string, unknown> | null;
    const raw =
      b != null && typeof b === 'object' && 'dados' in b && b['dados'] !== undefined
        ? b['dados']
        : b;

    if (raw == null || typeof raw !== 'object') {
      return {
        token: '',
        tipoUsuario: 'CLIENTE',
        nome: this.auth.perfil?.nome ?? '',
        id: this.auth.perfil?.id ?? ''
      };
    }

    const r = raw as Record<string, unknown>;
    const extras = (r['dadosExtras'] as Record<string, unknown> | undefined) ?? {};
    const tipoRaw = r['tipoUsuario'] ?? extras['tipoUsuario'] ?? extras['tipo'];
    const tipo: TipoUsuario =
      tipoRaw === 'RESTAURANTE' || tipoRaw === 'FUNCIONARIO' || tipoRaw === 'CLIENTE'
        ? tipoRaw
        : 'CLIENTE';

    const id =
      r['id'] != null ? String(r['id']) : r['userId'] != null ? String(r['userId']) : '';

    const token = typeof r['token'] === 'string' ? r['token'] : '';

    return {
      token,
      tipoUsuario: tipo,
      nome: String(r['nome'] ?? ''),
      id,
      imagem: (r['imagem'] ?? extras['imagem']) as string | null | undefined,
      restauranteId: (r['restauranteId'] ?? extras['restauranteId']) as string | undefined,
      idVerificacao: r['idVerificacao'] as string | undefined,
      mensagem: (r['mensagem'] as string | undefined) ?? (typeof b?.['mensagem'] === 'string' ? b['mensagem'] : undefined),
      userId: r['userId'] as string | undefined,
      email: r['email'] as string | undefined,
      dadosExtras: r['dadosExtras'] as Record<string, unknown> | undefined
    };
  }

  private applyAuthFromLogin(login: LoginResponse): void {
    if (login.token) {
      this.auth.setToken(login.token);
    }
    if (login.nome && login.tipoUsuario) {
      this.auth.setPerfil({
        tipo: login.tipoUsuario,
        nome: login.nome,
        id: login.id || undefined,
        imagem: login.imagem,
        restauranteId: login.restauranteId
      });
    }
  }

  postLogin(email: string, senha: string): Observable<LoginResponse> {
    return this.httpClient
      .post<unknown>(`${this.apiUrl}/login`, { email, senha }, { withCredentials: true })
      .pipe(
        map((body) => this.normalizeLoginResponse(body)),
        tap((login) => this.applyAuthFromLogin(login))
      );
  }

  postLoginWithGoogle(idToken: string): Observable<LoginResponse> {
    return this.httpClient
      .post<unknown>(`${this.apiUrl}/login/google`, { token: idToken }, { withCredentials: true })
      .pipe(
        map((body) => this.normalizeLoginResponse(body)),
        tap((login) => this.applyAuthFromLogin(login))
      );
  }

  postSignup(data: any): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${this.apiUrl}/register`, data, { withCredentials: true });
  }

  postRefreshToken(): Observable<LoginResponse> {
    console.log('[AcessService] calling /auth/refresh');
    return this.httpClient.post<unknown>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
      map((body) => this.normalizeLoginResponse(body)),
      tap((login) => {
        console.log('[AcessService] refresh response normalized:', login);
        this.applyAuthFromLogin(login);
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
    return this.httpClient
      .post<unknown>(
        `${this.apiUrl}/verificar`,
        {
          idVerificacao,
          codigo,
          mantenhaMeConectado
        },
        { withCredentials: true }
      )
      .pipe(
        map((body) => this.normalizeLoginResponse(body)),
        tap((login) => {
          if (login.token) {
            this.applyAuthFromLogin(login);
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

  postRedefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/mudar-senha/${token}`, { novaSenha }, { withCredentials: true });
  }

  postLoginGarcom(emailRestaurante: string, codigoIdentidade: string, senha: string): Observable<LoginResponse> {
    return this.httpClient
      .post<unknown>(
        `${this.apiUrl}/login/garcom`,
        {
          emailRestaurante,
          codigoIdentidade,
          senha
        },
        { withCredentials: true }
      )
      .pipe(
        map((body) => this.normalizeLoginResponse(body)),
        tap((login) => {
          console.log('[AcessService] postLoginGarcom - normalized:', login);
          this.applyAuthFromLogin(login);
        })
      );
  }
}
