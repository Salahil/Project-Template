import { Component, EventEmitter, Input, type OnChanges, Output, type SimpleChanges, Optional, Inject, HostListener, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NzBadgeModule } from "ng-zorro-antd/badge"
import { NzCalendarModule } from "ng-zorro-antd/calendar"
import { NzButtonModule } from "ng-zorro-antd/button"
import { NzIconModule } from "ng-zorro-antd/icon"
import { FormsModule } from "@angular/forms"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { IReserva } from "../../../Interfaces/IReserva.interface"

@Component({
  selector: "app-calendario-reservas",
  standalone: true,
  imports: [
    CommonModule,
    NzBadgeModule,
    NzCalendarModule,
    NzButtonModule,
    NzIconModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
  <div class="calendario-container">
    <!-- Header do Calendário (visível apenas quando mostra calendário) -->
    <div class="calendario-header" *ngIf="visualizacaoMobile === 'CALENDARIO'">
      <h3>Calendário de Reservas</h3>
      <button mat-icon-button (click)="fecharCalendario()" class="fechar-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <!-- Header da Lista (visível quando mostra lista de reservas) -->
    <div class="lista-header" *ngIf="visualizacaoMobile === 'LISTA'">
      <button mat-icon-button (click)="voltarParaCalendario()" class="voltar-btn">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <h3>Reservas de {{ dataSelecionadaParaLista | date:'dd/MM/yyyy' }}</h3>
      <button mat-flat-button (click)="selecionarDataEFechar()" class="selecionar-btn" [disabled]="!dataSelecionadaParaLista">
        <mat-icon>check</mat-icon>
        <span>Selecionar Dia</span>
      </button>
    </div>
    
    <!-- Calendário (visível apenas quando visualizacaoMobile === 'CALENDARIO') -->
    <div class="calendario-wrapper" *ngIf="visualizacaoMobile === 'CALENDARIO'">
      <nz-calendar [nzFullscreen]="true" (nzSelectChange)="selecionarData($event)">
        <ul *nzDateCell="let date" class="eventos-dia">
          <!-- Desktop: mostra lista completa de reservas -->
          <ng-container *ngIf="!isMobile && getReservasParaData(date).length > 0">
            <li *ngFor="let reserva of getReservasParaData(date); let i = index" class="evento-item">
              <div class="reserva-info" [matTooltip]="getTooltipReserva(reserva)" matTooltipClass="tavola-tooltip">
                <div class="cliente-info">
                  <span class="cliente-nome">{{ reserva.cliente }}</span>
                  <span class="pessoas-info">
                    <mat-icon>person</mat-icon>
                    {{ reserva.pessoas }}
                  </span>
                </div>
                <div class="status-badge" [ngClass]="'status-' + reserva.status.toLowerCase()">
                  <mat-icon>{{ getStatusIcon(reserva.status) }}</mat-icon>
                  <span>{{ getStatusText(reserva.status) }}</span>
                </div>
              </div>
            </li>
          </ng-container>
          <!-- Mobile: indicador visual simples (ponto) para dias com reservas -->
          <ng-container *ngIf="isMobile && temReservas(date)">
            <li class="indicador-reserva-mobile"></li>
          </ng-container>
        </ul>
      </nz-calendar>
    </div>

    <!-- Lista de Reservas (visível quando visualizacaoMobile === 'LISTA') -->
    <div class="lista-reservas-wrapper" *ngIf="visualizacaoMobile === 'LISTA'">
      <div class="lista-scroll">
        <div *ngFor="let reserva of reservasDoDiaSelecionado" class="reserva-card">
          <div class="cliente-info-card">
            <strong class="cliente-nome-card">{{ reserva.cliente }}</strong>
            <span class="pessoas-info-card">
              <mat-icon>person</mat-icon>
              {{ reserva.pessoas }} pessoas
            </span>
          </div>
          <div class="status-badge-card" [ngClass]="'status-' + reserva.status.toLowerCase()">
            <mat-icon>{{ getStatusIcon(reserva.status) }}</mat-icon>
            <span>{{ getStatusText(reserva.status) }}</span>
          </div>
        </div>
        <div *ngIf="reservasDoDiaSelecionado.length === 0" class="empty-day">
          <mat-icon>event_busy</mat-icon>
          <p>Nenhuma reserva para este dia.</p>
          <button mat-flat-button (click)="selecionarDataEFechar()" class="selecionar-dia-vazio-btn">
            <mat-icon>check</mat-icon>
            <span>Selecionar este dia</span>
          </button>
        </div>
      </div>
    </div>
  </div>
`,
  styles: [
    `
.calendario-container {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0;
  max-width: 100%;
  width: 100%;
  min-height: 600px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #F6BD38;
    border-radius: 4px;
    
    &:hover {
      background: #e6a82e;
    }
  }
}

.calendario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  margin-bottom: 0;
  flex-shrink: 0;
  border-bottom: 1px solid #e8e8e8;
  
  h3 {
    margin: 0;
    color: #3B221B;
    font-size: 22px;
    font-weight: 500;
  }
  
  .fechar-btn {
    color: #3B221B;
    width: 40px;
    height: 40px;
  }
}

.eventos-dia {
  list-style: none;
  margin: 0;
  padding: 6px;
  max-height: 140px;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #F6BD38;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #e6a82e;
  }
}

.evento-item {
  margin-bottom: 4px;
  
  .reserva-info {
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 6px;
    border: 1px solid #e8e8e8;
    transition: all 0.2s ease;
    cursor: pointer;
    
    &:hover {
      background-color: #f0f0f0;
      border-color: #F6BD38;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .cliente-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
      
      .cliente-nome {
        font-weight: 600;
        color: #3B221B;
        font-size: 12px;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 4px;
      }
      
      .pessoas-info {
        display: flex;
        align-items: center;
        gap: 2px;
        color: #666;
        font-size: 10px;
        flex-shrink: 0;
        
        mat-icon {
          font-size: 12px;
          width: 12px;
          height: 12px;
          line-height: 12px;
        }
      }
    }
    
    .status-badge {
      display: flex;
      align-items: center;
      gap: 3px;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 9px;
      font-weight: 600;
      width: fit-content;
      
      mat-icon {
        font-size: 10px;
        width: 10px;
        height: 10px;
        line-height: 10px;
      }
      
      &.status-confirmada {
        background-color: #e8f5e8;
        color: #4CAF50;
      }
      
      &.status-ativa {
        background-color: #e8f5e8;
        color: #4CAF50;
      }
      
      &.status-concluida {
        background-color: #e8f5e8;
        color: #4CAF50;
      }
      
      &.status-pendente {
        background-color: #fff3e0;
        color: #FF9800;
      }
      
      &.status-lista_espera {
        background-color: #fff3e0;
        color: #FF9800;
      }
      
      &.status-cancelada_restaurante {
        background-color: #ffebee;
        color: #F44336;
      }
      
      &.status-nao_compareceu {
        background-color: #ffebee;
        color: #F44336;
      }
    }
  }
}

::ng-deep .ant-picker-calendar {
  background: #FFFFFF;
  border-radius: 8px;
  flex: 1;
  overflow: auto;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  
  .ant-picker-calendar-header {
    padding: 20px;
    border-bottom: 1px solid #e8e8e8;
    flex-shrink: 0;
  }
  
  .ant-picker-content {
    height: auto;
    overflow: visible;
    flex: 1;
  }
  
  .ant-picker-calendar-date-content {
    height: 110px !important;
    padding: 6px !important;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 110px !important;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #F6BD38;
      border-radius: 2px;
    }
  }
  
  .ant-picker-cell {
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: top;
  }
  
  .ant-picker-calendar-date {
    height: 110px;
    overflow: visible;
  }
}

::ng-deep .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner {
  background: #fff !important;
  color: #3B221B !important;
  border: 2px solid #F6BD38 !important;
  border-radius: 8px !important;
}

::ng-deep .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
  border-color: #F6BD38 !important;
}

::ng-deep .ant-badge-status-success {
  background-color: #4CAF50 !important;
}

::ng-deep .ant-badge-status-warning {
  background-color: #F6BD38 !important;
}

::ng-deep .ant-badge-status-error {
  background-color: #DA4A24 !important;
}

::ng-deep .ant-badge-status-default {
  background-color: #9E9E9E !important; /* Cor cinza para status padrão/desconhecido */
}

// Header para Lista (desktop e mobile)
.lista-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #3B221B;
    flex: 1;
  }
  
  .voltar-btn {
    color: #3B221B;
    width: 40px;
    height: 40px;
  }
  
  .selecionar-btn {
    background-color: #F6BD38;
    color: #3B221B;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 8px;
    
    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  }
}

// Indicador de reserva no mobile (ponto simples - mais visível)
.indicador-reserva-mobile {
  width: 12px;
  height: 12px;
  background: #F6BD38;
  border-radius: 50%;
  margin: 6px auto 0;
  display: block;
  list-style: none;
  box-shadow: 0 2px 4px rgba(246, 189, 56, 0.5), 0 0 0 2px rgba(246, 189, 56, 0.2);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

// Wrapper do calendário
.calendario-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px 24px;
}

// Wrapper da lista de reservas
.lista-reservas-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  flex: 1;
  
  .lista-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #F6BD38;
      border-radius: 3px;
    }
  }
  
  .reserva-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    max-width: 100%;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }
    
    .cliente-info-card {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
      max-width: calc(100% - 120px);
      
      .cliente-nome-card {
        font-size: 13px;
        font-weight: 600;
        color: #3B221B;
        margin-bottom: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .pessoas-info-card {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #666;
        font-size: 11px;
        
        mat-icon {
          font-size: 12px;
          width: 12px;
          height: 12px;
          line-height: 12px;
        }
      }
    }
    
    .status-badge-card {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      flex-shrink: 0;
      white-space: nowrap;
      
      mat-icon {
        font-size: 12px;
        width: 12px;
        height: 12px;
        line-height: 12px;
      }
      
      &.status-confirmada, &.status-ativa, &.status-concluida {
        background-color: #e8f5e8;
        color: #4CAF50;
      }
      
      &.status-pendente, &.status-lista_espera {
        background-color: #fff3e0;
        color: #FF9800;
      }
      
      &.status-cancelada_restaurante, &.status-nao_compareceu {
        background-color: #ffebee;
        color: #F44336;
      }
    }
  }
  
  .empty-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    color: #999;
    
    mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #ccc;
    }
    
    p {
      margin: 0 0 24px 0;
      font-size: 16px;
    }
    
    .selecionar-dia-vazio-btn {
      background-color: #F6BD38;
      color: #3B221B;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 8px;
      margin-top: 16px;
      
      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: #3B221B;
        margin: 0;
      }
    }
  }
}

// Desktop e Mobile: comportamento unificado (master-detail)
// Não precisa mais de layout lado a lado

// Comportamento unificado para desktop e mobile
// Estilos já aplicados acima, não precisa duplicar

// Mobile: ajustes específicos
@media (max-width: 768px) {
  .calendario-container {
    max-width: 100vw;
    padding: 0;
    
    .calendario-header {
      padding: 12px 16px;
    }
    
    .lista-header {
      padding: 12px 16px;
      
      .selecionar-btn {
        padding: 6px 12px;
        font-size: 14px;
        
        span {
          display: none;
        }
      }
    }
  }
  
  ::ng-deep .ant-picker-calendar-date-content,
  ::ng-deep .ant-picker-calendar-date {
    height: 60px !important;
  }
  
  ::ng-deep .ant-picker-calendar-date-content {
    padding: 4px !important;
  }
}
`,
  ],
})
export class CalendarioReservasComponent implements OnChanges, OnInit {
  @Input() reservas: IReserva[] = []
  @Output() dataSeleccionada = new EventEmitter<Date>()
  @Output() fechar = new EventEmitter<void>()

  reservasPorData: { [key: string]: IReserva[] } = {}
  reservasInternas: IReserva[] = []
  
  // Controle de visualização (Master-Detail) - agora funciona igual para desktop e mobile
  visualizacaoMobile: 'CALENDARIO' | 'LISTA' = 'CALENDARIO'
  reservasDoDiaSelecionado: IReserva[] = []
  dataSelecionadaParaLista: Date | null = null
  isMobile = window.innerWidth <= 768

  constructor(
    @Optional() public dialogRef?: MatDialogRef<CalendarioReservasComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { reservas?: IReserva[], initialDate?: Date }
  ) {
    // Se estiver dentro de um dialog, usa os dados do dialog
    if (this.dialogRef && this.data) {
      this.reservasInternas = this.data.reservas || []
      this.organizarReservasPorData()
      if (this.data.initialDate) {
        this.dataSelecionadaParaLista = this.data.initialDate
      }
    }
  }

  ngOnInit(): void {
    this.checkMobile()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = event.target.innerWidth <= 768
    // Mantém o comportamento master-detail tanto no desktop quanto no mobile
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["reservas"]) {
      // Se não estiver em dialog, usa os @Input
      if (!this.dialogRef) {
        this.reservasInternas = this.reservas
      }
      this.organizarReservasPorData()
    }
  }

  organizarReservasPorData(): void {
    this.reservasPorData = {}
    const reservasParaUsar = this.dialogRef ? this.reservasInternas : this.reservas

    reservasParaUsar.forEach((reserva) => {
      const dataKey = this.formatarDataKey(reserva.data)

      if (!this.reservasPorData[dataKey]) {
        this.reservasPorData[dataKey] = []
      }

      this.reservasPorData[dataKey].push(reserva)
    })
  }

  formatarDataKey(data: Date): string {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  getReservasParaData(data: Date): IReserva[] {
    const dataKey = this.formatarDataKey(data)
    return this.reservasPorData[dataKey] || []
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case "CONFIRMADA":
      case "ATIVA":
      case "CONCLUIDA":
        return "success"
      case "PENDENTE":
      case "LISTA_ESPERA":
        return "warning"
      case "CANCELADA_RESTAURANTE":
      case "NAO_COMPARECEU":
        return "error"
      default:
        return "default"
    }
  }

  selecionarData(data: Date): void {
    this.dataSelecionadaParaLista = data
    this.reservasDoDiaSelecionado = this.getReservasParaData(data)
    
    // Se não tiver reservas, fecha o dialog e retorna a data diretamente
    if (this.reservasDoDiaSelecionado.length === 0) {
      if (this.dialogRef) {
        this.dialogRef.close(data)
      } else {
        this.dataSeleccionada.emit(data)
      }
    } else {
      // Se tiver reservas, mostra a lista (comportamento master-detail)
      this.visualizacaoMobile = 'LISTA'
    }
  }

  voltarParaCalendario(): void {
    this.visualizacaoMobile = 'CALENDARIO'
  }

  selecionarDataEFechar(): void {
    if (this.dataSelecionadaParaLista) {
      if (this.dialogRef) {
        this.dialogRef.close(this.dataSelecionadaParaLista)
      } else {
        this.dataSeleccionada.emit(this.dataSelecionadaParaLista)
      }
    }
  }

  temReservas(data: Date): boolean {
    return this.getReservasParaData(data).length > 0
  }

  fecharCalendario(): void {
    // Se estiver em dialog, fecha sem retornar dados
    if (this.dialogRef) {
      this.dialogRef.close()
    } else {
      // Se não estiver em dialog, emite o evento
      this.fechar.emit()
    }
  }

  getTooltipStatus(status: string): string {
    switch (status) {
      case "CONFIRMADA":
        return "Reserva confirmada"
      case "ATIVA":
        return "Reserva ativa"
      case "CONCLUIDA":
        return "Reserva concluída"
      case "PENDENTE":
        return "Reserva pendente"
      case "LISTA_ESPERA":
        return "Reserva na lista de espera"
      case "CANCELADA_RESTAURANTE":
        return "Reserva cancelada pelo restaurante"
      case "NAO_COMPARECEU":
        return "Cliente não compareceu"
      default:
        return "Status desconhecido"
    }
  }

  getTooltipReserva(reserva: IReserva): string {
    return `${reserva.cliente} - ${reserva.pessoas} pessoas às ${reserva.horario}`;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "CONFIRMADA":
      case "ATIVA":
      case "CONCLUIDA":
        return "check_circle"
      case "PENDENTE":
      case "LISTA_ESPERA":
        return "schedule"
      case "CANCELADA_RESTAURANTE":
      case "NAO_COMPARECEU":
        return "cancel"
      default:
        return "help"
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "CONFIRMADA":
        return "Confirmada"
      case "ATIVA":
        return "Ativa"
      case "CONCLUIDA":
        return "Concluída"
      case "PENDENTE":
        return "Pendente"
      case "LISTA_ESPERA":
        return "Lista de Espera"
      case "CANCELADA_RESTAURANTE":
        return "Cancelada"
      case "NAO_COMPARECEU":
        return "Não Compareceu"
      default:
        return "Desconhecido"
    }
  }
}
