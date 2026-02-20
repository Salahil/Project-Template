import { Component, type OnInit, type OnDestroy, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, ActivatedRoute } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ToastrService } from "ngx-toastr"
import { AcessService } from "../../../core/services/access.service"
import { GlobalSpinnerService } from "../../../core/services/global-spinner.service"

// NG-ZORRO IMPORTS
import { NzInputOtpComponent } from "ng-zorro-antd/input"
import { NzButtonModule } from "ng-zorro-antd/button"
import { NzIconModule, NZ_ICONS } from "ng-zorro-antd/icon"

// ANGULAR MATERIAL IMPORTS
import { MatCheckboxModule } from "@angular/material/checkbox"
import {
  SafetyCertificateOutline,
  LoadingOutline,
  ClockCircleOutline,
  ReloadOutline,
  CheckCircleOutline,
  CloseCircleOutline,
  InfoCircleOutline
} from '@ant-design/icons-angular/icons'

// SEU COMPONENTE DE LAYOUT
import { DefaultLoginLayoutComponent } from "../default-login-layout/default-login-layout.component"

@Component({
  selector: "app-confirmar-codigo",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // NG-ZORRO MODULES
    NzButtonModule,
    NzIconModule,
    NzInputOtpComponent,
    // ANGULAR MATERIAL MODULES
    MatCheckboxModule,
    // SEU COMPONENTE
    DefaultLoginLayoutComponent,
  ],
  templateUrl: "./confirmar-codigo.component.html",
  styleUrls: ["./confirmar-codigo.component.scss"],
  providers: [
    {
      provide: NZ_ICONS,
      useValue: [
        SafetyCertificateOutline,
        LoadingOutline,
        ClockCircleOutline,
        ReloadOutline,
        CheckCircleOutline,
        CloseCircleOutline,
        InfoCircleOutline
      ]
    }
  ]
})
export class ConfirmarCodigoComponent implements OnInit, OnDestroy {
  idVerificacao = ""
  codigo = ""
  carregando = false
  reenviando = false
  hasError = false
  statusMessage = ""
  statusType: "success" | "error" | "info" = "info"
  mantenhaMeConectado = false
  emailUsuario = ""
  
  // Propriedades para cooldown
  reenviarDisabilitado = false
  tempoRestante = 0
  intervalId: any

  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private toastr = inject(ToastrService)
  private loginService = inject(AcessService)
  private globalSpinner = inject(GlobalSpinnerService)

  ngOnInit() {
    this.idVerificacao = this.route.snapshot.params["id"]
    this.emailUsuario = localStorage.getItem("emailCadastro") || ""
    if (!this.idVerificacao) {
      this.toastr.warning("Sessão inválida. Redirecionando para login...")
      this.router.navigate(["/login"])
    }
  }

  onCodigoChange() {
    this.hasError = false
    this.statusMessage = ""

    if (this.codigo.length === 6) {
      this.statusMessage = "Código completo! Clique em verificar."
      this.statusType = "success"
    } else if (this.codigo.length > 0) {
      this.statusMessage = `${this.codigo.length}/6 dígitos inseridos`
      this.statusType = "info"
    }
  }

  verificarCodigo() {
  
    this.carregando = true
    this.statusMessage = "Verificando código..."
    this.statusType = "info"
    this.globalSpinner.mostrar()

    this.loginService.verificarCodigo(this.idVerificacao, this.codigo, this.mantenhaMeConectado).subscribe({
      next: (res: any) => { // O bloco 'next' é executado por causa do status 200
        if (res.erro) {
          // Se tiver, nós tratamos como um erro.
          this.hasError = true;
          const errorMessage = res.erro || "Código inválido ou expirado. Tente novamente.";
          this.statusMessage = errorMessage;
          this.statusType = "error";

          // 1. EXIBE O ERRO NO TOAST, COMO VOCÊ QUERIA!
          this.toastr.error(errorMessage);
          
          this.limparCodigo();
    
          // Para os indicadores de carregamento
          this.carregando = false;
          this.globalSpinner.ocultar();
    
          // 2. IMPEDE A NAVEGAÇÃO!
          // Esta é a linha mais importante. Ela para a execução da função aqui.
          return; 
        }
        // ===================================
    
        // Se o `if` de cima for falso, significa que não houve erro.
        // O código continua para o fluxo de SUCESSO.
        this.statusMessage = "Código verificado com sucesso!";
        this.statusType = "success";
        this.toastr.success("Conta verificada com sucesso!");
    
        // ... (seu código de sucesso para remover itens do localStorage e navegar)
        setTimeout(() => {
          if (res.tipoUsuario === 'CLIENTE') {
            this.router.navigate(["/home"]);
          } else {
            this.router.navigate(["/reserva"]);
          }
        }, 1000);
      },
      error: (err: any) => {
        // Este bloco continua funcionando para erros de verdade (4xx/5xx)
        this.hasError = true;
        const errorMessage = err.error?.erro || "Código inválido ou expirado. Tente novamente.";
        this.statusMessage = errorMessage;
        this.statusType = "error";
        this.toastr.error(errorMessage);
        this.limparCodigo();
      },
      complete: () => {
        // A lógica de parada de carregamento continua aqui, mas adicionamos
        // também no 'if (res.erro)' para garantir que pare em todos os cenários.
        this.carregando = false;
        this.globalSpinner.ocultar();
      }
    })
  }

  reenviarCodigo() {
    if (this.reenviarDisabilitado) return

    this.reenviando = true
    this.statusMessage = "Reenviando código..."
    this.statusType = "info"

    this.loginService.reenviarCodigo(this.emailUsuario).subscribe({
      next: () => {
        this.reenviando = false
        this.statusMessage = "Novo código enviado para seu e-mail!"
        this.statusType = "success"
        this.toastr.success("Novo código enviado!")
        
        // Inicia o cooldown
        this.iniciarCooldown()

        // Limpa a mensagem após alguns segundos
        setTimeout(() => {
          this.statusMessage = ""
        }, 3000)
      },
      error: (err: any) => {
        this.reenviando = false
        const errorMessage = err.error?.message || "Erro ao reenviar código. Tente novamente."
        this.statusMessage = errorMessage
        this.statusType = "error"
        this.toastr.error(errorMessage)
      }
    })
  }

  voltarVerificacao() {
    this.router.navigate(["/verificacao-email"])
  }

  isCodigoCompleto(): boolean {
    return this.codigo.length === 6
  }

  getStatusIcon(): string {
    switch (this.statusType) {
      case "success":
        return "check-circle"
      case "error":
        return "close-circle"
      default:
        return "info-circle"
    }
  }

  limparCodigo() {
    this.codigo = ""
    this.hasError = false
    this.statusMessage = ""
  }

  /**
   * Inicia o cooldown de 60 segundos
   */
  private iniciarCooldown(): void {
    this.reenviarDisabilitado = true
    this.tempoRestante = 60

    this.intervalId = setInterval(() => {
      this.tempoRestante--
      if (this.tempoRestante <= 0) {
        this.reenviarDisabilitado = false
        clearInterval(this.intervalId)
      }
    }, 1000)
  }

  /**
   * Verifica se o botão de reenvio deve estar desabilitado
   */
  get isReenviarDisabled(): boolean {
    return this.reenviarDisabilitado || this.reenviando
  }

  /**
   * Retorna o texto do botão de reenvio
   */
  get reenviarButtonText(): string {
    if (this.reenviando) {
      return "Reenviando..."
    }
    if (this.reenviarDisabilitado) {
      return `Aguarde ${this.tempoRestante}s`
    }
    return "Reenviar código"
  }

  /**
   * Limpa o intervalo quando o componente é destruído
   */
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
}