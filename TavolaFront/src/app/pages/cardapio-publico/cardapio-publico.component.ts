// cardapio-publico.component.ts
import {
  Component,
  type OnInit,
  inject,
  ViewChild,
  type ElementRef,
  type AfterViewInit,
  HostListener,
} from "@angular/core"
import { CommonModule, CurrencyPipe } from "@angular/common"
import { ActivatedRoute } from "@angular/router"
import { CardapioService } from "../../core/services/cardapio.service"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { NzImageModule } from "ng-zorro-antd/image"
import { NzEmptyModule } from "ng-zorro-antd/empty"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatSelectModule } from "@angular/material/select"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatMenuModule } from "@angular/material/menu"
import { MatTooltipModule } from "@angular/material/tooltip"
import { FormsModule } from "@angular/forms"
import { NzIconModule } from "ng-zorro-antd/icon"
import { NzDrawerModule } from "ng-zorro-antd/drawer"
import { environment } from "../../../environments/environment"

interface ItemCardapioPublico {
  id?: string
  nome: string
  descricao?: string
  preco: number
  imagem?: string
  disponivel: boolean
  categoria: string | { nome: string }
  tags: string[]
}

interface CategoriaComItens {
  nome: string
  itens: ItemCardapioPublico[]
}

interface CardapioPublicoResponse {
  nomeRestaurante: string
  imagemRestaurante?: string
  cardapio: ItemCardapioPublico[]
}

@Component({
  selector: "app-cardapio-publico",
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatProgressSpinnerModule,
    NzImageModule,
    NzEmptyModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTooltipModule,
    FormsModule,
    NzIconModule,
    NzDrawerModule,
  ],
  templateUrl: "./cardapio-publico.component.html",
  styleUrls: ["./cardapio-publico.component.scss"],
})
export class CardapioPublicoComponent implements OnInit, AfterViewInit {
  @ViewChild("categoriasScrollContainer") categoriasScrollContainer!: ElementRef
  @ViewChild("categoriasNavContainer") categoriasNavContainer!: ElementRef

  private route = inject(ActivatedRoute)
  private cardapioService = inject(CardapioService)

  restauranteId: string | null = null
  itensMenu: ItemCardapioPublico[] = []
  itensMenuFiltrados: ItemCardapioPublico[] = []
  categorias: CategoriaComItens[] = []
  categoriasFiltradas: CategoriaComItens[] = []
  isLoading = true
  hasError = false
  nomeRestaurante = "Cardápio"
  imagemRestaurante: string | null = null

  // Propriedades para busca e filtros
  pesquisa = ""
  categoriaFiltro = ""
  tagFiltro: string[] = []
  apenasDisponiveis = false
  tagsDisponiveis: string[] = []
  dietOptions: string[] = []

  // Propriedades para navegação de categorias
  categoriaAtiva = ""
  mostrarSetaEsquerda = false
  mostrarSetaDireita = false
  categoriasFixas = false
  scrollAmount = 200

  // Propriedades para drawer de opções dietéticas
  isDietOptionsVisible = false

  // Propriedade para detectar mobile
  public isMobile = false

  ngOnInit(): void {
    this.checkMobile()
    window.scrollTo(0, 0)
    this.restauranteId = this.route.snapshot.paramMap.get("idRestaurante")
    if (this.restauranteId) {
      this.carregarCardapio()
    } else {
      console.error("ID do restaurante não encontrado na URL.")
      this.isLoading = false
      this.hasError = true
    }
  }

  carregarCardapio(): void {
    this.isLoading = true
    this.hasError = false
    this.cardapioService.listarItensPublicos(this.restauranteId!).subscribe({
      next: (response) => {
        this.nomeRestaurante = response.nomeRestaurante || "Cardápio"
        // Corrigir o caminho da imagem do restaurante
        if (response.imagemRestaurante) {
          this.imagemRestaurante = this.getImagemCompleta(response.imagemRestaurante)
        } else {
          this.imagemRestaurante = null
        }

        this.itensMenu = (response.cardapio || []).map(
          (item) =>
            ({
              ...item,
              categoria:
                typeof item.categoria === "string" ? item.categoria : (item.categoria as any)?.nome || "Outros",
              tags: this.processarTags(item.tags),
              imagem: this.getImagemCompleta(item.imagem),
            }) as ItemCardapioPublico,
        )

        // Extrair tags únicas para filtros e opções dietéticas
        this.extrairTagsDisponiveis()
        this.agruparPorCategoria()
        this.aplicarFiltros()
        this.isLoading = false

        // Definir primeira categoria como ativa
        if (this.categorias.length > 0) {
          this.categoriaAtiva = this.categorias[0].nome
        }
      },
      error: (err) => {
        console.error("Erro ao carregar cardápio:", err)
        this.isLoading = false
        this.hasError = true
      },
    })
  }

  processarTags(tags: any): string[] {
    if (!tags) return []
    if (Array.isArray(tags)) {
      return tags.map((tag) => (typeof tag === "string" ? tag : tag.tag || tag))
    }
    return []
  }

  agruparPorCategoria(): void {
    const grupos: { [key: string]: ItemCardapioPublico[] } = {}
    this.itensMenu.forEach((item) => {
      if (item.disponivel !== false) {
        const nomeCategoria =
          typeof item.categoria === "string" ? item.categoria : (item.categoria as any)?.nome || "Outros"
        if (!grupos[nomeCategoria]) {
          grupos[nomeCategoria] = []
        }
        grupos[nomeCategoria].push(item)
      }
    })
    this.categorias = Object.keys(grupos)
      .sort()
      .map((nome) => ({ nome, itens: grupos[nome] }))
  }

  extrairTagsDisponiveis(): void {
    const tagsSet = new Set<string>()
    this.itensMenu.forEach((item) => {
      if (item.tags) {
        item.tags.forEach((tag) => {
          if (tag) {
            tagsSet.add(tag)
          }
        })
      }
    })
    this.tagsDisponiveis = Array.from(tagsSet).sort()
    this.dietOptions = Array.from(tagsSet).sort()
  }

  aplicarFiltros(): void {
    let itensFiltrados = [...this.itensMenu]

    // Filtrar por texto de pesquisa
    if (this.pesquisa.trim() !== "") {
      const termoPesquisa = this.pesquisa.toLowerCase().trim()
      itensFiltrados = itensFiltrados.filter((item) => {
        const categoriaNome = typeof item.categoria === "string" ? item.categoria : (item.categoria as any)?.nome || ""
        return (
          item.nome.toLowerCase().includes(termoPesquisa) ||
          item.descricao?.toLowerCase().includes(termoPesquisa) ||
          categoriaNome.toLowerCase().includes(termoPesquisa) ||
          (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(termoPesquisa)))
        )
      })
    }

    // Filtrar por categoria
    if (this.categoriaFiltro !== "") {
      itensFiltrados = itensFiltrados.filter((item) => item.categoria === this.categoriaFiltro)
    }

    // Filtrar por tags
    if (this.tagFiltro.length > 0) {
      itensFiltrados = itensFiltrados.filter(
        (item) => item.tags && item.tags.some((tag) => this.tagFiltro.includes(tag)),
      )
    }

    this.itensMenuFiltrados = itensFiltrados

    // Atualizar categorias com itens filtrados
    const grupos: { [key: string]: ItemCardapioPublico[] } = {}
    this.itensMenuFiltrados.forEach((item) => {
      if (item.disponivel !== false) {
        const nomeCategoria =
          typeof item.categoria === "string" ? item.categoria : (item.categoria as any)?.nome || "Outros"
        if (!grupos[nomeCategoria]) {
          grupos[nomeCategoria] = []
        }
        grupos[nomeCategoria].push(item)
      }
    })
    this.categoriasFiltradas = Object.keys(grupos)
      .sort()
      .map((nome) => ({ nome, itens: grupos[nome] }))
  }

  aplicarFiltrosSemFechar(): void {
    this.aplicarFiltros()
  }

  limparPesquisa(): void {
    this.pesquisa = ""
    this.aplicarFiltros()
  }

  limparFiltros(): void {
    this.pesquisa = ""
    this.categoriaFiltro = ""
    this.tagFiltro = []
    this.aplicarFiltros()
  }

  getItensPorCategoria(categoria: string): ItemCardapioPublico[] {
    const categoriaFiltrada = this.categoriasFiltradas.find((c) => c.nome === categoria)
    return categoriaFiltrada ? categoriaFiltrada.itens : []
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
      if (buttons[i].textContent?.trim() === this.categoriaAtiva) {
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

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    this.checkCategoriasPosition()
  }

  private checkCategoriasPosition(): void {
    if (!this.categoriasNavContainer) return
    const categoriasNavRect = this.categoriasNavContainer.nativeElement.getBoundingClientRect()
    const shouldBeFixed = categoriasNavRect.top <= 48
    if (shouldBeFixed !== this.categoriasFixas) {
      this.categoriasFixas = shouldBeFixed
    }
    this.categoriasFiltradas.forEach((categoria) => {
      const section = document.getElementById("categoria-" + categoria.nome.toLowerCase().replace(" ", "-"))
      if (!section) return
      const rect = section.getBoundingClientRect()
      if (rect.top <= 150 && rect.bottom >= 150) {
        if (this.categoriaAtiva !== categoria.nome) {
          this.categoriaAtiva = categoria.nome
          if (this.categoriasFixas && this.categoriasScrollContainer) {
            this.centralizarCategoriaAtiva()
          }
        }
      }
    })
    this.verificarSetas()
  }

  @HostListener("window:resize", ["$event"])
  onResize(event?: Event): void {
    this.checkMobile()
    this.verificarSetas()
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.verificarSetas()
    }, 100)
  }

  openDietOptions(): void {
    this.isDietOptionsVisible = true
  }

  closeDietOptions(): void {
    this.isDietOptionsVisible = false
  }

  onMenuClosed(event: any): void {
    // Remove o foco do gatilho do menu quando o menu é fechado
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement
      if (activeElement && activeElement.blur) {
        activeElement.blur()
      }
    }, 0)
  }

  getImagemCompleta(imagem: string | undefined | null): string {
    const placeholder = "assets/jpg/placeholder-comida.jpg"
    if (!imagem || imagem.trim() === "") return placeholder
    if (imagem.startsWith("http") || imagem.startsWith("data:")) return imagem
    // Garante que a imagem comece com / se não começar
    const imagemPath = imagem.startsWith("/") ? imagem : `/${imagem}`
    return `${environment.apiUrl}${imagemPath}`
  }

  getTagName(tag: string): string {
    return tag
  }
}
