import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { ToastrService } from 'ngx-toastr';
import { AvaliacaoService, DadosAvaliacao } from '../../core/services/avaliacao.service';
import { NotificacoesService } from '../../core/services/notificacoes.service';

export interface AvaliacaoDialogData {
  idReserva?: string; // Opcional, caso ainda seja necessário
  restauranteId: string; // ID do restaurante para enviar a avaliação
  nomeRestaurante: string;
  dataReserva: string;
  idNotificacao?: string; // ID da notificação para deletar após envio
}

@Component({
  selector: 'app-avaliacao-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NzRateModule
  ],
  templateUrl: './avaliacao-dialog.component.html',
  styleUrls: ['./avaliacao-dialog.component.scss']
})
export class AvaliacaoDialogComponent implements OnInit {
  nota: number = 0;
  comentario: string = '';
  enviando: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AvaliacaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AvaliacaoDialogData,
    private avaliacaoService: AvaliacaoService,
    private notificacoesService: NotificacoesService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    // Componente inicializado
  }

  /**
   * Verifica se o formulário está válido para envio
   */
  get isFormValid(): boolean {
    return this.nota > 0 && this.comentario.length >= 10;
  }

  /**
   * Formata a data da reserva para exibição
   */
  get dataFormatada(): string {
    const data = new Date(this.data.dataReserva);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Envia a avaliação
   */
  enviarAvaliacao(): void {
    if (!this.isFormValid) {
      this.toastService.warning('Por favor, preencha todos os campos corretamente');
      return;
    }

    this.enviando = true;

    const dadosAvaliacao: DadosAvaliacao = {
      nota: this.nota,
      comentario: this.comentario
    };

    // Primeiro envia a avaliação usando restauranteId
    this.avaliacaoService.enviarAvaliacao(this.data.restauranteId, dadosAvaliacao).subscribe({
      next: (response) => {
        // Se há idNotificacao, deleta a notificação
        if (this.data.idNotificacao) {
          this.notificacoesService.deleteNotificacao(this.data.idNotificacao).subscribe({
            next: () => {
              console.log('Notificação removida com sucesso');
            },
            error: (error) => {
              console.error('Erro ao remover notificação:', error);
              // Não impede o sucesso da avaliação
            }
          });
        }

        this.toastService.success(response?.message || 'Avaliação enviada com sucesso!');
        this.dialogRef.close({ 
          success: true, 
          restauranteId: this.data.restauranteId,
          idNotificacao: this.data.idNotificacao 
        });
      },
      error: (error) => {
        this.toastService.error('Erro ao enviar avaliação. Tente novamente.');
        console.error('Erro ao enviar avaliação:', error);
        this.enviando = false;
      },
      complete: () => {
        this.enviando = false;
      }
    });
  }

  /**
   * Cancela e fecha o diálogo
   */
  cancelar(): void {
    this.dialogRef.close({ success: false });
  }

  /**
   * Retorna o texto da avaliação baseado na nota
   */
  getRatingText(nota: number): string {
    const textos = ['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'];
    return textos[nota] || '';
  }
}
