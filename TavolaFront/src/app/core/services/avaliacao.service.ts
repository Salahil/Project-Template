import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DadosAvaliacao {
  nota: number;
  comentario: string;
}

export interface AvaliacaoPayload {
  score: number;
  comentario: string;
}

export interface Avaliacao {
  id: string;
  score: number;
  comentario: string;
  dataAvaliacao: string;
  clienteId?: string;
  restauranteId: string;
  reservaId?: string;
}

export interface AvaliacaoCliente {
  imagemCliente: string | null;
  nomeCliente: string;
  nota: number;
  idCliente: string;
  comentario: string;
  dataReserva: string;
  dataReservaPorExtenso?: string; // Data formatada por extenso (opcional)
}

export interface AvaliacoesRestaurante {
  mediaAvaliacao: number;
  totalAvaliacoes: number;
  avaliacoes: AvaliacaoCliente[];
}

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {
  private apiUrl = `${environment.apiUrl}/auth/avaliacoes`;

  constructor(private http: HttpClient) {}

  /**
   * Envia uma avaliação para o backend usando restauranteId
   */
  enviarAvaliacao(restauranteId: string, dados: DadosAvaliacao): Observable<any> {
    const payload: AvaliacaoPayload = {
      score: dados.nota,
      comentario: dados.comentario
    };

    return this.http.post<any>(`${this.apiUrl}/avaliar/${restauranteId}`, payload);
  }

  /**
   * Busca todas as avaliações de um restaurante
   */
  getAvaliacoesPorRestaurante(restauranteId: string): Observable<AvaliacoesRestaurante> {
    return this.http.get<AvaliacoesRestaurante>(`${this.apiUrl}/restaurante/${restauranteId}`);
  }
}
