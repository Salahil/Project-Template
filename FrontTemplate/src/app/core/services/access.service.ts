import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { ApiResponseBody, LoginResponse, RegisterResponse } from '../../types/login-response.interface';

/**
 * Chamadas HTTP à API de autenticação (LogApi).
 * JWT e refresh ficam em cookies httpOnly; o corpo traz só `dados` (perfil) em login.
 */
@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private readonly authBase = environment.apiUrl ? `${environment.apiUrl.replace(/\/$/, '')}/auth` : '/auth';

  constructor(
    private httpClient: HttpClient,
    private auth: AuthService
  ) {}

  /** Extrai mensagem de erro do `ApiResponse` do backend. */
  static apiErrorMessage(err: unknown): string {
    const e = err as { error?: ApiResponseBody | { message?: string; erro?: string } };
    const body = e?.error;
    if (body && typeof body === 'object' && 'mensagem' in body && typeof body.mensagem === 'string') {
      return body.mensagem;
    }
    if (body && typeof body === 'object' && 'message' in body && typeof (body as { message?: string }).message === 'string') {
      return (body as { message: string }).message;
    }
    if (body && typeof body === 'object' && 'erro' in body && typeof (body as { erro?: string }).erro === 'string') {
      return (body as { erro: string }).erro;
    }
    return 'Erro na requisição. Tente novamente.';
  }

  private normalizeLoginResponse(body: unknown): LoginResponse {
    const b = body as ApiResponseBody<Record<string, unknown>> | null;
    const topMensagem = b != null && typeof b.mensagem === 'string' ? b.mensagem : undefined;
    const raw = b != null && typeof b === 'object' && 'dados' in b ? b.dados : body;

    if (raw == null || typeof raw !== 'object') {
      return {
        token: '',
        nome: this.auth.perfil?.nome ?? '',
        id: this.auth.perfil?.id ?? '',
        mensagem: topMensagem
      };
    }

    const r = raw as Record<string, unknown>;
    const id =
      r['id'] != null
        ? String(r['id'])
        : r['userId'] != null
          ? String(r['userId'])
          : '';

    const token = typeof r['token'] === 'string' ? r['token'] : '';

    return {
      token,
      nome: String(r['nome'] ?? ''),
      id,
      imagem: r['imagem'] as string | null | undefined,
      idVerificacao: r['idVerificacao'] as string | undefined,
      mensagem: (r['mensagem'] as string | undefined) ?? topMensagem,
      userId: r['userId'] != null ? String(r['userId']) : undefined,
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

  postAuthLogin(email: string, senha: string, recaptchaToken: string): Observable<LoginResponse> {
    return this.httpClient
      .post<unknown>(`${this.authBase}/login`, { email, senha, recaptchaToken }, { withCredentials: true })
      .pipe(
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
    return this.httpClient.post<ApiResponseBody<unknown>>(`${this.authBase}/register`, data, { withCredentials: true }).pipe(
      map((body) => ({
        sucesso: body.sucesso,
        mensagem: body.mensagem,
        dados: body.dados
      }))
    );
  }

  /** Renova o access token via cookie `logapi-refresh`; o novo JWT vem no Set-Cookie. */
  postAuthRefreshToken(): Observable<void> {
    return this.httpClient.post<unknown>(`${this.authBase}/refresh`, {}, { withCredentials: true }).pipe(
      map(() => undefined)
    );
  }

  postAuthReenviarCodigo(email: string): Observable<unknown> {
    return this.httpClient.post(`${this.authBase}/reenviar-codigo`, { email }, { withCredentials: true });
  }

  postAuthEsqueciSenha(email: string): Observable<unknown> {
    return this.httpClient.post(`${this.authBase}/esqueci-senha`, { email }, { withCredentials: true });
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
