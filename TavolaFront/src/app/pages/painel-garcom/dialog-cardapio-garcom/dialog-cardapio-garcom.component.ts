import { Component, Inject, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClient } from '@angular/common/http';
import { PainelGarcomService, PedidoItem } from '../../../core/services/painel-garcom.service';
import { CardapioService } from '../../../core/services/cardapio.service';
import { AuthService } from '../../../core/services/auth.service';
import { PedidosService, ItemPedidoAddRequest } from '../../../core/services/pedidos.service';
import { IItemCardapio } from '../../../Interfaces/IItem-cardapio';
import { environment } from '../../../../environments/environment';

export interface DialogCardapioData {
  mesaId: string;
  mesaNome?: string; // Nome da mesa para exibição
  pedidoId?: string; // Se for para adicionar a um pedido existente
}

interface CardapioItem {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria: string;
  imagem?: string;
  imagemOriginal?: string; // URL relativa original da API
  tags?: string[];
  quantidade?: number; // Para o carrinho
  observacao?: string; // Para observações do item no pedido
}

interface CardapioCategoria {
  nome: string;
  itens: CardapioItem[];
}

@Component({
  selector: 'app-dialog-cardapio-garcom',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NzImageModule,
    NzIconModule
  ],
  templateUrl: './dialog-cardapio-garcom.component.html',
  styleUrls: ['./dialog-cardapio-garcom.component.scss']
})
export class DialogCardapioGarcomComponent implements OnInit, AfterViewInit {
  // Referências aos elementos do HTML para controle de scroll e sticky
  @ViewChild('categoriasScrollContainer') categoriasScrollContainer!: ElementRef;
  @ViewChild('categoriasNavContainer') categoriasNavContainer!: ElementRef;
  // Referência ao conteúdo do diálogo para o listener de scroll
  @ViewChild(MatDialogContent) dialogContent!: MatDialogContent; 

  categorias: CardapioCategoria[] = [];
  carrinho: CardapioItem[] = [];
  isLoading = false;
  isMobile = false; // Detecta se está em mobile
  
  // Estado da navegação
  categoriaAtiva: string = ''; // Inicia vazio ou com a primeira categoria
  categoriasFixas = false;
  mostrarSetaEsquerda = false;
  mostrarSetaDireita = false;
  scrollAmount = 200; // Pixels para rolar as categorias
  
  private cardapioService = inject(CardapioService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private pedidosService = inject(PedidosService);
  
  constructor(
    public dialogRef: MatDialogRef<DialogCardapioGarcomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogCardapioData,
    private painelGarcomService: PainelGarcomService
  ) {}
  
  ngOnInit(): void {
    // Detecta se está em mobile
    this.isMobile = window.innerWidth <= 768;

    // Carrega o cardápio da API
    this.carregarCardapio();
    
    // Se estiver editando um pedido, carrega os itens existentes
    if (this.data.pedidoId) {
      this.carregarItensExistentes();
    }
  }

  private carregarCardapio(): void {
    this.isLoading = true;
    this.cardapioService.listarItens().subscribe({
      next: (itens: IItemCardapio[]) => {
        // Agrupa os itens por categoria
        const categoriasMap = new Map<string, CardapioItem[]>();
        
        itens.forEach(item => {
          // A categoria pode vir como string ou objeto { nome: string }
          let categoriaNome: string;
          if (typeof item.categoria === 'string') {
            categoriaNome = item.categoria || 'Outros';
          } else if (item.categoria?.nome) {
            categoriaNome = item.categoria.nome;
          } else {
            categoriaNome = 'Outros';
          }
          
          // Armazena a imagem original (relativa) antes de processar
          const imagemOriginal = item.imagem;
          
          // Converte a imagem para URL absoluta se necessário (para exibição)
          let imagemUrl = item.imagem;
          if (imagemUrl && !imagemUrl.startsWith('http') && !imagemUrl.startsWith('assets/') && !imagemUrl.startsWith('data:')) {
            imagemUrl = this.authService.getAbsoluteImageUrl(imagemUrl);
          }
          
          const cardapioItem: CardapioItem = {
            id: item.id || '',
            nome: item.nome,
            descricao: item.descricao,
            preco: item.preco,
            categoria: categoriaNome,
            imagem: imagemUrl, // URL absoluta para exibição
            imagemOriginal: imagemOriginal, // URL relativa original para a API
            tags: item.tags?.map(t => typeof t === 'string' ? t : t.tag) || []
          };
          
          if (!categoriasMap.has(categoriaNome)) {
            categoriasMap.set(categoriaNome, []);
          }
          categoriasMap.get(categoriaNome)!.push(cardapioItem);
        });
        
        // Converte o Map para array de categorias e ordena
        this.categorias = Array.from(categoriasMap.entries())
          .map(([nome, itens]) => ({
            nome,
            itens
          }))
          .sort((a, b) => {
            // "Outros" sempre vai para o final
            if (a.nome === 'Outros') return 1;
            if (b.nome === 'Outros') return -1;
            // Demais categorias em ordem alfabética
            return a.nome.localeCompare(b.nome);
          });
        
        // Define a primeira categoria como ativa inicialmente
        if (this.categorias.length > 0) {
          this.categoriaAtiva = this.categorias[0].nome;
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar cardápio:', error);
        this.isLoading = false;
        // Em caso de erro, mantém categorias vazias
        this.categorias = [];
      }
    });
  }

  ngAfterViewInit(): void {
    // Garante que as setas sejam verificadas após a renderização inicial
    setTimeout(() => this.verificarSetas(), 100);
  }
  
  adicionarItem(item: CardapioItem): void {
    // Lógica para adicionar ao this.carrinho
    const itemExistente = this.carrinho.find(i => i.id === item.id);
    if (itemExistente) {
      itemExistente.quantidade = (itemExistente.quantidade || 1) + 1;
    } else {
      this.carrinho.push({ ...item, quantidade: 1 });
    }
  }
  
  removerItem(itemId: string): void {
    this.carrinho = this.carrinho.filter(item => item.id !== itemId);
  }
  
  ajustarQuantidade(itemId: string, quantidade: number): void {
    const item = this.carrinho.find(i => i.id === itemId);
    if (item) {
      if (quantidade <= 0) {
        this.removerItem(itemId);
      } else {
        item.quantidade = quantidade;
      }
    }
  }
  
  getTotalCarrinho(): number {
    return this.carrinho.reduce((total, item) => total + (item.preco * (item.quantidade || 1)), 0);
  }
  
  getQuantidadeItem(itemId: string): number {
    const item = this.carrinho.find(i => i.id === itemId);
    return item?.quantidade || 0; // Retorna 0 se não estiver no carrinho
  }

  getTotalItensCarrinho(): number {
    return this.carrinho.reduce((total, item) => total + (item.quantidade || 0), 0);
  }
  
  finalizarPedido(): void {
    if (this.carrinho.length === 0) {
      return;
    }
    
    const restauranteId = this.pedidosService.getRestauranteId();
    
    if (!restauranteId) {
      console.error('RestauranteId não encontrado');
      return;
    }
    
    this.isLoading = true;
    
    // Se tiver pedidoId, faz PUT para adicionar itens ao pedido existente
    if (this.data.pedidoId) {
      this.adicionarItensAoPedido(restauranteId);
    } else {
      // Senão, faz POST para criar novo pedido
      this.criarNovoPedido(restauranteId);
    }
  }

  private adicionarItensAoPedido(restauranteId: string): void {
    // Prepara o payload no formato esperado pela API
    const itens: ItemPedidoAddRequest[] = this.carrinho.map(item => {
      // Calcula o valor total do item
      const valorTotalItem = (item.preco || 0) * (item.quantidade || 1);
      
      // Usa a imagem original (relativa) se disponível, senão usa a processada
      const imagemUrl = item.imagemOriginal || item.imagem || '';
      
      return {
        cardapioItemId: item.id,
        nome: item.nome,
        valorUnitario: item.preco || 0,
        quantidade: item.quantidade || 1,
        observacao: item.observacao || '',
        imagemUrl: imagemUrl,
        valorTotalItem: valorTotalItem
      };
    });
    
    this.pedidosService.adicionarItensAoPedido(restauranteId, this.data.pedidoId!, itens)
      .subscribe({
        next: (response) => {
          console.log('Itens adicionados ao pedido com sucesso:', response);
          this.isLoading = false;
          this.dialogRef.close({ sucesso: true, pedido: response });
        },
        error: (error) => {
          console.error('Erro ao adicionar itens ao pedido:', error);
          this.isLoading = false;
          this.dialogRef.close({ sucesso: false, erro: error });
        }
      });
  }

  private criarNovoPedido(restauranteId: string): void {
    // Prepara o payload do pedido
    const payload = {
      clienteId: '', // Pode ser vazio se não houver cliente específico
      itens: this.carrinho.map(item => ({
        cardapioItemId: item.id,
        quantidade: item.quantidade || 1,
        observacao: item.observacao || ''
      }))
    };
    
    // Faz o POST do pedido
    const url = `${environment.apiUrl}/auth/api/restaurantes/${restauranteId}/pedidos/${this.data.mesaId}/salvar`;
    
    this.http.post(url, payload).subscribe({
      next: (response) => {
        console.log('Pedido criado com sucesso:', response);
        this.isLoading = false;
        this.dialogRef.close({ sucesso: true, pedido: response });
      },
      error: (error) => {
        console.error('Erro ao criar pedido:', error);
        this.isLoading = false;
        // Ainda fecha o dialog, mas pode mostrar uma mensagem de erro se necessário
        this.dialogRef.close({ sucesso: false, erro: error });
      }
    });
  }
  
  fechar(): void {
    this.dialogRef.close();
  }

  private carregarItensExistentes(): void {
    // Busca o pedido existente no serviço
    const pedidos = this.painelGarcomService.getPedidosAtuais();
    const pedido = pedidos.find(p => p.id === this.data.pedidoId);
    
    if (pedido && pedido.itens) {
      // Mapeia os itens do pedido para o formato do carrinho
      // Precisamos aguardar o cardápio carregar para ter as informações completas
      this.cardapioService.listarItens().subscribe({
        next: (itensCardapio: IItemCardapio[]) => {
          // Cria um mapa dos itens do cardápio por ID para busca rápida
          const cardapioMap = new Map<string, IItemCardapio>();
          itensCardapio.forEach(item => {
            if (item.id) {
              cardapioMap.set(item.id, item);
            }
          });
          
          // Mapeia os itens do pedido para o formato do carrinho
          this.carrinho = pedido.itens.map(itemPedido => {
            // Busca o item completo no cardápio
            const itemCardapio = cardapioMap.get(itemPedido.id);
            
            // Determina a categoria
            let categoriaNome = 'Outros';
            if (itemCardapio) {
              if (typeof itemCardapio.categoria === 'string') {
                categoriaNome = itemCardapio.categoria || 'Outros';
              } else if (itemCardapio.categoria?.nome) {
                categoriaNome = itemCardapio.categoria.nome;
              }
            }
            
            // Processa a imagem
            const imagemOriginal = itemCardapio?.imagem || '';
            let imagemUrl = imagemOriginal;
            if (imagemUrl && !imagemUrl.startsWith('http') && !imagemUrl.startsWith('assets/') && !imagemUrl.startsWith('data:')) {
              imagemUrl = this.authService.getAbsoluteImageUrl(imagemUrl);
            }
            
            return {
              id: itemPedido.id,
              nome: itemPedido.nome,
              descricao: itemCardapio?.descricao || '',
              preco: itemPedido.preco,
              categoria: categoriaNome,
              imagem: imagemUrl,
              imagemOriginal: imagemOriginal,
              tags: itemCardapio?.tags?.map(t => typeof t === 'string' ? t : t.tag) || [],
              quantidade: itemPedido.quantidade,
              observacao: itemPedido.observacoes || ''
            };
          });
        },
        error: (error) => {
          console.error('Erro ao carregar cardápio para mapear itens existentes:', error);
          // Em caso de erro, ainda tenta mapear com os dados básicos do pedido
          this.carrinho = pedido.itens.map(itemPedido => ({
            id: itemPedido.id,
            nome: itemPedido.nome,
            descricao: '',
            preco: itemPedido.preco,
            categoria: 'Outros',
            imagem: '',
            imagemOriginal: '',
            tags: [],
            quantidade: itemPedido.quantidade,
            observacao: itemPedido.observacoes || ''
          }));
        }
      });
    }
  }

  // === MÉTODOS PARA NAVEGAÇÃO DE CATEGORIAS (Copiados e Adaptados) ===

  // Listener para o scroll DENTRO do MatDialogContent
  onDialogScroll(event: Event): void {
    this.checkCategoriasPosition(event.target as HTMLElement);
  }

  // Verifica se a barra de categorias deve ficar sticky
  private checkCategoriasPosition(scrollableElement: HTMLElement): void {
    if (!this.categoriasNavContainer) return;

    const navContainerTop = this.categoriasNavContainer.nativeElement.getBoundingClientRect().top;
    // O 'top' de referência agora é o topo do DIÁLOGO (geralmente 0 ou próximo)
    const dialogTop = scrollableElement.getBoundingClientRect().top; 
    
    // Fica fixo se o topo da barra de navegação atingir o topo do conteúdo do diálogo
    const shouldBeFixed = navContainerTop <= dialogTop; 

    if (shouldBeFixed !== this.categoriasFixas) {
      this.categoriasFixas = shouldBeFixed;
    }

    // Lógica para destacar a categoria ativa durante o scroll
    let foundActive = false;
    for (const categoria of this.categorias) {
      const section = document.getElementById("categoria-" + this.getCategoriaId(categoria.nome));
      if (!section) continue;

      const rect = section.getBoundingClientRect();
      // Ajusta o 'top' de referência (ex: 80px abaixo do topo do dialog content)
      const referenceTop = dialogTop + 80; 

      if (rect.top <= referenceTop && rect.bottom >= referenceTop) {
        if (this.categoriaAtiva !== categoria.nome) {
          this.categoriaAtiva = categoria.nome;
          this.centralizarCategoriaAtiva(); // Tenta centralizar ao mudar
        }
        foundActive = true;
        break; // Para na primeira categoria visível
      }
    }
    // Se nenhuma seção está na posição de referência (ex: no topo ou fundo do scroll), mantém a última ativa
    // Ou define a primeira se estiver no topo absoluto
    if (!foundActive && scrollableElement.scrollTop === 0 && this.categorias.length > 0) {
         this.categoriaAtiva = this.categorias[0].nome;
         this.centralizarCategoriaAtiva();
    }

    this.verificarSetas(); // Verifica as setas após o scroll
  }

  // Verifica se as setas de scroll da categoria devem ser mostradas
  verificarSetas(): void {
    if (!this.categoriasScrollContainer) return;
    const container = this.categoriasScrollContainer.nativeElement;
    // Pequena tolerância para evitar flickering
    this.mostrarSetaEsquerda = container.scrollLeft > 5; 
    this.mostrarSetaDireita = container.scrollWidth > container.clientWidth && 
                              container.scrollLeft < (container.scrollWidth - container.clientWidth - 5);
  }

  // Rola a barra de categorias
  scrollCategorias(direcao: "left" | "right"): void {
    if (!this.categoriasScrollContainer) return;
    const container = this.categoriasScrollContainer.nativeElement;
    const scrollValue = direcao === "left" ? -this.scrollAmount : this.scrollAmount;
    container.scrollBy({ left: scrollValue, behavior: "smooth" });
    // Verifica as setas após um pequeno delay para o scroll terminar
    setTimeout(() => this.verificarSetas(), 300); 
  }

  // Rola o CONTEÚDO do diálogo até a categoria clicada
  selecionarCategoria(categoriaNome: string): void {
    this.categoriaAtiva = categoriaNome;

    const elementId = "categoria-" + this.getCategoriaId(categoriaNome);
    const element = document.getElementById(elementId);
    
    if (element) {
       // Usa scrollIntoView como alternativa mais simples
       const offset = this.categoriasFixas ? (this.categoriasNavContainer?.nativeElement.offsetHeight || 60) : 0;
       
       element.scrollIntoView({
         behavior: "smooth",
         block: "start",
         inline: "nearest"
       });
       
       // Ajusta a posição após o scroll
       setTimeout(() => {
         window.scrollBy(0, -offset - 16);
       }, 100);
    }

    this.centralizarCategoriaAtiva(); // Centraliza o botão da categoria clicada na barra
  }

  // Centraliza o BOTÃO da categoria ativa na barra de navegação
  centralizarCategoriaAtiva(): void {
    if (!this.categoriasScrollContainer) return;
    const container = this.categoriasScrollContainer.nativeElement;
    // Encontra o botão ativo
    const activeButton = container.querySelector('.categoria-btn.active') as HTMLElement; 
    if (!activeButton) return;

    const containerWidth = container.clientWidth;
    const buttonLeft = activeButton.offsetLeft;
    const buttonWidth = activeButton.offsetWidth;

    // Calcula a posição para centralizar o botão
    const scrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);

    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    // Reverifica as setas após centralizar
    setTimeout(() => this.verificarSetas(), 300);
  }

  // Listener para scroll DENTRO da barra de categorias
  onCategoriaScroll(event: Event): void {
    this.verificarSetas();
  }

  // Helper para criar IDs válidos a partir dos nomes das categorias
  getCategoriaId(nome: string): string {
    return nome.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // Listener para resize da janela (útil para as setas)
  @HostListener("window:resize")
  onResize(): void {
    this.isMobile = window.innerWidth <= 768;
    this.verificarSetas();
  }

  // Método para tratar erro de carregamento de imagem
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/jpg/placeholder-comida.jpg';
    }
  }
}
