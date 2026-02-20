// reserva-confirmada-dialog.component.ts

import { Component, Inject } from "@angular/core"
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog"
import { CommonModule } from "@angular/common"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { NzDividerModule } from "ng-zorro-antd/divider"
import { CalendarService } from "../../../../core/services/calendar.service"
import { IDadosEventoCalendario } from "../../../../Interfaces/IDadosEventoCalendario.interface"
import { NzMessageService } from "ng-zorro-antd/message"

export interface DialogDataReservaConfirmada {
  nomeRestaurante: string
  endereco: string
  data: string
  horario: string
  quantidadePessoas: number
  comentarios?: string
}

@Component({
  selector: "app-reserva-confirmada-dialog",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, NzDividerModule],
  templateUrl: "./reserva-confirmada-dialog.component.html",
  styleUrls: ["./reserva-confirmada-dialog.component.scss"],
})
export class ReservaConfirmadaDialogComponent {
  public canShare = false; // Propriedade para controlar a exibição do botão

  constructor(
    public dialogRef: MatDialogRef<ReservaConfirmadaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataReservaConfirmada,
    private calendarService: CalendarService,
    private message: NzMessageService
  ) {
    // Verifica no construtor se a Web Share API está disponível
    this.canShare = !!navigator.share;
  }

  adicionarAoGoogleCalendar(): void {
    const dataInicioEvento = new Date(`${this.data.data}T${this.data.horario}`)
    let descricaoEvento = `Reserva para ${this.data.quantidadePessoas} ${this.data.quantidadePessoas > 1 ? "pessoas" : "pessoa"}.`
    if (this.data.comentarios) {
      descricaoEvento += `\n\nPreferências: "${this.data.comentarios}"`
    }
    const dadosEvento: IDadosEventoCalendario = {
      titulo: `Reserva em: ${this.data.nomeRestaurante}`,
      dataInicio: dataInicioEvento,
      duracaoHoras: 2,
      localizacao: this.data.endereco,
      descricao: descricaoEvento,
    }
    const link = this.calendarService.criarLinkGoogleCalendar(dadosEvento)
    window.open(link, "_blank")
  }

  // Lógica de compartilhamento atualizada
  async compartilharReserva(): Promise<void> {
    const detalhes =
      `Nossa reserva no restaurante ${this.data.nomeRestaurante} está confirmada!\n\n` +
      `Data: ${new Date(this.data.data + "T00:00:00").toLocaleDateString("pt-BR")}\n` +
      `Horário: ${this.data.horario}\n` +
      `Para: ${this.data.quantidadePessoas} ${this.data.quantidadePessoas > 1 ? "pessoas" : "pessoa"}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Reserva em ${this.data.nomeRestaurante}`,
          text: detalhes,
        })
      } catch (error) {
        // O usuário pode cancelar o compartilhamento, não é um erro real.
        console.log("Compartilhamento cancelado ou falhou", error)
      }
    } else {
      // Fallback caso a API não esteja disponível (não deveria acontecer por causa do *ngIf)
      this.message.error("A função de compartilhar não está disponível neste navegador.")
    }
  }

  // O botão de fechar/concluir simplesmente fecha o diálogo.
  // A navegação para a home é tratada no componente pai, o que é a prática correta.
  concluir(): void {
    this.dialogRef.close()
  }
}
