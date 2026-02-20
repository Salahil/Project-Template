import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAmbiente } from '../../Interfaces/IAmbiente.interface';

@Injectable({
  providedIn: 'root'
})
export class AmbienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth/ambientes`;

  // GET: /auth/ambientes
  getListarAmbientes(): Observable<IAmbiente[]> {
    return this.http.get<IAmbiente[]>(this.apiUrl);
  }

  // POST: /auth/ambientes
  postCriarAmbiente(payload: { nome: string }): Observable<IAmbiente> {
    return this.http.post<IAmbiente>(this.apiUrl, payload);
  }

  // PUT: /auth/ambientes/{idAmbiente}
  putAtualizarAmbiente(idAmbiente: string, payload: { nome: string }): Observable<IAmbiente> {
    return this.http.put<IAmbiente>(`${this.apiUrl}/${idAmbiente}`, payload);
  }

  // DELETE: /auth/ambientes/{idAmbiente}
  deleteRemoverAmbiente(idAmbiente: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idAmbiente}`);
  }
}