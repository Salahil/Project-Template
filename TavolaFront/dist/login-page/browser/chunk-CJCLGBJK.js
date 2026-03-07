import {
  MatButton,
  MatButtonModule
} from "./chunk-M2CDMWSZ.js";
import "./chunk-T2NCV3EX.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-MRNRD2EB.js";
import {
  AuthService,
  CommonModule,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule
} from "./chunk-CSZAONZW.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-IKAMEZHE.js";

// src/app/pages/layout-principal/layout-principal.component.ts
var LayoutPrincipalComponent = class _LayoutPrincipalComponent {
  constructor(router, auth) {
    this.router = router;
    this.auth = auth;
    this.sidebarAberta = true;
  }
  ngOnInit() {
  }
  get userName() {
    return this.auth.perfil?.nome || "Usu\xE1rio";
  }
  get userType() {
    const tipo = this.auth.perfil?.tipo;
    switch (tipo) {
      case "RESTAURANTE":
        return "Restaurante";
      case "FUNCIONARIO":
        return "FUNCIONARIO";
      // Será convertido no template
      default:
        return "Cliente";
    }
  }
  get userAvatar() {
    const profileImage = this.auth.perfil?.imagem;
    if (profileImage) {
      return this.auth.getAbsoluteImageUrl(profileImage);
    }
    if (this.auth.perfil?.tipo === "RESTAURANTE") {
      return "assets/png/avatar-padrao-restaurante-tavola.png";
    }
    if (this.auth.perfil?.tipo === "FUNCIONARIO") {
      return "assets/png/avatar-padrao-garcom-tavola.png";
    }
    return "assets/png/avatar-padrao-tavola-cordeirinho.png";
  }
  get isCliente() {
    return this.auth.hasRole("CLIENTE");
  }
  get isRestaurante() {
    return this.auth.hasRole("RESTAURANTE");
  }
  get isFuncionario() {
    return this.auth.hasRole("FUNCIONARIO");
  }
  handleSidebarClick(event) {
    if (event.target.closest("button"))
      return;
    if (!this.sidebarAberta)
      this.sidebarAberta = true;
  }
  toggleSidebar() {
    this.sidebarAberta = !this.sidebarAberta;
  }
  logout() {
    try {
      if (this.auth && this.auth.clearAuthData)
        this.auth.clearAuthData();
    } catch {
    }
    this.router.navigate(["/login"]);
  }
  static {
    this.\u0275fac = function LayoutPrincipalComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LayoutPrincipalComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LayoutPrincipalComponent, selectors: [["app-layout-principal"]], decls: 35, vars: 3, consts: [[1, "layout-container"], ["role", "banner", 1, "toolbar"], [2, "display", "flex", "align-items", "center", "gap", "16px"], ["src", "assets/png/LogoTavolaSimples.png", "alt", "Logo Tavola", 1, "logo", 2, "height", "40px"], ["type", "button", "aria-label", "Alternar sidebar", 1, "menu-toggle", 3, "click"], ["aria-hidden", "true"], [2, "margin-left", "auto", "display", "flex", "align-items", "center", "gap", "12px"], [2, "font-weight", "600"], ["mat-button", "", "type", "button", 3, "click"], [1, "main-wrapper"], ["role", "navigation", "aria-label", "Menu lateral", 1, "desktop-sidebar"], [1, "sidebar-header"], ["src", "assets/png/LogoTavolaSimples.png", "alt", "Logo Tavola", 1, "logo"], ["role", "navigation", "aria-label", "Menu principal", 1, "menu"], ["routerLink", "/home", "routerLinkActive", "active", "type", "button"], ["routerLink", "/historico", "routerLinkActive", "active", "type", "button"], ["routerLink", "/favoritos", "routerLinkActive", "active", "type", "button"], ["role", "main", 1, "content"]], template: function LayoutPrincipalComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "div", 2);
        \u0275\u0275element(3, "img", 3);
        \u0275\u0275elementStart(4, "button", 4);
        \u0275\u0275listener("click", function LayoutPrincipalComponent_Template_button_click_4_listener() {
          return ctx.toggleSidebar();
        });
        \u0275\u0275elementStart(5, "mat-icon", 5);
        \u0275\u0275text(6, "menu");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(7, "div", 6)(8, "span", 7);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "button", 8);
        \u0275\u0275listener("click", function LayoutPrincipalComponent_Template_button_click_10_listener() {
          return ctx.logout();
        });
        \u0275\u0275elementStart(11, "mat-icon");
        \u0275\u0275text(12, "logout");
        \u0275\u0275elementEnd();
        \u0275\u0275text(13, " Sair ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(14, "div", 9)(15, "aside", 10)(16, "div", 11);
        \u0275\u0275element(17, "img", 12);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "nav", 13)(19, "button", 14)(20, "mat-icon");
        \u0275\u0275text(21, "home");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "span");
        \u0275\u0275text(23, "In\xEDcio");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(24, "button", 15)(25, "mat-icon");
        \u0275\u0275text(26, "history");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "span");
        \u0275\u0275text(28, "Hist\xF3rico");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(29, "button", 16)(30, "mat-icon");
        \u0275\u0275text(31, "favorite");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(32, "span");
        \u0275\u0275text(33, "Favoritos");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275element(34, "main", 17);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate(ctx.userName);
        \u0275\u0275advance(6);
        \u0275\u0275classProp("fechada", !ctx.sidebarAberta);
      }
    }, dependencies: [RouterModule, RouterLink, RouterLinkActive, MatIconModule, MatIcon, MatButtonModule, MatButton, CommonModule], encapsulation: 2, data: { animation: [] } });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutPrincipalComponent, [{
    type: Component,
    args: [{ selector: "app-layout-principal", standalone: true, imports: [RouterModule, MatIconModule, MatButtonModule, CommonModule], animations: [], template: '<!-- Minimal layout: menubar + sidebar with buttons -->\r\n<div class="layout-container">\r\n  <header class="toolbar" role="banner">\r\n    <div style="display:flex;align-items:center;gap:16px">\r\n      <img src="assets/png/LogoTavolaSimples.png" alt="Logo Tavola" class="logo" style="height:40px" />\r\n      <button class="menu-toggle" (click)="toggleSidebar()" type="button" aria-label="Alternar sidebar">\r\n        <mat-icon aria-hidden="true">menu</mat-icon>\r\n      </button>\r\n    </div>\r\n\r\n    <div style="margin-left:auto;display:flex;align-items:center;gap:12px">\r\n      <span style="font-weight:600">{{ userName }}</span>\r\n      <button mat-button (click)="logout()" type="button">\r\n        <mat-icon>logout</mat-icon>\r\n        Sair\r\n      </button>\r\n    </div>\r\n  </header>\r\n\r\n  <div class="main-wrapper">\r\n    <aside class="desktop-sidebar" [class.fechada]="!sidebarAberta" role="navigation" aria-label="Menu lateral">\r\n      <div class="sidebar-header">\r\n        <img src="assets/png/LogoTavolaSimples.png" alt="Logo Tavola" class="logo" />\r\n      </div>\r\n      <nav class="menu" role="navigation" aria-label="Menu principal">\r\n        <button routerLink="/home" routerLinkActive="active" type="button">\r\n          <mat-icon>home</mat-icon>\r\n          <span>In\xEDcio</span>\r\n        </button>\r\n        <button routerLink="/historico" routerLinkActive="active" type="button">\r\n          <mat-icon>history</mat-icon>\r\n          <span>Hist\xF3rico</span>\r\n        </button>\r\n        <button routerLink="/favoritos" routerLinkActive="active" type="button">\r\n          <mat-icon>favorite</mat-icon>\r\n          <span>Favoritos</span>\r\n        </button>\r\n      </nav>\r\n    </aside>\r\n\r\n    <main class="content" role="main">\r\n      <!-- Intentionally empty: this layout shows only sidebar + menubar -->\r\n    </main>\r\n  </div>\r\n</div>\r\n' }]
  }], () => [{ type: Router }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LayoutPrincipalComponent, { className: "LayoutPrincipalComponent", filePath: "src/app/pages/layout-principal/layout-principal.component.ts", lineNumber: 17 });
})();
export {
  LayoutPrincipalComponent
};
//# sourceMappingURL=chunk-CJCLGBJK.js.map
