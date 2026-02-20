import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CardapioService } from '../../core/services/cardapio.service';
import { IItemCardapio } from '../../Interfaces/IItem-cardapio';
import { ICategoriaComItens } from '../../Interfaces/ICategoriaComItens.interface';
import { DialogItemCardapioComponent } from './dialog-item-cardapio/dialog-item-cardapio.component';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro-cardapio',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './cadastro-cardapio.component.html',
  styleUrls: ['./cadastro-cardapio.component.scss']
})
export class CadastroCardapioComponent implements OnInit {
  private service = inject(CardapioService);
  private dialog  = inject(MatDialog);
  private toastr = inject(ToastrService);

  itens: IItemCardapio[] = [];
  defaultImg = 'assets/png/placeholder.png';
  isLoading = false;

  categorias = [
    { id: '1', nome: 'Entradas' },
    { id: '2', nome: 'Acompanhamento' },
    { id: '3', nome: 'Pratos Principais' },
    { id: '4', nome: 'Sobremesas' },
    { id: '5', nome: 'Bebidas' }
  ];

  categoriasComItens: ICategoriaComItens[] = [];
  categoriasComItensFiltradas: ICategoriaComItens[] = [];

  mensagemSucesso = '';
  pesquisa = '';
  categoriaFiltro = '';
  tagFiltro: string[] = [];
  apenasDisponiveis = false;
  tagsDisponiveis: string[] = [];
  public isMobile = false;

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.checkMobile();
  }

  ngOnInit() {
    this.carregarItens();
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  // ... dentro da classe CadastroCardapioComponent

  // Propriedade para verificar se todas as categorias estão vazias
  public get todasCategoriasVazias(): boolean {
    // Se o array principal não existir ou estiver vazio, consideramos que está "vazio".
    if (!this.categoriasComItens || this.categoriasComItens.length === 0) {
      return true;
    }
    
    // A mesma lógica que você tinha, agora dentro do componente.
    return this.categoriasComItens.every(cat => cat.itens.length === 0);
  }

  // Propriedade para verificar se todas as categorias filtradas estão vazias
  public get todasCategoriasFiltradasVazias(): boolean {
    if (!this.categoriasComItensFiltradas || this.categoriasComItensFiltradas.length === 0) {
      return true;
    }
    
    return this.categoriasComItensFiltradas.every(cat => cat.itens.length === 0);
  }

  // Método para aplicar filtros
  aplicarFiltros(): void {
    let itensFiltrados = [...this.itens];

    // Filtrar por texto de pesquisa
    if (this.pesquisa.trim() !== '') {
      const termoPesquisa = this.pesquisa.toLowerCase().trim();
      itensFiltrados = itensFiltrados.filter(item => 
        item.nome.toLowerCase().includes(termoPesquisa) ||
        item.descricao?.toLowerCase().includes(termoPesquisa) ||
        this.getCategoriaNome(item.categoria).toLowerCase().includes(termoPesquisa) ||
        (item.tags && item.tags.some(tag => 
          (typeof tag === 'string' ? tag : tag.tag)?.toLowerCase().includes(termoPesquisa)
        ))
      );
    }

    // Filtrar por categoria
    if (this.categoriaFiltro !== '') {
      itensFiltrados = itensFiltrados.filter(item => 
        this.getCategoriaNome(item.categoria) === this.categoriaFiltro
      );
    }

    // Filtrar por tags
    if (this.tagFiltro.length > 0) {
      itensFiltrados = itensFiltrados.filter(item => 
        item.tags && item.tags.some(tag => 
          this.tagFiltro.includes(typeof tag === 'string' ? tag : tag.tag)
        )
      );
    }

    // Filtrar apenas disponíveis
    if (this.apenasDisponiveis) {
      itensFiltrados = itensFiltrados.filter(item => item.disponivel);
    }

    // Atualizar categorias com itens filtrados
    this.categoriasComItensFiltradas = this.categorias.map(cat => ({
      ...cat,
      itens: itensFiltrados.filter(item => this.getCategoriaNome(item.categoria) === cat.nome)
    }));
  }

  // Método para aplicar filtros sem fechar o menu
  aplicarFiltrosSemFechar(): void {
    this.aplicarFiltros();
    // Previne que o menu feche ao selecionar um item
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.closest('.filter-menu-content')) {
        // Mantém o foco dentro do menu
        return;
      }
    }, 0);
  }

  // Método para limpar pesquisa
  limparPesquisa(): void {
    this.pesquisa = '';
    this.aplicarFiltros();
  }

  // Método para limpar todos os filtros
  limparFiltros(): void {
    this.pesquisa = '';
    this.categoriaFiltro = '';
    this.tagFiltro = [];
    this.apenasDisponiveis = false;
    this.aplicarFiltros();
  }


  private carregarItens() {
    this.service.listarItens().subscribe({
      next: (itens) => {
        this.itens = itens.map(item => ({
          ...item,
          categoria: typeof item.categoria === 'string'
            ? { nome: item.categoria }
            : item.categoria,
          tags: (item.tags || []).map((t: any) =>
            typeof t === 'string' ? { tag: t } : t
          ),
          imagem: item.imagem && !item.imagem.startsWith('http') && !item.imagem.startsWith('data:')
            ? `${environment.apiUrl}${item.imagem}`
            : item.imagem
        }));
        
        // Extrair tags únicas para filtros
        this.extrairTagsDisponiveis();
        this.atualizarCategoriasComItens();
        this.aplicarFiltros(); // Inicializar filtros
      },
      error: (erro) => {
        console.warn('Nenhum item carregado ou erro no backend:', erro);
        this.itens = [];
        this.tagsDisponiveis = [];
        this.atualizarCategoriasComItens();
        this.aplicarFiltros(); // Inicializar filtros
      }
    });
  }

  // Helper para obter o nome da categoria de forma segura
  private getCategoriaNome(categoria: string | { nome: string } | undefined): string {
    if (!categoria) return '';
    if (typeof categoria === 'string') return categoria;
    return categoria.nome || '';
  }

  // Helper para obter o nome da tag de forma segura (para uso no template)
  getTagNome(tag: string | { tag: string }): string {
    if (typeof tag === 'string') return tag;
    return tag.tag || '';
  }

  // Helper para normalizar tags para array de strings (para uso no *ngFor)
  getTagsNormalizadas(tags: string[] | { tag: string }[] | undefined): string[] {
    if (!tags) return [];
    return tags.map(t => typeof t === 'string' ? t : t.tag);
  }

  private extrairTagsDisponiveis() {
    const tagsSet = new Set<string>();
    this.itens.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => {
          const tagName = typeof tag === 'string' ? tag : tag.tag;
          if (tagName) {
            tagsSet.add(tagName);
          }
        });
      }
    });
    this.tagsDisponiveis = Array.from(tagsSet).sort();
  }

  private atualizarCategoriasComItens() {
    this.categoriasComItens = this.categorias.map(cat => ({
      ...cat,
      itens: this.itens.filter(item => this.getCategoriaNome(item.categoria) === cat.nome)
    }));
  }

  atualizarItens(novoItens: IItemCardapio[]) {
    this.itens = novoItens;
    this.atualizarCategoriasComItens();
    this.aplicarFiltros();
  }

  adicionar() {
    const dialogRef = this.dialog.open(DialogItemCardapioComponent, {
      width: '600px',
      data: { modo: 'criar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== false) {
        // Recarregar todos os itens para garantir consistência
        this.carregarItens();
        this.toastr.success('Item adicionado com sucesso!');
      }
    });
  }

  editar(item: IItemCardapio) {
    const dialogRef = this.dialog.open(DialogItemCardapioComponent, {
      width: '600px',
      data: { modo: 'editar', item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarItens();
      }
    });
  }

  toggleDisponibilidade(item: IItemCardapio) {
    if (!item.id) return;
    const itemAtualizado = { ...item, disponivel: !item.disponivel };
    this.service.atualizarItem(item.id, itemAtualizado).subscribe({
      next: () => {
        this.carregarItens();
        this.toastr.success('Disponibilidade atualizada!');
      },
      error: () => {
        this.toastr.error('Não foi possível atualizar a disponibilidade.');
      }
    });
  }

  confirmarRemocao(item: IItemCardapio) {
    if (!item.id) {
      Swal.fire({
        title: 'Erro!',
        text: 'Item inválido para remoção.',
        icon: 'error',
        confirmButtonColor: '#F6BD38'
      });
      return;
    }

    Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja remover "${item.nome}" do cardápio?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DA4A24',
      cancelButtonColor: '#3B221B',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.removerItem(item.id!).subscribe({
          next: () => {
            this.carregarItens();
            Swal.fire({
              title: 'Removido!',
              text: 'Item removido com sucesso.',
              icon: 'success',
              confirmButtonColor: '#F6BD38'
            });
          },
          error: (erro) => {
            console.error('Erro ao remover item:', erro);
            Swal.fire({
              title: 'Erro!',
              text: 'Não foi possível remover o item.',
              icon: 'error',
              confirmButtonColor: '#F6BD38'
            });
          }
        });
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