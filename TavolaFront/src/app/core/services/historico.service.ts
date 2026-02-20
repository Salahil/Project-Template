import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IReservaHistorico } from '../../Interfaces/IReservaHistorico.interface';

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private apiUrl = `${environment.apiUrl}/auth/reservas`;

  constructor(private http: HttpClient) {}

  getMeuHistorico(): Observable<IReservaHistorico[]> {
    return this.http.get<IReservaHistorico[]>(`${this.apiUrl}/meu-historico`);
  }
}

