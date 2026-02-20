import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAtendimento, IIniciarAtendimentoPayload } from '../../Interfaces/IAtendimento.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/auth/api/restaurantes`;

  /**
   * Obtém o ID do restaurante do usuário logado
   */
  private getIdRestaurante(): string {  
    const perfil = this.authService.perfil;
    return perfil?.restauranteId || '';
  }

  /**
   * PUT /auth/api/restaurantes/{idRestaurante}/mesas/{mesaId}/atendimento/iniciar
   * Inicia um atendimento em uma mesa
   */
  putIniciarAtendimento(mesaId: string, payload?: IIniciarAtendimentoPayload): Observable<IAtendimento> {
    const idRestaurante = this.getIdRestaurante();
    if (!idRestaurante) {
      throw new Error('ID do restaurante não encontrado');
    }
    
    return this.http.put<IAtendimento>(
      `${this.apiUrl}/${idRestaurante}/mesas/${mesaId}/atendimento/iniciar`,
      payload || {}
    );
  }
}



