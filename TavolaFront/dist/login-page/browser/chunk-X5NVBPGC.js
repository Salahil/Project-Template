import {
  NzButtonComponent,
  NzButtonModule,
  NzIconModule,
  NzTransitionPatchDirective,
  NzWaveDirective
} from "./chunk-JWFN2V33.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-MRNRD2EB.js";
import {
  CommonModule,
  NgIf
} from "./chunk-CSZAONZW.js";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-IKAMEZHE.js";

// src/app/pages/acesso/default-login-layout/default-login-layout.component.ts
var _c0 = ["*"];
function DefaultLoginLayoutComponent_div_13_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function DefaultLoginLayoutComponent_div_13_button_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onPrimaryClick());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.disablePrimaryBtn)("nzLoading", ctx_r1.primaryBtnLoading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.primaryBtnText);
  }
}
function DefaultLoginLayoutComponent_div_13_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function DefaultLoginLayoutComponent_div_13_button_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSecondaryClick());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.secondaryBtnText);
  }
}
function DefaultLoginLayoutComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275template(1, DefaultLoginLayoutComponent_div_13_button_1_Template, 2, 3, "button", 10)(2, DefaultLoginLayoutComponent_div_13_button_2_Template, 2, 1, "button", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.primaryBtnText);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.secondaryBtnText);
  }
}
var DefaultLoginLayoutComponent = class _DefaultLoginLayoutComponent {
  constructor() {
    this.title = "";
    this.primaryBtnText = "";
    this.secondaryBtnText = "";
    this.disablePrimaryBtn = false;
    this.primaryBtnLoading = false;
    this.submit = new EventEmitter();
    this.navigate = new EventEmitter();
    this.isDark = typeof document !== "undefined" && document.documentElement.classList.contains("theme-dark");
  }
  onPrimaryClick() {
    this.submit.emit();
  }
  onSecondaryClick() {
    this.navigate.emit();
  }
  toggleTheme() {
    const root = document.documentElement;
    root.classList.toggle("theme-dark");
    this.isDark = root.classList.contains("theme-dark");
  }
  static {
    this.\u0275fac = function DefaultLoginLayoutComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DefaultLoginLayoutComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DefaultLoginLayoutComponent, selectors: [["app-default-login-layout"]], inputs: { title: "title", primaryBtnText: "primaryBtnText", secondaryBtnText: "secondaryBtnText", disablePrimaryBtn: "disablePrimaryBtn", primaryBtnLoading: "primaryBtnLoading" }, outputs: { submit: "submit", navigate: "navigate" }, ngContentSelectors: _c0, decls: 14, vars: 3, consts: [[1, "login-layout"], ["aria-hidden", "true", 1, "layout-bg"], ["aria-label", "Alternar tema", 1, "theme-toggle"], ["type", "button", 1, "toggle-pill", 3, "click"], ["title", "Modo claro", 1, "pill-label", "light"], ["title", "Modo escuro", 1, "pill-label", "dark"], [1, "form-area"], [1, "content"], ["class", "action-buttons", 4, "ngIf"], [1, "action-buttons"], ["nz-button", "", "nzType", "primary", "class", "primary-btn", 3, "disabled", "nzLoading", "click", 4, "ngIf"], ["nz-button", "", "nzType", "default", "class", "secondary-btn", 3, "click", 4, "ngIf"], ["nz-button", "", "nzType", "primary", 1, "primary-btn", 3, "click", "disabled", "nzLoading"], ["nz-button", "", "nzType", "default", 1, "secondary-btn", 3, "click"]], template: function DefaultLoginLayoutComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275elementStart(0, "main", 0);
        \u0275\u0275element(1, "div", 1);
        \u0275\u0275elementStart(2, "div", 2)(3, "button", 3);
        \u0275\u0275listener("click", function DefaultLoginLayoutComponent_Template_button_click_3_listener() {
          return ctx.toggleTheme();
        });
        \u0275\u0275elementStart(4, "span", 4)(5, "mat-icon");
        \u0275\u0275text(6, "light_mode");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "span", 5)(8, "mat-icon");
        \u0275\u0275text(9, "dark_mode");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(10, "div", 6)(11, "div", 7);
        \u0275\u0275projection(12);
        \u0275\u0275elementEnd();
        \u0275\u0275template(13, DefaultLoginLayoutComponent_div_13_Template, 3, 2, "div", 8);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275classProp("dark", ctx.isDark);
        \u0275\u0275advance(10);
        \u0275\u0275property("ngIf", ctx.primaryBtnText || ctx.secondaryBtnText);
      }
    }, dependencies: [CommonModule, NgIf, MatIconModule, MatIcon, NzButtonModule, NzButtonComponent, NzTransitionPatchDirective, NzWaveDirective, NzIconModule], styles: ['\n\nhtml[_ngcontent-%COMP%], \nbody[_ngcontent-%COMP%] {\n  height: 100%;\n}\nbody[_ngcontent-%COMP%] {\n  background-color: var(--bg-page);\n  color: var(--text-primary);\n  font-family:\n    Inter,\n    system-ui,\n    -apple-system,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.container[_ngcontent-%COMP%] {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n.login-layout[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--bg-page);\n  overflow: hidden;\n}\n.layout-bg[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(\n      1200px 400px at 10% 20%,\n      rgba(246, 189, 56, 0.06),\n      transparent 25%),\n    radial-gradient(\n      800px 300px at 90% 80%,\n      rgba(218, 74, 36, 0.04),\n      transparent 25%);\n  pointer-events: none;\n}\n.theme-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 16px;\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 2;\n}\n.toggle-pill[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: stretch;\n  border-radius: 999px;\n  border: 1px solid var(--border);\n  background: var(--bg-surface-elevated);\n  box-shadow: var(--shadow-sm);\n  cursor: pointer;\n  overflow: hidden;\n}\n.toggle-pill[_ngcontent-%COMP%]   .pill-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 8px 12px;\n  transition: color 0.2s, background 0.2s;\n}\n.toggle-pill[_ngcontent-%COMP%]   .pill-label[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.toggle-pill[_ngcontent-%COMP%]   .pill-label.light[_ngcontent-%COMP%] {\n  color: var(--text-primary);\n  background: var(--bg-surface);\n  border-radius: 999px 0 0 999px;\n}\n.toggle-pill[_ngcontent-%COMP%]   .pill-label.dark[_ngcontent-%COMP%] {\n  color: var(--text-muted);\n  border-radius: 0 999px 999px 0;\n}\n.toggle-pill.dark[_ngcontent-%COMP%]   .pill-label.light[_ngcontent-%COMP%] {\n  color: var(--text-muted);\n  background: transparent;\n}\n.toggle-pill.dark[_ngcontent-%COMP%]   .pill-label.dark[_ngcontent-%COMP%] {\n  color: var(--text-primary);\n  background: var(--bg-surface);\n}\n.form-area[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  max-width: 440px;\n  padding: 24px 20px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.content[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n}\n.action-buttons[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  gap: 8px;\n  justify-content: center;\n  margin-top: 16px;\n}\n.primary-btn[_ngcontent-%COMP%] {\n  min-width: 120px;\n}\n.secondary-btn[_ngcontent-%COMP%] {\n  min-width: 100px;\n}\nmat-error[_ngcontent-%COMP%] {\n  color: var(--danger) !important;\n}\n  .mat-mdc-form-field {\n  width: 100%;\n}\n@media (max-width: 480px) {\n  .login-layout[_ngcontent-%COMP%] {\n    align-items: center;\n    justify-content: flex-start;\n    padding-top: 72px;\n    padding-left: 12px;\n    padding-right: 12px;\n  }\n  .theme-toggle[_ngcontent-%COMP%] {\n    top: 12px;\n  }\n  .form-area[_ngcontent-%COMP%] {\n    padding: 16px 12px;\n    max-width: 100%;\n    width: 100%;\n    box-sizing: border-box;\n  }\n  .content[_ngcontent-%COMP%] {\n    padding: 0;\n  }\n}\n@media (max-width: 360px) {\n  .login-layout[_ngcontent-%COMP%] {\n    padding-left: 8px;\n    padding-right: 8px;\n  }\n  .form-area[_ngcontent-%COMP%] {\n    padding: 12px 8px;\n  }\n}\n/*# sourceMappingURL=default-login-layout.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DefaultLoginLayoutComponent, [{
    type: Component,
    args: [{ selector: "app-default-login-layout", standalone: true, imports: [CommonModule, MatIconModule, NzButtonModule, NzIconModule], template: '<main class="login-layout">\r\n  <div class="layout-bg" aria-hidden="true"></div>\r\n  <div class="theme-toggle" aria-label="Alternar tema">\r\n    <button type="button" class="toggle-pill" [class.dark]="isDark" (click)="toggleTheme()">\r\n      <span class="pill-label light" title="Modo claro"><mat-icon>light_mode</mat-icon></span>\r\n      <span class="pill-label dark" title="Modo escuro"><mat-icon>dark_mode</mat-icon></span>\r\n    </button>\r\n  </div>\r\n  <div class="form-area">\r\n    <div class="content">\r\n      <ng-content></ng-content>\r\n    </div>\r\n    <div class="action-buttons" *ngIf="primaryBtnText || secondaryBtnText">\r\n      <button nz-button nzType="primary" (click)="onPrimaryClick()" [disabled]="disablePrimaryBtn" [nzLoading]="primaryBtnLoading" class="primary-btn" *ngIf="primaryBtnText">{{ primaryBtnText }}</button>\r\n      <button nz-button nzType="default" (click)="onSecondaryClick()" class="secondary-btn" *ngIf="secondaryBtnText">{{ secondaryBtnText }}</button>\r\n    </div>\r\n  </div>\r\n</main>\r\n', styles: ['/* src/app/pages/acesso/default-login-layout/default-login-layout.component.scss */\nhtml,\nbody {\n  height: 100%;\n}\nbody {\n  background-color: var(--bg-page);\n  color: var(--text-primary);\n  font-family:\n    Inter,\n    system-ui,\n    -apple-system,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.container {\n  max-width: 1100px;\n  margin: 0 auto;\n  padding: 0 16px;\n}\n.login-layout {\n  position: relative;\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--bg-page);\n  overflow: hidden;\n}\n.layout-bg {\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(\n      1200px 400px at 10% 20%,\n      rgba(246, 189, 56, 0.06),\n      transparent 25%),\n    radial-gradient(\n      800px 300px at 90% 80%,\n      rgba(218, 74, 36, 0.04),\n      transparent 25%);\n  pointer-events: none;\n}\n.theme-toggle {\n  position: absolute;\n  top: 16px;\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 2;\n}\n.toggle-pill {\n  display: flex;\n  align-items: stretch;\n  border-radius: 999px;\n  border: 1px solid var(--border);\n  background: var(--bg-surface-elevated);\n  box-shadow: var(--shadow-sm);\n  cursor: pointer;\n  overflow: hidden;\n}\n.toggle-pill .pill-label {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 8px 12px;\n  transition: color 0.2s, background 0.2s;\n}\n.toggle-pill .pill-label mat-icon {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.toggle-pill .pill-label.light {\n  color: var(--text-primary);\n  background: var(--bg-surface);\n  border-radius: 999px 0 0 999px;\n}\n.toggle-pill .pill-label.dark {\n  color: var(--text-muted);\n  border-radius: 0 999px 999px 0;\n}\n.toggle-pill.dark .pill-label.light {\n  color: var(--text-muted);\n  background: transparent;\n}\n.toggle-pill.dark .pill-label.dark {\n  color: var(--text-primary);\n  background: var(--bg-surface);\n}\n.form-area {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  max-width: 440px;\n  padding: 24px 20px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.content {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n}\n.action-buttons {\n  width: 100%;\n  display: flex;\n  gap: 8px;\n  justify-content: center;\n  margin-top: 16px;\n}\n.primary-btn {\n  min-width: 120px;\n}\n.secondary-btn {\n  min-width: 100px;\n}\nmat-error {\n  color: var(--danger) !important;\n}\n::ng-deep .mat-mdc-form-field {\n  width: 100%;\n}\n@media (max-width: 480px) {\n  .login-layout {\n    align-items: center;\n    justify-content: flex-start;\n    padding-top: 72px;\n    padding-left: 12px;\n    padding-right: 12px;\n  }\n  .theme-toggle {\n    top: 12px;\n  }\n  .form-area {\n    padding: 16px 12px;\n    max-width: 100%;\n    width: 100%;\n    box-sizing: border-box;\n  }\n  .content {\n    padding: 0;\n  }\n}\n@media (max-width: 360px) {\n  .login-layout {\n    padding-left: 8px;\n    padding-right: 8px;\n  }\n  .form-area {\n    padding: 12px 8px;\n  }\n}\n/*# sourceMappingURL=default-login-layout.component.css.map */\n'] }]
  }], null, { title: [{
    type: Input
  }], primaryBtnText: [{
    type: Input
  }], secondaryBtnText: [{
    type: Input
  }], disablePrimaryBtn: [{
    type: Input
  }], primaryBtnLoading: [{
    type: Input
  }], submit: [{
    type: Output
  }], navigate: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DefaultLoginLayoutComponent, { className: "DefaultLoginLayoutComponent", filePath: "src/app/pages/acesso/default-login-layout/default-login-layout.component.ts", lineNumber: 14 });
})();

export {
  DefaultLoginLayoutComponent
};
//# sourceMappingURL=chunk-X5NVBPGC.js.map
