import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IUpdateClientePayload {
  nome: string;
  email: string;
  senha: string;
  endereco: {
    pais: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
  };
  telefone: string;
  imagemPerfilBase64: string | null;
  imagemBackgroundBase64: string | null;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth/clientes`;

  getCliente(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get`);
  }

  updateCliente(payload: IUpdateClientePayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/self/update`, payload);
  }

  deleteCliente(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`);
  }
}
