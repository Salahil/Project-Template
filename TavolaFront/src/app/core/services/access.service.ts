import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse, RegisterResponse } from '../../types/login-response.type';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcessService {
  apiUrl: string = `${environment.apiUrl}/auth`;

  constructor(private httpClient: HttpClient, private auth: AuthService) {}

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, { email, senha }, { withCredentials: true }).pipe(
      tap((value) => {
        this.auth.setToken(value.token);
        this.auth.setPerfil({ 
          tipo: value.tipoUsuario as 'CLIENTE' | 'RESTAURANTE' | 'FUNCIONARIO', 
          nome: value.nome, 
          id: value.id,
          imagem: value.imagem,
          restauranteId: value.restauranteId
        });
      })
    );
  }

  signup(data: any): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${this.apiUrl}/register`, data, { withCredentials: true });
  }

  refreshToken(): Observable<LoginResponse> {
    console.log('[LoginService] calling /auth/refresh');
    return this.httpClient
      .post<LoginResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(res => {
          console.log('[LoginService] refresh response received:', res);
          // atualiza token na AuthService
          this.auth.setToken(res.token);
          // se precisar atualizar perfil:
          this.auth.setPerfil({ 
            tipo: res.tipoUsuario as 'CLIENTE' | 'RESTAURANTE' | 'FUNCIONARIO', 
            nome: res.nome, 
            imagem: res.imagem, 
            id: res.id,
            restauranteId: res.restauranteId
          });
        })
      );
  }

  reenviarCodigo(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/reenviar-codigo`, { email });
  }

  esqueciMinhaSenha(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/esqueci-senha`, { email });
  }

// access.service.ts
verificarCodigo(idVerificacao: string, codigo: string, mantenhaMeConectado: boolean): Observable<LoginResponse> {
  return this.httpClient.post<LoginResponse>(`${this.apiUrl}/verificar`, {
    idVerificacao,
    codigo,
    mantenhaMeConectado
  }, { withCredentials: true }).pipe( // <<< CORREÇÃO APLICADA AQUI
    tap((value) => { 
      // Salva o token e perfil se o token estiver presente
      if (value.token) { 
        this.auth.setToken(value.token);
        this.auth.setPerfil({ 
          tipo: value.tipoUsuario as 'CLIENTE' | 'RESTAURANTE' | 'FUNCIONARIO', 
          nome: value.nome, 
          id: value.id,
          imagem: value.imagem,
          restauranteId: value.restauranteId
        });
      }
    })
  );
}
// ...

  logout(): Observable<any> {
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
  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/mudar-senha/${token}`, { novaSenha }, { withCredentials: true });
  }

  /**
   * Login específico para garçons/funcionários
   */
  loginGarcom(emailRestaurante: string, codigoIdentidade: string, senha: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login/garcom`, {
      emailRestaurante,
      codigoIdentidade,
      senha
    }, { withCredentials: true }).pipe(
      tap((value) => {
        console.log('[AcessService] loginGarcom - Response completo:', value);
        this.auth.setToken(value.token);
        // Para funcionários, o restauranteId vem no response como 'restauranteId'
        const restauranteId = value.restauranteId;
        console.log('[AcessService] loginGarcom - restauranteId extraído:', restauranteId);
        console.log('[AcessService] loginGarcom - Dados do perfil a serem salvos:', {
          tipo: value.tipoUsuario,
          nome: value.nome,
          id: value.id,
          imagem: value.imagem,
          restauranteId: value.restauranteId
        });
        this.auth.setPerfil({ 
          tipo: value.tipoUsuario as 'CLIENTE' | 'RESTAURANTE' | 'FUNCIONARIO', 
          nome: value.nome, 
          id: value.id,
          imagem: value.imagem,
          restauranteId: value.restauranteId
        });
        console.log('[AcessService] loginGarcom - Perfil salvo. Verificando localStorage...');
        console.log('[AcessService] loginGarcom - localStorage após salvar:', {
          tipoUsuario: localStorage.getItem('tipoUsuario'),
          restauranteIdFuncionario: localStorage.getItem('restauranteIdFuncionario'),
          nome: localStorage.getItem('nome'),
          token: localStorage.getItem('token') ? 'presente' : 'ausente'
        });
      })
    );
  }
}
