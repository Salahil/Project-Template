import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { LoginResponse, RegisterResponse } from '../../types/login-response.interface';

/**
 * Chamadas HTTP à API de autenticação.
 * Nomenclatura: verbo HTTP + Auth + ação (ex.: postAuthLogin).
 */
@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private readonly authBase = `${environment.apiUrl}/auth`;

  constructor(
    private httpClient: HttpClient,
    private auth: AuthService
  ) {}

  private normalizeLoginResponse(body: unknown): LoginResponse {
    const b = body as Record<string, unknown> | null;
    const raw =
      b != null && typeof b === 'object' && 'dados' in b && b['dados'] !== undefined
        ? b['dados']
        : b;

    if (raw == null || typeof raw !== 'object') {
      return {
        token: '',
        nome: this.auth.perfil?.nome ?? '',
        id: this.auth.perfil?.id ?? ''
      };
    }

    const r = raw as Record<string, unknown>;
    const id =
      r['id'] != null ? String(r['id']) : r['userId'] != null ? String(r['userId']) : '';

    const token = typeof r['token'] === 'string' ? r['token'] : '';

    return {
      token,
      nome: String(r['nome'] ?? ''),
      id,
      imagem: r['imagem'] as string | null | undefined,
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
    if (login.nome) {
      this.auth.setPerfil({
        nome: login.nome,
        id: login.id || undefined,
        imagem: login.imagem
      });
    }
  }

  postAuthLogin(email: string, senha: string): Observable<LoginResponse> {
    return this.httpClient.post<unknown>(`${this.authBase}/login`, { email, senha }, { withCredentials: true }).pipe(
      map((body) => this.normalizeLoginResponse(body)),
      tap((login) => this.applyAuthFromLogin(login))
    );
  }

  postAuthLoginGoogle(idToken: string): Observable<LoginResponse> {
    return this.httpClient
      .post<unknown>(`${this.authBase}/login/google`, { token: idToken }, { withCredentials: true })
      .pipe(
        map((body) => this.normalizeLoginResponse(body)),
        tap((login) => this.applyAuthFromLogin(login))
      );
  }

  postAuthRegister(data: unknown): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${this.authBase}/register`, data, { withCredentials: true });
  }

  postAuthRefreshToken(): Observable<LoginResponse> {
    return this.httpClient.post<unknown>(`${this.authBase}/refresh`, {}, { withCredentials: true }).pipe(
      map((body) => this.normalizeLoginResponse(body)),
      tap((login) => this.applyAuthFromLogin(login))
    );
  }

  postAuthReenviarCodigo(email: string): Observable<unknown> {
    return this.httpClient.post(`${this.authBase}/reenviar-codigo`, { email });
  }

  postAuthEsqueciSenha(email: string): Observable<unknown> {
    return this.httpClient.post(`${this.authBase}/esqueci-senha`, { email });
  }

  postAuthVerificarCodigo(
    idVerificacao: string,
    codigo: string,
    mantenhaMeConectado: boolean
  ): Observable<LoginResponse> {
    return this.httpClient
      .post<unknown>(
        `${this.authBase}/verificar`,
        { idVerificacao, codigo, mantenhaMeConectado },
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

  postAuthLogout(): Observable<unknown> {
    return this.httpClient.post(`${this.authBase}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.auth.clearAuthData())
    );
  }

  postAuthRedefinirSenha(token: string, novaSenha: string): Observable<unknown> {
    return this.httpClient.post(`${this.authBase}/mudar-senha/${token}`, { novaSenha }, { withCredentials: true });
  }
}
