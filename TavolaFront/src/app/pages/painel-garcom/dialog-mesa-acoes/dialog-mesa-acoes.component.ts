import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Mesa, GarcomInfo, PainelGarcomService } from '../../../core/services/painel-garcom.service';
import { MesaService } from '../../../core/services/mesa.service';
import { AtendimentoService } from '../../../core/services/atendimento.service';
import { PedidosService } from '../../../core/services/pedidos.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';

export interface DialogMesaData {
  mesa: Mesa;
  garcom: GarcomInfo;
  garconsDisponiveis?: GarcomInfo[];
}

@Component({
  selector: 'app-dialog-mesa-acoes',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    NzAvatarModule,
    NzButtonModule
  ],
  templateUrl: './dialog-mesa-acoes.component.html',
  styleUrls: ['./dialog-mesa-acoes.component.scss']
})
export class DialogMesaAcoesComponent {
  
  garconsParaAdicionar: GarcomInfo[] = [];
  nomeCliente: string = '';
  mostrandoInputCliente: boolean = false;
  
  // Sugestões rápidas de nomes de clientes
  sugestoesNomesClientes: string[] = [
    'Cliente'
  ];

  private painelGarcomService = inject(PainelGarcomService);
  private pedidosService = inject(PedidosService);

  constructor(
    public dialogRef: MatDialogRef<DialogMesaAcoesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMesaData,
    private mesaService: MesaService,
    private atendimentoService: AtendimentoService
  ) {
    console.log('DialogMesaAcoes - Dados recebidos:', this.data);
    this.filtrarGarconsParaAdicionar();
  }

  // Ações principais
  ocuparMesa(): void {
    if (!this.mostrandoInputCliente) {
      // Mostra o input para o nome do cliente
      this.mostrandoInputCliente = true;
      return;
    }

    // Valida se o nome foi preenchido
    if (!this.nomeCliente || this.nomeCliente.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Nome obrigatório',
        text: 'Por favor, informe o nome do cliente para ocupar a mesa.',
        confirmButtonColor: '#F6BD38'
      });
      return;
    }

    // Chama a API para atualizar o status
    this.mesaService.putAtualizarStatusMesa(this.data.mesa.id, {
      novoStatus: 'OCUPADA',
      nomeCliente: this.nomeCliente.trim()
    }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Mesa ocupada!',
          text: `A mesa ${this.data.mesa.nome} foi ocupada com sucesso.`,
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: '#F6BD38'
        });
        this.dialogRef.close({ acao: 'ocupar_mesa', nomeCliente: this.nomeCliente.trim() });
      },
      error: (error) => {
        console.error('Erro ao ocupar mesa:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao ocupar mesa',
          text: 'Não foi possível ocupar a mesa. Tente novamente.',
          confirmButtonColor: '#F6BD38'
        });
      }
    });
  }

  cancelarOcupacao(): void {
    this.mostrandoInputCliente = false;
    this.nomeCliente = '';
  }

  executarAcaoPrincipal(): void {
    // Chama a API para iniciar atendimento sem pedir nome do cliente
    this.atendimentoService.putIniciarAtendimento(this.data.mesa.id, {}).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Atendimento iniciado!',
          text: `O atendimento da mesa ${this.data.mesa.nome} foi iniciado com sucesso.`,
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: '#F6BD38'
        });
        this.dialogRef.close({ acao: 'iniciar_atendimento' });
      },
      error: (error) => {
        console.error('Erro ao iniciar atendimento:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao iniciar atendimento',
          text: 'Não foi possível iniciar o atendimento. Tente novamente.',
          confirmButtonColor: '#F6BD38'
        });
      }
    });
  }

  // Adiciona sugestão ao campo de nome do cliente
  adicionarSugestao(sugestao: string): void {
    if (this.nomeCliente && this.nomeCliente.trim() !== '') {
      this.nomeCliente = this.nomeCliente + ', ' + sugestao;
    } else {
      this.nomeCliente = sugestao;
    }
  }

  // Ações secundárias
  verCardapio(): void {
    this.dialogRef.close({ acao: 'ver_cardapio' });
  }

  // Filtra a lista de garçons disponíveis
  private filtrarGarconsParaAdicionar(): void {
    if (!this.data.garconsDisponiveis) {
      this.garconsParaAdicionar = [];
      return;
    }
    const idsAtendendo = this.data.mesa.garcomsAtendendo || [];
    this.garconsParaAdicionar = this.data.garconsDisponiveis.filter(
      garcom => !idsAtendendo.includes(garcom.id)
    );
  }

  // Chamado pelo (selectionChange) do mat-select
  adicionarGarcomSelecionado(garcomId: string): void {
    if (garcomId) {
      this.dialogRef.close({ acao: 'adicionar_garcom_especifico', garcomId: garcomId });
    }
  }

  removerGarcom(garcomId: string): void {
    this.dialogRef.close({ acao: 'remover_garcom', garcomId: garcomId });
  }

  liberarMesa(): void {
    // Busca o pedido ativo da mesa
    const restauranteId = this.pedidosService.getRestauranteId();
    if (!restauranteId) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'ID do restaurante não encontrado.',
        confirmButtonColor: '#F6BD38'
      });
      return;
    }

    // Busca os pedidos ativos para encontrar o pedido da mesa
    this.pedidosService.getPedidosAtivos(restauranteId)
      .pipe(take(1))
      .subscribe({
        next: (pedidos) => {
          // Encontra o pedido ativo da mesa
          const pedidoMesa = pedidos.find(p => p.mesaId === this.data.mesa.id);
          
          if (!pedidoMesa) {
            // Se não houver pedido, apenas fecha o dialog
            Swal.fire({
              icon: 'info',
              title: 'Mesa sem pedido',
              text: 'Esta mesa não possui pedidos ativos.',
              confirmButtonColor: '#F6BD38'
            });
            this.dialogRef.close({ acao: 'liberar_mesa' });
            return;
          }

          // Confirma a ação
          Swal.fire({
            title: 'Liberar Mesa',
            text: `Tem certeza que deseja liberar a mesa ${this.data.mesa.nome}? O pedido será marcado como ENTREGUE.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#F6BD38',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, Liberar!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Atualiza o status do pedido para ENTREGUE
              this.pedidosService.atualizarStatusPedido(restauranteId, pedidoMesa.id, 'ENTREGUE')
                .pipe(take(1))
                .subscribe({
                  next: () => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Mesa liberada!',
                      text: `A mesa ${this.data.mesa.nome} foi liberada com sucesso.`,
                      timer: 2000,
                      showConfirmButton: false,
                      confirmButtonColor: '#F6BD38'
                    });
                    this.dialogRef.close({ acao: 'liberar_mesa', pedidoId: pedidoMesa.id });
                  },
                  error: (error) => {
                    console.error('Erro ao liberar mesa:', error);
                    Swal.fire({
                      icon: 'error',
                      title: 'Erro ao liberar mesa',
                      text: 'Não foi possível liberar a mesa. Tente novamente.',
                      confirmButtonColor: '#F6BD38'
                    });
                  }
                });
            }
          });
        },
        error: (error) => {
          console.error('Erro ao buscar pedidos:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível buscar os pedidos da mesa.',
            confirmButtonColor: '#F6BD38'
          });
        }
      });
  }

  fechar(): void {
    this.dialogRef.close();
  }

  // Helpers para a UI
  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'LIVRE': 'Livre',
      'OCUPADA': 'Ocupada',
      'RESERVADA': 'Reservada',
      'EM_ATENDIMENTO': 'Em Atendimento'
    };
    return texts[status] || status;
  }
  
  getAcaoPrincipalTexto(): string {
    const status = this.data.mesa.status;
    if (status === 'LIVRE' || status === 'RESERVADA' || status === 'OCUPADA') {
      return 'Iniciar Atendimento';
    }
    // Adicione mais lógicas se necessário
    return 'Ação';
  }

  // Função para buscar dados do garçom
  getGarcomInfo(id: string): GarcomInfo | undefined {
    // Primeiro tenta pegar do serviço (que tem informações completas dos garçons do atendimento)
    const garcomAtendimento = this.painelGarcomService.getGarcomInfoAtendimento(id);
    if (garcomAtendimento) {
      return garcomAtendimento;
    }
    
    // Se não encontrar, tenta pegar da lista de garçons disponíveis passada
    if (this.data.garconsDisponiveis) {
      const garcomDisponivel = this.data.garconsDisponiveis.find(g => g.id === id);
      if (garcomDisponivel) {
        return garcomDisponivel;
      }
    }
    
    // Se não encontrar, retorna o garçom atual se for o mesmo ID
    if (id === this.data.garcom.id) {
      return this.data.garcom;
    }
    
    return undefined;
  }

  // Método para tratar erro de carregamento de imagem
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/png/avatar-padrao-garcom-tavola.png';
    }
  }
}
