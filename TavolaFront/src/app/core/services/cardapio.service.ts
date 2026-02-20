import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IItemCardapio } from '../../Interfaces/IItem-cardapio';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CardapioService {
  private apiUrl = `${environment.apiUrl}/auth/cardapios`;

  constructor(private http: HttpClient) {}

  listarItens(): Observable<IItemCardapio[]> {
    return this.http.get<IItemCardapio[]>(`${this.apiUrl}`);
  }

  adicionarItem(item: Omit<IItemCardapio, 'id'>): Observable<IItemCardapio> {
    return this.http.post<IItemCardapio>(`${this.apiUrl}/save`, item);
  }

  atualizarItem(id: string, item: Omit<IItemCardapio, 'id'>): Observable<IItemCardapio> {
    return this.http.put<IItemCardapio>(`${this.apiUrl}/update/${id}`, item);
  }

  removerItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listarItensPorRestaurante(idRestaurante: string) {
    return this.http.get<IItemCardapio[]>(`${this.apiUrl}/disponiveis/${idRestaurante}`);
  }

  listarItensPublicos(idRestaurante: string): Observable<{
    nomeRestaurante: string;
    imagemRestaurante?: string;
    cardapio: IItemCardapio[];
  }> {
    return this.http.get<{
      nomeRestaurante: string;
      imagemRestaurante?: string;
      cardapio: IItemCardapio[];
    }>(`${this.apiUrl}/public/${idRestaurante}`);
  }
}
