import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EquipeService } from '../../core/services/equipe.service';
import { IMembroEquipe } from '../../Interfaces/IMembroEquipe.interface';
import { DialogEquipeComponent, DialogEquipeData } from './dialog-equipe/dialog-equipe.component';
import { environment } from '../../../environments/environment';
// import { GlobalSpinnerService } from '../../spin/global-spinner/global-spinner.service';

@Component({
  selector: 'app-gerenciar-equipe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './gerenciar-equipe.component.html',
  styleUrls: ['./gerenciar-equipe.component.scss']
})
export class GerenciarEquipeComponent implements OnInit {
  equipe: IMembroEquipe[] = [];
  equipeFiltrada: IMembroEquipe[] = [];
  carregando = false;
  pesquisa = '';
  copiadoMembros: { [key: string]: boolean } = {};
  public isMobile = false;

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.checkMobile();
  }

  constructor(
    private equipeService: EquipeService,
    private dialog: MatDialog,
    private toastr: ToastrService
    // private spinner: GlobalSpinnerService
  ) {}

  ngOnInit(): void {
    this.checkMobile();
    // this.spinner.show();
    this.carregarEquipe();
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  /**
   * Carrega a lista de membros da equipa
   */
  carregarEquipe(): void {
    this.carregando = true;
    this.equipeService.getEquipe().subscribe({
      next: (membros) => {
        this.equipe = membros;
        this.equipeFiltrada = membros;
        this.carregando = false;
        // this.spinner.hide();
      },
      error: (error) => {
        console.error('Erro ao carregar equipa:', error);
        this.toastr.error('Erro ao carregar equipa', 'Erro');
        this.carregando = false;
        // this.spinner.hide();
      }
    });
  }

  /**
   * Abre o diálogo para adicionar novo membro
   */
  abrirDialogAdicao(): void {
    const dialogData: DialogEquipeData = {
      editMode: false,
      membro: null
    };

    const dialogRef = this.dialog.open(DialogEquipeComponent, {
      data: dialogData,
      width: '500px',
      maxWidth: '90vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.carregarEquipe();
        this.toastr.success('Membro adicionado com sucesso!', 'Sucesso');
      }
    });
  }

  /**
   * Abre o diálogo para editar membro
   */
  abrirDialogEdicao(membro: IMembroEquipe): void {
    const dialogData: DialogEquipeData = {
      editMode: true,
      membro: membro
    };

    const dialogRef = this.dialog.open(DialogEquipeComponent, {
      data: dialogData,
      width: '500px',
      maxWidth: '90vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.carregarEquipe();
        this.toastr.success('Membro atualizado com sucesso!', 'Sucesso');
      }
    });
  }

  /**
   * Remove um membro da equipa
   */
  removerMembro(membro: IMembroEquipe): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja remover ${membro.nome} da equipe?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c22523',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, remover!',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      customClass: {
        popup: 'swal-popup-tavola',
        title: 'swal-title-tavola',
        confirmButton: 'swal-confirm-tavola',
        cancelButton: 'swal-cancel-tavola'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.equipeService.deleteMembro(membro.id).subscribe({
          next: () => {
            this.carregarEquipe();
            this.toastr.success('Membro removido com sucesso!', 'Sucesso');
          },
          error: (error) => {
            console.error('Erro ao remover membro:', error);
            this.toastr.error('Erro ao remover membro', 'Erro');
          }
        });
      }
    });
  }

  /**
   * Copia o código de acesso para a área de transferência
   */
  copiarCodigo(codigo: string, membroId: string): void {
    this.copiadoMembros[membroId] = true;
    navigator.clipboard.writeText(codigo).then(() => {
      this.toastr.success('Código copiado!', 'Sucesso');
      setTimeout(() => {
        this.copiadoMembros[membroId] = false;
      }, 2000);
    }).catch(() => {
      this.toastr.error('Erro ao copiar código', 'Erro');
      this.copiadoMembros[membroId] = false;
    });
  }

  /**
   * Formata o código para exibição (1234-5678)
   */
  formatarCodigo(codigo: string): string {
    if (codigo.length === 8) {
      return `${codigo.substring(0, 4)}-${codigo.substring(4, 8)}`;
    }
    return codigo;
  }

  /**
   * Retorna a URL da imagem do membro
   */
  getImagemUrl(imagem: string | null): string {
    if (imagem && imagem.trim() !== '') {
      // Se é base64, retorna diretamente
      if (imagem.startsWith('data:')) {
        return imagem;
      }
      // Se é uma URL relativa, adiciona o base URL
      if (!imagem.startsWith('http')) {
        return `${environment.apiUrl}${imagem}`;
      }
      // Se já é uma URL completa, retorna diretamente
      return imagem;
    }
    return 'assets/png/avatar-padrao-garcom-tavola.png';
  }

  /**
   * TrackBy function para otimizar a renderização da lista
   */
  trackByMembroId(index: number, membro: IMembroEquipe): string {
    return membro.id;
  }

  /**
   * Aplica filtros de busca
   */
  aplicarFiltros(): void {
    if (!this.pesquisa.trim()) {
      this.equipeFiltrada = [...this.equipe];
    } else {
      this.equipeFiltrada = this.equipe.filter(membro =>
        membro.nome.toLowerCase().includes(this.pesquisa.toLowerCase())
      );
    }
  }

  /**
   * Limpa a pesquisa
   */
  limparPesquisa(): void {
    this.pesquisa = '';
    this.aplicarFiltros();
  }

  /**
   * Troca a imagem do membro
   */
  trocarImagem(membro: IMembroEquipe): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          this.toastr.error('Arquivo muito grande. Selecione uma imagem menor que 5MB.', 'Erro');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const novaImagem = e.target.result;
          
          // Verificar se a imagem foi lida corretamente
          if (!novaImagem || typeof novaImagem !== 'string') {
            this.toastr.error('Erro ao processar a imagem.', 'Erro');
            return;
          }
          
          // Usar o método updateMembro que permite atualizar apenas a imagem
          // Passando string vazia para senha para não alterá-la
          this.equipeService.updateMembro(
            membro.id,
            {
              nome: membro.nome,
              senha: '', // String vazia para não alterar a senha
              imagem: novaImagem
            }
          ).subscribe({
            next: () => {
              // Recarregar a equipe para garantir consistência com o backend
              this.carregarEquipe();
              this.toastr.success('Foto atualizada com sucesso!', 'Sucesso');
            },
            error: (error) => {
              console.error('Erro ao atualizar foto:', error);
              this.toastr.error('Erro ao atualizar foto', 'Erro');
            }
          });
        };
        reader.readAsDataURL(file);
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
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
