import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { RestauranteService } from './restaurante.service';
import { AuthService } from './auth.service';
import { IMembroEquipe } from '../../Interfaces/IMembroEquipe.interface';
import { IDadosMembro } from '../../Interfaces/IDadosMembro.interface';
import { IResultadoAdicao } from '../../Interfaces/IResultadoAdicao.interface';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private restauranteService = inject(RestauranteService);
  private authService = inject(AuthService);

  constructor() { }

  /**
   * Obtém o ID do restaurante do usuário logado
   */
  private getIdRestaurante(): string {
    const perfil = this.authService.perfil;
    return perfil?.id || '';
  }

  /**
   * Busca todos os membros da equipa
   */
  getEquipe(): Observable<IMembroEquipe[]> {
    const idRestaurante = this.getIdRestaurante();
    return this.restauranteService.getGarcons(idRestaurante).pipe(
      map(garcons => garcons.map(garcom => ({
        id: garcom.id,
        nome: garcom.nome,
        codigo: garcom.codigoIdentidade,
        codigoIdentidade: garcom.codigoIdentidade,
        senha: '', // Senha não é retornada pelo GET
        imagem: garcom.imagem,
        dataCriacao: new Date().toISOString(), // Campo não retornado pela API
        ativo: garcom.ativo
      })))
    );
  }

  /**
   * Adiciona um novo membro à equipa
   */
  addMembro(dados: IDadosMembro): Observable<IResultadoAdicao> {
    const idRestaurante = this.getIdRestaurante();
    const payload = {
      nome: dados.nome,
      senha: dados.senha,
      imagem: dados.imagem || ''
    };

    return this.restauranteService.postGarcom(idRestaurante, payload);
  }

  /**
   * Atualiza um membro existente
   */
  updateMembro(id: string, dados: IDadosMembro | any): Observable<any> {
    const idRestaurante = this.getIdRestaurante();
    const payload: any = {
      nome: dados.nome,
      senha: dados.senha,
      // Preserva exatamente o valor da imagem (null, string ou undefined)
      // Se for null, mantém null; se for string, mantém a string; se for undefined, usa null
      imagem: dados.imagem !== undefined ? dados.imagem : null
    };

    return this.restauranteService.putGarcom(idRestaurante, id, payload);
  }

  /**
   * Remove um membro da equipa
   */
  deleteMembro(id: string): Observable<any> {
    const idRestaurante = this.getIdRestaurante();
    return this.restauranteService.deleteGarcom(idRestaurante, id);
  }

  /**
   * Atualiza a foto de um membro
   */
  updateMembroFoto(id: string, fotoBase64: string, nome: string, senha: string): Observable<any> {
    const idRestaurante = this.getIdRestaurante();
    const payload = {
      nome: nome,
      senha: senha,
      imagem: fotoBase64
    };

    return this.restauranteService.putGarcom(idRestaurante, id, payload);
  }
}
