import { Component, type OnInit, inject, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"

// INTERFACES E SERVIÇOS
import { FavoritosService, type IFavorito } from "../../core/services/favoritos.service"
import { GlobalSpinnerService } from "../../core/services/global-spinner.service"
import { AuthService } from "../../core/services/auth.service"
import { RestauranteService } from "../../core/services/restaurante.service"

// COMPONENTES DE UI
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatChipsModule } from "@angular/material/chips"
import { MatSnackBarModule } from "@angular/material/snack-bar"

@Component({
  selector: "app-favoritos",
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatSnackBarModule],
  templateUrl: "./favoritos.component.html",
  styleUrl: "./favoritos.component.scss",
})
export class FavoritosComponent implements OnInit {
  private favoritosService = inject(FavoritosService)
  private router = inject(Router)
  private spinnerService = inject(GlobalSpinnerService)
  private authService = inject(AuthService)
  private restauranteService = inject(RestauranteService)

  public favoritos: IFavorito[] = []
  public isMobile = false

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.checkMobile();
  }

  ngOnInit(): void {
    this.checkMobile();
    this.carregarFavoritos()
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private carregarFavoritos(): void {
    this.spinnerService.mostrar()

    this.favoritosService.getFavoritos()
      .subscribe({
        next: (data: IFavorito[]) => {
          this.favoritos = data
          this.spinnerService.ocultar()
        },
        error: (err: any) => {
          console.error("Erro ao buscar favoritos:", err)
          this.spinnerService.ocultar()
        },
      })
  }

  public getImagemUrl(favorito: IFavorito): string {
    // Prioriza imagemPrincipal se existir
    if (favorito.imagemPrincipal) {
      const path = favorito.imagemPrincipal;
      if (path && path.startsWith("assets/")) {
        return path;
      }
      return this.authService.getAbsoluteImageUrl(path);
    }
    
    // Fallback para primeira imagem do array se imagemPrincipal não existir
    if (favorito.imagens && favorito.imagens.length > 0) {
      const path = favorito.imagens[0];
      if (path && path.startsWith("assets/")) {
        return path;
      }
      return this.authService.getAbsoluteImageUrl(path);
    }
    
    // Se não houver imagem, retorna uma imagem padrão
    return 'assets/png/avatar-padrao-restaurante-tavola.png';
  }

  public getEnderecoResumido(endereco: any): string {
    if (endereco && endereco.bairro && endereco.cidade) {
      return `${endereco.bairro}, ${endereco.cidade}`;
    }
    return endereco?.cidade || 'Endereço não disponível';
  }

  public verRestaurante(idRestaurante: string): void {
    if (idRestaurante) {
      this.router.navigate(["/home/agendamento-reservas-restaurante", idRestaurante])
    }
  }

  public desfavoritarRestaurante(idRestaurante: string): void {
    this.restauranteService.favoritarRestaurante(idRestaurante).subscribe({
      next: () => {
        // Remove o favorito da lista local
        this.favoritos = this.favoritos.filter(fav => fav.id !== idRestaurante);
        // Mostra mensagem de sucesso
        console.log('Restaurante removido dos favoritos!');
      },
      error: (err) => {
        console.error('Erro ao remover favorito:', err);
      }
    });
  }

  public getPrecoMedio(valor: number | undefined): string {
    if (!valor) return 'Preço não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  public getAvaliacaoFormatada(media: number, total: number): string {
    return `${media.toFixed(1)} (${total} avaliações)`
  }
}
