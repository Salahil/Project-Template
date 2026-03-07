import {
  GlobalSpinnerService,
  NzInputOtpComponent
} from "./chunk-5YEO7UKV.js";
import {
  MatCheckbox,
  MatCheckboxModule
} from "./chunk-M77BERMS.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-WSWJU3ME.js";
import {
  DefaultLoginLayoutComponent
} from "./chunk-X5NVBPGC.js";
import {
  AcessService,
  CheckCircleOutline,
  ClockCircleOutline,
  CloseCircleOutline,
  InfoCircleOutline,
  LoadingOutline,
  NZ_ICONS,
  NzButtonComponent,
  NzButtonModule,
  NzIconDirective,
  NzIconModule,
  NzTransitionPatchDirective,
  ReloadOutline,
  SafetyCertificateOutline,
  ToastrService
} from "./chunk-JWFN2V33.js";
import "./chunk-53AACB3W.js";
import "./chunk-T2NCV3EX.js";
import "./chunk-MRNRD2EB.js";
import {
  ActivatedRoute,
  CommonModule,
  NgClass,
  NgIf,
  Router
} from "./chunk-CSZAONZW.js";
import {
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-IKAMEZHE.js";

// src/app/pages/acesso/confirmar-codigo/confirmar-codigo.component.ts
function ConfirmarCodigoComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275element(1, "i", 22);
    \u0275\u0275elementEnd();
  }
}
function ConfirmarCodigoComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 24);
    \u0275\u0275element(2, "i", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 26);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.statusType);
    \u0275\u0275advance();
    \u0275\u0275property("nzType", ctx_r0.getStatusIcon())("nzTheme", ctx_r0.statusType === "error" ? "fill" : "outline");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r0.statusType);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.statusMessage);
  }
}
function ConfirmarCodigoComponent_div_29_i_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 30);
  }
}
function ConfirmarCodigoComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27)(1, "button", 28);
    \u0275\u0275listener("click", function ConfirmarCodigoComponent_div_29_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.reenviarCodigo());
    });
    \u0275\u0275template(2, ConfirmarCodigoComponent_div_29_i_2_Template, 1, 0, "i", 29);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.isReenviarDisabled)("nzLoading", ctx_r0.reenviando);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.reenviando);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.reenviarButtonText, " ");
  }
}
var ConfirmarCodigoComponent = class _ConfirmarCodigoComponent {
  constructor() {
    this.idVerificacao = "";
    this.codigo = "";
    this.carregando = false;
    this.reenviando = false;
    this.hasError = false;
    this.statusMessage = "";
    this.statusType = "info";
    this.mantenhaMeConectado = false;
    this.emailUsuario = "";
    this.reenviarDisabilitado = false;
    this.tempoRestante = 0;
    this.router = inject(Router);
    this.route = inject(ActivatedRoute);
    this.toastr = inject(ToastrService);
    this.loginService = inject(AcessService);
    this.globalSpinner = inject(GlobalSpinnerService);
  }
  ngOnInit() {
    this.idVerificacao = this.route.snapshot.params["id"];
    this.emailUsuario = localStorage.getItem("emailCadastro") || "";
    if (!this.idVerificacao) {
      this.toastr.warning("Sess\xE3o inv\xE1lida. Redirecionando para login...");
      this.router.navigate(["/login"]);
    }
  }
  onCodigoChange() {
    this.hasError = false;
    this.statusMessage = "";
    if (this.codigo.length === 6) {
      this.statusMessage = "C\xF3digo completo! Clique em verificar.";
      this.statusType = "success";
    } else if (this.codigo.length > 0) {
      this.statusMessage = `${this.codigo.length}/6 d\xEDgitos inseridos`;
      this.statusType = "info";
    }
  }
  verificarCodigo() {
    this.carregando = true;
    this.statusMessage = "Verificando c\xF3digo...";
    this.statusType = "info";
    this.globalSpinner.mostrar();
    this.loginService.verificarCodigo(this.idVerificacao, this.codigo, this.mantenhaMeConectado).subscribe({
      next: (res) => {
        if (res.erro) {
          this.hasError = true;
          const errorMessage = res.erro || "C\xF3digo inv\xE1lido ou expirado. Tente novamente.";
          this.statusMessage = errorMessage;
          this.statusType = "error";
          this.toastr.error(errorMessage);
          this.limparCodigo();
          this.carregando = false;
          this.globalSpinner.ocultar();
          return;
        }
        this.statusMessage = "C\xF3digo verificado com sucesso!";
        this.statusType = "success";
        this.toastr.success("Conta verificada com sucesso!");
        setTimeout(() => {
          if (res.tipoUsuario === "CLIENTE") {
            this.router.navigate(["/home"]);
          } else {
            this.router.navigate(["/reserva"]);
          }
        }, 1e3);
      },
      error: (err) => {
        this.hasError = true;
        const errorMessage = err.error?.erro || "C\xF3digo inv\xE1lido ou expirado. Tente novamente.";
        this.statusMessage = errorMessage;
        this.statusType = "error";
        this.toastr.error(errorMessage);
        this.limparCodigo();
      },
      complete: () => {
        this.carregando = false;
        this.globalSpinner.ocultar();
      }
    });
  }
  reenviarCodigo() {
    if (this.reenviarDisabilitado)
      return;
    this.reenviando = true;
    this.statusMessage = "Reenviando c\xF3digo...";
    this.statusType = "info";
    this.loginService.reenviarCodigo(this.emailUsuario).subscribe({
      next: () => {
        this.reenviando = false;
        this.statusMessage = "Novo c\xF3digo enviado para seu e-mail!";
        this.statusType = "success";
        this.toastr.success("Novo c\xF3digo enviado!");
        this.iniciarCooldown();
        setTimeout(() => {
          this.statusMessage = "";
        }, 3e3);
      },
      error: (err) => {
        this.reenviando = false;
        const errorMessage = err.error?.message || "Erro ao reenviar c\xF3digo. Tente novamente.";
        this.statusMessage = errorMessage;
        this.statusType = "error";
        this.toastr.error(errorMessage);
      }
    });
  }
  voltarVerificacao() {
    this.router.navigate(["/verificacao-email"]);
  }
  isCodigoCompleto() {
    return this.codigo.length === 6;
  }
  getStatusIcon() {
    switch (this.statusType) {
      case "success":
        return "check-circle";
      case "error":
        return "close-circle";
      default:
        return "info-circle";
    }
  }
  limparCodigo() {
    this.codigo = "";
    this.hasError = false;
    this.statusMessage = "";
  }
  /**
   * Inicia o cooldown de 60 segundos
   */
  iniciarCooldown() {
    this.reenviarDisabilitado = true;
    this.tempoRestante = 60;
    this.intervalId = setInterval(() => {
      this.tempoRestante--;
      if (this.tempoRestante <= 0) {
        this.reenviarDisabilitado = false;
        clearInterval(this.intervalId);
      }
    }, 1e3);
  }
  /**
   * Verifica se o botão de reenvio deve estar desabilitado
   */
  get isReenviarDisabled() {
    return this.reenviarDisabilitado || this.reenviando;
  }
  /**
   * Retorna o texto do botão de reenvio
   */
  get reenviarButtonText() {
    if (this.reenviando) {
      return "Reenviando...";
    }
    if (this.reenviarDisabilitado) {
      return `Aguarde ${this.tempoRestante}s`;
    }
    return "Reenviar c\xF3digo";
  }
  /**
   * Limpa o intervalo quando o componente é destruído
   */
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  static {
    this.\u0275fac = function ConfirmarCodigoComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ConfirmarCodigoComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConfirmarCodigoComponent, selectors: [["app-confirmar-codigo"]], features: [\u0275\u0275ProvidersFeature([
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
    ])], decls: 30, vars: 14, consts: [["title", "Digite o c\xF3digo de verifica\xE7\xE3o", "primaryBtnText", "Verificar C\xF3digo", "secondaryBtnText", "Voltar", 3, "submit", "navigate", "disablePrimaryBtn", "primaryBtnLoading"], [1, "codigo-content", "page-card"], [1, "header-icon"], [1, "icon-container"], ["nz-icon", "", "nzType", "safety-certificate", "nzTheme", "outline"], ["class", "loading-spinner", 4, "ngIf"], [1, "content-header"], [1, "main-title"], [1, "description"], [1, "codigo-inputs-wrapper"], [3, "ngModelChange", "nzLength", "ngModel"], ["class", "status-feedback", 4, "ngIf"], [1, "checkbox-section"], [1, "keep-connected-checkbox", 3, "ngModelChange", "ngModel"], [1, "help-section"], [1, "help-text"], [1, "timer-text"], ["nz-icon", "", "nzType", "clock-circle", "nzTheme", "outline"], [1, "highlight"], [1, "instruction-text"], ["class", "resend-section", 4, "ngIf"], [1, "loading-spinner"], ["nz-icon", "", "nzType", "loading", "nzSpin", ""], [1, "status-feedback"], [1, "status-icon", 3, "ngClass"], ["nz-icon", "", 3, "nzType", "nzTheme"], [1, "status-text", 3, "ngClass"], [1, "resend-section"], ["nz-button", "", "nzType", "link", "nzSize", "small", 1, "resend-btn", 3, "click", "disabled", "nzLoading"], ["nz-icon", "", "nzType", "reload", "nzTheme", "outline", 4, "ngIf"], ["nz-icon", "", "nzType", "reload", "nzTheme", "outline"]], template: function ConfirmarCodigoComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "app-default-login-layout", 0);
        \u0275\u0275listener("submit", function ConfirmarCodigoComponent_Template_app_default_login_layout_submit_0_listener() {
          return ctx.verificarCodigo();
        })("navigate", function ConfirmarCodigoComponent_Template_app_default_login_layout_navigate_0_listener() {
          return ctx.voltarVerificacao();
        });
        \u0275\u0275elementStart(1, "div", 1)(2, "div", 2)(3, "div", 3);
        \u0275\u0275element(4, "i", 4);
        \u0275\u0275template(5, ConfirmarCodigoComponent_div_5_Template, 2, 0, "div", 5);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(6, "div", 6)(7, "h3", 7);
        \u0275\u0275text(8, "Verifica\xE7\xE3o de Seguran\xE7a");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "p", 8);
        \u0275\u0275text(10, " Insira o c\xF3digo de ");
        \u0275\u0275elementStart(11, "strong");
        \u0275\u0275text(12, "6 d\xEDgitos");
        \u0275\u0275elementEnd();
        \u0275\u0275text(13, " que enviamos para seu e-mail ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(14, "div", 9)(15, "nz-input-otp", 10);
        \u0275\u0275twoWayListener("ngModelChange", function ConfirmarCodigoComponent_Template_nz_input_otp_ngModelChange_15_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.codigo, $event) || (ctx.codigo = $event);
          return $event;
        });
        \u0275\u0275listener("ngModelChange", function ConfirmarCodigoComponent_Template_nz_input_otp_ngModelChange_15_listener() {
          return ctx.onCodigoChange();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275template(16, ConfirmarCodigoComponent_div_16_Template, 5, 5, "div", 11);
        \u0275\u0275elementStart(17, "div", 12)(18, "mat-checkbox", 13);
        \u0275\u0275twoWayListener("ngModelChange", function ConfirmarCodigoComponent_Template_mat_checkbox_ngModelChange_18_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.mantenhaMeConectado, $event) || (ctx.mantenhaMeConectado = $event);
          return $event;
        });
        \u0275\u0275text(19, " Manter-me conectado ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "div", 14)(21, "div", 15)(22, "p", 16);
        \u0275\u0275element(23, "i", 17);
        \u0275\u0275text(24, " O c\xF3digo expira em ");
        \u0275\u0275elementStart(25, "span", 18);
        \u0275\u0275text(26, "10 minutos");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(27, "p", 19);
        \u0275\u0275text(28, " Certifique-se de digit\xE1-lo corretamente ");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(29, ConfirmarCodigoComponent_div_29_Template, 4, 4, "div", 20);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275property("disablePrimaryBtn", !ctx.isCodigoCompleto() || ctx.carregando)("primaryBtnLoading", ctx.carregando);
        \u0275\u0275advance(2);
        \u0275\u0275classProp("loading", ctx.carregando);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.carregando);
        \u0275\u0275advance(9);
        \u0275\u0275classProp("error", ctx.hasError)("success", ctx.isCodigoCompleto());
        \u0275\u0275advance();
        \u0275\u0275property("nzLength", 6);
        \u0275\u0275twoWayProperty("ngModel", ctx.codigo);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.statusMessage);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.mantenhaMeConectado);
        \u0275\u0275advance(11);
        \u0275\u0275property("ngIf", !ctx.carregando);
      }
    }, dependencies: [
      CommonModule,
      NgClass,
      NgIf,
      FormsModule,
      NgControlStatus,
      NgModel,
      // NG-ZORRO MODULES
      NzButtonModule,
      NzButtonComponent,
      NzTransitionPatchDirective,
      NzIconModule,
      NzIconDirective,
      NzInputOtpComponent,
      // ANGULAR MATERIAL MODULES
      MatCheckboxModule,
      MatCheckbox,
      // SEU COMPONENTE
      DefaultLoginLayoutComponent
    ], styles: ['\n\nhtml[_ngcontent-%COMP%], \nbody[_ngcontent-%COMP%] {\n  height: 100%;\n}\nbody[_ngcontent-%COMP%] {\n  background-color: var(--bg-page);\n  color: var(--text-primary);\n  font-family:\n    Inter,\n    system-ui,\n    -apple-system,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.container[_ngcontent-%COMP%] {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n.codigo-content[_ngcontent-%COMP%] {\n  text-align: center;\n  width: 100%;\n  max-width: 480px;\n  margin: 0 auto;\n  padding: 28px 24px 2rem;\n}\n.header-icon[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.header-icon[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  color: var(--primary);\n}\n.content-header[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.content-header[_ngcontent-%COMP%]   .main-title[_ngcontent-%COMP%] {\n  color: var(--primary);\n  font-size: 1.35rem;\n  font-weight: 700;\n  margin-bottom: 0.5rem;\n}\n.content-header[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n  font-size: 1rem;\n  margin: 0;\n}\n.content-header[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--primary);\n}\n.codigo-inputs-wrapper[_ngcontent-%COMP%] {\n  margin: 2rem 0;\n  padding: 1.25rem;\n  border-radius: var(--radius-lg);\n  background: var(--bg-surface-elevated);\n  border: 2px solid var(--border);\n  transition: border-color 0.3s, background 0.3s;\n}\n.codigo-inputs-wrapper.success[_ngcontent-%COMP%] {\n  border-color: var(--success);\n  background: rgba(82, 196, 26, 0.08);\n}\n.codigo-inputs-wrapper.error[_ngcontent-%COMP%] {\n  border-color: var(--danger);\n  background: rgba(209, 73, 91, 0.08);\n  animation: _ngcontent-%COMP%_shake 0.5s ease-in-out;\n}\n  .ant-input-otp {\n  gap: 0.5rem;\n  display: flex;\n  justify-content: center;\n}\n  .ant-input-otp-input {\n  width: 48px !important;\n  height: 56px !important;\n  min-width: 48px !important;\n  min-height: 56px !important;\n  font-size: 1.5rem !important;\n  font-weight: 700 !important;\n  border: 2px solid var(--border-strong) !important;\n  border-radius: var(--radius) !important;\n  background: var(--bg-surface) !important;\n  color: var(--text-primary) !important;\n  text-align: center !important;\n}\n  .ant-input-otp-input:focus, \n  .ant-input-otp-input.ant-input-otp-input-active {\n  border-color: var(--primary) !important;\n  box-shadow: 0 0 0 2px rgba(246, 189, 56, 0.2) !important;\n}\n.status-feedback[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n  padding: 0.75rem;\n  border-radius: var(--radius);\n  background: var(--bg-surface-elevated);\n  border-left: 4px solid var(--primary);\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.status-feedback[_ngcontent-%COMP%]   .status-icon.success[_ngcontent-%COMP%] {\n  color: var(--success);\n}\n.status-feedback[_ngcontent-%COMP%]   .status-icon.error[_ngcontent-%COMP%] {\n  color: var(--danger);\n}\n.status-feedback[_ngcontent-%COMP%]   .status-icon.info[_ngcontent-%COMP%] {\n  color: var(--primary);\n}\n.status-feedback[_ngcontent-%COMP%]   .status-text[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.9rem;\n}\n.help-section[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n}\n.help-section[_ngcontent-%COMP%]   .resend-btn[_ngcontent-%COMP%] {\n  color: var(--primary) !important;\n  border: none !important;\n  background: none !important;\n  cursor: pointer;\n}\n@keyframes _ngcontent-%COMP%_shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  20%, 60% {\n    transform: translateX(-4px);\n  }\n  40%, 80% {\n    transform: translateX(4px);\n  }\n}\n@media (max-width: 768px) {\n  .content-header[_ngcontent-%COMP%]   .main-title[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n    .ant-input-otp-input {\n    width: 40px !important;\n    height: 48px !important;\n    min-width: 40px !important;\n    min-height: 48px !important;\n    font-size: 1.25rem !important;\n  }\n}\n@media (max-width: 480px) {\n    .ant-input-otp-input {\n    width: 36px !important;\n    height: 44px !important;\n    min-width: 36px !important;\n    min-height: 44px !important;\n    font-size: 1.1rem !important;\n  }\n}\n/*# sourceMappingURL=confirmar-codigo.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfirmarCodigoComponent, [{
    type: Component,
    args: [{ selector: "app-confirmar-codigo", standalone: true, imports: [
      CommonModule,
      FormsModule,
      // NG-ZORRO MODULES
      NzButtonModule,
      NzIconModule,
      NzInputOtpComponent,
      // ANGULAR MATERIAL MODULES
      MatCheckboxModule,
      // SEU COMPONENTE
      DefaultLoginLayoutComponent
    ], providers: [
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
    ], template: `<app-default-login-layout \r
  title="Digite o c\xF3digo de verifica\xE7\xE3o"\r
  primaryBtnText="Verificar C\xF3digo"\r
  secondaryBtnText="Voltar"\r
  [disablePrimaryBtn]="!isCodigoCompleto() || carregando"\r
  [primaryBtnLoading]="carregando"\r
  (submit)="verificarCodigo()"\r
  (navigate)="voltarVerificacao()">\r
  \r
  <div class="codigo-content page-card">\r
    <!-- Melhorado o \xEDcone com anima\xE7\xE3o e melhor posicionamento -->\r
    <div class="header-icon" [class.loading]="carregando">\r
      <div class="icon-container">\r
        <i nz-icon nzType="safety-certificate" nzTheme="outline"></i>\r
        <div class="loading-spinner" *ngIf="carregando">\r
          <i nz-icon nzType="loading" nzSpin></i>\r
        </div>\r
      </div>\r
    </div>\r
    \r
    <!-- Melhorada a tipografia e hierarquia visual -->\r
    <div class="content-header">\r
      <h3 class="main-title">Verifica\xE7\xE3o de Seguran\xE7a</h3>\r
      <p class="description">\r
        Insira o c\xF3digo de <strong>6 d\xEDgitos</strong> que enviamos para seu e-mail\r
      </p>\r
    </div>\r
\r
    <!-- Melhorado o wrapper dos inputs com melhor espa\xE7amento -->\r
    <div class="codigo-inputs-wrapper" [class.error]="hasError" [class.success]="isCodigoCompleto()">\r
      <nz-input-otp \r
        [nzLength]="6" \r
        [(ngModel)]="codigo"\r
        (ngModelChange)="onCodigoChange()">\r
      </nz-input-otp>\r
    </div>\r
    \r
    <!-- Adicionado feedback visual para estados -->\r
    <div class="status-feedback" *ngIf="statusMessage">\r
      <div class="status-icon" [ngClass]="statusType">\r
        <i nz-icon [nzType]="getStatusIcon()" [nzTheme]="statusType === 'error' ? 'fill' : 'outline'"></i>\r
      </div>\r
      <p class="status-text" [ngClass]="statusType">{{ statusMessage }}</p>\r
    </div>\r
    \r
    <!-- Checkbox para manter conectado -->\r
    <div class="checkbox-section">\r
      <mat-checkbox [(ngModel)]="mantenhaMeConectado" class="keep-connected-checkbox">\r
        Manter-me conectado\r
      </mat-checkbox>\r
    </div>\r
\r
    <!-- Melhorado o texto de ajuda com melhor hierarquia -->\r
    <div class="help-section">\r
      <div class="help-text">\r
        <p class="timer-text">\r
          <i nz-icon nzType="clock-circle" nzTheme="outline"></i>\r
          O c\xF3digo expira em <span class="highlight">10 minutos</span>\r
        </p>\r
        <p class="instruction-text">\r
          Certifique-se de digit\xE1-lo corretamente\r
        </p>\r
      </div>\r
      \r
      <!-- Adicionado bot\xE3o para reenviar c\xF3digo -->\r
      <div class="resend-section" *ngIf="!carregando">\r
        <button \r
          nz-button \r
          nzType="link" \r
          nzSize="small"\r
          class="resend-btn"\r
          (click)="reenviarCodigo()"\r
          [disabled]="isReenviarDisabled"\r
          [nzLoading]="reenviando">\r
          <i nz-icon nzType="reload" nzTheme="outline" *ngIf="!reenviando"></i>\r
          {{ reenviarButtonText }}\r
        </button>\r
      </div>\r
    </div>\r
  </div>\r
</app-default-login-layout>`, styles: ['/* src/app/pages/acesso/confirmar-codigo/confirmar-codigo.component.scss */\nhtml,\nbody {\n  height: 100%;\n}\nbody {\n  background-color: var(--bg-page);\n  color: var(--text-primary);\n  font-family:\n    Inter,\n    system-ui,\n    -apple-system,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.container {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n.codigo-content {\n  text-align: center;\n  width: 100%;\n  max-width: 480px;\n  margin: 0 auto;\n  padding: 28px 24px 2rem;\n}\n.header-icon {\n  margin-bottom: 2rem;\n}\n.header-icon i {\n  font-size: 2.5rem;\n  color: var(--primary);\n}\n.content-header {\n  margin-bottom: 2rem;\n}\n.content-header .main-title {\n  color: var(--primary);\n  font-size: 1.35rem;\n  font-weight: 700;\n  margin-bottom: 0.5rem;\n}\n.content-header .description {\n  color: var(--text-secondary);\n  font-size: 1rem;\n  margin: 0;\n}\n.content-header .description strong {\n  color: var(--primary);\n}\n.codigo-inputs-wrapper {\n  margin: 2rem 0;\n  padding: 1.25rem;\n  border-radius: var(--radius-lg);\n  background: var(--bg-surface-elevated);\n  border: 2px solid var(--border);\n  transition: border-color 0.3s, background 0.3s;\n}\n.codigo-inputs-wrapper.success {\n  border-color: var(--success);\n  background: rgba(82, 196, 26, 0.08);\n}\n.codigo-inputs-wrapper.error {\n  border-color: var(--danger);\n  background: rgba(209, 73, 91, 0.08);\n  animation: shake 0.5s ease-in-out;\n}\n::ng-deep .ant-input-otp {\n  gap: 0.5rem;\n  display: flex;\n  justify-content: center;\n}\n::ng-deep .ant-input-otp-input {\n  width: 48px !important;\n  height: 56px !important;\n  min-width: 48px !important;\n  min-height: 56px !important;\n  font-size: 1.5rem !important;\n  font-weight: 700 !important;\n  border: 2px solid var(--border-strong) !important;\n  border-radius: var(--radius) !important;\n  background: var(--bg-surface) !important;\n  color: var(--text-primary) !important;\n  text-align: center !important;\n}\n::ng-deep .ant-input-otp-input:focus,\n::ng-deep .ant-input-otp-input.ant-input-otp-input-active {\n  border-color: var(--primary) !important;\n  box-shadow: 0 0 0 2px rgba(246, 189, 56, 0.2) !important;\n}\n.status-feedback {\n  margin: 1rem 0;\n  padding: 0.75rem;\n  border-radius: var(--radius);\n  background: var(--bg-surface-elevated);\n  border-left: 4px solid var(--primary);\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.status-feedback .status-icon.success {\n  color: var(--success);\n}\n.status-feedback .status-icon.error {\n  color: var(--danger);\n}\n.status-feedback .status-icon.info {\n  color: var(--primary);\n}\n.status-feedback .status-text {\n  margin: 0;\n  font-size: 0.9rem;\n}\n.help-section {\n  margin-top: 1.5rem;\n}\n.help-section .resend-btn {\n  color: var(--primary) !important;\n  border: none !important;\n  background: none !important;\n  cursor: pointer;\n}\n@keyframes shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  20%, 60% {\n    transform: translateX(-4px);\n  }\n  40%, 80% {\n    transform: translateX(4px);\n  }\n}\n@media (max-width: 768px) {\n  .content-header .main-title {\n    font-size: 1.2rem;\n  }\n  ::ng-deep .ant-input-otp-input {\n    width: 40px !important;\n    height: 48px !important;\n    min-width: 40px !important;\n    min-height: 48px !important;\n    font-size: 1.25rem !important;\n  }\n}\n@media (max-width: 480px) {\n  ::ng-deep .ant-input-otp-input {\n    width: 36px !important;\n    height: 44px !important;\n    min-width: 36px !important;\n    min-height: 44px !important;\n    font-size: 1.1rem !important;\n  }\n}\n/*# sourceMappingURL=confirmar-codigo.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConfirmarCodigoComponent, { className: "ConfirmarCodigoComponent", filePath: "src/app/pages/acesso/confirmar-codigo/confirmar-codigo.component.ts", lineNumber: 61 });
})();
export {
  ConfirmarCodigoComponent
};
//# sourceMappingURL=chunk-YWK5DT4I.js.map
