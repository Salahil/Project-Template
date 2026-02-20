import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private apiUrl = `${environment.apiUrl}/auth/reservas`;
  constructor(private http: HttpClient) {}

  postCriarReserva(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, payload);
  }

  getReservasPorRestaurante(idRestaurante: string, data: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/restaurante/${idRestaurante}?data=${data}`);
  }

  getReservasParaCalendario(idRestaurante: string, data: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/restaurante/${idRestaurante}/calendario?data=${data}`);
  }

  putAtualizarStatusReserva(idReserva: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idReserva}/status`, { novoStatus: status });
  }

  putCancelarReserva(idReserva: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idReserva}/cancel`, {});
  }

  putAtualizarReserva(idReserva: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idReserva}/update`, payload);
  }

  getReservasListaEspera(idRestaurante: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/restaurante/${idRestaurante}/lista-espera`);
  }
} 