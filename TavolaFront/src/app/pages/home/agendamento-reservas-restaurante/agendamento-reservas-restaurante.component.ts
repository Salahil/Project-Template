import { Component, type OnInit, ViewChild, ElementRef, type AfterViewInit, HostListener, LOCALE_ID, OnDestroy, Inject, ChangeDetectorRef } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { RestauranteService } from "../../../core/services/restaurante.service"
import { MapsService } from "../../../core/services/maps.service"
import { CommonModule, registerLocaleData, CurrencyPipe } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterLink } from "@angular/router"
import { GoogleMapsModule } from "@angular/google-maps"
import { GoogleMap } from "@angular/google-maps"
import localePt from "@angular/common/locales/pt"
import { GlobalSpinnerService } from "../../../core/services/global-spinner.service"
import { IRestaurante } from '../../../Interfaces/IRestaurante.interface';
import { CardapioService } from '../../../core/services/cardapio.service';
import { ReservasService } from '../../../core/services/reservas.service';
import { environment } from '../../../../environments/environment';
import { ReservaConfirmadaDialogComponent , DialogDataReservaConfirmada} from "./reserva-confirmada-dialog/reserva-confirmada-dialog.component"
import { ReservaDialogComponent, ReservaDialogData } from "./reserva-dialog/reserva-dialog.component"

// Registrar locale português
registerLocaleData(localePt)

// Angular Material
import { MatIconModule } from "@angular/material/icon"
import { MatTabsModule } from "@angular/material/tabs"
import { MatButtonModule } from "@angular/material/button"
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialog } from '@angular/material/dialog'
import { AvaliacaoDialogComponent, type AvaliacaoDialogData } from '../../avaliacao-dialog/avaliacao-dialog.component'
import { NotificacoesService, type Notificacao } from '../../../core/services/notificacoes.service'
import { AuthService } from '../../../core/services/auth.service'
import { AvaliacaoService, type AvaliacoesRestaurante, type AvaliacaoCliente } from '../../../core/services/avaliacao.service'

// NG-Zorro
import { NzGridModule } from "ng-zorro-antd/grid"
import { NzImageModule } from "ng-zorro-antd/image"
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb"
import { NzTagModule } from "ng-zorro-antd/tag"
import { NzTypographyModule } from "ng-zorro-antd/typography"
import { NzSpaceModule } from "ng-zorro-antd/space"
import { NzButtonModule } from "ng-zorro-antd/button"
import { NzRateModule } from "ng-zorro-antd/rate"
import { NzTabsModule } from "ng-zorro-antd/tabs"
import { NzCardModule } from "ng-zorro-antd/card"
import { NZ_ICONS } from "ng-zorro-antd/icon"
import { NzDatePickerModule } from "ng-zorro-antd/date-picker"
import { NzSelectModule } from "ng-zorro-antd/select"
import { NzFormModule } from "ng-zorro-antd/form"
import { NzModalModule } from "ng-zorro-antd/modal"
import { NzIconModule } from "ng-zorro-antd/icon"
import { NzDividerModule } from "ng-zorro-antd/divider"
import { NzCollapseModule } from "ng-zorro-antd/collapse"
import { NzToolTipModule } from "ng-zorro-antd/tooltip"
import { NzDrawerModule } from "ng-zorro-antd/drawer"
import { NzCalendarModule } from "ng-zorro-antd/calendar"
import { NzBadgeModule } from "ng-zorro-antd/badge"
import { NzAvatarModule } from "ng-zorro-antd/avatar"
import { NzCommentModule } from "ng-zorro-antd/comment"
import { NzListModule } from "ng-zorro-antd/list"
import { NzEmptyModule } from "ng-zorro-antd/empty"
import { NzMessageService } from "ng-zorro-antd/message"
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
  CloseOutline,
} from "@ant-design/icons-angular/icons"

const icons: IconDefinition[] = [
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
  CloseOutline,
]

@Component({
  selector: "app-agendamento-reservas-restaurante",
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    GoogleMapsModule,

    // Angular Material
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,

    // NG-Zorro
    NzBreadCrumbModule,
    NzTagModule,
    NzTypographyModule,
    NzIconModule,
    NzSpaceModule,
    NzGridModule,
    NzImageModule,
    NzButtonModule,
    NzRateModule,
    NzTabsModule,
    NzCardModule,
    NzDatePickerModule,
    NzSelectModule,
    NzFormModule,
    NzModalModule,
    NzDividerModule,
    NzCollapseModule,
    NzToolTipModule,
    NzDrawerModule,
    NzCalendarModule,
    NzBadgeModule,
    NzAvatarModule,
    NzCommentModule,
    NzListModule,
    NzEmptyModule,

    GoogleMap,
  ],
  templateUrl: "./agendamento-reservas-restaurante.component.html",
  styleUrls: ["./agendamento-reservas-restaurante.component.scss"],
})
export class AgendamentoReservasRestauranteComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("tabsContainer") tabsContainer!: ElementRef
  @ViewChild("categoriasScrollContainer") categoriasScrollContainer!: ElementRef
  @ViewChild("categoriasNavContainer") categoriasNavContainer!: ElementRef

  restaurante: IRestaurante | null = null
  isFavorite = false
  isGalleryVisible = false
  isHorariosVisible = false
  isDietOptionsVisible = false
  activeTabIndex = 0
  tabFixo = false
  copiado = false

  // Propriedades para navegação de categorias
  mostrarSetaEsquerda = false
  mostrarSetaDireita = false
  scrollAmount = 200
  categoriasFixas = false

  // Propriedades do sistema de reservas
  bookingStep = 1 // 1: Data, 2: Horário, 3: Pessoas, 4: Confirmação
  selectedDate: Date = new Date()
  selectedTime = ""
  selectedGuests = 2
  availableSlots: any[] = []
  selectedComments = ""
  bookingData: any = null

  // Properties for loading spinner
  isLoading = true

  // Propriedades do mapa e rotas
  center: any = { lat: -16.6869, lng: -49.2648 }
  zoom = 15
  markerPosition: any = { lat: -16.6869, lng: -49.2648 }
  markerOptions: any = {
    draggable: false,
    icon: {
      url: "assets/png/restaurant-marker.png",
      scaledSize: new google.maps.Size(40, 40),
    },
  }
  mapOptions: any = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  }

  // Propriedades para rotas
  directionsResult: google.maps.DirectionsResult | null = null
  directionsOptions: google.maps.DirectionsRendererOptions = {
    suppressMarkers: false,
    polylineOptions: {
      strokeColor: "#F6BD38",
      strokeWeight: 5,
      strokeOpacity: 0.8,
    },
  }
  carregandoRota = false
  userLocation: google.maps.LatLngLiteral | null = null

  // Imagens principais para a galeria
  restaurantImages: string[] = []

  // Todas as imagens para o modal de galeria
  allImages: string[] = []
  totalPhotos = 0

  // Horários de funcionamento
  horariosFuncionamento: { diaSemana: string; abertura: string; fechamento: string }[] = []

  // Recursos e serviços
  recursos: { nome: string; icone: string }[] = []

  // Propriedades do menu
  itensMenu: any[] = []
  categorias: string[] = []
  dietOptions: string[] = []
  categoriaAtiva = "Destaques"

  // Propriedades das avaliações
  avaliacoesData: AvaliacoesRestaurante | null = null
  carregandoAvaliacoes = false

  restauranteId!: string
  public isMobile = false

  // --- PROPRIEDADES PARA O DIALOG MOBILE ---
  isReservaDialogVisible = false // Controla o dialog
  proximosDiasDisponiveis: Date[] = [] // Array para os botões de data
  // --- FIM DAS PROPRIEDADES ---

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    private restauranteService: RestauranteService,
    private mapsService: MapsService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private router: Router,
    private spinnerService: GlobalSpinnerService,
    private cardapioService: CardapioService,
    private reservasService: ReservasService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private notificacoesService: NotificacoesService,
    private authService: AuthService,
    private avaliacaoService: AvaliacaoService
  ) {}
  public agendamentoId: string | null = null;
  public agendamentoDetails: any; // Replace 'any' with a proper interface

  // Dicionário para exibir o nome do dia da semana em português
  private readonly DIAS_PT: { [key: string]: string } = {
    'DOMINGO': 'Domingo',
    'SEGUNDA': 'Segunda-feira',
    'TERCA': 'Terça-feira',
    'QUARTA': 'Quarta-feira',
    'QUINTA': 'Quinta-feira',
    'SEXTA': 'Sexta-feira',
    'SABADO': 'Sábado',
  };

  servicosComIcone = [
    { nome: "Wi-Fi gratuito", icone: "wifi" },
    { nome: "Aceita cartões", icone: "credit_card" },
    { nome: "Acessível para cadeirantes", icone: "accessible" },
    { nome: "Estacionamento", icone: "local_parking" },
    { nome: "Ideal para crianças", icone: "child_friendly" },
    { nome: "Música ao vivo", icone: "music_note" },
    { nome: "Permite animais", icone: "pets" },
    { nome: "Valet (serviço de manobrista)", icone: "hail" },
    { nome: "Ar-condicionado", icone: "ac_unit" },
    { nome: "Bar completo", icone: "local_bar" },
    { nome: "Área externa", icone: "deck" },
  ];

  ngOnInit() {
    this.agendamentoId = this.route.snapshot.paramMap.get('id');
    if (this.agendamentoId) {
      // Example: Fetch data using this.agendamentoId and restaurante.service
      // this.restauranteService.getAgendamentoById(this.agendamentoId).subscribe(details => {
      //   this.agendamentoDetails = details;
      // });
      console.log('Agendamento ID:', this.agendamentoId);
    } else {
      console.error('Agendamento ID not found in route parameters.');
      // Handle missing ID, perhaps navigate away or show an error
    }

    // Garante que o scroll está no topo ao entrar na tela
    window.scrollTo(0, 0)
    // Também garante que o router-container está no topo
    setTimeout(() => {
      const routerContainer = document.querySelector('.router-container');
      if (routerContainer) {
        routerContainer.scrollTo(0, 0);
      }
    }, 0);
    this.selectedDate = new Date()
    this.selectedDate.setHours(0, 0, 0, 0) // Zerando hora para evitar problemas na comparação
    
    // Verificar query parameters para pré-preencher dados
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.selectedDate = new Date(params['data'])
        this.bookingStep = 2 // Avança para horário se data foi fornecida
      }
      if (params['horario']) {
        this.selectedTime = params['horario']
        this.bookingStep = 3 // Avança para pessoas se horário foi fornecido
      }
      if (params['pessoas']) {
        this.selectedGuests = parseInt(params['pessoas'])
        this.bookingStep = 4 // Avança para confirmação se pessoas foram fornecidas
      }
      if (params['comentarios']) {
        this.selectedComments = params['comentarios']
      }
      
      // Verificar se deve abrir o dialog de avaliação
      if (params['verificarNotificacao'] === 'true' && this.restauranteId) {
        this.verificarEAbrirDialogAvaliacao()
      }
    })
    
    this.checkMobile();
    this.route.params.subscribe(params => {
      this.restauranteId = params['id']
      if (this.restauranteId) {
        this.carregarDadosRestaurante()
      }
    })
    this.carregarItensMenu()
    this.generateAvailableSlots()
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  ngAfterViewInit() {
    // Garante que o scroll está no topo após a view ser inicializada
    window.scrollTo(0, 0)
    const routerContainer = document.querySelector('.router-container');
    if (routerContainer) {
      routerContainer.scrollTo(0, 0);
    }
    
    setTimeout(() => {
      if (this.tabsContainer) {
        this.checkTabPosition()
      }
      this.verificarSetas()
    }, 100)
  }

  private checkTabPosition(): void {
    if (!this.tabsContainer) return
    const tabsPosition = this.tabsContainer.nativeElement.getBoundingClientRect().top
    this.tabFixo = tabsPosition <= 0
  }

  // Métodos do sistema de reservas
  setBookingStep(step: number): void {
    if (step <= this.bookingStep || step === 1) {
      this.bookingStep = step
    }
  }

  // Função auxiliar para comparar só a parte da data (dia, mês, ano)
  private isSameDate(d1: Date, d2: Date): boolean {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
  }

  onDateSelect(date: Date): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Data selecionada:", date);
    console.log("Data atual selecionada no componente:", this.selectedDate);
    console.log("Hoje:", today);

    if (date < today) {
      this.message.error("Não é possível selecionar uma data anterior a hoje.");
      return;
    }

    this.selectedDate = date;
    this.bookingStep = 2; // Avança para a etapa de horário
    this.generateAvailableSlots();
  }

  onTimeSelect(time: string): void {
    this.selectedTime = time
    this.bookingStep = 3
  }

  onGuestsSelect(guests: number): void {
    this.selectedGuests = guests
    this.bookingStep = 4
    this.prepareBookingData()
  }

  goBackStep(): void {
    if (this.bookingStep > 1) {
      this.bookingStep--
    }
  }

  resetBooking(): void {
    this.bookingStep = 1
    this.selectedDate = new Date()
    this.selectedTime = ""
    this.selectedGuests = 2
    this.selectedComments = ""
    this.bookingData = null
  }

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (current && current < today) || !this.isDiaHabilitado(current);
  }

  // Método para mostrar como chegar - simplificado
  async mostrarComoChegar(): Promise<void> {
    this.carregandoRota = true
    try {
      const destino = this.markerPosition || this.center;
      await this.mapsService.mostrarRotaNoGoogleMaps(destino)
      this.message.success("Abrindo rota no Google Maps...")
    } catch (error) {
      this.message.error("Erro ao abrir a rota")
    } finally {
      this.carregandoRota = false
    }
  }

  generateAvailableSlots(): void {
    const diasSemana = ['DOMINGO','SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA','SABADO'];
    const diaApi = diasSemana[this.selectedDate.getDay()];
    const horariosDoDia = (this.horariosFuncionamento || []).filter(h => h.diaSemana === diaApi);
    this.availableSlots = horariosDoDia.map(horario => {
      return {
        period: `${horario.abertura} - ${horario.fechamento}`,
        slots: this.generateTimeSlots(horario.abertura, horario.fechamento, 15)
      };
    });
  }

  generateTimeSlots(start: string, end: string, intervalMinutes: number): any[] {
    const slots = []
    const startTime = this.timeToMinutes(start)
    const endTime = this.timeToMinutes(end)

    for (let time = startTime; time <= endTime; time += intervalMinutes) {
      const timeString = this.minutesToTime(time)
      slots.push({
        time: timeString,
        availability: 'available',
        percentage: null,
      })
    }

    return slots
  }

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }

  getFormattedDate(): string {
    return this.selectedDate.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
    })
  }

  carregarDadosRestaurante(): void {
    this.spinnerService.mostrar(0)
    this.isLoading = true
    this.restauranteService.findById(this.restauranteId).subscribe({
      next: (restaurante: IRestaurante) => {
        this.restaurante = restaurante
        // Imagens: garantir pelo menos 4
        let imgs = restaurante.imagens && restaurante.imagens.length > 0
          ? restaurante.imagens.map(img => this.getImagemCompleta(img))
          : []
        while (imgs.length < 4) imgs.push('assets/jpg/restauranteModelo.jpg');
        this.restaurantImages = imgs.slice(0, 5); // até 5 para o botão de galeria
        this.allImages = [...imgs];
        this.totalPhotos = imgs.length > 4 ? imgs.length - 4 : 0
        // Horários de funcionamento ordenados
        this.horariosFuncionamento = this.ordenarHorarios(restaurante.horariosFuncionamento || [])
        this.selectedDate = new Date(this.selectedDate);
        // Serviços
        this.recursos = (restaurante.servicos || []).map(nome => {
          const found = this.servicosComIcone.find(s => s.nome === nome);
          return { nome, icone: found?.icone || 'check_circle' };
        });
        // Centralizar mapa pelo endereço formatado
        this.atualizarLocalizacaoMapa();
        // --- CHAMA AS NOVAS FUNÇÕES ---
        this.generateAvailableSlots(); // Gera slots para a data atual
        this.calcularProximosDiasDisponiveis(); // Calcula os próximos 7 dias
        // --- FIM DA CHAMADA ---
        this.isFavorite = restaurante.favorito ?? false;
        this.isLoading = false
        this.spinnerService.ocultar()
        
        // Após carregar o restaurante, verifica se deve abrir o dialog de avaliação
        this.route.queryParams.subscribe(qParams => {
          if (qParams['verificarNotificacao'] === 'true') {
            // Aguarda um pouco para garantir que tudo foi carregado
            setTimeout(() => {
              this.verificarEAbrirDialogAvaliacao()
            }, 300)
          }
        })
      },
      error: (error: any) => {
        console.error('Erro ao carregar dados do restaurante:', error)
        this.isLoading = false
        this.spinnerService.ocultar()
        this.message.error('Não foi possível determinar a localização exata do restaurante a partir do endereço.')
      }
    })
  }

  gerarImagens(): void {
    const baseImage = "assets/jpg/Comida.jpg"
    this.allImages = [...this.restaurantImages]

    for (let i = 0; i < 15; i++) {
      this.allImages.push(baseImage)
    }

    this.totalPhotos = this.allImages.length - 4
  }

  toggleFavorite() {
    if (!this.restauranteId) return;
    this.restauranteService.favoritarRestaurante(this.restauranteId).subscribe({
      next: () => {
        this.isFavorite = !this.isFavorite;
        this.message.success(this.isFavorite ? 'Adicionado aos favoritos!' : 'Removido dos favoritos!');
      },
      error: () => {
        this.message.error('Erro ao favoritar restaurante.');
      }
    });
  }

  openGallery() {
    if (this.restaurantImages.length > 4) {
      this.isGalleryVisible = true
    }
  }

  closeGallery() {
    this.isGalleryVisible = false
  }

  openHorarios() {
    this.isHorariosVisible = true
  }

  closeHorarios() {
    this.isHorariosVisible = false
  }

  openDietOptions(): void {
    this.isDietOptionsVisible = true
  }

  closeDietOptions(): void {
    this.isDietOptionsVisible = false
  }

  onTabChange(index: number): void {
    this.activeTabIndex = index;
    if (index === 1) {
      this.carregarItensMenu();
    }
    if (index === 2) {
      this.carregarAvaliacoes();
    }
  }

  copiarEndereco(): void {
    const endereco = this.getEnderecoFormatado()
    if (endereco) {
      navigator.clipboard.writeText(endereco).then(() => {
        this.copiado = true
        setTimeout(() => {
          this.copiado = false
        }, 2000)
      }).catch(err => console.error('Erro ao copiar:', err))
    }
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    this.checkTabPosition()
    this.checkCategoriasPosition()
  }

  private checkCategoriasPosition(): void {
    if (this.activeTabIndex !== 1 || !this.categoriasNavContainer) return

    const categoriasNavRect = this.categoriasNavContainer.nativeElement.getBoundingClientRect()
    const shouldBeFixed = categoriasNavRect.top <= 48

    if (shouldBeFixed !== this.categoriasFixas) {
      this.categoriasFixas = shouldBeFixed
    }

    this.categorias.forEach((categoria) => {
      const section = document.getElementById("categoria-" + categoria.toLowerCase().replace(" ", "-"))
      if (!section) return

      const rect = section.getBoundingClientRect()
      if (rect.top <= 150 && rect.bottom >= 150) {
        if (this.categoriaAtiva !== categoria) {
          this.categoriaAtiva = categoria
          if (this.categoriasFixas && this.categoriasScrollContainer) {
            this.centralizarCategoriaAtiva()
          }
        }
      }
    })

    this.verificarSetas()
  }

  carregarItensMenu(): void {
    if (!this.restauranteId) return;
    this.cardapioService.listarItensPorRestaurante(this.restauranteId).subscribe({
      next: (itens) => {
        this.itensMenu = itens;
        // Categorias dinâmicas
        this.categorias = Array.from(new Set(itens.map(i => typeof i.categoria === 'string' ? i.categoria : i.categoria?.nome)));
        // Opções dietéticas dinâmicas
        this.dietOptions = Array.from(new Set(itens.flatMap(i => (i.tags || []).map((t: any) => typeof t === 'string' ? t : t.tag))));
      },
      error: () => {
        this.itensMenu = [];
        this.categorias = [];
        this.dietOptions = [];
      }
    });
  }

  getItensPorCategoria(categoria: string): any[] {
    return this.itensMenu.filter((item) => item.categoria === categoria)
  }

  selecionarCategoria(categoria: string): void {
    this.categoriaAtiva = categoria

    const element = document.getElementById("categoria-" + categoria.toLowerCase().replace(" ", "-"))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }

    this.centralizarCategoriaAtiva()
  }

  verificarSetas(): void {
    if (!this.categoriasScrollContainer) return

    const container = this.categoriasScrollContainer.nativeElement

    this.mostrarSetaDireita =
      container.scrollWidth > container.clientWidth &&
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    this.mostrarSetaEsquerda = container.scrollLeft > 10
  }

  scrollCategorias(direcao: "left" | "right"): void {
    if (!this.categoriasScrollContainer) return

    const container = this.categoriasScrollContainer.nativeElement
    const scrollAtual = container.scrollLeft

    if (direcao === "left") {
      container.scrollLeft = Math.max(0, scrollAtual - this.scrollAmount)
    } else {
      container.scrollLeft = Math.min(container.scrollWidth - container.clientWidth, scrollAtual + this.scrollAmount)
    }

    setTimeout(() => {
      this.verificarSetas()
    }, 300)
  }

  centralizarCategoriaAtiva(): void {
    if (!this.categoriasScrollContainer) return

    const container = this.categoriasScrollContainer.nativeElement
    const buttons = container.querySelectorAll(".categoria-btn")

    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent.trim() === this.categoriaAtiva) {
        const button = buttons[i]
        const containerWidth = container.clientWidth
        const buttonLeft = button.offsetLeft
        const buttonWidth = button.offsetWidth

        const scrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        })

        break
      }
    }
  }

  onCategoriaScroll(event: Event): void {
    this.verificarSetas()
  }

  @HostListener("window:resize", ["$event"])
  onResize(event?: Event): void {
    this.checkMobile();
    this.verificarSetas();
    this.checkTabPosition();
  }

  prepareBookingData(): void {
    this.bookingData = {
      date: this.selectedDate,
      time: this.selectedTime,
      guests: this.selectedGuests,
      restaurant: this.restaurante?.nome,
      formattedDate: this.getFormattedDate(),
      comments: this.selectedComments,
    }
  }

  finalizarReserva(): void {
    if (!this.selectedDate || !this.selectedTime || !this.selectedGuests) {
      this.message.error('Por favor, selecione a data, horário e número de pessoas.');
      return;
    }
    this.spinnerService.mostrar(0);
    const reservaData = {
      idRestaurante: this.restauranteId,
      dataReserva: this.selectedDate.toISOString().split('T')[0],
      horarioReserva: this.selectedTime,
      quantidadePessoasReserva: this.selectedGuests,
      comentariosPreferenciaReserva: this.selectedComments
    };
    this.reservasService.postCriarReserva(reservaData).subscribe({
      next: () => {
        this.spinnerService.ocultar();
        this.fecharDialogReserva(); // Fecha o dialog após sucesso
        this.abrirDialogSucesso(reservaData);
        this.resetBooking(); // Limpa o formulário para uma nova reserva
      },
      error: () => {
        this.spinnerService.ocultar();
        this.message.error('Erro ao criar reserva.');
      }
    });
  }

  abrirDialogSucesso(dadosReserva: any): void {
    const dialogData: DialogDataReservaConfirmada = {
      nomeRestaurante: this.restaurante?.nome || 'Restaurante',
      endereco: this.getEnderecoFormatado(),
      data: dadosReserva.dataReserva,
      horario: dadosReserva.horarioReserva,
      quantidadePessoas: dadosReserva.quantidadePessoasReserva,
      comentarios: dadosReserva.comentariosPreferenciaReserva // Passe os comentários para o diálogo
    };

    const dialogRef = this.dialog.open(ReservaConfirmadaDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.message.success('Reserva realizada com sucesso!');
      this.resetBooking();
      this.router.navigate(['/home']);
    });
  }


  checkIfFavorite(): void {
    // Implementação simples mock: apenas alterna a propriedade isFavorite.
    // Para uma implementação real, você verificaria em uma lista de IDs favoritos.
    console.log('Verificando se restaurante é favorito (mock)')
    // Mantendo a propriedade isFavorite como um boolean simples por enquanto.
  }

  ngOnDestroy(): void {
    console.log('Componente AgendamentoReservasRestauranteComponent sendo destruído.')
  }

  // Função para exibir endereço formatado
  getEnderecoFormatado(): string {
    if (!this.restaurante?.endereco) return '';
    const e = this.restaurante.endereco;
    let partes = [e.rua, e.numero, e.bairro, e.cidade, e.estado, e.cep, e.complemento];
    return partes.filter(Boolean).join(', ');
  }

  // Função para exibir endereço resumido (rua, cidade - estado)
  getEnderecoResumido(): string {
    if (!this.restaurante?.endereco) return '';
    const e = this.restaurante.endereco;
    let partes = [e.rua, e.numero, e.cidade, e.estado];
    return partes.filter(Boolean).join(', ');
  }

  // Função para exibir preço médio
  getPrecoMedio(): number {
    return this.restaurante?.valorMedioPorPessoa ?? 0;
  }

  // Função para exibir nome do dia da semana em PT
  getDiaSemanaPt(dia: string): string {
    return this.DIAS_PT[dia] || dia;
  }

  // Função para exibir descrição com quebra de linha
  getDescricaoFormatada(): string {
    return this.restaurante?.descricao || '';
  }

  // Função para desabilitar dias no calendário que não estão em horariosFuncionamento
  isDiaHabilitado = (date: Date): boolean => {
    if (!this.horariosFuncionamento || this.horariosFuncionamento.length === 0) return false;
    const diasSemana = ['DOMINGO','SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA','SABADO'];
    const diaApi = diasSemana[date.getDay()];
    return this.horariosFuncionamento.some(h => h.diaSemana === diaApi);
  }

  // Ordena os horários de funcionamento por ordem dos dias da semana
  ordenarHorarios(horarios: { diaSemana: string; abertura: string; fechamento: string }[]): any[] {
    const ordem = ['DOMINGO','SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA','SABADO'];
    return horarios.slice().sort((a, b) => ordem.indexOf(a.diaSemana) - ordem.indexOf(b.diaSemana));
  }

  // Função para agrupar horários por dia e período (almoço/jantar)
  getHorariosPorDia(): any[] {
    // Agrupa por diaSemana e retorna todos os períodos daquele dia
    const diasSemana = ['DOMINGO','SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA','SABADO'];
    return diasSemana.map(dia => {
      const horarios = (this.horariosFuncionamento || []).filter(h => h.diaSemana === dia);
      return horarios.length > 0 ? { dia, horarios } : null;
    }).filter(Boolean);
  }

  // Atualizar localização do mapa após carregar restaurante
   private atualizarLocalizacaoMapa(): void {
    const enderecoStr = this.getEnderecoFormatado(); // Usa sua função que já formata o endereço
    if (enderecoStr) {
      this.mapsService.getCoordinatesFromAddress(enderecoStr).subscribe({
        next: coords => {
          // Atualiza o centro do mapa e a posição do marcador
          this.center = { lat: coords.lat, lng: coords.lng };
          this.markerPosition = this.center;
        },
        error: () => {
          // Fallback: Se a API do Google falhar, tenta usar coordenadas do banco de dados se existirem
          if (this.restaurante?.coordenadas) {
            this.center = {
              lat: this.restaurante.coordenadas.latitude,
              lng: this.restaurante.coordenadas.longitude,
            };
            this.markerPosition = this.center;
          } else {
             this.message.error('Não foi possível determinar a localização exata do restaurante a partir do endereço.');
          }
        }
      });
    }
  }

  getImagemCompleta(imagem: string): string {
    if (!imagem) return 'assets/jpg/Comida.jpg';
    if (imagem.startsWith('http')) return imagem;
    return `${environment.apiUrl}${imagem}`;
  }

  /**
   * Carrega as avaliações do restaurante
   */
  carregarAvaliacoes(): void {
    if (!this.restauranteId) return;
    
    // Evita carregar novamente se já carregou
    if (this.avaliacoesData !== null) return;

    this.carregandoAvaliacoes = true;
    this.avaliacaoService.getAvaliacoesPorRestaurante(this.restauranteId).subscribe({
      next: (data: AvaliacoesRestaurante) => {
        this.avaliacoesData = data;
        this.carregandoAvaliacoes = false;
      },
      error: (error) => {
        console.error('Erro ao carregar avaliações:', error);
        this.message.error('Erro ao carregar avaliações');
        this.carregandoAvaliacoes = false;
      }
    });
  }

  /**
   * Obtém o avatar do cliente ou retorna o padrão
   */
  getAvatarCliente(imagemCliente: string | null): string {
    if (!imagemCliente) {
      return 'assets/png/avatar-padrao-tavola-cordeirinho.png';
    }
    if (imagemCliente.startsWith('http')) {
      return imagemCliente;
    }
    return `${environment.apiUrl}${imagemCliente}`;
  }

  /**
   * Calcula a porcentagem para o círculo de progresso (0-100)
   */
  calcularPorcentagemNota(nota: number): number {
    // Converte de 0-5 para 0-100
    return (nota / 5) * 100;
  }

  /**
   * Calcula o stroke-dasharray para o círculo de progresso
   */
  calcularStrokeDasharray(nota: number): string {
    // Circunferência do círculo: 2 * π * raio (52) = ~326.73
    const circunferencia = 2 * Math.PI * 52;
    const porcentagem = this.calcularPorcentagemNota(nota);
    const preenchido = (porcentagem / 100) * circunferencia;
    // Retorna "preenchido circunferencia" para criar o efeito de progresso
    return `${preenchido} ${circunferencia}`;
  }

  /**
   * Retorna o texto da avaliação baseado na nota
   */
  getTextoAvaliacao(media: number): string {
    if (media >= 4.5) return 'Excelente';
    if (media >= 4.0) return 'Muito Bom';
    if (media >= 3.5) return 'Bom';
    if (media >= 3.0) return 'Regular';
    if (media >= 2.5) return 'Ruim';
    return 'Péssimo';
  }

  /**
   * Formata a data da reserva para exibição
   */
  formatarDataReserva(dataReserva: string): string {
    if (!dataReserva) return '';
    
    // Se a data vier no formato DD/MM/YYYY, converte para Date
    if (dataReserva.includes('/')) {
      const partes = dataReserva.split('/');
      if (partes.length === 3) {
        // Formato: DD/MM/YYYY -> converte para YYYY-MM-DD
        const dia = partes[0].padStart(2, '0');
        const mes = partes[1].padStart(2, '0');
        const ano = partes[2];
        const data = new Date(`${ano}-${mes}-${dia}T00:00:00`);
        
        if (!isNaN(data.getTime())) {
          return data.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        }
      }
    }
    
    // Tenta parse padrão
    const data = new Date(dataReserva + 'T00:00:00');
    if (!isNaN(data.getTime())) {
      return data.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    
    return dataReserva; // Retorna a string original se não conseguir fazer parse
  }

  // --- NOVAS FUNÇÕES PARA O DRAWER MOBILE ---

  /**
   * Calcula os próximos 7 dias disponíveis para reserva.
   */
  private calcularProximosDiasDisponiveis(): void {
    const dias: Date[] = [];
    let hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera a hora para comparação

    // Itera pelos próximos 7 dias (ou mais, se quiser)
    for (let i = 0; i < 7; i++) {
      let proximoDia = new Date(); // Começa de 'hoje' (com hora atual)
      proximoDia.setDate(proximoDia.getDate() + i);
      proximoDia.setHours(0, 0, 0, 0); // Zera para o isDiaHabilitado
      
      // Usa a função isDiaHabilitado para verificar se o restaurante abre
      if (this.isDiaHabilitado(proximoDia)) {
        dias.push(proximoDia);
      }
    }
    this.proximosDiasDisponiveis = dias;
  }

  /**
   * Abre o dialog de reserva (mobile) começando na etapa de escolha de data.
   */
  abrirDialogReservaEscolha(): void {
    this.bookingStep = 1;
    this.isReservaDialogVisible = true;
    
    const dialogData: ReservaDialogData = {
      selectedDate: this.selectedDate,
      selectedTime: this.selectedTime,
      selectedGuests: this.selectedGuests,
      selectedComments: this.selectedComments,
      availableSlots: this.availableSlots,
      disabledDate: this.disabledDate,
      isLoading: this.isLoading,
      restauranteNome: this.restaurante?.nome || 'Restaurante'
    };

    const dialogRef = this.dialog.open(ReservaDialogComponent, {
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      panelClass: ['reserva-dialog-mobile'],
      hasBackdrop: false, // Remove o backdrop cinza
      position: {
        top: '0',
        left: '0'
      },
      data: {
        ...dialogData,
        onDateSelectCallback: (date: Date) => {
          this.selectedDate = date;
          this.generateAvailableSlots();
          // Atualiza os slots no dialog
          if (dialogRef && dialogRef.componentInstance) {
            dialogRef.componentInstance.atualizarSlots(this.availableSlots);
          }
        }
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isReservaDialogVisible = false;
      if (result) {
        this.selectedDate = result.selectedDate;
        this.selectedTime = result.selectedTime;
        this.selectedGuests = result.selectedGuests;
        this.selectedComments = result.selectedComments;
        this.bookingStep = 4;
        this.prepareBookingData();
        this.finalizarReserva();
      }
    });
  }

  /**
   * Fecha o dialog de reserva (mobile).
   */
  fecharDialogReserva(): void {
    this.isReservaDialogVisible = false;
  }

  /**
   * Formata a data para os botões do footer (Ex: Ter. 05)
   */
  formatarDataBotao(data: Date): { diaSemana: string, dia: string } {
    const dia = data.toLocaleDateString('pt-BR', { day: '2-digit' });
    // Capitaliza a primeira letra da semana
    let diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' });
    diaSemana = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1).replace('.', '');
    
    return { diaSemana, dia };
  }
  
  // --- FIM DAS NOVAS FUNÇÕES ---

  /**
   * Verifica se há notificação pendente para este restaurante e abre o dialog de avaliação
   */
  private verificarEAbrirDialogAvaliacao(): void {
    if (!this.restauranteId) {
      console.warn('Restaurante ID não disponível para verificar notificação')
      return
    }

    // Busca as notificações
    this.notificacoesService.getNotificacoes().subscribe({
      next: (notificacoes: Notificacao[]) => {
        // Encontra a notificação correspondente ao restauranteId da URL
        const notificacao = notificacoes.find(n => n.restauranteId === this.restauranteId)
        
        if (notificacao) {
          // Usa o nome do restaurante carregado, ou o nome da notificação como fallback
          const nomeRestaurante = this.restaurante?.nome || notificacao.nomeRestaurante || 'Restaurante'
          
          // Abre o dialog de avaliação com os dados da notificação
          const dialogData: AvaliacaoDialogData = {
            restauranteId: notificacao.restauranteId, // Usa o restauranteId da notificação
            nomeRestaurante: nomeRestaurante,
            dataReserva: notificacao.dataReserva,
            idNotificacao: notificacao.id // ID para deletar após envio
          }

          const dialogRef = this.dialog.open(AvaliacaoDialogComponent, {
            data: dialogData,
            width: '500px',
            maxWidth: '90vw',
            disableClose: false,
          })

          dialogRef.afterClosed().subscribe((result) => {
            if (result && result.success) {
              console.log('Avaliação enviada com sucesso')
              // Remove o parâmetro da URL após envio
              this.router.navigate(['/home/agendamento-reservas-restaurante', this.restauranteId], {
                replaceUrl: true
              })
            }
          })
        } else {
          console.log('Nenhuma notificação encontrada para este restaurante')
        }
      },
      error: (error) => {
        console.error('Erro ao buscar notificações:', error)
      }
    })
  }
}