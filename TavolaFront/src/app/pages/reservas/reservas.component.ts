import { Component, type OnInit, ViewChild, type TemplateRef, ChangeDetectorRef, LOCALE_ID, inject, ElementRef, AfterViewInit, HostListener } from "@angular/core"
import { CommonModule, registerLocaleData } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import localePt from "@angular/common/locales/pt"
import { MatDialog } from "@angular/material/dialog"
import { v4 as uuidv4 } from "uuid"
import { CalendarioReservasComponent } from "./calendario-reservas/calendario-reservas.component"
import { finalize } from 'rxjs'
import Swal from 'sweetalert2'
import { MatTabsModule, MatTabChangeEvent } from "@angular/material/tabs"

// Angular Material (imports existentes)
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatButtonToggleModule } from "@angular/material/button-toggle"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatBadgeModule } from "@angular/material/badge"
import { MatDividerModule } from "@angular/material/divider"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatChipsModule } from "@angular/material/chips"
import { MatSelectModule } from "@angular/material/select"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu"
import { MatAutocompleteModule } from "@angular/material/autocomplete"
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

// NG-Zorro (imports existentes)
import { NzAvatarModule } from "ng-zorro-antd/avatar"
import { NzTagModule } from "ng-zorro-antd/tag"
import { NzIconModule } from "ng-zorro-antd/icon"
import { NzButtonModule } from "ng-zorro-antd/button"
import { NzEmptyModule } from "ng-zorro-antd/empty"
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal"
import { NZ_ICONS } from "ng-zorro-antd/icon"
import { NZ_I18N, pt_BR } from "ng-zorro-antd/i18n"
import type { IconDefinition } from "@ant-design/icons-angular"
import {
  CarOutline,
  HomeOutline,
  EnvironmentOutline,
  FlagOutline,
  HeartOutline,
  HeartFill,
  LeftOutline,
  RightOutline,
  CalendarOutline,
  ClockCircleOutline,
  TeamOutline,
  CheckCircleOutline,
  ExclamationCircleOutline,
  FireFill,
  CopyOutline,
  CheckOutline,
  PlusOutline,
  DeleteOutline,
  EditOutline,
  UserOutline,
} from "@ant-design/icons-angular/icons"
import { NzDatePickerModule } from "ng-zorro-antd/date-picker"
import { IReserva } from '../../Interfaces/IReserva.interface';
import { IMesa } from '../../Interfaces/IMesa.interface';
import { ICliente } from '../../Interfaces/ICliente.interface';
import { IAmbiente } from '../../Interfaces/IAmbiente.interface';
import { DialogGerenciarMesasComponent } from './dialog-gerenciar-mesas/dialog-gerenciar-mesas.component';

// Seus Serviços
import { AmbienteService } from '../../core/services/ambiente.service';
import { MesaService } from '../../core/services/mesa.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ReservasService } from '../../core/services/reservas.service';
import { ClienteService } from '../../core/services/cliente.service';

registerLocaleData(localePt)

const antIcons: IconDefinition[] = [
  CarOutline,
  HomeOutline,
  EnvironmentOutline,
  FlagOutline,
  HeartOutline,
  HeartFill,
  LeftOutline,
  RightOutline,
  CalendarOutline,
  ClockCircleOutline,
  TeamOutline,
  CheckCircleOutline,
  ExclamationCircleOutline,
  FireFill,
  CopyOutline,
  CheckOutline,
  PlusOutline,
  DeleteOutline,
  EditOutline,
  UserOutline,
]

@Component({
  selector: "app-reservas",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    NzAvatarModule,
    NzTagModule,
    NzIconModule,
    NzButtonModule,
    NzEmptyModule,
    NzModalModule,
    NzDatePickerModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    CalendarioReservasComponent,
  ],
  templateUrl: "./reservas.component.html",
  styleUrls: ["./reservas.component.scss"],
  providers: [
    { provide: NZ_ICONS, useValue: antIcons },
    { provide: NZ_I18N, useValue: pt_BR },
    { provide: LOCALE_ID, useValue: "pt-BR" },
    NzModalService,
  ],
  animations: [],
})
export class ReservasComponent implements OnInit, AfterViewInit {
  @ViewChild("modalMesa") modalMesaTemplate!: TemplateRef<any>
  @ViewChild("ambientesScroll") ambientesScrollContainer!: ElementRef;

  // Injeção de dependências
  private ambienteService = inject(AmbienteService);
  private mesaService = inject(MesaService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);
  private modalService = inject(NzModalService);
  private reservasService = inject(ReservasService);
  private clienteService = inject(ClienteService);

  // --- NOVO MODELO DE DADOS ---
  ambientes: IAmbiente[] = [];
  ambienteAtivo: IAmbiente | null = null;
  
  // --- DADOS DE RESERVA (Serão populados pela API futuramente) ---
  reservaSelecionada: IReserva | null = null;
  reservas: IReserva[] = []; // Por enquanto vazio
  reservasVisiveis: IReserva[] = [];
  reservasEspera: IReserva[] = [];
  reservasAlmocoVisiveis: IReserva[] = [];
  reservasJantarVisiveis: IReserva[] = [];

  // --- ESTADO DA UI ---
  isLoading = { ambientes: false, mesas: false, reservas: false };
  editandoIndex: number | null = null;
  valorEditado = '';
  adicionandoArea = false;
  nomeNovaArea = '';
  mesaEditando: IMesa = this.criarMesaPadrao();

  dataAtual: Date = new Date();
  filtroPesquisa = "";
  periodoFiltro: "todos" | "Almoço" | "Jantar" = "todos";
  abaAtiva = "Reservas";
  pesquisa = "";
  pesquisaEspera = "";
  mostrarCalendario = false;
  selectedTabIndex: number = 0;
  selectedEnvironmentTabIndex: number = 0;
  
  // Responsividade
  visualizacaoAtiva: 'lista' | 'mapa' = 'lista';
  isMobileView = false;

  // Controle de scroll dos ambientes
  mostrarSetaEsquerda = false;
  mostrarSetaDireita = false;

  // Mock data (como no seu código)
  clientes: ICliente[] = []; // This will no longer be used as client data is in IReserva

  reservasEsperaVisiveis: IReserva[] = [];
  reservasParaCalendario: IReserva[] = [];

  // --- LÓGICA DE CONTROLE DAS ABAS (MAIS ROBUSTA) ---
  mudarAba(event: MatTabChangeEvent): void {
    const index = event.index;
    this.selectedTabIndex = index;
    if (this.selectedTabIndex === 1) {
      this.carregarReservasListaEspera();
    } else if (this.selectedTabIndex === 0) {
      this.carregarReservas();
    }
  }

  mudarAmbienteTab(event: MatTabChangeEvent): void {
    const index = event.index;
    this.selectedEnvironmentTabIndex = index;
    if (this.editandoIndex === null && index < this.ambientes.length) {
      this.ambienteAtivo = this.ambientes[index];
      this.cdr.detectChanges();
    }
  }

  // Novo método para seleção direta de ambiente
  selecionarAmbiente(ambiente: IAmbiente): void {
    if (this.editandoIndex === null) {
      this.ambienteAtivo = ambiente;
      this.cdr.detectChanges();
    }
  }

  // --- MÉTODOS DO CRUD DE ÁREAS (REVISADOS E CORRIGIDOS) ---
  iniciarEdicao(event: Event, index: number): void {
    event.stopPropagation();
    this.cancelarAdicionar();
    if (this.editandoIndex !== null) {
      this.salvarEdicao(this.editandoIndex);
    }
    this.editandoIndex = index;
    this.valorEditado = this.ambientes[index].nome;
  }

  cancelarEdicao(): void {
    this.editandoIndex = null;
    this.valorEditado = '';
  }

  salvarEdicao(index: number): void {
    if (this.editandoIndex === null || index !== this.editandoIndex) return;

    const novoNome = this.valorEditado.trim();
    const ambiente = this.ambientes[index];

    if (novoNome && novoNome !== ambiente.nome) {
      if (this.ambientes.some((a, i) => a.nome.toLowerCase() === novoNome.toLowerCase() && i !== index)) {
        this.toastr.warning(`O ambiente "${novoNome}" já existe.`);
        this.cancelarEdicao();
        return;
      }
      this.ambienteService.putAtualizarAmbiente(ambiente.id, { nome: novoNome }).subscribe({
        next: () => {
          this.toastr.success(`Ambiente "${ambiente.nome}" atualizado para "${novoNome}".`);
          this.carregarAmbientes();
        },
        error: () => this.toastr.error("Erro ao atualizar o ambiente."),
        complete: () => this.cancelarEdicao(),
      });
    } else {
      this.cancelarEdicao();
    }
  }

  ativarModoAdicionar(): void {
    this.cancelarEdicao();
    this.adicionandoArea = true;
  }

  salvarNovaArea(): void {
    if (!this.adicionandoArea) return;

    const novoNome = this.nomeNovaArea.trim();
    if (novoNome && !this.ambientes.find(a => a.nome.toLowerCase() === novoNome.toLowerCase())) {
      this.ambienteService.postCriarAmbiente({ nome: novoNome }).subscribe({
        next: () => {
          this.toastr.success(`Ambiente "${novoNome}" criado com sucesso.`);
          this.carregarAmbientes();
        },
        error: () => this.toastr.error("Erro ao criar o ambiente."),
        complete: () => this.cancelarAdicionar(),
      });
    }
    this.cancelarAdicionar();
  }

  cancelarAdicionar(): void {
    this.adicionandoArea = false;
    this.nomeNovaArea = '';
  }

  confirmarRemocaoArea(event: Event, ambiente: IAmbiente): void {
    event.stopPropagation();
    Swal.fire({
      title: `Remover "${ambiente.nome}"?`,
      html: `Isso removerá o ambiente e todas as <b>${ambiente.mesas.length}</b> mesas contidas nele. Esta ação não pode ser desfeita.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ambienteService.deleteRemoverAmbiente(ambiente.id).subscribe({
          next: () => {
            this.toastr.success(`Ambiente "${ambiente.nome}" removido.`);
            this.ambienteAtivo = null;
            this.carregarAmbientes();
          },
          error: () => this.toastr.error("Erro ao remover o ambiente."),
        });
      }
    });
  }

  ngOnInit(): void {
    this.carregarAmbientes();
    this.carregarReservas();
    this.carregarReservasListaEspera();
    this.aplicarFiltros();
    this.aplicarFiltrosEspera();
    this.checkMobileView();
    
    // Listener para mudanças de tamanho da tela
    window.addEventListener('resize', () => {
      this.checkMobileView();
    });
  }

  ngAfterViewInit(): void {
    // Usamos um setTimeout para garantir que o ngFor tenha renderizado os ambientes
    setTimeout(() => {
      this.verificarVisibilidadeSetas();
    }, 100);
  }
  
  @HostListener('window:resize')
  onResize() {
    this.verificarVisibilidadeSetas();
  }
  
  checkMobileView(): void {
    this.isMobileView = window.innerWidth <= 768;
  }
  
  isMobile(): boolean {
    return this.isMobileView;
  }

  onViewChange(event: any): void {
    this.visualizacaoAtiva = event.value;
  }

  // Métodos de controle de scroll dos ambientes
  scrollAmbientes(direcao: 'left' | 'right'): void {
    const container = this.ambientesScrollContainer.nativeElement;
    const scrollAmount = 250; // Quantidade de pixels para rolar

    if (direcao === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
  
  verificarVisibilidadeSetas(): void {
    // Adiciona um debounce para evitar chamadas excessivas durante o scroll
    setTimeout(() => {
        if (!this.ambientesScrollContainer) return;
        const container = this.ambientesScrollContainer.nativeElement;
        
        // Verifica se o conteúdo é maior que o container
        const hasOverflow = container.scrollWidth > container.clientWidth;

        if (!hasOverflow) {
            this.mostrarSetaEsquerda = false;
            this.mostrarSetaDireita = false;
            return;
        }

        // Tolerância de 1px para evitar problemas de arredondamento
        this.mostrarSetaEsquerda = container.scrollLeft > 1;
        this.mostrarSetaDireita = container.scrollWidth - container.clientWidth - container.scrollLeft > 1;
        this.cdr.detectChanges(); // Força a detecção de mudanças
    }, 50);
  }
  
  abrirBottomSheetReserva(reserva: IReserva): void {
    // Por enquanto, vamos implementar um comportamento simples
    // Futuramente você pode criar um componente específico para o bottom sheet
    this.reservaSelecionada = reserva;
    
    // Mostra uma mensagem ou implementa o bottom sheet
    this.toastr.info('Detalhes da reserva abertos no mobile');
  }

  criarMesaPadrao(): IMesa {
    return { 
      id: "", 
      nome: "", 
      tipo: "retangular", 
      ambienteId: this.ambienteAtivo?.id || "", 
      vip: false, 
      ocupada: false, 
      capacidade: 2 
    }
  }

  proximoDia(): void {
    const novaData = new Date(this.dataAtual)
    novaData.setDate(novaData.getDate() + 1)
    this.dataAtual = novaData
    this.carregarReservas()
    this.limparSelecao()
  }

  diaAnterior(): void {
    const novaData = new Date(this.dataAtual)
    novaData.setDate(novaData.getDate() - 1)
    this.dataAtual = novaData
    this.carregarReservas()
    this.limparSelecao()
  }

  temReservasParaPesquisaNoPeriodo(periodo: "Almoço" | "Jantar"): boolean {
    if (!this.pesquisa.trim()) return false

    const termoBusca = this.pesquisa.toLowerCase().trim()
    const reservasDoPeriodo = periodo === "Almoço" ? this.reservasAlmocoVisiveis : this.reservasJantarVisiveis

    if (reservasDoPeriodo.length === 0) return false

    return reservasDoPeriodo.some((reserva: IReserva) => {
      return reserva.cliente.toLowerCase().includes(termoBusca)
    })
  }

  temReservasVisiveisParaPesquisaNoPeriodo(periodo: "Almoço" | "Jantar"): boolean {
    if (!this.pesquisa.trim()) return false
    return periodo === "Almoço" ? this.reservasAlmocoVisiveis.length > 0 : this.reservasJantarVisiveis.length > 0
  }

  existemReservasParaDataAtual(): boolean {
    const dataAtualDia = this.dataAtual.getDate();
    const dataAtualMes = this.dataAtual.getMonth();
    const dataAtualAno = this.dataAtual.getFullYear();

    return this.reservas.some(
      (reserva: IReserva) => {
        const reservaData = new Date(reserva.data);
        const mesmoDia = reservaData.getDate() === dataAtualDia;
        const mesmoMes = reservaData.getMonth() === dataAtualMes;
        const mesmoAno = reservaData.getFullYear() === dataAtualAno;
        
        console.log(`[aplicarFiltros] Comparando reserva: ${reserva.cliente}, Data: ${reservaData.toLocaleDateString()}, Mesmo dia: ${mesmoDia}, Mesmo mês: ${mesmoMes}, Mesmo ano: ${mesmoAno}`);
        
        return mesmoDia && mesmoMes && mesmoAno;
      }
    );
  }

  aplicarFiltros(): void {
    const dataAtualDia = this.dataAtual.getDate();
    const dataAtualMes = this.dataAtual.getMonth();
    const dataAtualAno = this.dataAtual.getFullYear();

    console.log(`[aplicarFiltros] Filtrando para data: ${this.dataAtual.toLocaleDateString()}`);

    let tempReservas = this.reservas.filter(
      (reserva: IReserva) => {
        const reservaData = new Date(reserva.data);
        const mesmoDia = reservaData.getDate() === dataAtualDia;
        const mesmoMes = reservaData.getMonth() === dataAtualMes;
        const mesmoAno = reservaData.getFullYear() === dataAtualAno;
        
        console.log(`[aplicarFiltros] Comparando reserva: ${reserva.cliente}, Data: ${reservaData.toLocaleDateString()}, Mesmo dia: ${mesmoDia}, Mesmo mês: ${mesmoMes}, Mesmo ano: ${mesmoAno}`);
        
        return mesmoDia && mesmoMes && mesmoAno;
      }
    );

    console.log(`[aplicarFiltros] Reservas filtradas (pré-pesquisa/período): ${tempReservas.length}`);

    if (this.pesquisa && this.pesquisa.trim() !== "") {
      const termoBusca = this.pesquisa.toLowerCase().trim()
      tempReservas = tempReservas.filter((reserva: IReserva) => {
        return reserva.cliente.toLowerCase().includes(termoBusca)
      })
    }

    if (this.periodoFiltro !== "todos") {
      tempReservas = tempReservas.filter((r) => r.periodo === this.periodoFiltro)
    }

    this.reservasVisiveis = [...tempReservas]

    this.reservasAlmocoVisiveis = this.reservasVisiveis.filter((r) => r.periodo === "Almoço")
    this.reservasJantarVisiveis = this.reservasVisiveis.filter((r) => r.periodo === "Jantar")

    console.log(`[aplicarFiltros] Reservas Visíveis: ${this.reservasVisiveis.length}, Almoço: ${this.reservasAlmocoVisiveis.length}, Jantar: ${this.reservasJantarVisiveis.length}`);

    if (this.periodoFiltro === "Almoço") {
      this.reservasJantarVisiveis = []
    } else if (this.periodoFiltro === "Jantar") {
      this.reservasAlmocoVisiveis = []
    }

    if (this.reservaSelecionada && !this.reservasVisiveis.find((r) => r.id === this.reservaSelecionada!.id)) {
      this.reservaSelecionada = null
    }
    this.atualizarStatusMesas()
    this.cdr.detectChanges()
  }

  aplicarFiltrosEspera(): void {
    let tempReservas = [...this.reservasEspera]

    if (this.pesquisaEspera && this.pesquisaEspera.trim() !== "") {
      const termoBusca = this.pesquisaEspera.toLowerCase().trim()
      tempReservas = tempReservas.filter((reserva: IReserva) => {
        return reserva.cliente.toLowerCase().includes(termoBusca)
      })
    }

    this.reservasEsperaVisiveis = [...tempReservas]
    this.cdr.detectChanges()
  }

  limparPesquisaEspera(): void {
    this.pesquisaEspera = ""
    this.aplicarFiltrosEspera()
  }

  reatribuirReserva(reserva: IReserva, event: Event): void {
    event.stopPropagation()

    this.modalService.confirm({
      nzTitle: "Reatribuir Reserva",
      nzContent: `Deseja reatribuir a reserva de ${reserva.cliente} para ${this.dataAtual.toLocaleDateString("pt-BR")}`,
      nzOkText: "Sim, reatribuir",
      nzOkType: "primary",
      nzCancelText: "Cancelar",
      nzOnOk: () => {
        const idRestaurante = this.authService.perfil?.id;
        if (!idRestaurante) {
          this.toastr.error("ID do restaurante não encontrado. Faça o login.");
          return;
        }

        // Prepara o payload para a API com a nova data e status
        const updatePayload = {
          idRestaurante: idRestaurante, 
          dataReserva: this.formatarDataParaAPI(this.dataAtual), // Usa a data atual selecionada
          horarioReserva: reserva.horario,
          idsMesas: reserva.mesaIds, // Mantém as mesas existentes, se houver
          quantidadePessoasReserva: reserva.pessoas,
          comentariosPreferenciaReserva: reserva.preferencias,
          status: "CONFIRMADA" // Define o status como CONFIRMADA
        };

        this.reservasService.putAtualizarReserva(reserva.id, updatePayload).subscribe({
          next: () => {
            this.toastr.success(`Reserva de ${reserva.cliente} reatribuída e confirmada para ${this.dataAtual.toLocaleDateString("pt-BR")}.`);
            
            // Atualiza o estado local após sucesso da API
            reserva.data = new Date(this.dataAtual); // Atualiza a data localmente
            reserva.status = "CONFIRMADA"; // Atualiza o status localmente

            // Remove da lista de espera e adiciona à lista principal
            this.reservasEspera = this.reservasEspera.filter((r) => r.id !== reserva.id);
            this.reservas.push(reserva);
            
            this.carregarReservas(); // Recarrega todas as reservas normais do backend
            this.carregarReservasListaEspera(); // Recarrega a lista de espera

            this.aplicarFiltros(); // Reaplicar filtros para atualizar as listas visíveis
            this.aplicarFiltrosEspera();
            this.limparSelecao(); // Limpa a seleção para fechar os detalhes
            this.selectedTabIndex = 0; // Volta para a aba 'Reservas'
          },
          error: (error) => {
            const errorMessage = error.error?.erro || "Erro ao reatribuir reserva.";
            this.toastr.error(errorMessage);
            console.error("Erro ao reatribuir reserva:", error);
      },
        });
      },
    });
  }

  getTooltipStatus(status: string): string {
    switch (status) {
      case "CONFIRMADA":
        return "Reserva Confirmada"
      case "PENDENTE":
        return "Aguardando Confirmação"
      case "CANCELADA_RESTAURANTE":
        return "Reserva Cancelada"
      case "CONCLUIDA":
        return "Reserva Concluída"
      case "NAO_COMPARECEU":
        return "Cliente Não Compareceu"
      case "ATIVA":
        return "Reserva Ativa"
      case "LISTA_ESPERA":
        return "Lista de Espera"
      default:
        return "Status Desconhecido"
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "CONFIRMADA":
        return "check_circle"
      case "PENDENTE":
        return "hourglass_empty"
      case "CANCELADA_RESTAURANTE":
        return "cancel"
      case "CONCLUIDA":
        return "task_alt"
      case "NAO_COMPARECEU":
        return "person_off"
      case "ATIVA":
        return "event_available"
      case "LISTA_ESPERA":
        return "pending_actions"
      default:
        return "help_outline"
    }
  }

  getClasseMesa(mesa: IMesa): string {
    const classes = []

    if (mesa.tipo === "circular") {
      classes.push("mesa-circular")
    }

    if (mesa.vip) {
      classes.push("mesa-vip")
    }

    if (this.isMesaOcupadaPorOutraReserva(mesa.id)) {
      classes.push("mesa-ocupada")
    }

    if (this.isMesaAtribuidaAReservaAtual(mesa.id)) {
      classes.push("mesa-atribuida-reserva-atual")
    }

    return classes.join(" ")
  }

  getTooltipMesa(mesa: IMesa): string {
    if (this.isMesaOcupadaPorOutraReserva(mesa.id)) {
      const reserva = this.getReservaPorId(mesa.reservaId!)
      return `Ocupada por: ${reserva?.cliente || "Outra reserva"} (${reserva?.horario || ""})`
    }

    if (this.isMesaAtribuidaAReservaAtual(mesa.id)) {
      const cliente = this.reservaSelecionada ? this.reservaSelecionada.cliente : ""
      return `Atribuída a esta reserva (${cliente}, ${this.reservaSelecionada?.horario || ""})`
    }

    return `Disponível - Capacidade: ${mesa.capacidade || "N/A"} pessoas`
  }

  limparPesquisa(): void {
    this.pesquisa = ""
    this.aplicarFiltros()
  }

  abrirModalAdicionarReserva(): void {
    console.log("Abrir modal para adicionar nova reserva. Payload para backend seria:", {
      idRestaurante: "ID_RESTAURANTE_AQUI",
      dataReserva: this.dataAtual.toISOString().split("T")[0],
    })
  }

  selecionarReserva(reserva: IReserva): void {
    if (this.isMobile()) {
      // No mobile, muda para visualização de mapa e seleciona a reserva
      this.visualizacaoAtiva = 'mapa';
      this.reservaSelecionada = reserva;
      
      // Apenas muda para a aba de Reservas (índice 0) se a reserva selecionada NÃO for da Lista de Espera
      if (this.reservaSelecionada.status !== 'LISTA_ESPERA' && this.selectedTabIndex !== 0) {
          this.selectedTabIndex = 0; 
      } else if (this.reservaSelecionada.status === 'LISTA_ESPERA' && this.selectedTabIndex !== 1) {
          this.selectedTabIndex = 1;
      }

      if (this.reservaSelecionada.mesaIds.length > 0) {
          const primeiraMesa = this.getMesaPorId(this.reservaSelecionada.mesaIds[0]);
          if (primeiraMesa) {
            const ambiente = this.ambientes.find(a => a.mesas.some(m => m.id === primeiraMesa.id));
            if (ambiente) {
              this.ambienteAtivo = ambiente;
              this.selectedEnvironmentTabIndex = this.ambientes.indexOf(ambiente);
              this.cdr.detectChanges();
            }
          }
        }
    } else {
      // No desktop, comportamento normal
      this.reservaSelecionada = this.reservaSelecionada?.id === reserva.id ? null : reserva;
      if (this.reservaSelecionada) {
          // Apenas muda para a aba de Reservas (índice 0) se a reserva selecionada NÃO for da Lista de Espera
          if (this.reservaSelecionada.status !== 'LISTA_ESPERA' && this.selectedTabIndex !== 0) {
              this.selectedTabIndex = 0; 
          } else if (this.reservaSelecionada.status === 'LISTA_ESPERA' && this.selectedTabIndex !== 1) { // If it is a waiting list reservation, switch to waiting list tab
              this.selectedTabIndex = 1;
          }

        if (this.reservaSelecionada.mesaIds.length > 0) {
          const primeiraMesa = this.getMesaPorId(this.reservaSelecionada.mesaIds[0]);
          if (primeiraMesa) {
            const ambiente = this.ambientes.find(a => a.mesas.some(m => m.id === primeiraMesa.id));
            if (ambiente) {
              this.ambienteAtivo = ambiente;
              this.selectedEnvironmentTabIndex = this.ambientes.indexOf(ambiente);
              this.cdr.detectChanges();
            }
          }
        }
      }
    }
  }

  fecharDetalhes(): void {
    this.reservaSelecionada = null;
  }

  mudarArea(event: any): void {
    const index = event.index;
    if (this.editandoIndex === null && index < this.ambientes.length) {
      this.ambienteAtivo = this.ambientes[index];
    }
  }

  formatarData(data: Date): string {
    if (!data) return ""
    return new Date(data).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })
  }

  getMesasPorArea(area: string): IMesa[] {
    const ambiente = this.ambientes.find(a => a.nome === area);
    return ambiente?.mesas || [];
  }

  isMesaOcupada(mesaId: string): boolean {
    return this.reservasVisiveis.some((reserva) => reserva.mesaIds.includes(mesaId))
  }

  isMesaOcupadaPorOutraReserva(mesaId: string): boolean {
    if (this.reservaSelecionada && this.reservaSelecionada.mesaIds.includes(mesaId)) {
      return false
    }
    const mesa = this.getMesaPorId(mesaId)
    return mesa?.ocupada || false
  }

  isMesaAtribuidaAReservaAtual(mesaId: string): boolean {
    return !!this.reservaSelecionada && this.reservaSelecionada.mesaIds.includes(mesaId)
  }

  toggleMesaParaReserva(mesa: IMesa): void {
    if (!this.reservaSelecionada || (mesa.ocupada && mesa.reservaId !== this.reservaSelecionada.id)) {
        return;
    }

    const indexNaReserva = this.reservaSelecionada.mesaIds.indexOf(mesa.id);
    if (indexNaReserva > -1) {
        this.reservaSelecionada.mesaIds.splice(indexNaReserva, 1);
    } else {
        this.reservaSelecionada.mesaIds.push(mesa.id);
    }
    
    this.atualizarMesasReserva(this.reservaSelecionada.mesaIds);
  }

  atualizarStatusMesas(): void {
    this.ambientes.forEach(ambiente => {
      ambiente.mesas.forEach(mesa => {
        const reservaAssociada = this.reservasVisiveis.find((r) => r.mesaIds.includes(mesa.id))
        if (reservaAssociada) {
          mesa.ocupada = true
          mesa.reservaId = reservaAssociada.id
        } else {
          mesa.ocupada = false
          mesa.reservaId = undefined
        }
      });
    });
  }

  getMesaPorId(id: string): IMesa | undefined {
    for (const ambiente of this.ambientes) {
      const mesa = ambiente.mesas.find(m => m.id === id);
      if (mesa) return mesa;
    }
    return undefined;
  }

  getReservaPorId(id: string | undefined): IReserva | undefined {
    if (!id) return undefined
    return this.reservas.find((reserva) => reserva.id === id)
  }

  getMesasFormatadas(reserva: IReserva | null): string {
    if (!reserva || !reserva.nomesMesas || reserva.nomesMesas.length === 0) {
      return "N/A";
    }
    return reserva.nomesMesas.join(", ");
  }

  removerMesaDaReserva(reservaId: string, mesaId: string): void {
    const reservaOriginal = this.reservas.find((r) => r.id === reservaId);
    if (reservaOriginal && this.reservaSelecionada && this.reservaSelecionada.id === reservaId) {
      const currentReserva = this.reservaSelecionada; // Usa a reserva selecionada para a atualização
      const idRestaurante = this.authService.perfil?.id;

      // Remove o ID da mesa do array local
      const novasMesasIds = currentReserva.mesaIds.filter((id) => id !== mesaId);
      
      // Prepara o payload para a API
      const updatePayload = {
        idRestaurante: idRestaurante, 
        dataReserva: this.formatarDataParaAPI(currentReserva.data),
        horarioReserva: currentReserva.horario,
        idsMesas: novasMesasIds, // Envia os IDs das mesas atualizados
        quantidadePessoasReserva: currentReserva.pessoas,
        comentariosPreferenciaReserva: currentReserva.preferencias
      };

      // Chama a API para atualizar a reserva
      this.reservasService.putAtualizarReserva(reservaId, updatePayload).subscribe({
        next: () => {
          this.toastr.success("Mesa desassociada da reserva com sucesso!");
          // Recomendo recarregar as reservas para garantir que o estado local esteja 100% sincronizado
          this.carregarReservas();
          this.limparSelecao(); // Fecha os detalhes para recarregar com o novo estado
        },
        error: (error) => {
          const errorMessage = error.error?.erro || "Erro ao desassociar mesa da reserva.";
          this.toastr.error(errorMessage);
          console.error("Erro ao desassociar mesa da reserva:", error);
          // Opcional: Reverter a remoção do chip localmente em caso de erro
          // currentReserva.mesaIds.push(mesaId);
        }
      });
    }
  }

  abrirModalAdicionarMesa(mesa?: IMesa): void {
    this.mesaEditando = mesa ? { ...mesa } : this.criarMesaPadrao()
    this.modalService.create({
      nzTitle: this.mesaEditando.id ? "Editar Mesa" : "Adicionar Nova Mesa",
      nzContent: this.modalMesaTemplate,
      nzFooter: [
        { label: "Cancelar", onClick: () => this.fecharModalMesa(true) },
        { label: "Salvar", type: "primary", onClick: () => this.salvarMesa() },
      ],
      nzOnCancel: () => this.fecharModalMesa(true),
    })
  }

  salvarMesa(): void {
    if (!this.mesaEditando.nome.trim() || !this.mesaEditando.ambienteId) {
      console.error("Nome e Ambiente da mesa são obrigatórios.")
      return
    }

    const ambiente = this.ambientes.find(a => a.id === this.mesaEditando.ambienteId);
    if (!ambiente) {
      console.error("Ambiente não encontrado.")
      return;
    }

    if (this.mesaEditando.id) {
      const index = ambiente.mesas.findIndex((m) => m.id === this.mesaEditando.id)
      if (index !== -1) {
        ambiente.mesas[index] = { ...this.mesaEditando }
      }
    } else {
      this.mesaEditando.id = `m${Date.now()}`
      ambiente.mesas.push({ ...this.mesaEditando })
    }
    this.atualizarStatusMesas()
    this.fecharModalMesa(true)
  }

  excluirMesa(mesaId: string): void {
    for (const ambiente of this.ambientes) {
      ambiente.mesas = ambiente.mesas.filter((m) => m.id !== mesaId)
    }
    this.reservas.forEach((reserva) => {
      reserva.mesaIds = reserva.mesaIds.filter((id) => id !== mesaId)
      if (reserva.nomesMesas) {
        const mesaRemovida = this.getMesaPorId(mesaId);
        if (mesaRemovida) {
          reserva.nomesMesas = reserva.nomesMesas.filter(name => name !== mesaRemovida.nome);
        }
      }
    })
    if (this.reservaSelecionada && this.reservaSelecionada.mesaIds.includes(mesaId)) {
      this.removerMesaDaReserva(this.reservaSelecionada.id, mesaId)
    }
    this.atualizarStatusMesas()
    this.fecharModalMesa(true)
  }

  fecharModalMesa(isFromModalService = false): void {
    if (isFromModalService) {
      this.modalService.closeAll()
    }
    this.mesaEditando = this.criarMesaPadrao()
  }

  abrirModalGerenciarMesas(modo: 'criar' | 'editar', mesa?: IMesa): void {
    if (modo === 'criar' && (!this.ambienteAtivo || this.ambienteAtivo.id === "")) {
      this.toastr.info("Por favor, selecione ou crie um ambiente primeiro para adicionar mesas.");
      return;
    }
    
    const dialogRef = this.dialog.open(DialogGerenciarMesasComponent, {
      data: {
        modo: modo,
        mesa: mesa || null,
        idAmbiente: this.ambienteAtivo?.id,
        ambientes: this.ambientes,
      },
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(sucesso => {
      if (sucesso) {
        this.carregarAmbientes();
      }
    });
  }

  nzDatePickerChange(date: Date): void {
    // Cria um novo objeto Date para garantir que a data seja o início do dia no fuso horário local
    this.dataAtual = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.carregarReservas();
    this.limparSelecao();
  }

  limparSelecao(): void {
    this.reservaSelecionada = null
    this.cdr.detectChanges()
  }

  editarMesa(mesa: IMesa): void {
    this.abrirModalGerenciarMesas('editar', mesa)
  }

  confirmarRemocaoMesa(event: Event, mesa: IMesa): void {
    event.stopPropagation();
    Swal.fire({
      title: `Remover a mesa "${mesa.nome}"?`,
      text: "Esta ação não pode ser desfeita.",
      icon: 'warning',
      confirmButtonColor: '#d33',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim, remover'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mesaService.deleteRemoverMesa(mesa.id).subscribe({
          next: () => {
            this.toastr.success(`Mesa "${mesa.nome}" removida.`);
            this.carregarAmbientes();
          },
          error: () => this.toastr.error("Erro ao remover a mesa."),
        });
      }
    });
  }

  getClientesDodia(): ICliente[] {
    const dataFormatada = this.dataAtual.toLocaleDateString("pt-BR")
    const reservasDoDia = this.reservas.filter(
      (reserva) => new Date(reserva.data).toLocaleDateString("pt-BR") === dataFormatada,
    )

    const clientesUnicos = new Map<string, ICliente>();
    reservasDoDia.forEach(reserva => {
      if (!clientesUnicos.has(reserva.clienteId)) {
        clientesUnicos.set(reserva.clienteId, {
          id: reserva.clienteId,
          nome: reserva.cliente,
          email: reserva.emailCliente,
          telefone: reserva.telefoneCliente,
          avatar: reserva.imagemPerfilCliente,
        });
      }
    });
    return Array.from(clientesUnicos.values());
  }

  atualizarStatusReserva(novoStatus: string): void {
    if (this.reservaSelecionada) {
      const currentReserva = this.reservaSelecionada; // Atribui a uma constante local
      const reservaId = currentReserva.id;
      const idRestaurante = this.authService.perfil?.id;
      const statusAnterior = currentReserva.status; // Usa a constante local

      if (novoStatus === "CANCELADA_RESTAURANTE") {
        Swal.fire({
          title: `Tem certeza que deseja cancelar a reserva de ${currentReserva.cliente}?`,
          html: "Esta ação irá desassociar todas as mesas e não poderá ser desfeita.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim, cancelar',
          cancelButtonText: 'Não',
          confirmButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            // PASSO 1: Desassociar mesas antes de cancelar
            const updatePayload = {
              idRestaurante: idRestaurante, 
              dataReserva: this.formatarDataParaAPI(currentReserva.data), 
              horarioReserva: currentReserva.horario,
              idsMesas: [], // Remover todas as mesas
              quantidadePessoasReserva: currentReserva.pessoas,
              comentariosPreferenciaReserva: currentReserva.preferencias
            };

            this.reservasService.putAtualizarReserva(reservaId, updatePayload).subscribe({
              next: () => {
                this.toastr.info("Mesas desassociadas da reserva. Prosseguindo com o cancelamento...");
                // PASSO 2: Chamar o endpoint de cancelamento
                this.reservasService.putCancelarReserva(reservaId).subscribe({
                  next: () => {
                    this.toastr.success("Reserva cancelada com sucesso!");
                    currentReserva.status = novoStatus as any; // Usa a constante local
                    this.limparSelecao();
                    this.carregarReservas(); // Recarrega todas as reservas do backend
                  },
                  error: (error) => {
                    const errorMessage = error.error?.erro || "Erro ao cancelar reserva.";
                    this.toastr.error(errorMessage);
                    if (errorMessage.includes("já foi finalizada ou cancelada")) {
                      Swal.fire({
                        title: 'Erro ao Cancelar',
                        text: errorMessage,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                      });
                    }
                    console.error("Erro ao cancelar reserva:", error);
                    setTimeout(() => {
                      currentReserva.status = statusAnterior as any;
                      this.cdr.detectChanges();
                    }, 0);
                  },
                });
              },
              error: (error) => {
                const errorMessage = error.error?.erro || "Erro ao desassociar mesas para cancelamento.";
                this.toastr.error(errorMessage);
                console.error("Erro ao desassociar mesas para cancelamento:", error);
                setTimeout(() => {
                  currentReserva.status = statusAnterior as any;
                  this.cdr.detectChanges();
                }, 0);
              }
            });
          } else {
            // Se o usuário clicou em "Não" ou fechou o Swal, reverte o status
            setTimeout(() => {
              currentReserva.status = statusAnterior as any;
              this.cdr.detectChanges();
            }, 0);
          }
        });
      } else if (novoStatus === "LISTA_ESPERA") { // Lógica para mover para LISTA_ESPERA
        Swal.fire({
          title: `Tem certeza que deseja mover a reserva de ${currentReserva.cliente} para a Lista de Espera?`,
          html: "Isso irá desassociar todas as mesas atualmente atribuídas a esta reserva.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim, mover',
          cancelButtonText: 'Não',
          confirmButtonColor: '#ffc107',
        }).then((result) => {
          if (result.isConfirmed) {
            // PASSO 1: PREPARAÇÃO - Chama o endpoint para limpar as mesas da reserva.
            // Note que o status NÃO é enviado aqui.
            const preparacaoPayload = {
              idRestaurante: idRestaurante,
              dataReserva: this.formatarDataParaAPI(currentReserva.data),
              horarioReserva: currentReserva.horario,
              idsMesas: [], // Ação principal: esvaziar a lista de mesas
              quantidadePessoasReserva: currentReserva.pessoas,
              comentariosPreferenciaReserva: currentReserva.preferencias,
            };

            this.reservasService.putAtualizarReserva(reservaId, preparacaoPayload).subscribe({
              next: () => {
                this.toastr.info("Mesas desassociadas. Atualizando status...");

                // PASSO 2: EXECUÇÃO FINAL - Agora que as mesas foram limpas, atualiza o status.
                this.reservasService.putAtualizarStatusReserva(reservaId, novoStatus).subscribe({
                  next: () => {
                    this.toastr.success("Reserva movida para a Lista de Espera com sucesso!");
                    
                    // Atualiza a UI
                    this.limparSelecao();
                    this.carregarReservas();
                    this.carregarReservasListaEspera();
                    this.selectedTabIndex = 1; // Muda para a aba correta
                    this.cdr.detectChanges();
                  },
                  error: (error) => {
                    // Erro no PASSO 2
                    const errorMessage = error.error?.erro || "Erro ao atualizar o status para Lista de Espera.";
                    this.toastr.error(errorMessage);
                    console.error("Erro no passo 2 (atualizar status):", error);
                    setTimeout(() => {
                      currentReserva.status = statusAnterior as any;
                      this.cdr.detectChanges();
                    }, 0);
                  }
                });
              },
              error: (error) => {
                // Erro no PASSO 1
                const errorMessage = error.error?.erro || "Erro ao desassociar mesas da reserva.";
                this.toastr.error(errorMessage);
                console.error("Erro no passo 1 (limpar mesas):", error);
                setTimeout(() => {
                  currentReserva.status = statusAnterior as any;
                  this.cdr.detectChanges();
                }, 0);
              }
            });
          } else {
            // Usuário clicou em "Não" no Swal
            setTimeout(() => {
              currentReserva.status = statusAnterior as any;
              this.cdr.detectChanges();
            }, 0);
          }
        });
      } else { // Lógica para outros status (PENDENTE, CONFIRMADA, ATIVA, CONCLUIDA, NAO_COMPARECEU)
        this.reservasService.putAtualizarStatusReserva(reservaId, novoStatus).subscribe({
          next: () => {
            this.toastr.success("Status da reserva atualizado com sucesso!");
            currentReserva.status = novoStatus as any; // Atualiza o status localmente para a reserva selecionada
            this.carregarReservas(); // Recarrega as reservas normais para garantir sincronia
            this.carregarReservasListaEspera(); // Recarrega a lista de espera (garante que, se algo saiu, volte ao normal)
            this.limparSelecao(); // Limpa a seleção para fechar os detalhes e forçar recarregamento
            this.selectedTabIndex = 0; // Garante que esteja na aba 'Reservas'
            this.cdr.detectChanges(); // Força a atualização da UI para a mudança de aba e status
          },
          error: (error) => {
            const errorMessage = error.error?.erro || "Erro ao atualizar status da reserva.";
            this.toastr.error(errorMessage);
            console.error("Erro ao atualizar status da reserva:", error);
            setTimeout(() => {
              currentReserva.status = statusAnterior as any;
              this.cdr.detectChanges();
            }, 0);
          },
        });
      }
    }
  }

  // Método auxiliar para formatar a data para o formato da API (YYYY-MM-DD)
  formatarDataParaAPI(data: Date): string {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  atualizarMesasReserva(novasMesas: string[]): void {
    if (this.reservaSelecionada) {
      const currentReserva = this.reservaSelecionada;
      const idRestaurante = this.authService.perfil?.id;

      currentReserva.mesaIds = novasMesas; // Atualiza localmente os IDs das mesas

      // Construir o payload para a API
      const updatePayload = {
        idRestaurante: idRestaurante, 
        dataReserva: this.formatarDataParaAPI(currentReserva.data),
        horarioReserva: currentReserva.horario,
        idsMesas: novasMesas, // Envia os novos IDs das mesas
        quantidadePessoasReserva: currentReserva.pessoas,
        comentariosPreferenciaReserva: currentReserva.preferencias
      };

      // Chamar a API para atualizar a reserva
      this.reservasService.putAtualizarReserva(currentReserva.id, updatePayload).subscribe({
        next: () => {
          this.toastr.success("Mesas da reserva atualizadas com sucesso!");
          // Recomendo recarregar as reservas para garantir que nomesMesas seja atualizado corretamente pelo backend
          this.carregarReservas();
        },
        error: (error) => {
          const errorMessage = error.error?.erro || "Erro ao atualizar mesas da reserva.";
          this.toastr.error(errorMessage);
          console.error("Erro ao atualizar mesas da reserva:", error);
          // Opcional: Reverter a seleção local das mesas em caso de erro
          // currentReserva.mesaIds = reservasOriginal.mesaIds; 
        }
      });

      // Removida a atualização local de nomesMesas, pois será recarregada pela API
      // currentReserva.nomesMesas = novasMesas.map(id => this.getMesaPorId(id)?.nome).filter(Boolean) as string[];
      
      this.atualizarStatusMesas(); // Mantém a atualização visual dos status das mesas no mapa
    }
  }

  getMesasDisponiveis(): IMesa[] {
    const mesasDisponiveis: IMesa[] = [];
    this.ambientes.forEach(ambiente => {
      mesasDisponiveis.push(...ambiente.mesas.filter(
        mesa => !mesa.ocupada || (this.reservaSelecionada && mesa.reservaId === this.reservaSelecionada.id)
      ));
    });
    return mesasDisponiveis;
  }

  getReservasParaCalendario(): any[] {
    return this.reservasParaCalendario.map((reserva) => ({
      id: reserva.id,
      clienteId: reserva.clienteId,
      cliente: reserva.cliente || "Cliente não encontrado",
      data: reserva.data,
      status: reserva.status,
      pessoas: reserva.pessoas,
    }));
  }

  selecionarDataDoCalendario(data: Date): void {
    // Cria um novo objeto Date para garantir que a data seja o início do dia no fuso horário local
    this.dataAtual = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    this.carregarReservas();
    this.limparSelecao();
    this.mostrarCalendario = false;
  }

  formatarDataSimples(data: Date): string {
    return data.toLocaleDateString("pt-BR")
  }

  getClienteNomeById(id: string): string {
    return '';
  }

  carregarAmbientes(): void {
    const idRestaurante = this.authService.perfil?.id;
    if (!idRestaurante) {
      this.toastr.error("ID do restaurante não encontrado. Faça o login.");
      return;
    }

    this.isLoading.ambientes = true;
    this.ambienteService.getListarAmbientes()
      .pipe(finalize(() => this.isLoading.ambientes = false))
      .subscribe({
        next: (data) => {
          this.ambientes = data;
          if (this.ambienteAtivo) {
            this.ambienteAtivo = this.ambientes.find(a => a.id === this.ambienteAtivo!.id) || null;
          }
          if (!this.ambienteAtivo && this.ambientes.length > 0) {
            this.ambienteAtivo = this.ambientes[0];
            this.selectedEnvironmentTabIndex = 0;
          }
          this.atualizarStatusMesasOcupadas();
          this.cdr.detectChanges();
        },
        error: () => this.toastr.error("Falha ao carregar os ambientes."),
      });
  }
  
  atualizarStatusMesasOcupadas(): void {
    // Primeiro, reseta o status de todas as mesas
    this.ambientes.forEach(ambiente => {
        ambiente.mesas.forEach(mesa => {
            mesa.ocupada = false;
            mesa.reservaId = undefined; // Limpa o ID da reserva
        });
    });

    // Agora, marca as mesas como ocupadas com base nas reservas carregadas para o dia
    this.reservas.forEach(reserva => {
        (reserva.mesaIds || []).forEach(idMesa => {
            const mesa = this.getMesaPorId(idMesa);
            if (mesa) {
                mesa.ocupada = true;
                mesa.reservaId = reserva.id; // Atribui o ID da reserva que a ocupa
            }
        });
    });
    this.cdr.detectChanges();
  }

  getAmbientePorMesa(mesaId: string): IAmbiente | undefined {
    return this.ambientes.find(ambiente => 
      ambiente.mesas.some(mesa => mesa.id === mesaId)
    );
  }

  getMesaIdPorNome(mesaNome: string): string | undefined {
    for (const ambiente of this.ambientes) {
      const mesa = ambiente.mesas.find(m => m.nome === mesaNome);
      if (mesa) return mesa.id;
    }
    return undefined;
  }

  carregarReservas(): void {
    const idRestaurante = this.authService.perfil?.id;
    if (!idRestaurante) {
      this.toastr.error("ID do restaurante não encontrado. Faça o login.");
      this.reservas = []; 
      this.aplicarFiltros();
      return;
    }

    this.isLoading.reservas = true;

    const ano = this.dataAtual.getFullYear();
    const mes = (this.dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const dia = this.dataAtual.getDate().toString().padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    this.reservasService.getReservasPorRestaurante(idRestaurante, dataFormatada)
      .pipe(finalize(() => this.isLoading.reservas = false))
      .subscribe({
        next: (response) => {
          this.reservas = response.map((reserva: any) => {
            const datePart = reserva.data.substring(0, 10);
            const parts = datePart.split('-'); 
            const dataReserva = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            
            // Popula mesaIds diretamente da lista de mesas da reserva (se disponível na resposta da API)
            const mesaIds = (reserva.mesas || []).map((mesaObj: any) => mesaObj.id);
            
            const imageUrl = this.authService.getAbsoluteImageUrl(reserva.imagemPerfilCliente);

            return {
              id: reserva.id,
              clienteId: reserva.idCliente,
              cliente: reserva.cliente,
              mesaIds: mesaIds, 
              data: dataReserva,
              horario: reserva.hora.substring(0, 5),
              periodo: this.determinarPeriodo(reserva.hora),
              pessoas: reserva.pessoas,
              status: this.mapearStatus(reserva.status),
              preferencias: reserva.observacoes,
              restaurante: reserva.restaurante,
              emailCliente: reserva.emailCliente,
              telefoneCliente: reserva.telefoneCliente,
              imagemPerfilCliente: imageUrl || undefined, // Use undefined to trigger nzIcon fallback
              nomesMesas: (reserva.mesas || []).map((mesaObj: any) => mesaObj.nome) // Popula nomesMesas diretamente da lista de objetos 'mesas'
            };
          });
          console.log('[ReservasComponent] Reservas carregadas e mapeadas:', this.reservas);
          this.atualizarStatusMesasOcupadas(); // Atualiza status de ocupação com base nas reservas carregadas
          this.aplicarFiltros();
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar reservas.');
          this.reservas = []; 
          this.aplicarFiltros(); 
        }
      });
  }

  private determinarPeriodo(hora: string): "Almoço" | "Jantar" {
    const horaNum = parseInt(hora.split(':')[0]);
    return horaNum >= 11 && horaNum <= 15 ? "Almoço" : "Jantar";
  }

  private mapearStatus(status: string): "PENDENTE" | "CONFIRMADA" | "ATIVA" | "LISTA_ESPERA" | "CANCELADA_RESTAURANTE" | "CONCLUIDA" | "NAO_COMPARECEU" {
    const statusUpper = status.toUpperCase();
    const statusMap: { [key: string]: any } = {
      'ATIVA': 'ATIVA',
      'PENDENTE': 'PENDENTE',
      'CANCELADA_CLIENTE': 'CANCELADA_RESTAURANTE',
      'CANCELADA_RESTAURANTE': 'CANCELADA_RESTAURANTE',
      'CONCLUIDA': 'CONCLUIDA',
      'NAO_COMPARECEU': 'NAO_COMPARECEU',
      'LISTA_ESPERA': 'LISTA_ESPERA',
      'CONFIRMADA': 'CONFIRMADA'
    };
    return statusMap[statusUpper] || 'PENDENTE';
  }

  // Nova função para abrir o calendário e carregar os dados
  abrirCalendario(): void {
    this.mostrarCalendario = true;
    this.carregarReservasParaCalendario(this.dataAtual);
  }

  carregarReservasParaCalendario(data: Date): void {
    const idRestaurante = this.authService.perfil?.id;
    if (!idRestaurante) {
      console.error("ID do restaurante não encontrado para calendário.");
      this.reservasParaCalendario = [];
      return;
    }

    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    this.isLoading.reservas = true; // Use existing isLoading for simplicity or create a new one

    this.reservasService.getReservasParaCalendario(idRestaurante, dataFormatada)
      .pipe(finalize(() => this.isLoading.reservas = false))
      .subscribe({
        next: (response) => {
          this.reservasParaCalendario = response.map((reserva: any) => {
            const mappedReserva = {
              id: reserva.id || uuidv4(), // Assuming id might be missing from calendar API
              clienteId: reserva.idCliente || '', // Assuming idCliente might be missing
              cliente: reserva.clienteNome,
              mesaIds: [],
              // Extrai a parte da data "YYYY-MM-DD" e então parseia como uma data local
              data: new Date(
                  parseInt(reserva.data.substring(0, 4)), // Ano
                  parseInt(reserva.data.substring(5, 7)) - 1, // Mês (0-indexed)
                  parseInt(reserva.data.substring(8, 10))  // Dia
              ),
              horario: reserva.hora || '00:00',
              periodo: this.determinarPeriodo(reserva.hora || '00:00'),
              pessoas: reserva.pessoas,
              status: this.mapearStatus(reserva.status),
              preferencias: reserva.observacoes || '',
              restaurante: reserva.restaurante || '',
              emailCliente: reserva.emailCliente || '',
              telefoneCliente: reserva.telefoneCliente || '',
              imagemPerfilCliente: this.authService.getAbsoluteImageUrl(reserva.imagemPerfilCliente) || undefined, // Updated here to use undefined
              nomesMesas: reserva.nomesMesas || []
            };
            console.log('[ReservasComponent] Reserva Calendário mapeada:', mappedReserva);
            return mappedReserva;
          });
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar reservas para calendário:', error);
          this.toastr.error('Erro ao carregar reservas para calendário.');
          this.reservasParaCalendario = [];
        }
      });
  }

  getStatusClasses(status: string): { [key: string]: boolean } {
    return {
      'status-confirmada': status === 'CONFIRMADA',
      'status-pendente': status === 'PENDENTE',
      'status-cancelada': status === 'CANCELADA_RESTAURANTE',
      'status-concluida': status === 'CONCLUIDA',
      'status-nao-compareceu': status === 'NAO_COMPARECEU',
      'status-ativa': status === 'ATIVA',
      'status-lista-espera': status === 'LISTA_ESPERA'
    };
  }

  // NOVO MÉTODO: Carregar Reservas da Lista de Espera
  carregarReservasListaEspera(): void {
    const idRestaurante = this.authService.perfil?.id;
    if (!idRestaurante) {
      this.toastr.error("ID do restaurante não encontrado para lista de espera. Faça o login.");
      this.reservasEspera = [];
      this.aplicarFiltrosEspera();
      return;
    }

    this.isLoading.reservas = true; // Reutiliza o indicador de loading para reservas

    this.reservasService.getReservasListaEspera(idRestaurante)
      .pipe(finalize(() => this.isLoading.reservas = false))
      .subscribe({
        next: (response) => {
          this.reservasEspera = response.map((reserva: any) => {
            const datePart = reserva.data.substring(0, 10);
            const parts = datePart.split('-'); 
            const dataReserva = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            
            const mesaIds = (reserva.mesas || []).map((mesaObj: any) => mesaObj.id); // Simplificado para usar diretamente o ID
    
            const imageUrl = this.authService.getAbsoluteImageUrl(reserva.imagemPerfilCliente);
    
            const mappedReserva = {
              id: reserva.id,
              clienteId: reserva.idCliente,
              cliente: reserva.cliente,
              mesaIds: mesaIds, 
              data: dataReserva,
              horario: reserva.hora.substring(0, 5), // Corrigido para 'hora' como na amostra
              periodo: this.determinarPeriodo(reserva.hora), // Corrigido para 'hora'
              pessoas: reserva.pessoas,
              status: this.mapearStatus(reserva.status),
              preferencias: reserva.observacoes, // Corrigido para 'observacoes'
              restaurante: reserva.restaurante,
              emailCliente: reserva.emailCliente,
              telefoneCliente: reserva.telefoneCliente,
              imagemPerfilCliente: imageUrl || undefined, // Use undefined to trigger nzIcon fallback
              nomesMesas: (reserva.mesas || []).map((mesa: any) => mesa.nome) // Popula nomesMesas da lista de objetos 'mesas'
            };
            console.log('[ReservasComponent] Reserva Lista de Espera mapeada:', mappedReserva);
            return mappedReserva;
          });
          this.aplicarFiltrosEspera(); // Aplica filtros após carregar os dados
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar reservas da lista de espera.');
          this.reservasEspera = [];
          this.aplicarFiltrosEspera();
        }
      });
  }

  /**
   * Remove o foco do gatilho do menu quando o menu é fechado.
   * Isso corrige um bug no mobile onde o menu não fecha ao clicar fora.
   */
  onMenuClosed(event: any): void {
    // Usa setTimeout para garantir que o blur aconteça após o menu fechar
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.blur) {
        activeElement.blur();
      }
    }, 0);
  }
}