import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IFavorito {
  id: string;
  nome: string;
  imagem: string[];
  imagens?: string[];
  imagemPrincipal?: string;
  endereco: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
  };
  tipoCozinha: string;
  mediaAvaliacao: number;
  totalAvaliacao: number;
  valorMedioPorPessoa?: number;
}

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private apiUrl = `${environment.apiUrl}/auth/clientes`;

  constructor(private http: HttpClient) {}

  getFavoritos(): Observable<IFavorito[]> {
    return this.http.get<IFavorito[]>(`${this.apiUrl}/favoritos`);
  }
}
