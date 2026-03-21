import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Notificacao {
  id: string;
  titulo: string;
  corpo: string;
  lida: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificacoesService {
  getNotificacoes(): Observable<Notificacao[]> {
    return of([]);
  }
}
