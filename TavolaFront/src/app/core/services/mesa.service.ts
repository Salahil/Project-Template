import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IMesa } from '../../Interfaces/IMesa.interface';
import { IAtualizarStatusMesaPayload } from '../../Interfaces/IAtualizarStatusMesaPayload.interface';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private apiUrl = `${environment.apiUrl}/auth/mesas`;

  constructor(private http: HttpClient) {}

  getListarMesasPorAmbiente(ambienteId: string): Observable<IMesa[]> {
    return this.http.get<IMesa[]>(`${this.apiUrl}/ambiente/${ambienteId}`);
  }

  postCriarMesa(ambienteId: string, mesa: {
    nome: string;
    tipo: "retangular" | "circular";
    capacidade: number;
    vip: boolean;
  }): Observable<IMesa> {
    return this.http.post<IMesa>(`${this.apiUrl}/ambiente/${ambienteId}`, mesa);
  }

  putAtualizarMesa(id: string, mesa: {
    nome: string;
    tipo: "retangular" | "circular";
    capacidade: number;
    vip: boolean;
  }): Observable<IMesa> {
    return this.http.put<IMesa>(`${this.apiUrl}/${id}`, mesa);
  }

  deleteRemoverMesa(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  putAtualizarStatusMesa(idMesa: string, payload: IAtualizarStatusMesaPayload): Observable<IMesa> {
    return this.http.put<IMesa>(`${this.apiUrl}/${idMesa}/status`, payload);
  }
}
