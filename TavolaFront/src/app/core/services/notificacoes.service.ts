import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notificacao {
  id: string;
  nomeRestaurante: string;
  dataReserva: string;
  restauranteId: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacoesService {
  private apiUrl = `${environment.apiUrl}/auth/notificacoes`;

  constructor(private http: HttpClient) {}

  /**
   * Busca todas as notificações do usuário
   */
  getNotificacoes(): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(this.apiUrl);
  }

  /**
   * Remove uma notificação
   */
  deleteNotificacao(idNotificacao: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idNotificacao}`);
  }
}


