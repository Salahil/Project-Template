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
  FormBuilder,
  FormControlName,
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
  NzIconDirective,
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
  ActivatedRoute,
  CommonModule,
  NgIf,
  Router
} from "./chunk-CSZAONZW.js";
import {
  Component,
  __spreadValues,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-IKAMEZHE.js";

// src/app/pages/acesso/redefinir-senha/redefinir-senha.component.ts
function RedefinirSenhaComponent_mat_error_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Este campo \xE9 obrigat\xF3rio ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaComponent_mat_error_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " A senha deve ter no m\xEDnimo 8 caracteres ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaComponent_mat_error_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " A senha deve conter ao menos um caractere especial ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaComponent_mat_error_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Este campo \xE9 obrigat\xF3rio ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaComponent_mat_error_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " As senhas n\xE3o coincidem ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaComponent_i_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 13);
  }
}
function RedefinirSenhaComponent_mat_icon_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 14);
    \u0275\u0275text(1, "refresh");
    \u0275\u0275elementEnd();
  }
}
function passwordMatchValidator(control) {
  const password = control.get("novaSenha")?.value;
  const passwordConfirm = control.get("confirmarSenha");
  if (password !== passwordConfirm?.value) {
    passwordConfirm?.setErrors({ passwordMismatch: true });
  } else {
    const currentErrors = __spreadValues({}, passwordConfirm?.errors);
    delete currentErrors["passwordMismatch"];
    passwordConfirm?.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
  }
  return null;
}
var RedefinirSenhaComponent = class _RedefinirSenhaComponent {
  constructor() {
    this.token = null;
    this.isLoading = false;
    this.hidePassword = true;
    this.hideConfirmPassword = true;
    this.route = inject(ActivatedRoute);
    this.router = inject(Router);
    this.accessService = inject(AcessService);
    this.toastService = inject(ToastrService);
    this.fb = inject(FormBuilder);
    this.validadorSenhaForte = (control) => {
      const valor = control.value;
      if (!valor)
        return null;
      const erros = {};
      if (valor.length < 8) {
        erros["minCaracteres"] = true;
      }
      if (valor.length >= 8 && !/[!@#$%^&*(),.?":{}|<>]/.test(valor)) {
        erros["semCaractereEspecial"] = true;
      }
      return Object.keys(erros).length ? erros : null;
    };
    this.resetForm = this.fb.group({
      novaSenha: ["", [Validators.required, this.validadorSenhaForte]],
      confirmarSenha: ["", [Validators.required]]
    }, { validators: passwordMatchValidator });
  }
  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get("token");
    console.log("Token capturado da URL:", this.token);
    if (!this.token) {
      this.toastService.error("Token de redefini\xE7\xE3o n\xE3o encontrado na URL.", "Erro");
      this.router.navigate(["/login"]);
      return;
    }
  }
  onSubmit() {
    console.log("onSubmit chamado");
    console.log("Formul\xE1rio v\xE1lido:", this.resetForm.valid);
    console.log("Token:", this.token);
    console.log("Erros do formul\xE1rio:", this.resetForm.errors);
    console.log("Erros novaSenha:", this.resetForm.get("novaSenha")?.errors);
    console.log("Erros confirmarSenha:", this.resetForm.get("confirmarSenha")?.errors);
    if (this.resetForm.invalid || !this.token) {
      console.log("Formul\xE1rio inv\xE1lido ou token ausente");
      this.resetForm.markAllAsTouched();
      return;
    }
    console.log("Iniciando requisi\xE7\xE3o de redefini\xE7\xE3o de senha");
    this.isLoading = true;
    const novaSenha = this.resetForm.get("novaSenha")?.value;
    this.accessService.redefinirSenha(this.token, novaSenha).subscribe({
      next: (response) => {
        console.log("Resposta da redefini\xE7\xE3o:", response);
        this.isLoading = false;
        this.toastService.success("Sua senha foi redefinida com sucesso!", "Sucesso!");
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        console.error("Erro na redefini\xE7\xE3o:", err);
        this.isLoading = false;
        const errorMessage = err.error?.erro || err.error?.message || "N\xE3o foi poss\xEDvel redefinir sua senha. Tente solicitar um novo link.";
        this.toastService.error(errorMessage, "Erro");
      }
    });
  }
  static {
    this.\u0275fac = function RedefinirSenhaComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RedefinirSenhaComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RedefinirSenhaComponent, selectors: [["app-redefinir-senha"]], decls: 29, vars: 14, consts: [["title", "Redefinir sua Senha"], [1, "form-section", "page-card"], [1, "reset-form", 3, "ngSubmit", "formGroup"], [1, "form-description"], ["appearance", "outline"], ["matInput", "", "formControlName", "novaSenha", 3, "type"], ["mat-icon-button", "", "matSuffix", "", "type", "button", 3, "click"], [4, "ngIf"], ["matInput", "", "formControlName", "confirmarSenha", 3, "type"], [1, "actions"], ["type", "submit", 1, "primary-action", 3, "disabled"], ["nz-icon", "", "nzType", "key", "nzTheme", "outline", 4, "ngIf"], ["class", "spinning", 4, "ngIf"], ["nz-icon", "", "nzType", "key", "nzTheme", "outline"], [1, "spinning"]], template: function RedefinirSenhaComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "app-default-login-layout", 0)(1, "div", 1)(2, "form", 2);
        \u0275\u0275listener("ngSubmit", function RedefinirSenhaComponent_Template_form_ngSubmit_2_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(3, "p", 3);
        \u0275\u0275text(4, " Crie uma nova senha. Ela deve ter no m\xEDnimo 8 caracteres e conter ao menos um caractere especial. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "mat-form-field", 4)(6, "mat-label");
        \u0275\u0275text(7, "Nova Senha");
        \u0275\u0275elementEnd();
        \u0275\u0275element(8, "input", 5);
        \u0275\u0275elementStart(9, "button", 6);
        \u0275\u0275listener("click", function RedefinirSenhaComponent_Template_button_click_9_listener() {
          return ctx.hidePassword = !ctx.hidePassword;
        });
        \u0275\u0275elementStart(10, "mat-icon");
        \u0275\u0275text(11);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(12, RedefinirSenhaComponent_mat_error_12_Template, 2, 0, "mat-error", 7)(13, RedefinirSenhaComponent_mat_error_13_Template, 2, 0, "mat-error", 7)(14, RedefinirSenhaComponent_mat_error_14_Template, 2, 0, "mat-error", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "mat-form-field", 4)(16, "mat-label");
        \u0275\u0275text(17, "Confirme sua senha");
        \u0275\u0275elementEnd();
        \u0275\u0275element(18, "input", 8);
        \u0275\u0275elementStart(19, "button", 6);
        \u0275\u0275listener("click", function RedefinirSenhaComponent_Template_button_click_19_listener() {
          return ctx.hideConfirmPassword = !ctx.hideConfirmPassword;
        });
        \u0275\u0275elementStart(20, "mat-icon");
        \u0275\u0275text(21);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(22, RedefinirSenhaComponent_mat_error_22_Template, 2, 0, "mat-error", 7)(23, RedefinirSenhaComponent_mat_error_23_Template, 2, 0, "mat-error", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "div", 9)(25, "button", 10);
        \u0275\u0275template(26, RedefinirSenhaComponent_i_26_Template, 1, 0, "i", 11)(27, RedefinirSenhaComponent_mat_icon_27_Template, 2, 0, "mat-icon", 12);
        \u0275\u0275text(28);
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        let tmp_3_0;
        let tmp_4_0;
        let tmp_5_0;
        let tmp_8_0;
        let tmp_9_0;
        \u0275\u0275advance(2);
        \u0275\u0275property("formGroup", ctx.resetForm);
        \u0275\u0275advance(6);
        \u0275\u0275property("type", ctx.hidePassword ? "password" : "text");
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.hidePassword ? "visibility_off" : "visibility");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", (tmp_3_0 = ctx.resetForm.get("novaSenha")) == null ? null : tmp_3_0.hasError("required"));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", (tmp_4_0 = ctx.resetForm.get("novaSenha")) == null ? null : tmp_4_0.hasError("minCaracteres"));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", (tmp_5_0 = ctx.resetForm.get("novaSenha")) == null ? null : tmp_5_0.hasError("semCaractereEspecial"));
        \u0275\u0275advance(4);
        \u0275\u0275property("type", ctx.hideConfirmPassword ? "password" : "text");
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.hideConfirmPassword ? "visibility_off" : "visibility");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", (tmp_8_0 = ctx.resetForm.get("confirmarSenha")) == null ? null : tmp_8_0.hasError("required"));
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", (tmp_9_0 = ctx.resetForm.get("confirmarSenha")) == null ? null : tmp_9_0.hasError("passwordMismatch"));
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", !ctx.resetForm.valid || ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.isLoading ? "Redefinindo..." : "Redefinir Senha", " ");
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
      NzIconModule,
      NzIconDirective
    ], styles: ['\n\nhtml[_ngcontent-%COMP%], \nbody[_ngcontent-%COMP%] {\n  height: 100%;\n}\nbody[_ngcontent-%COMP%] {\n  background-color: var(--bg-page);\n  color: var(--text-primary);\n  font-family:\n    Inter,\n    system-ui,\n    -apple-system,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.container[_ngcontent-%COMP%] {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n.form-section[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 500px;\n  margin: 0 auto;\n  padding: 28px 24px;\n}\n.reset-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  width: 100%;\n}\n.form-description[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n  text-align: center;\n  margin-bottom: 16px;\n  font-size: 14px;\n}\n.status-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  padding: 32px;\n  gap: 16px;\n  color: var(--text-primary);\n}\n.status-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  color: var(--primary);\n}\n.status-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 16px;\n}\n.status-card.error[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], \n.status-card.error[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--danger);\n}\n  .mat-mdc-form-field {\n  width: 100%;\n}\n  .mat-mdc-form-field .mat-mdc-input-element, \n  .mat-mdc-form-field .mdc-floating-label {\n  color: var(--text-primary) !important;\n}\n  .mat-mdc-form-field .mdc-text-field--outlined {\n  --mdc-outlined-text-field-outline-color: var(--input-border);\n  --mdc-outlined-text-field-hover-outline-color: var(--primary);\n  --mdc-outlined-text-field-focus-outline-color: var(--primary);\n}\nmat-error[_ngcontent-%COMP%] {\n  color: var(--danger) !important;\n}\n.actions[_ngcontent-%COMP%] {\n  margin-top: 1.5rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.actions[_ngcontent-%COMP%]   .primary-action[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 50px;\n  border: none;\n  border-radius: var(--radius);\n  background: var(--primary);\n  color: var(--text-primary);\n  font-weight: 600;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.actions[_ngcontent-%COMP%]   .secondary-action[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 45px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius);\n  background: transparent;\n  color: var(--primary);\n  font-weight: 500;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n@media (max-width: 600px) {\n  .form-section[_ngcontent-%COMP%] {\n    padding: 24px 16px;\n  }\n  .status-card[_ngcontent-%COMP%] {\n    padding: 24px 16px;\n  }\n  .status-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n    font-size: 40px;\n    width: 40px;\n    height: 40px;\n  }\n}\n/*# sourceMappingURL=redefinir-senha.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RedefinirSenhaComponent, [{
    type: Component,
    args: [{ selector: "app-redefinir-senha", standalone: true, imports: [
      CommonModule,
      DefaultLoginLayoutComponent,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      NzIconModule
    ], template: `<app-default-login-layout title="Redefinir sua Senha">\r
  <div class="form-section page-card">\r
    <form [formGroup]="resetForm" class="reset-form" (ngSubmit)="onSubmit()">\r
      <p class="form-description">\r
        Crie uma nova senha. Ela deve ter no m\xEDnimo 8 caracteres e conter ao menos um caractere especial.\r
      </p>\r
\r
      <mat-form-field appearance="outline">\r
        <mat-label>Nova Senha</mat-label>\r
        <input matInput formControlName="novaSenha" [type]="hidePassword ? 'password' : 'text'">\r
        <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">\r
          <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>\r
        </button>\r
        <mat-error *ngIf="resetForm.get('novaSenha')?.hasError('required')">\r
          Este campo \xE9 obrigat\xF3rio\r
        </mat-error>\r
        <mat-error *ngIf="resetForm.get('novaSenha')?.hasError('minCaracteres')">\r
          A senha deve ter no m\xEDnimo 8 caracteres\r
        </mat-error>\r
        <mat-error *ngIf="resetForm.get('novaSenha')?.hasError('semCaractereEspecial')">\r
          A senha deve conter ao menos um caractere especial\r
        </mat-error>\r
      </mat-form-field>\r
\r
      <mat-form-field appearance="outline">\r
        <mat-label>Confirme sua senha</mat-label>\r
        <input matInput formControlName="confirmarSenha" [type]="hideConfirmPassword ? 'password' : 'text'">\r
        <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">\r
          <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>\r
        </button>\r
        <mat-error *ngIf="resetForm.get('confirmarSenha')?.hasError('required')">\r
          Este campo \xE9 obrigat\xF3rio\r
        </mat-error>\r
        <mat-error *ngIf="resetForm.get('confirmarSenha')?.hasError('passwordMismatch')">\r
          As senhas n\xE3o coincidem\r
        </mat-error>\r
      </mat-form-field>\r
      \r
      <div class="actions">\r
        <button type="submit" class="primary-action" [disabled]="!resetForm.valid || isLoading">\r
          <i nz-icon nzType="key" nzTheme="outline" *ngIf="!isLoading"></i>\r
          <mat-icon *ngIf="isLoading" class="spinning">refresh</mat-icon>\r
          {{ isLoading ? 'Redefinindo...' : 'Redefinir Senha' }}\r
        </button>\r
      </div>\r
    </form>\r
  </div>\r
</app-default-login-layout>\r
`, styles: ['/* src/app/pages/acesso/redefinir-senha/redefinir-senha.component.scss */\nhtml,\nbody {\n  height: 100%;\n}\nbody {\n  background-color: var(--bg-page);\n  color: var(--text-primary);\n  font-family:\n    Inter,\n    system-ui,\n    -apple-system,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.container {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n.form-section {\n  width: 100%;\n  max-width: 500px;\n  margin: 0 auto;\n  padding: 28px 24px;\n}\n.reset-form {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  width: 100%;\n}\n.form-description {\n  color: var(--text-secondary);\n  text-align: center;\n  margin-bottom: 16px;\n  font-size: 14px;\n}\n.status-card {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  padding: 32px;\n  gap: 16px;\n  color: var(--text-primary);\n}\n.status-card mat-icon {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  color: var(--primary);\n}\n.status-card p {\n  margin: 0;\n  font-size: 16px;\n}\n.status-card.error mat-icon,\n.status-card.error p {\n  color: var(--danger);\n}\n::ng-deep .mat-mdc-form-field {\n  width: 100%;\n}\n::ng-deep .mat-mdc-form-field .mat-mdc-input-element,\n::ng-deep .mat-mdc-form-field .mdc-floating-label {\n  color: var(--text-primary) !important;\n}\n::ng-deep .mat-mdc-form-field .mdc-text-field--outlined {\n  --mdc-outlined-text-field-outline-color: var(--input-border);\n  --mdc-outlined-text-field-hover-outline-color: var(--primary);\n  --mdc-outlined-text-field-focus-outline-color: var(--primary);\n}\nmat-error {\n  color: var(--danger) !important;\n}\n.actions {\n  margin-top: 1.5rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.actions .primary-action {\n  width: 100%;\n  height: 50px;\n  border: none;\n  border-radius: var(--radius);\n  background: var(--primary);\n  color: var(--text-primary);\n  font-weight: 600;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.actions .secondary-action {\n  width: 100%;\n  height: 45px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius);\n  background: transparent;\n  color: var(--primary);\n  font-weight: 500;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n@media (max-width: 600px) {\n  .form-section {\n    padding: 24px 16px;\n  }\n  .status-card {\n    padding: 24px 16px;\n  }\n  .status-card mat-icon {\n    font-size: 40px;\n    width: 40px;\n    height: 40px;\n  }\n}\n/*# sourceMappingURL=redefinir-senha.component.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RedefinirSenhaComponent, { className: "RedefinirSenhaComponent", filePath: "src/app/pages/acesso/redefinir-senha/redefinir-senha.component.ts", lineNumber: 46 });
})();
export {
  RedefinirSenhaComponent,
  passwordMatchValidator
};
//# sourceMappingURL=chunk-JR3WICIL.js.map
