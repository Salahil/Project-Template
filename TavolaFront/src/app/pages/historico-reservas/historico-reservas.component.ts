import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { of } from "rxjs"
import { delay, finalize } from "rxjs/operators"

// INTERFACES E SERVIÇOS
import type { IReservaHistorico } from "../../Interfaces/IReservaHistorico.interface"
import { AuthService } from "../../core/services/auth.service"
import { GlobalSpinnerService } from "../../core/services/global-spinner.service"
import { HistoricoService } from "../../core/services/historico.service"
import { ReservasService } from "../../core/services/reservas.service"

// COMPONENTES DE UI
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"


const mockHistoricoReservas: IReservaHistorico[] = [
  {
    idReserva: "1",
    idRestaurante: "rest1",
    nomeRestaurante: "Cantina da Nona",
    imagemRestaurante: "assets/jpg/restauranteModelo.jpg",
    enderecoResumido: "Setor Bueno, Goiânia",
    data: "2025-08-20",
    horario: "20:30",
    quantidadePessoas: 2,
    status: "CONCLUIDA",
    comentariosPreferenciaReserva: "Mesa perto da janela, por favor. É uma comemoração de aniversário.",
  },
  {
    idReserva: "2",
    idRestaurante: "rest2",
    nomeRestaurante: "Sushi Prime",
    imagemRestaurante: "assets/jpg/restauranteModelo.jpg",
    enderecoResumido: "Jardim Goiás, Goiânia",
    data: "2025-08-15",
    horario: "19:00",
    quantidadePessoas: 4,
    status: "CONCLUIDA",
  },
  {
    idReserva: "3",
    idRestaurante: "rest3",
    nomeRestaurante: "Steak House Imperial",
    imagemRestaurante: "assets/jpg/restauranteModelo.jpg",
    enderecoResumido: "Setor Marista, Goiânia",
    data: "2025-07-28",
    horario: "21:00",
    quantidadePessoas: 3,
    status: "CANCELADA_CLIENTE",
  },
  {
    idReserva: "4",
    idRestaurante: "rest1",
    nomeRestaurante: "Cantina da Nona",
    imagemRestaurante: "assets/jpg/restauranteModelo.jpg",
    enderecoResumido: "Setor Bueno, Goiânia",
    data: "2025-09-10",
    horario: "12:00",
    quantidadePessoas: 5,
    status: "CONFIRMADA",
    comentariosPreferenciaReserva: "Precisaremos de uma cadeira de bebê.",
  },
]

@Component({
  selector: "app-historico-reservas",
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: "./historico-reservas.component.html",
  styleUrl: "./historico-reservas.component.scss",
  providers: [DatePipe],
})
export class HistoricoReservasComponent implements OnInit {
  private authService = inject(AuthService)
  private router = inject(Router)
  private datePipe = inject(DatePipe)
  private spinnerService = inject(GlobalSpinnerService)
  private historicoService = inject(HistoricoService)
  private reservasService = inject(ReservasService)

  public historicoAgrupado: { mesAno: string; reservas: IReservaHistorico[] }[] = []

  ngOnInit(): void {
    this.carregarHistorico()
  }

  private carregarHistorico(): void {
    this.spinnerService.mostrar()

    this.historicoService.getMeuHistorico()
      .pipe(finalize(() => this.spinnerService.ocultar()))
      .subscribe({
        next: (data: IReservaHistorico[]) => {
          this.historicoAgrupado = this.agruparReservasPorMes(data)
        },
        error: (err: any) => {
          console.error("Erro ao buscar histórico de reservas:", err)
        },
      })
  }

  private agruparReservasPorMes(reservas: IReservaHistorico[]): { mesAno: string; reservas: IReservaHistorico[] }[] {
    if (!reservas || reservas.length === 0) {
      return []
    }
    const sortedReservas = reservas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

    const grupos: { [key: string]: IReservaHistorico[] } = {}

    for (const reserva of sortedReservas) {
      const mesAno = this.datePipe.transform(reserva.data, "MMMM 'de' yyyy", "pt-BR")
      const chave = mesAno!.charAt(0).toUpperCase() + mesAno!.slice(1)

      if (!grupos[chave]) {
        grupos[chave] = []
      }
      grupos[chave].push(reserva)
    }

    return Object.keys(grupos).map((chave) => ({
      mesAno: chave,
      reservas: grupos[chave],
    }))
  }

  public getIconePorStatus(status: string): string {
    switch (status) {
      case "PENDENTE":
        return "schedule"
      case "CONFIRMADA":
        return "check_circle"
      case "ATIVA":
        return "restaurant"
      case "LISTA_ESPERA":
        return "hourglass_empty"
      case "CANCELADA_CLIENTE":
      case "CANCELADA_RESTAURANTE":
        return "cancel"
      case "CONCLUIDA":
        return "check_circle"
      case "NAO_COMPARECEU":
        return "no_accounts"
      default:
        return "circle"
    }
  }

  public getStatusText(status: string): string {
    switch (status) {
      case "PENDENTE":
        return "Pendente"
      case "CONFIRMADA":
        return "Confirmada"
      case "ATIVA":
        return "Ativa"
      case "LISTA_ESPERA":
        return "Lista de Espera"
      case "CANCELADA_CLIENTE":
        return "Cancelada pelo Cliente"
      case "CANCELADA_RESTAURANTE":
        return "Cancelada pelo Restaurante"
      case "CONCLUIDA":
        return "Concluída"
      case "NAO_COMPARECEU":
        return "Não Compareceu"
      default:
        return status
    }
  }

  public getStatusColor(status: string): string {
    switch (status) {
      case "PENDENTE":
        return "#faad14" // amarelo
      case "CONFIRMADA":
        return "#52c41a" // verde
      case "ATIVA":
        return "#1890ff" // azul
      case "LISTA_ESPERA":
        return "#722ed1" // roxo
      case "CANCELADA_CLIENTE":
      case "CANCELADA_RESTAURANTE":
        return "#ff4d4f" // vermelho
      case "CONCLUIDA":
        return "#52c41a" // verde
      case "NAO_COMPARECEU":
        return "#8c8c8c" // cinza
      default:
        return "#d9d9d9" // cinza claro
    }
  }

  public getImagemUrl(path: string | null): string {
    if (path && path.startsWith("assets/")) {
      return path
    }
    return this.authService.getAbsoluteImageUrl(path)
  }

  public verRestaurante(idRestaurante: string): void {
    if (idRestaurante) {
      this.router.navigate(["/home/agendamento-reservas-restaurante", idRestaurante])
    }
  }

  public reservarNovamente(reserva: IReservaHistorico): void {
    if (reserva.idRestaurante) {
      // Navegar para a página de agendamento com os dados pré-preenchidos
      this.router.navigate(["/home/agendamento-reservas-restaurante", reserva.idRestaurante], {
        queryParams: {
          data: reserva.data,
          horario: reserva.horario,
          pessoas: reserva.quantidadePessoas,
          comentarios: reserva.comentariosPreferenciaReserva || ''
        }
      })
    }
  }
}
