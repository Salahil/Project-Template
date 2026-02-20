import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { IPedido } from '../../Interfaces/IPedido.interface';
import { IPedidoItem } from '../../Interfaces/IPedidoItem.interface';

interface PedidoAtivoResponse {
  id: string;
  mesaId: string;
  nomeMesa: string;
  nomeGarcom: string;
  dataHora: string;
  status: string;
  valorTotalPedido: number;
  itens: ItemPedidoResponse[];
}

interface ItemPedidoResponse {
  cardapioItemId: string;
  nome: string;
  valorUnitario: number;
  quantidade: number;
  observacao: string;
  imagemUrl?: string;
  valorTotalItem: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  /**
   * Busca os pedidos ativos do restaurante
   */
  getPedidosAtivos(restauranteId: string): Observable<IPedido[]> {
    const url = `${environment.apiUrl}/auth/api/restaurantes/${restauranteId}/pedidos/ativos`;
    
    return this.http.get<PedidoAtivoResponse[]>(url).pipe(
      map((response: PedidoAtivoResponse[]) => {
        return response.map(pedido => this.mapearPedidoResponse(pedido));
      })
    );
  }

  /**
   * Mapeia a resposta da API para a interface IPedido
   */
  private mapearPedidoResponse(pedido: PedidoAtivoResponse): IPedido {
    // Mapeia o status da API para o status da interface
    const statusMap: { [key: string]: 'ATIVO' | 'PREPARANDO' | 'PRONTO' | 'ENTREGUE' } = {
      'PENDENTE': 'ATIVO',
      'EM_PREPARO': 'PREPARANDO',
      'PRONTO': 'PRONTO',
      'ENTREGUE': 'ENTREGUE'
    };

    const statusMapeado = statusMap[pedido.status] || 'ATIVO';

    // Mapeia os itens
    const itens: IPedidoItem[] = pedido.itens.map(item => ({
      id: item.cardapioItemId,
      nome: item.nome,
      quantidade: item.quantidade,
      preco: item.valorUnitario,
      observacoes: item.observacao || undefined,
      status: this.mapearStatusItem(pedido.status)
    }));

    return {
      id: pedido.id,
      mesaId: pedido.mesaId,
      mesaNome: pedido.nomeMesa,
      status: statusMapeado,
      itens: itens,
      total: pedido.valorTotalPedido,
      dataCriacao: new Date(pedido.dataHora),
      garcomId: pedido.nomeGarcom // Usa o nome como ID temporário, pode ser ajustado depois
    };
  }

  /**
   * Mapeia o status do pedido para o status do item
   */
  private mapearStatusItem(statusPedido: string): 'PENDENTE' | 'PREPARANDO' | 'PRONTO' | 'ENTREGUE' {
    const statusMap: { [key: string]: 'PENDENTE' | 'PREPARANDO' | 'PRONTO' | 'ENTREGUE' } = {
      'PENDENTE': 'PENDENTE',
      'EM_PREPARO': 'PREPARANDO',
      'PRONTO': 'PRONTO',
      'ENTREGUE': 'ENTREGUE'
    };
    return statusMap[statusPedido] || 'PENDENTE';
  }

  /**
   * Adiciona itens a um pedido existente
   */
  adicionarItensAoPedido(restauranteId: string, pedidoId: string, itens: ItemPedidoAddRequest[]): Observable<any> {
    const url = `${environment.apiUrl}/auth/api/restaurantes/${restauranteId}/pedidos/${pedidoId}/add`;
    
    const payload = {
      itens: itens
    };
    
    return this.http.put(url, payload);
  }

  /**
   * Cancela um pedido alterando seu status para CANCELADO
   */
  cancelarPedido(restauranteId: string, pedidoId: string): Observable<any> {
    return this.atualizarStatusPedido(restauranteId, pedidoId, 'CANCELADO');
  }

  /**
   * Atualiza o status de um pedido
   */
  atualizarStatusPedido(restauranteId: string, pedidoId: string, novoStatus: string): Observable<any> {
    const url = `${environment.apiUrl}/auth/api/restaurantes/${restauranteId}/pedidos/${pedidoId}/status`;
    
    const payload = {
      novoStatus: novoStatus
    };
    
    return this.http.put(url, payload);
  }

  /**
   * Obtém o ID do restaurante do perfil autenticado
   */
  getRestauranteId(): string {
    const perfil = this.authService.perfil;
    
    if (perfil) {
      if (perfil.tipo === 'FUNCIONARIO' && perfil.restauranteId) {
        return perfil.restauranteId;
      } else if (perfil.tipo === 'RESTAURANTE' && perfil.id) {
        return perfil.id;
      }
    }
    
    return '';
  }
}

/**
 * Interface para o payload de adicionar itens a um pedido
 */
export interface ItemPedidoAddRequest {
  cardapioItemId: string;
  nome: string;
  valorUnitario: number;
  quantidade: number;
  observacao: string;
  imagemUrl?: string;
  valorTotalItem: number;
}

