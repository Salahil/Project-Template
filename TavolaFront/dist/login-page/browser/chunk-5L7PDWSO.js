import {
  GoogleLoginProvider,
  SocialAuthService
} from "./chunk-FLFEJXHJ.js";
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatInput,
  MatInputModule,
  MatLabel,
  MatSuffix
} from "./chunk-X4322BIS.js";
import {
  DefaultValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-WSWJU3ME.js";
import {
  DefaultLoginLayoutComponent
} from "./chunk-X5NVBPGC.js";
import {
  AcessService,
  NzIconModule,
  ToastrService
} from "./chunk-JWFN2V33.js";
import "./chunk-53AACB3W.js";
import {
  MatButtonModule,
  MatIconButton
} from "./chunk-M2CDMWSZ.js";
import "./chunk-T2NCV3EX.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-MRNRD2EB.js";
import {
  AuthService,
  CommonModule,
  NgIf,
  Router
} from "./chunk-CSZAONZW.js";
import {
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-IKAMEZHE.js";

// src/app/pages/acesso/login/login.component.ts
function LoginComponent_mat_error_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Digite um e-mail v\xE1lido");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_mat_error_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, "Senha obrigat\xF3ria");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275text(1, "Credenciais inv\xE1lidas");
    \u0275\u0275elementEnd();
  }
}
var LoginComponent = class _LoginComponent {
  constructor() {
    this.showLoginError = false;
    this.hidePassword = true;
    this.router = inject(Router);
    this.loginService = inject(AcessService);
    this.toastService = inject(ToastrService);
    this.authService = inject(AuthService);
    this.socialAuthService = inject(SocialAuthService);
    this.googleAuthSub = null;
    this.loginForm = new FormGroup({
      email: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.email] }),
      senha: new FormControl("", { nonNullable: true, validators: [Validators.required] })
    });
  }
  realizarLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const email = this.loginForm.get("email")?.value;
    const senha = this.loginForm.get("senha")?.value;
    if (email && senha) {
      this.loginService.login(email, senha).subscribe({
        next: (res) => {
          this.showLoginError = false;
          if (res.idVerificacao) {
            this.toastService.info(res.mensagem || "C\xF3digo de verifica\xE7\xE3o enviado para seu e-mail.");
            this.router.navigate(["/confirmar-codigo", res.idVerificacao]);
            return;
          }
          this.toastService.success("Login feito com sucesso!");
          this.authService.setAuthData(res.token, res.nome, res.tipoUsuario, res.id, res.imagem, res.restauranteId);
          this.router.navigate(["app"]);
        },
        error: (err) => {
          this.showLoginError = true;
          const errorMessage = err.error?.erro || err.error?.message || "N\xE3o foi poss\xEDvel acessar sua conta. Verifique seu e-mail e senha e tente novamente.";
          this.toastService.error(errorMessage);
        }
      });
    } else {
      this.showLoginError = true;
      this.toastService.error("Email ou senha inv\xE1lidos.");
    }
  }
  ngOnInit() {
    this.googleAuthSub = this.socialAuthService.authState.subscribe((user) => {
      if (user?.idToken) {
        this.loginService.loginWithGoogle(user.idToken).subscribe({
          next: (res) => {
            this.showLoginError = false;
            this.toastService.success("Login feito com sucesso!");
            this.authService.setAuthData(res.token, res.nome, res.tipoUsuario, res.id, res.imagem, res.restauranteId);
            this.router.navigate(["app"]);
          },
          error: (err) => {
            this.showLoginError = true;
            const msg = err.error?.erro || err.error?.message || "N\xE3o foi poss\xEDvel entrar com o Google. Tente novamente.";
            this.toastService.error(msg);
          }
        });
      }
    });
  }
  ngOnDestroy() {
    this.googleAuthSub?.unsubscribe();
  }
  signInWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  irParaCadastro() {
    this.router.navigate(["signup"]);
  }
  forgotPassword() {
    const email = this.loginForm.get("email")?.value;
    if (!email) {
      this.toastService.warning("Por favor, digite seu e-mail antes de solicitar a redefini\xE7\xE3o de senha.");
      return;
    }
    if (this.loginForm.get("email")?.invalid) {
      this.toastService.warning("Por favor, digite um e-mail v\xE1lido.");
      return;
    }
    this.loginService.esqueciMinhaSenha(email).subscribe({ next: () => this.toastService.success("Instru\xE7\xF5es para redefini\xE7\xE3o de senha foram enviadas para seu e-mail!"), error: (err) => this.toastService.error(err.error?.erro || err.error?.message || "Erro ao enviar e-mail de redefini\xE7\xE3o. Tente novamente.") });
  }
  static {
    this.\u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LoginComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 49, vars: 7, consts: [[1, "login-card", "page-card"], ["src", "/assets/png/LogoTavolaSimples.png", "alt", "Tavola", 1, "logo"], [1, "title"], [1, "subtitle"], [1, "login-form", "page-form", 3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "full"], ["matInput", "", "formControlName", "email", "type", "email", "autocomplete", "username", "placeholder", "Email ou telefone"], [4, "ngIf"], ["matInput", "", "formControlName", "senha", "autocomplete", "current-password", 3, "type"], ["mat-icon-button", "", "matSuffix", "", "type", "button", "aria-label", "Alternar visibilidade da senha", 3, "click"], [1, "forgot-row"], ["href", "#", 1, "link-primary", 3, "click"], ["class", "login-error text-danger", 4, "ngIf"], ["type", "submit", 1, "btn-primary", "btn-primary-page", 3, "disabled"], [1, "divider"], [1, "socials"], ["type", "button", "aria-label", "Entrar com Google", 1, "social", "google", 3, "click"], ["aria-hidden", "true", 1, "google-icon"], ["width", "18", "height", "18", "viewBox", "0 0 24 24", "xmlns", "http://www.w3.org/2000/svg"], ["fill", "#4285F4", "d", "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"], ["fill", "#34A853", "d", "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"], ["fill", "#FBBC05", "d", "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"], ["fill", "#EA4335", "d", "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"], ["type", "button", "aria-label", "Entrar com LinkedIn", 1, "social", "linkedin"], ["aria-hidden", "true", 1, "linkedin-icon"], ["d", "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", "fill", "currentColor"], [1, "signup-link", "link-muted"], [1, "link-primary", 3, "click"], [1, "login-error", "text-danger"]], template: function LoginComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "app-default-login-layout")(1, "div", 0);
        \u0275\u0275element(2, "img", 1);
        \u0275\u0275elementStart(3, "h1", 2);
        \u0275\u0275text(4, "Bem-vindo de volta");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 3);
        \u0275\u0275text(6, "Fa\xE7a login na sua conta");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "form", 4);
        \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_7_listener() {
          return ctx.realizarLogin();
        });
        \u0275\u0275elementStart(8, "mat-form-field", 5)(9, "mat-label");
        \u0275\u0275text(10, "E-mail ou telefone");
        \u0275\u0275elementEnd();
        \u0275\u0275element(11, "input", 6);
        \u0275\u0275template(12, LoginComponent_mat_error_12_Template, 2, 0, "mat-error", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "mat-form-field", 5)(14, "mat-label");
        \u0275\u0275text(15, "Senha");
        \u0275\u0275elementEnd();
        \u0275\u0275element(16, "input", 8);
        \u0275\u0275elementStart(17, "button", 9);
        \u0275\u0275listener("click", function LoginComponent_Template_button_click_17_listener() {
          return ctx.hidePassword = !ctx.hidePassword;
        });
        \u0275\u0275elementStart(18, "mat-icon");
        \u0275\u0275text(19);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(20, LoginComponent_mat_error_20_Template, 2, 0, "mat-error", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "div", 10)(22, "a", 11);
        \u0275\u0275listener("click", function LoginComponent_Template_a_click_22_listener($event) {
          ctx.forgotPassword();
          return $event.preventDefault();
        });
        \u0275\u0275text(23, "Esqueceu a senha?");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(24, LoginComponent_div_24_Template, 2, 0, "div", 12);
        \u0275\u0275elementStart(25, "button", 13);
        \u0275\u0275text(26, "Entrar");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "p", 14);
        \u0275\u0275text(28, "ou entre com");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "div", 15)(30, "button", 16);
        \u0275\u0275listener("click", function LoginComponent_Template_button_click_30_listener() {
          return ctx.signInWithGoogle();
        });
        \u0275\u0275elementStart(31, "span", 17);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(32, "svg", 18);
        \u0275\u0275element(33, "path", 19)(34, "path", 20)(35, "path", 21)(36, "path", 22);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(37, "span");
        \u0275\u0275text(38, "Google");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(39, "button", 23)(40, "span", 24);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(41, "svg", 18);
        \u0275\u0275element(42, "path", 25);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(43, "span");
        \u0275\u0275text(44, "LinkedIn");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(45, "p", 26);
        \u0275\u0275text(46, "N\xE3o tem conta? ");
        \u0275\u0275elementStart(47, "a", 27);
        \u0275\u0275listener("click", function LoginComponent_Template_a_click_47_listener() {
          return ctx.irParaCadastro();
        });
        \u0275\u0275text(48, "Cadastre-se");
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        let tmp_1_0;
        let tmp_4_0;
        \u0275\u0275advance(7);
        \u0275\u0275property("formGroup", ctx.loginForm);
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", (tmp_1_0 = ctx.loginForm.get("email")) == null ? null : tmp_1_0.invalid);
        \u0275\u0275advance(4);
        \u0275\u0275property("type", ctx.hidePassword ? "password" : "text");
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.hidePassword ? "visibility_off" : "visibility");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", (tmp_4_0 = ctx.loginForm.get("senha")) == null ? null : tmp_4_0.invalid);
        \u0275\u0275advance(4);
        \u0275\u0275property("ngIf", ctx.showLoginError);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", !ctx.loginForm.valid);
      }
    }, dependencies: [
      CommonModule,
      NgIf,
      DefaultLoginLayoutComponent,
      ReactiveFormsModule,
      \u0275NgNoValidate,
      DefaultValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      FormGroupDirective,
      FormControlName,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatError,
      MatSuffix,
      MatInputModule,
      MatInput,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatIconButton,
      NzIconModule
    ], styles: ['\n\nhtml[_ngcontent-%COMP%], \nbody[_ngcontent-%COMP%] {\n  height: 100%;\n}\nbody[_ngcontent-%COMP%] {\n  background-color: var(--bg-page);\n  color: var(--text-primary);\n  font-family:\n    Inter,\n    system-ui,\n    -apple-system,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.container[_ngcontent-%COMP%] {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n.login-card[_ngcontent-%COMP%] {\n  padding: 28px 24px;\n}\n.logo[_ngcontent-%COMP%] {\n  display: block;\n  margin: 0 auto 16px;\n  width: 72px;\n}\n.title[_ngcontent-%COMP%] {\n  text-align: center;\n  margin: 0 0 4px;\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--text-primary);\n}\n.subtitle[_ngcontent-%COMP%] {\n  text-align: center;\n  margin: 0 0 24px;\n  font-size: 0.95rem;\n  color: var(--text-secondary);\n}\n.login-form[_ngcontent-%COMP%]   .full[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.forgot-row[_ngcontent-%COMP%] {\n  text-align: right;\n  margin-top: -8px;\n  margin-bottom: 4px;\n}\n.login-error[_ngcontent-%COMP%] {\n  padding: 10px;\n  border-radius: var(--radius);\n  text-align: center;\n  font-size: 14px;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.divider[_ngcontent-%COMP%] {\n  text-align: center;\n  margin: 20px 0 12px;\n  font-size: 13px;\n  color: var(--text-muted);\n}\n.socials[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n.socials[_ngcontent-%COMP%]   .social[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;\n  border-radius: var(--radius);\n  border: 1px solid var(--border);\n  background: var(--bg-surface);\n  color: var(--text-primary);\n  font-size: 14px;\n  cursor: pointer;\n  transition: background 0.2s, border-color 0.2s;\n}\n.socials[_ngcontent-%COMP%]   .social[_ngcontent-%COMP%]:hover {\n  background: var(--border);\n  border-color: var(--border-strong);\n}\n.socials[_ngcontent-%COMP%]   .google-icon[_ngcontent-%COMP%], \n.socials[_ngcontent-%COMP%]   .linkedin-icon[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.socials[_ngcontent-%COMP%]   .social.linkedin[_ngcontent-%COMP%] {\n  color: #0A66C2;\n}\n.socials[_ngcontent-%COMP%]   .social.linkedin[_ngcontent-%COMP%]   .linkedin-icon[_ngcontent-%COMP%] {\n  color: #0A66C2;\n}\n.signup-link[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 20px;\n  font-size: 14px;\n}\n.signup-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--primary);\n  text-decoration: none;\n  cursor: pointer;\n  transition: text-decoration 0.2s;\n}\n.signup-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n  color: var(--primary);\n}\n  .mat-mdc-form-field .mdc-floating-label, \n  .mat-mdc-form-field .mat-mdc-input-element {\n  color: var(--text-primary) !important;\n}\n  .mat-mdc-form-field .mdc-text-field--outlined {\n  --mdc-outlined-text-field-outline-color: var(--input-border);\n  --mdc-outlined-text-field-hover-outline-color: var(--primary);\n  --mdc-outlined-text-field-focus-outline-color: var(--primary);\n}\n@media (max-width: 480px) {\n  .login-card[_ngcontent-%COMP%] {\n    padding: 20px 16px;\n    margin: 0 8px;\n  }\n  .title[_ngcontent-%COMP%] {\n    font-size: 1.35rem;\n  }\n  .logo[_ngcontent-%COMP%] {\n    width: 64px;\n  }\n}\n/*# sourceMappingURL=login.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", standalone: true, imports: [
      CommonModule,
      DefaultLoginLayoutComponent,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      NzIconModule
    ], template: `<app-default-login-layout>\r
  <div class="login-card page-card">\r
    <img src="/assets/png/LogoTavolaSimples.png" alt="Tavola" class="logo" />\r
    <h1 class="title">Bem-vindo de volta</h1>\r
    <p class="subtitle">Fa\xE7a login na sua conta</p>\r
\r
    <form [formGroup]="loginForm" (ngSubmit)="realizarLogin()" class="login-form page-form">\r
      <mat-form-field appearance="outline" class="full">\r
        <mat-label>E-mail ou telefone</mat-label>\r
        <input matInput formControlName="email" type="email" autocomplete="username" placeholder="Email ou telefone">\r
        <mat-error *ngIf="loginForm.get('email')?.invalid">Digite um e-mail v\xE1lido</mat-error>\r
      </mat-form-field>\r
\r
      <mat-form-field appearance="outline" class="full">\r
        <mat-label>Senha</mat-label>\r
        <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="senha" autocomplete="current-password">\r
        <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword" aria-label="Alternar visibilidade da senha">\r
          <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>\r
        </button>\r
        <mat-error *ngIf="loginForm.get('senha')?.invalid">Senha obrigat\xF3ria</mat-error>\r
      </mat-form-field>\r
\r
      <div class="forgot-row">\r
        <a href="#" (click)="forgotPassword(); $event.preventDefault();" class="link-primary">Esqueceu a senha?</a>\r
      </div>\r
\r
      <div *ngIf="showLoginError" class="login-error text-danger">Credenciais inv\xE1lidas</div>\r
\r
      <button class="btn-primary btn-primary-page" type="submit" [disabled]="!loginForm.valid">Entrar</button>\r
\r
      <p class="divider">ou entre com</p>\r
      <div class="socials">\r
        <button type="button" class="social google" aria-label="Entrar com Google" (click)="signInWithGoogle()">\r
          <span class="google-icon" aria-hidden="true">\r
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>\r
          </span>\r
          <span>Google</span>\r
        </button>\r
        <button type="button" class="social linkedin" aria-label="Entrar com LinkedIn">\r
          <span class="linkedin-icon" aria-hidden="true">\r
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/></svg>\r
          </span>\r
          <span>LinkedIn</span>\r
        </button>\r
      </div>\r
\r
      <p class="signup-link link-muted">N\xE3o tem conta? <a (click)="irParaCadastro()" class="link-primary">Cadastre-se</a></p>\r
    </form>\r
  </div>\r
</app-default-login-layout>\r
`, styles: ['/* src/app/pages/acesso/login/login.component.scss */\nhtml,\nbody {\n  height: 100%;\n}\nbody {\n  background-color: var(--bg-page);\n  color: var(--text-primary);\n  font-family:\n    Inter,\n    system-ui,\n    -apple-system,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.container {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n.login-card {\n  padding: 28px 24px;\n}\n.logo {\n  display: block;\n  margin: 0 auto 16px;\n  width: 72px;\n}\n.title {\n  text-align: center;\n  margin: 0 0 4px;\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--text-primary);\n}\n.subtitle {\n  text-align: center;\n  margin: 0 0 24px;\n  font-size: 0.95rem;\n  color: var(--text-secondary);\n}\n.login-form .full {\n  width: 100%;\n}\n.forgot-row {\n  text-align: right;\n  margin-top: -8px;\n  margin-bottom: 4px;\n}\n.login-error {\n  padding: 10px;\n  border-radius: var(--radius);\n  text-align: center;\n  font-size: 14px;\n}\n.btn-primary {\n  margin-top: 8px;\n}\n.divider {\n  text-align: center;\n  margin: 20px 0 12px;\n  font-size: 13px;\n  color: var(--text-muted);\n}\n.socials {\n  display: flex;\n  gap: 10px;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n.socials .social {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;\n  border-radius: var(--radius);\n  border: 1px solid var(--border);\n  background: var(--bg-surface);\n  color: var(--text-primary);\n  font-size: 14px;\n  cursor: pointer;\n  transition: background 0.2s, border-color 0.2s;\n}\n.socials .social:hover {\n  background: var(--border);\n  border-color: var(--border-strong);\n}\n.socials .google-icon,\n.socials .linkedin-icon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.socials .social.linkedin {\n  color: #0A66C2;\n}\n.socials .social.linkedin .linkedin-icon {\n  color: #0A66C2;\n}\n.signup-link {\n  text-align: center;\n  margin-top: 20px;\n  font-size: 14px;\n}\n.signup-link a {\n  color: var(--primary);\n  text-decoration: none;\n  cursor: pointer;\n  transition: text-decoration 0.2s;\n}\n.signup-link a:hover {\n  text-decoration: underline;\n  color: var(--primary);\n}\n::ng-deep .mat-mdc-form-field .mdc-floating-label,\n::ng-deep .mat-mdc-form-field .mat-mdc-input-element {\n  color: var(--text-primary) !important;\n}\n::ng-deep .mat-mdc-form-field .mdc-text-field--outlined {\n  --mdc-outlined-text-field-outline-color: var(--input-border);\n  --mdc-outlined-text-field-hover-outline-color: var(--primary);\n  --mdc-outlined-text-field-focus-outline-color: var(--primary);\n}\n@media (max-width: 480px) {\n  .login-card {\n    padding: 20px 16px;\n    margin: 0 8px;\n  }\n  .title {\n    font-size: 1.35rem;\n  }\n  .logo {\n    width: 64px;\n  }\n}\n/*# sourceMappingURL=login.component.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/pages/acesso/login/login.component.ts", lineNumber: 34 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-5L7PDWSO.js.map
