import {
  AnimationDriver,
  AnimationEngine,
  AnimationRendererFactory,
  AnimationStyleNormalizer,
  NoopAnimationDriver,
  WebAnimationsDriver,
  WebAnimationsStyleNormalizer,
  animate,
  sequence,
  state,
  style,
  transition,
  trigger
} from "./chunk-53AACB3W.js";
import {
  AuthService,
  BrowserModule,
  DOCUMENT,
  Directionality,
  DomRendererFactory2,
  DomSanitizer,
  HttpBackend,
  HttpClient,
  MediaMatcher,
  NgIf,
  NgTemplateOutlet,
  Platform,
  coerceBooleanProperty,
  coerceCssPixelValue,
  environment
} from "./chunk-CSZAONZW.js";
import {
  ANIMATION_MODULE_TYPE,
  ApplicationRef,
  CSP_NONCE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver$1,
  ContentChild,
  ContentChildren,
  DestroyRef,
  Directive,
  EMPTY,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  NgZone,
  Observable,
  Optional,
  Renderer2,
  RendererFactory2,
  RuntimeError,
  SecurityContext,
  Subject,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  __esDecorate,
  __runInitializers,
  __spreadProps,
  __spreadValues,
  afterNextRender,
  assertInInjectionContext,
  assertNotInReactiveContext,
  auditTime,
  booleanAttribute,
  catchError,
  computed,
  distinctUntilChanged,
  filter,
  finalize,
  from,
  fromEvent,
  inject,
  input,
  isDevMode,
  makeEnvironmentProviders,
  map,
  numberAttribute,
  of,
  performanceMarkFeature,
  setClassMetadata,
  share,
  signal,
  startWith,
  take,
  takeUntil,
  tap,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleProp,
  ɵɵsyntheticHostProperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-IKAMEZHE.js";

// node_modules/@angular/platform-browser/fesm2022/animations.mjs
var InjectableAnimationEngine = class _InjectableAnimationEngine extends AnimationEngine {
  // The `ApplicationRef` is injected here explicitly to force the dependency ordering.
  // Since the `ApplicationRef` should be created earlier before the `AnimationEngine`, they
  // both have `ngOnDestroy` hooks and `flush()` must be called after all views are destroyed.
  constructor(doc, driver, normalizer) {
    super(doc, driver, normalizer);
  }
  ngOnDestroy() {
    this.flush();
  }
  static \u0275fac = function InjectableAnimationEngine_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InjectableAnimationEngine)(\u0275\u0275inject(DOCUMENT), \u0275\u0275inject(AnimationDriver), \u0275\u0275inject(AnimationStyleNormalizer));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _InjectableAnimationEngine,
    factory: _InjectableAnimationEngine.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InjectableAnimationEngine, [{
    type: Injectable
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: AnimationDriver
  }, {
    type: AnimationStyleNormalizer
  }], null);
})();
function instantiateDefaultStyleNormalizer() {
  return new WebAnimationsStyleNormalizer();
}
function instantiateRendererFactory(renderer, engine, zone) {
  return new AnimationRendererFactory(renderer, engine, zone);
}
var SHARED_ANIMATION_PROVIDERS = [{
  provide: AnimationStyleNormalizer,
  useFactory: instantiateDefaultStyleNormalizer
}, {
  provide: AnimationEngine,
  useClass: InjectableAnimationEngine
}, {
  provide: RendererFactory2,
  useFactory: instantiateRendererFactory,
  deps: [DomRendererFactory2, AnimationEngine, NgZone]
}];
var BROWSER_NOOP_ANIMATIONS_PROVIDERS = [{
  provide: AnimationDriver,
  useClass: NoopAnimationDriver
}, {
  provide: ANIMATION_MODULE_TYPE,
  useValue: "NoopAnimations"
}, ...SHARED_ANIMATION_PROVIDERS];
var BROWSER_ANIMATIONS_PROVIDERS = [
  // Note: the `ngServerMode` happen inside factories to give the variable time to initialize.
  {
    provide: AnimationDriver,
    useFactory: () => false ? new NoopAnimationDriver() : new WebAnimationsDriver()
  },
  {
    provide: ANIMATION_MODULE_TYPE,
    useFactory: () => false ? "NoopAnimations" : "BrowserAnimations"
  },
  ...SHARED_ANIMATION_PROVIDERS
];
var BrowserAnimationsModule = class _BrowserAnimationsModule {
  /**
   * Configures the module based on the specified object.
   *
   * @param config Object used to configure the behavior of the `BrowserAnimationsModule`.
   * @see {@link BrowserAnimationsModuleConfig}
   *
   * @usageNotes
   * When registering the `BrowserAnimationsModule`, you can use the `withConfig`
   * function as follows:
   * ```ts
   * @NgModule({
   *   imports: [BrowserAnimationsModule.withConfig(config)]
   * })
   * class MyNgModule {}
   * ```
   */
  static withConfig(config) {
    return {
      ngModule: _BrowserAnimationsModule,
      providers: config.disableAnimations ? BROWSER_NOOP_ANIMATIONS_PROVIDERS : BROWSER_ANIMATIONS_PROVIDERS
    };
  }
  static \u0275fac = function BrowserAnimationsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserAnimationsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _BrowserAnimationsModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: BROWSER_ANIMATIONS_PROVIDERS,
    imports: [BrowserModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();
function provideAnimations() {
  performanceMarkFeature("NgEagerAnimations");
  return [...BROWSER_ANIMATIONS_PROVIDERS];
}
var NoopAnimationsModule = class _NoopAnimationsModule {
  static \u0275fac = function NoopAnimationsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NoopAnimationsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NoopAnimationsModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
    imports: [BrowserModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoopAnimationsModule, [{
    type: NgModule,
    args: [{
      exports: [BrowserModule],
      providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS
    }]
  }], null, null);
})();

// src/app/core/services/access.service.ts
var AcessService = class _AcessService {
  constructor(httpClient, auth) {
    this.httpClient = httpClient;
    this.auth = auth;
    this.apiUrl = `${environment.apiUrl}/auth`;
  }
  login(email, senha) {
    return this.httpClient.post(`${this.apiUrl}/login`, { email, senha }, { withCredentials: true }).pipe(tap((value) => {
      this.auth.setToken(value.token);
      this.auth.setPerfil({
        tipo: value.tipoUsuario,
        nome: value.nome,
        id: value.id,
        imagem: value.imagem,
        restauranteId: value.restauranteId
      });
    }));
  }
  /**
   * Login com token do Google (idToken). Envia o token para o backend e salva JWT + perfil.
   */
  loginWithGoogle(idToken) {
    return this.httpClient.post(`${this.apiUrl}/google`, { token: idToken }, { withCredentials: true }).pipe(tap((value) => {
      this.auth.setToken(value.token);
      this.auth.setPerfil({
        tipo: value.tipoUsuario,
        nome: value.nome,
        id: value.id,
        imagem: value.imagem,
        restauranteId: value.restauranteId
      });
    }));
  }
  signup(data) {
    return this.httpClient.post(`${this.apiUrl}/register`, data, { withCredentials: true });
  }
  refreshToken() {
    console.log("[LoginService] calling /auth/refresh");
    return this.httpClient.post(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(tap((res) => {
      console.log("[LoginService] refresh response received:", res);
      this.auth.setToken(res.token);
      this.auth.setPerfil({
        tipo: res.tipoUsuario,
        nome: res.nome,
        imagem: res.imagem,
        id: res.id,
        restauranteId: res.restauranteId
      });
    }));
  }
  reenviarCodigo(email) {
    return this.httpClient.post(`${this.apiUrl}/reenviar-codigo`, { email });
  }
  esqueciMinhaSenha(email) {
    return this.httpClient.post(`${this.apiUrl}/esqueci-senha`, { email });
  }
  // access.service.ts
  verificarCodigo(idVerificacao, codigo, mantenhaMeConectado) {
    return this.httpClient.post(`${this.apiUrl}/verificar`, {
      idVerificacao,
      codigo,
      mantenhaMeConectado
    }, { withCredentials: true }).pipe(
      // <<< CORREÇÃO APLICADA AQUI
      tap((value) => {
        if (value.token) {
          this.auth.setToken(value.token);
          this.auth.setPerfil({
            tipo: value.tipoUsuario,
            nome: value.nome,
            id: value.id,
            imagem: value.imagem,
            restauranteId: value.restauranteId
          });
        }
      })
    );
  }
  // ...
  logout() {
    return this.httpClient.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(tap(() => {
      this.auth.clearAuthData();
    }));
  }
  /**
   * Envia a nova senha para o backend para concluir a redefinição.
   * O token é passado na URL como path parameter.
   */
  redefinirSenha(token, novaSenha) {
    return this.httpClient.post(`${this.apiUrl}/mudar-senha/${token}`, { novaSenha }, { withCredentials: true });
  }
  /**
   * Login específico para garçons/funcionários
   */
  loginGarcom(emailRestaurante, codigoIdentidade, senha) {
    return this.httpClient.post(`${this.apiUrl}/login/garcom`, {
      emailRestaurante,
      codigoIdentidade,
      senha
    }, { withCredentials: true }).pipe(tap((value) => {
      console.log("[AcessService] loginGarcom - Response completo:", value);
      this.auth.setToken(value.token);
      const restauranteId = value.restauranteId;
      console.log("[AcessService] loginGarcom - restauranteId extra\xEDdo:", restauranteId);
      console.log("[AcessService] loginGarcom - Dados do perfil a serem salvos:", {
        tipo: value.tipoUsuario,
        nome: value.nome,
        id: value.id,
        imagem: value.imagem,
        restauranteId: value.restauranteId
      });
      this.auth.setPerfil({
        tipo: value.tipoUsuario,
        nome: value.nome,
        id: value.id,
        imagem: value.imagem,
        restauranteId: value.restauranteId
      });
      console.log("[AcessService] loginGarcom - Perfil salvo. Verificando localStorage...");
      console.log("[AcessService] loginGarcom - localStorage ap\xF3s salvar:", {
        tipoUsuario: localStorage.getItem("tipoUsuario"),
        restauranteIdFuncionario: localStorage.getItem("restauranteIdFuncionario"),
        nome: localStorage.getItem("nome"),
        token: localStorage.getItem("token") ? "presente" : "ausente"
      });
    }));
  }
  static {
    this.\u0275fac = function AcessService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AcessService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(AuthService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AcessService, factory: _AcessService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AcessService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }, { type: AuthService }], null);
})();

// node_modules/@ant-design/icons-angular/fesm2022/ant-design-icons-angular-icons.mjs
var ArrowLeftOutline = {
  name: "arrow-left",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" /></svg>'
};
var BarsOutline = {
  name: "bars",
  theme: "outline",
  icon: '<svg viewBox="0 0 1024 1024" focusable="false"><path d="M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM104 228a56 56 0 10112 0 56 56 0 10-112 0zm0 284a56 56 0 10112 0 56 56 0 10-112 0zm0 284a56 56 0 10112 0 56 56 0 10-112 0z" /></svg>'
};
var CalendarOutline = {
  name: "calendar",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z" /></svg>'
};
var CarOutline = {
  name: "car",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M380 704h264c4.4 0 8-3.6 8-8v-84c0-4.4-3.6-8-8-8h-40c-4.4 0-8 3.6-8 8v36H428v-36c0-4.4-3.6-8-8-8h-40c-4.4 0-8 3.6-8 8v84c0 4.4 3.6 8 8 8zm340-123a40 40 0 1080 0 40 40 0 10-80 0zm239-167.6L935.3 372a8 8 0 00-10.9-2.9l-50.7 29.6-78.3-216.2a63.9 63.9 0 00-60.9-44.4H301.2c-34.7 0-65.5 22.4-76.2 55.5l-74.6 205.2-50.8-29.6a8 8 0 00-10.9 2.9L65 413.4c-2.2 3.8-.9 8.6 2.9 10.8l60.4 35.2-14.5 40c-1.2 3.2-1.8 6.6-1.8 10v348.2c0 15.7 11.8 28.4 26.3 28.4h67.6c12.3 0 23-9.3 25.6-22.3l7.7-37.7h545.6l7.7 37.7c2.7 13 13.3 22.3 25.6 22.3h67.6c14.5 0 26.3-12.7 26.3-28.4V509.4c0-3.4-.6-6.8-1.8-10l-14.5-40 60.3-35.2a8 8 0 003-10.8zM840 517v237H184V517l15.6-43h624.8l15.6 43zM292.7 218.1l.5-1.3.4-1.3c1.1-3.3 4.1-5.5 7.6-5.5h427.6l75.4 208H220l72.7-199.9zM224 581a40 40 0 1080 0 40 40 0 10-80 0z" /></svg>'
};
var CaretDownFill = {
  name: "caret-down",
  theme: "fill",
  icon: '<svg viewBox="0 0 1024 1024" focusable="false"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" /></svg>'
};
var CaretUpFill = {
  name: "caret-up",
  theme: "fill",
  icon: '<svg viewBox="0 0 1024 1024" focusable="false"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" /></svg>'
};
var CaretDownOutline = {
  name: "caret-down",
  theme: "outline",
  icon: '<svg viewBox="0 0 1024 1024" focusable="false"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" /></svg>'
};
var CheckOutline = {
  name: "check",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" /></svg>'
};
var CaretUpOutline = {
  name: "caret-up",
  theme: "outline",
  icon: '<svg viewBox="0 0 1024 1024" focusable="false"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" /></svg>'
};
var ClockCircleOutline = {
  name: "clock-circle",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" /><path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z" /></svg>'
};
var CloseCircleFill = {
  name: "close-circle",
  theme: "fill",
  icon: '<svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false"><path d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z" /></svg>'
};
var CloseOutline = {
  name: "close",
  theme: "outline",
  icon: '<svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" /></svg>'
};
var CloseCircleOutline = {
  name: "close-circle",
  theme: "outline",
  icon: '<svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false"><path d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm128.01 198.83c.03 0 .05.01.09.06l45.02 45.01a.2.2 0 01.05.09.12.12 0 010 .07c0 .02-.01.04-.05.08L557.25 512l127.87 127.86a.27.27 0 01.05.06v.02a.12.12 0 010 .07c0 .03-.01.05-.05.09l-45.02 45.02a.2.2 0 01-.09.05.12.12 0 01-.07 0c-.02 0-.04-.01-.08-.05L512 557.25 384.14 685.12c-.04.04-.06.05-.08.05a.12.12 0 01-.07 0c-.03 0-.05-.01-.09-.05l-45.02-45.02a.2.2 0 01-.05-.09.12.12 0 010-.07c0-.02.01-.04.06-.08L466.75 512 338.88 384.14a.27.27 0 01-.05-.06l-.01-.02a.12.12 0 010-.07c0-.03.01-.05.05-.09l45.02-45.02a.2.2 0 01.09-.05.12.12 0 01.07 0c.02 0 .04.01.08.06L512 466.75l127.86-127.86c.04-.05.06-.06.08-.06a.12.12 0 01.07 0z" /></svg>'
};
var CheckCircleOutline = {
  name: "check-circle",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z" /><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" /></svg>'
};
var CheckCircleFill = {
  name: "check-circle",
  theme: "fill",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" /></svg>'
};
var CopyOutline = {
  name: "copy",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z" /></svg>'
};
var DeleteOutline = {
  name: "delete",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" /></svg>'
};
var DoubleLeftOutline = {
  name: "double-left",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z" /></svg>'
};
var DoubleRightOutline = {
  name: "double-right",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 00188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 00492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z" /></svg>'
};
var DownOutline = {
  name: "down",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" /></svg>'
};
var EllipsisOutline = {
  name: "ellipsis",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z" /></svg>'
};
var EnvironmentOutline = {
  name: "environment",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M854.6 289.1a362.49 362.49 0 00-79.9-115.7 370.83 370.83 0 00-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 00169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0022.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z" /></svg>'
};
var ExclamationCircleOutline = {
  name: "exclamation-circle",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" /><path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z" /></svg>'
};
var ExclamationCircleFill = {
  name: "exclamation-circle",
  theme: "fill",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" /></svg>'
};
var EyeOutline = {
  name: "eye",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" /></svg>'
};
var FileFill = {
  name: "file",
  theme: "fill",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2z" /></svg>'
};
var CrownOutline = {
  name: "crown",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M899.6 276.5L705 396.4 518.4 147.5a8.06 8.06 0 00-12.9 0L319 396.4 124.3 276.5c-5.7-3.5-13.1 1.2-12.2 7.9L188.5 865c1.1 7.9 7.9 14 16 14h615.1c8 0 14.9-6 15.9-14l76.4-580.6c.8-6.7-6.5-11.4-12.3-7.9zm-126 534.1H250.3l-53.8-409.4 139.8 86.1L512 252.9l175.7 234.4 139.8-86.1-53.9 409.4zM512 509c-62.1 0-112.6 50.5-112.6 112.6S449.9 734.2 512 734.2s112.6-50.5 112.6-112.6S574.1 509 512 509zm0 160.9c-26.6 0-48.2-21.6-48.2-48.3 0-26.6 21.6-48.3 48.2-48.3s48.2 21.6 48.2 48.3c0 26.6-21.6 48.3-48.2 48.3z" /></svg>'
};
var FileOutline = {
  name: "file",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z" /></svg>'
};
var FilterFill = {
  name: "filter",
  theme: "fill",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376h348.8l221.3-376c12.1-21.3-3.2-48-27.7-48z" /></svg>'
};
var FireFill = {
  name: "fire",
  theme: "fill",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M834.1 469.2A347.49 347.49 0 00751.2 354l-29.1-26.7a8.09 8.09 0 00-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 01-47.5 46.1 352.6 352.6 0 00-100.3 121.5A347.75 347.75 0 00160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0075.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 00760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0027.7-136c0-48.8-10-96.2-29.9-140.9z" /></svg>'
};
var FlagOutline = {
  name: "flag",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M880 305H624V192c0-17.7-14.3-32-32-32H184v-40c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v784c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V640h248v113c0 17.7 14.3 32 32 32h416c17.7 0 32-14.3 32-32V337c0-17.7-14.3-32-32-32zM184 568V232h368v336H184zm656 145H504v-73h112c4.4 0 8-3.6 8-8V377h216v336z" /></svg>'
};
var EditOutline = {
  name: "edit",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></svg>'
};
var HeartFill = {
  name: "heart",
  theme: "fill",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9z" /></svg>'
};
var HeartOutline = {
  name: "heart",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" /></svg>'
};
var HomeOutline = {
  name: "home",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" /></svg>'
};
var InfoCircleOutline = {
  name: "info-circle",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" /><path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" /></svg>'
};
var LoadingOutline = {
  name: "loading",
  theme: "outline",
  icon: '<svg viewBox="0 0 1024 1024" focusable="false"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" /></svg>'
};
var LeftOutline = {
  name: "left",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z" /></svg>'
};
var MailOutline = {
  name: "mail",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0068.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z" /></svg>'
};
var LoginOutline = {
  name: "login",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><defs><style /></defs><path d="M521.7 82c-152.5-.4-286.7 78.5-363.4 197.7-3.4 5.3.4 12.3 6.7 12.3h70.3c4.8 0 9.3-2.1 12.3-5.8 7-8.5 14.5-16.7 22.4-24.5 32.6-32.5 70.5-58.1 112.7-75.9 43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 32.6 32.5 58.1 70.4 76 112.5C865.7 417.8 875 464.1 875 512c0 47.9-9.4 94.2-27.8 137.8-17.8 42.1-43.4 80-76 112.5s-70.5 58.1-112.7 75.9A352.8 352.8 0 01520.6 866c-47.9 0-94.3-9.4-137.9-27.8A353.84 353.84 0 01270 762.3c-7.9-7.9-15.3-16.1-22.4-24.5-3-3.7-7.6-5.8-12.3-5.8H165c-6.3 0-10.2 7-6.7 12.3C234.9 863.2 368.5 942 520.6 942c236.2 0 428-190.1 430.4-425.6C953.4 277.1 761.3 82.6 521.7 82zM395.02 624v-76h-314c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8h314v-76c0-6.7 7.8-10.5 13-6.3l141.9 112a8 8 0 010 12.6l-141.9 112c-5.2 4.1-13 .4-13-6.3z" /></svg>'
};
var KeyOutline = {
  name: "key",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M608 112c-167.9 0-304 136.1-304 304 0 70.3 23.9 135 63.9 186.5l-41.1 41.1-62.3-62.3a8.15 8.15 0 00-11.4 0l-39.8 39.8a8.15 8.15 0 000 11.4l62.3 62.3-44.9 44.9-62.3-62.3a8.15 8.15 0 00-11.4 0l-39.8 39.8a8.15 8.15 0 000 11.4l62.3 62.3-65.3 65.3a8.03 8.03 0 000 11.3l42.3 42.3c3.1 3.1 8.2 3.1 11.3 0l253.6-253.6A304.06 304.06 0 00608 720c167.9 0 304-136.1 304-304S775.9 112 608 112zm161.2 465.2C726.2 620.3 668.9 644 608 644c-60.9 0-118.2-23.7-161.2-66.8-43.1-43-66.8-100.3-66.8-161.2 0-60.9 23.7-118.2 66.8-161.2 43-43.1 100.3-66.8 161.2-66.8 60.9 0 118.2 23.7 161.2 66.8 43.1 43 66.8 100.3 66.8 161.2 0 60.9-23.7 118.2-66.8 161.2z" /></svg>'
};
var PaperClipOutline = {
  name: "paper-clip",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 00174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z" /></svg>'
};
var QuestionCircleOutline = {
  name: "question-circle",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" /><path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z" /></svg>'
};
var ReloadOutline = {
  name: "reload",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 00-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 01655.9 829c-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 01279 755.2a342.16 342.16 0 01-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27a341.5 341.5 0 01109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z" /></svg>'
};
var RightOutline = {
  name: "right",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" /></svg>'
};
var RotateRightOutline = {
  name: "rotate-right",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><defs><style /></defs><path d="M480.5 251.2c13-1.6 25.9-2.4 38.8-2.5v63.9c0 6.5 7.5 10.1 12.6 6.1L660 217.6c4-3.2 4-9.2 0-12.3l-128-101c-5.1-4-12.6-.4-12.6 6.1l-.2 64c-118.6.5-235.8 53.4-314.6 154.2A399.75 399.75 0 00123.5 631h74.9c-.9-5.3-1.7-10.7-2.4-16.1-5.1-42.1-2.1-84.1 8.9-124.8 11.4-42.2 31-81.1 58.1-115.8 27.2-34.7 60.3-63.2 98.4-84.3 37-20.6 76.9-33.6 119.1-38.8z" /><path d="M880 418H352c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H396V494h440v326z" /></svg>'
};
var SafetyCertificateOutline = {
  name: "safety-certificate",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M866.9 169.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM810 654.3L512 886.5 214 654.3V226.7l298-101.6 298 101.6v427.6zm-405.8-201c-3-4.1-7.8-6.6-13-6.6H336c-6.5 0-10.3 7.4-6.5 12.7l126.4 174a16.1 16.1 0 0026 0l212.6-292.7c3.8-5.3 0-12.7-6.5-12.7h-55.2c-5.1 0-10 2.5-13 6.6L468.9 542.4l-64.7-89.1z" /></svg>'
};
var RotateLeftOutline = {
  name: "rotate-left",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><defs><style /></defs><path d="M672 418H144c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H188V494h440v326z" /><path d="M819.3 328.5c-78.8-100.7-196-153.6-314.6-154.2l-.2-64c0-6.5-7.6-10.1-12.6-6.1l-128 101c-4 3.1-3.9 9.1 0 12.3L492 318.6c5.1 4 12.7.4 12.6-6.1v-63.9c12.9.1 25.9.9 38.8 2.5 42.1 5.2 82.1 18.2 119 38.7 38.1 21.2 71.2 49.7 98.4 84.3 27.1 34.7 46.7 73.7 58.1 115.8a325.95 325.95 0 016.5 140.9h74.9c14.8-103.6-11.3-213-81-302.3z" /></svg>'
};
var ShopOutline = {
  name: "shop",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M882 272.1V144c0-17.7-14.3-32-32-32H174c-17.7 0-32 14.3-32 32v128.1c-16.7 1-30 14.9-30 31.9v131.7a177 177 0 0014.4 70.4c4.3 10.2 9.6 19.8 15.6 28.9v345c0 17.6 14.3 32 32 32h676c17.7 0 32-14.3 32-32V535a175 175 0 0015.6-28.9c9.5-22.3 14.4-46 14.4-70.4V304c0-17-13.3-30.9-30-31.9zM214 184h596v88H214v-88zm362 656.1H448V736h128v104.1zm234 0H640V704c0-17.7-14.3-32-32-32H416c-17.7 0-32 14.3-32 32v136.1H214V597.9c2.9 1.4 5.9 2.8 9 4 22.3 9.4 46 14.1 70.4 14.1s48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1.2-.1.4-.1.6 0a180.4 180.4 0 0038.7 22.1c22.3 9.4 46 14.1 70.4 14.1 24.4 0 48-4.7 70.4-14.1 13.8-5.8 26.8-13.2 38.7-22.1.2-.1.4-.1.6 0a180.4 180.4 0 0038.7 22.1c22.3 9.4 46 14.1 70.4 14.1 24.4 0 48-4.7 70.4-14.1 3-1.3 6-2.6 9-4v242.2zm30-404.4c0 59.8-49 108.3-109.3 108.3-40.8 0-76.4-22.1-95.2-54.9-2.9-5-8.1-8.1-13.9-8.1h-.6c-5.7 0-11 3.1-13.9 8.1A109.24 109.24 0 01512 544c-40.7 0-76.2-22-95-54.7-3-5.1-8.4-8.3-14.3-8.3s-11.4 3.2-14.3 8.3a109.63 109.63 0 01-95.1 54.7C233 544 184 495.5 184 435.7v-91.2c0-.3.2-.5.5-.5h655c.3 0 .5.2.5.5v91.2z" /></svg>'
};
var SearchOutline = {
  name: "search",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" /></svg>'
};
var StarOutline = {
  name: "star",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z" /></svg>'
};
var StarFill = {
  name: "star",
  theme: "fill",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" /></svg>'
};
var SwapOutline = {
  name: "swap",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" /></svg>'
};
var InfoCircleFill = {
  name: "info-circle",
  theme: "fill",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" /></svg>'
};
var TeamOutline = {
  name: "team",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M824.2 699.9a301.55 301.55 0 00-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 00-86.4 60.4C345 754.6 314 826.8 312 903.8a8 8 0 008 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5A226.62 226.62 0 01612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c.1 4.3 3.7 7.7 8 7.7h56a8 8 0 008-8.2c-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5a126.86 126.86 0 01-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5A127.3 127.3 0 01612 612zM361.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 01-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 008 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z" /></svg>'
};
var SwapRightOutline = {
  name: "swap-right",
  theme: "outline",
  icon: '<svg viewBox="0 0 1024 1024" focusable="false"><path d="M873.1 596.2l-164-208A32 32 0 00684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z" /></svg>'
};
var UpOutline = {
  name: "up",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z" /></svg>'
};
var UploadOutline = {
  name: "upload",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z" /></svg>'
};
var VerticalAlignTopOutline = {
  name: "vertical-align-top",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M859.9 168H164.1c-4.5 0-8.1 3.6-8.1 8v60c0 4.4 3.6 8 8.1 8h695.8c4.5 0 8.1-3.6 8.1-8v-60c0-4.4-3.6-8-8.1-8zM518.3 355a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V848c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V509.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 355z" /></svg>'
};
var UserAddOutline = {
  name: "user-add",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M678.3 642.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 00-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 505 759.6 431.7 759.6 349c0-137-110.8-248-247.5-248S264.7 212 264.7 349c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 00-80.4 119.5A373.6 373.6 0 00137 888.8a8 8 0 008 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C357 628.2 432.2 597 512.2 597c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 008.1.3zM512.2 521c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 01340.5 349c0-45.9 17.9-89.1 50.3-121.6S466.3 177 512.2 177s88.9 17.9 121.4 50.4A171.2 171.2 0 01683.9 349c0 45.9-17.9 89.1-50.3 121.6C601.1 503.1 558 521 512.2 521zM880 759h-84v-84c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v84h-84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h84v84c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-84h84c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" /></svg>'
};
var ZoomOutOutline = {
  name: "zoom-out",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M637 443H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h312c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z" /></svg>'
};
var ZoomInOutline = {
  name: "zoom-in",
  theme: "outline",
  icon: '<svg viewBox="64 64 896 896" focusable="false"><path d="M637 443H519V309c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v134H325c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h118v134c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V519h118c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm284 424L775 721c122.1-148.9 113.6-369.5-26-509-148-148.1-388.4-148.1-537 0-148.1 148.6-148.1 389 0 537 139.5 139.6 360.1 148.1 509 26l146 146c3.2 2.8 8.3 2.8 11 0l43-43c2.8-2.7 2.8-7.8 0-11zM696 696c-118.8 118.7-311.2 118.7-430 0-118.7-118.8-118.7-311.2 0-430 118.8-118.7 311.2-118.7 430 0 118.7 118.8 118.7 311.2 0 430z" /></svg>'
};

// node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}

// node_modules/@babel/runtime/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

// node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}

// node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}

// node_modules/@ant-design/fast-color/es/FastColor.js
var round = Math.round;
function splitColorStr(str, parseNum) {
  const match = str.replace(/^[^(]*\((.*)/, "$1").replace(/\).*/, "").match(/\d*\.?\d+%?/g) || [];
  const numList = match.map((item) => parseFloat(item));
  for (let i = 0; i < 3; i += 1) {
    numList[i] = parseNum(numList[i] || 0, match[i] || "", i);
  }
  if (match[3]) {
    numList[3] = match[3].includes("%") ? numList[3] / 100 : numList[3];
  } else {
    numList[3] = 1;
  }
  return numList;
}
var parseHSVorHSL = (num, _, index) => index === 0 ? num : num / 100;
function limitRange(value, max) {
  const mergedMax = max || 255;
  if (value > mergedMax) {
    return mergedMax;
  }
  if (value < 0) {
    return 0;
  }
  return value;
}
var FastColor = class _FastColor {
  constructor(input2) {
    _defineProperty(this, "isValid", true);
    _defineProperty(this, "r", 0);
    _defineProperty(this, "g", 0);
    _defineProperty(this, "b", 0);
    _defineProperty(this, "a", 1);
    _defineProperty(this, "_h", void 0);
    _defineProperty(this, "_s", void 0);
    _defineProperty(this, "_l", void 0);
    _defineProperty(this, "_v", void 0);
    _defineProperty(this, "_max", void 0);
    _defineProperty(this, "_min", void 0);
    _defineProperty(this, "_brightness", void 0);
    function matchFormat(str) {
      return str[0] in input2 && str[1] in input2 && str[2] in input2;
    }
    if (!input2) {
    } else if (typeof input2 === "string") {
      let matchPrefix2 = function(prefix) {
        return trimStr.startsWith(prefix);
      };
      var matchPrefix = matchPrefix2;
      const trimStr = input2.trim();
      if (/^#?[A-F\d]{3,8}$/i.test(trimStr)) {
        this.fromHexString(trimStr);
      } else if (matchPrefix2("rgb")) {
        this.fromRgbString(trimStr);
      } else if (matchPrefix2("hsl")) {
        this.fromHslString(trimStr);
      } else if (matchPrefix2("hsv") || matchPrefix2("hsb")) {
        this.fromHsvString(trimStr);
      }
    } else if (input2 instanceof _FastColor) {
      this.r = input2.r;
      this.g = input2.g;
      this.b = input2.b;
      this.a = input2.a;
      this._h = input2._h;
      this._s = input2._s;
      this._l = input2._l;
      this._v = input2._v;
    } else if (matchFormat("rgb")) {
      this.r = limitRange(input2.r);
      this.g = limitRange(input2.g);
      this.b = limitRange(input2.b);
      this.a = typeof input2.a === "number" ? limitRange(input2.a, 1) : 1;
    } else if (matchFormat("hsl")) {
      this.fromHsl(input2);
    } else if (matchFormat("hsv")) {
      this.fromHsv(input2);
    } else {
      throw new Error("@ant-design/fast-color: unsupported input " + JSON.stringify(input2));
    }
  }
  // ======================= Setter =======================
  setR(value) {
    return this._sc("r", value);
  }
  setG(value) {
    return this._sc("g", value);
  }
  setB(value) {
    return this._sc("b", value);
  }
  setA(value) {
    return this._sc("a", value, 1);
  }
  setHue(value) {
    const hsv = this.toHsv();
    hsv.h = value;
    return this._c(hsv);
  }
  // ======================= Getter =======================
  /**
   * Returns the perceived luminance of a color, from 0-1.
   * @see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
   */
  getLuminance() {
    function adjustGamma(raw) {
      const val = raw / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    }
    const R = adjustGamma(this.r);
    const G = adjustGamma(this.g);
    const B = adjustGamma(this.b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
  getHue() {
    if (typeof this._h === "undefined") {
      const delta = this.getMax() - this.getMin();
      if (delta === 0) {
        this._h = 0;
      } else {
        this._h = round(60 * (this.r === this.getMax() ? (this.g - this.b) / delta + (this.g < this.b ? 6 : 0) : this.g === this.getMax() ? (this.b - this.r) / delta + 2 : (this.r - this.g) / delta + 4));
      }
    }
    return this._h;
  }
  getSaturation() {
    if (typeof this._s === "undefined") {
      const delta = this.getMax() - this.getMin();
      if (delta === 0) {
        this._s = 0;
      } else {
        this._s = delta / this.getMax();
      }
    }
    return this._s;
  }
  getLightness() {
    if (typeof this._l === "undefined") {
      this._l = (this.getMax() + this.getMin()) / 510;
    }
    return this._l;
  }
  getValue() {
    if (typeof this._v === "undefined") {
      this._v = this.getMax() / 255;
    }
    return this._v;
  }
  /**
   * Returns the perceived brightness of the color, from 0-255.
   * Note: this is not the b of HSB
   * @see http://www.w3.org/TR/AERT#color-contrast
   */
  getBrightness() {
    if (typeof this._brightness === "undefined") {
      this._brightness = (this.r * 299 + this.g * 587 + this.b * 114) / 1e3;
    }
    return this._brightness;
  }
  // ======================== Func ========================
  darken(amount = 10) {
    const h = this.getHue();
    const s = this.getSaturation();
    let l = this.getLightness() - amount / 100;
    if (l < 0) {
      l = 0;
    }
    return this._c({
      h,
      s,
      l,
      a: this.a
    });
  }
  lighten(amount = 10) {
    const h = this.getHue();
    const s = this.getSaturation();
    let l = this.getLightness() + amount / 100;
    if (l > 1) {
      l = 1;
    }
    return this._c({
      h,
      s,
      l,
      a: this.a
    });
  }
  /**
   * Mix the current color a given amount with another color, from 0 to 100.
   * 0 means no mixing (return current color).
   */
  mix(input2, amount = 50) {
    const color = this._c(input2);
    const p = amount / 100;
    const calc = (key) => (color[key] - this[key]) * p + this[key];
    const rgba = {
      r: round(calc("r")),
      g: round(calc("g")),
      b: round(calc("b")),
      a: round(calc("a") * 100) / 100
    };
    return this._c(rgba);
  }
  /**
   * Mix the color with pure white, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return white.
   */
  tint(amount = 10) {
    return this.mix({
      r: 255,
      g: 255,
      b: 255,
      a: 1
    }, amount);
  }
  /**
   * Mix the color with pure black, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return black.
   */
  shade(amount = 10) {
    return this.mix({
      r: 0,
      g: 0,
      b: 0,
      a: 1
    }, amount);
  }
  onBackground(background) {
    const bg = this._c(background);
    const alpha = this.a + bg.a * (1 - this.a);
    const calc = (key) => {
      return round((this[key] * this.a + bg[key] * bg.a * (1 - this.a)) / alpha);
    };
    return this._c({
      r: calc("r"),
      g: calc("g"),
      b: calc("b"),
      a: alpha
    });
  }
  // ======================= Status =======================
  isDark() {
    return this.getBrightness() < 128;
  }
  isLight() {
    return this.getBrightness() >= 128;
  }
  // ======================== MISC ========================
  equals(other) {
    return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
  }
  clone() {
    return this._c(this);
  }
  // ======================= Format =======================
  toHexString() {
    let hex = "#";
    const rHex = (this.r || 0).toString(16);
    hex += rHex.length === 2 ? rHex : "0" + rHex;
    const gHex = (this.g || 0).toString(16);
    hex += gHex.length === 2 ? gHex : "0" + gHex;
    const bHex = (this.b || 0).toString(16);
    hex += bHex.length === 2 ? bHex : "0" + bHex;
    if (typeof this.a === "number" && this.a >= 0 && this.a < 1) {
      const aHex = round(this.a * 255).toString(16);
      hex += aHex.length === 2 ? aHex : "0" + aHex;
    }
    return hex;
  }
  /** CSS support color pattern */
  toHsl() {
    return {
      h: this.getHue(),
      s: this.getSaturation(),
      l: this.getLightness(),
      a: this.a
    };
  }
  /** CSS support color pattern */
  toHslString() {
    const h = this.getHue();
    const s = round(this.getSaturation() * 100);
    const l = round(this.getLightness() * 100);
    return this.a !== 1 ? `hsla(${h},${s}%,${l}%,${this.a})` : `hsl(${h},${s}%,${l}%)`;
  }
  /** Same as toHsb */
  toHsv() {
    return {
      h: this.getHue(),
      s: this.getSaturation(),
      v: this.getValue(),
      a: this.a
    };
  }
  toRgb() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a
    };
  }
  toRgbString() {
    return this.a !== 1 ? `rgba(${this.r},${this.g},${this.b},${this.a})` : `rgb(${this.r},${this.g},${this.b})`;
  }
  toString() {
    return this.toRgbString();
  }
  // ====================== Privates ======================
  /** Return a new FastColor object with one channel changed */
  _sc(rgb, value, max) {
    const clone = this.clone();
    clone[rgb] = limitRange(value, max);
    return clone;
  }
  _c(input2) {
    return new this.constructor(input2);
  }
  getMax() {
    if (typeof this._max === "undefined") {
      this._max = Math.max(this.r, this.g, this.b);
    }
    return this._max;
  }
  getMin() {
    if (typeof this._min === "undefined") {
      this._min = Math.min(this.r, this.g, this.b);
    }
    return this._min;
  }
  fromHexString(trimStr) {
    const withoutPrefix = trimStr.replace("#", "");
    function connectNum(index1, index2) {
      return parseInt(withoutPrefix[index1] + withoutPrefix[index2 || index1], 16);
    }
    if (withoutPrefix.length < 6) {
      this.r = connectNum(0);
      this.g = connectNum(1);
      this.b = connectNum(2);
      this.a = withoutPrefix[3] ? connectNum(3) / 255 : 1;
    } else {
      this.r = connectNum(0, 1);
      this.g = connectNum(2, 3);
      this.b = connectNum(4, 5);
      this.a = withoutPrefix[6] ? connectNum(6, 7) / 255 : 1;
    }
  }
  fromHsl({
    h,
    s,
    l,
    a
  }) {
    this._h = h % 360;
    this._s = s;
    this._l = l;
    this.a = typeof a === "number" ? a : 1;
    if (s <= 0) {
      const rgb = round(l * 255);
      this.r = rgb;
      this.g = rgb;
      this.b = rgb;
    }
    let r = 0, g = 0, b = 0;
    const huePrime = h / 60;
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
    if (huePrime >= 0 && huePrime < 1) {
      r = chroma;
      g = secondComponent;
    } else if (huePrime >= 1 && huePrime < 2) {
      r = secondComponent;
      g = chroma;
    } else if (huePrime >= 2 && huePrime < 3) {
      g = chroma;
      b = secondComponent;
    } else if (huePrime >= 3 && huePrime < 4) {
      g = secondComponent;
      b = chroma;
    } else if (huePrime >= 4 && huePrime < 5) {
      r = secondComponent;
      b = chroma;
    } else if (huePrime >= 5 && huePrime < 6) {
      r = chroma;
      b = secondComponent;
    }
    const lightnessModification = l - chroma / 2;
    this.r = round((r + lightnessModification) * 255);
    this.g = round((g + lightnessModification) * 255);
    this.b = round((b + lightnessModification) * 255);
  }
  fromHsv({
    h,
    s,
    v,
    a
  }) {
    this._h = h % 360;
    this._s = s;
    this._v = v;
    this.a = typeof a === "number" ? a : 1;
    const vv = round(v * 255);
    this.r = vv;
    this.g = vv;
    this.b = vv;
    if (s <= 0) {
      return;
    }
    const hh = h / 60;
    const i = Math.floor(hh);
    const ff = hh - i;
    const p = round(v * (1 - s) * 255);
    const q = round(v * (1 - s * ff) * 255);
    const t = round(v * (1 - s * (1 - ff)) * 255);
    switch (i) {
      case 0:
        this.g = t;
        this.b = p;
        break;
      case 1:
        this.r = q;
        this.b = p;
        break;
      case 2:
        this.r = p;
        this.b = t;
        break;
      case 3:
        this.r = p;
        this.g = q;
        break;
      case 4:
        this.r = t;
        this.g = p;
        break;
      case 5:
      default:
        this.g = p;
        this.b = q;
        break;
    }
  }
  fromHsvString(trimStr) {
    const cells = splitColorStr(trimStr, parseHSVorHSL);
    this.fromHsv({
      h: cells[0],
      s: cells[1],
      v: cells[2],
      a: cells[3]
    });
  }
  fromHslString(trimStr) {
    const cells = splitColorStr(trimStr, parseHSVorHSL);
    this.fromHsl({
      h: cells[0],
      s: cells[1],
      l: cells[2],
      a: cells[3]
    });
  }
  fromRgbString(trimStr) {
    const cells = splitColorStr(trimStr, (num, txt) => (
      // Convert percentage to number. e.g. 50% -> 128
      txt.includes("%") ? round(num / 100 * 255) : num
    ));
    this.r = cells[0];
    this.g = cells[1];
    this.b = cells[2];
    this.a = cells[3];
  }
};

// node_modules/@ant-design/colors/es/generate.js
var hueStep = 2;
var saturationStep = 0.16;
var saturationStep2 = 0.05;
var brightnessStep1 = 0.05;
var brightnessStep2 = 0.15;
var lightColorCount = 5;
var darkColorCount = 4;
var darkColorMap = [{
  index: 7,
  amount: 15
}, {
  index: 6,
  amount: 25
}, {
  index: 5,
  amount: 30
}, {
  index: 5,
  amount: 45
}, {
  index: 5,
  amount: 65
}, {
  index: 5,
  amount: 85
}, {
  index: 4,
  amount: 90
}, {
  index: 3,
  amount: 95
}, {
  index: 2,
  amount: 97
}, {
  index: 1,
  amount: 98
}];
function getHue(hsv, i, light) {
  var hue;
  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
    hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
  } else {
    hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
  }
  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }
  return hue;
}
function getSaturation(hsv, i, light) {
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }
  var saturation;
  if (light) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  }
  if (saturation > 1) {
    saturation = 1;
  }
  if (light && i === lightColorCount && saturation > 0.1) {
    saturation = 0.1;
  }
  if (saturation < 0.06) {
    saturation = 0.06;
  }
  return Math.round(saturation * 100) / 100;
}
function getValue(hsv, i, light) {
  var value;
  if (light) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }
  value = Math.max(0, Math.min(1, value));
  return Math.round(value * 100) / 100;
}
function generate(color) {
  var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var patterns = [];
  var pColor = new FastColor(color);
  var hsv = pColor.toHsv();
  for (var i = lightColorCount; i > 0; i -= 1) {
    var c = new FastColor({
      h: getHue(hsv, i, true),
      s: getSaturation(hsv, i, true),
      v: getValue(hsv, i, true)
    });
    patterns.push(c);
  }
  patterns.push(pColor);
  for (var _i = 1; _i <= darkColorCount; _i += 1) {
    var _c = new FastColor({
      h: getHue(hsv, _i),
      s: getSaturation(hsv, _i),
      v: getValue(hsv, _i)
    });
    patterns.push(_c);
  }
  if (opts.theme === "dark") {
    return darkColorMap.map(function(_ref) {
      var index = _ref.index, amount = _ref.amount;
      return new FastColor(opts.backgroundColor || "#141414").mix(patterns[index], amount).toHexString();
    });
  }
  return patterns.map(function(c2) {
    return c2.toHexString();
  });
}

// node_modules/@ant-design/colors/es/presets.js
var red = ["#fff1f0", "#ffccc7", "#ffa39e", "#ff7875", "#ff4d4f", "#f5222d", "#cf1322", "#a8071a", "#820014", "#5c0011"];
red.primary = red[5];
var volcano = ["#fff2e8", "#ffd8bf", "#ffbb96", "#ff9c6e", "#ff7a45", "#fa541c", "#d4380d", "#ad2102", "#871400", "#610b00"];
volcano.primary = volcano[5];
var orange = ["#fff7e6", "#ffe7ba", "#ffd591", "#ffc069", "#ffa940", "#fa8c16", "#d46b08", "#ad4e00", "#873800", "#612500"];
orange.primary = orange[5];
var gold = ["#fffbe6", "#fff1b8", "#ffe58f", "#ffd666", "#ffc53d", "#faad14", "#d48806", "#ad6800", "#874d00", "#613400"];
gold.primary = gold[5];
var yellow = ["#feffe6", "#ffffb8", "#fffb8f", "#fff566", "#ffec3d", "#fadb14", "#d4b106", "#ad8b00", "#876800", "#614700"];
yellow.primary = yellow[5];
var lime = ["#fcffe6", "#f4ffb8", "#eaff8f", "#d3f261", "#bae637", "#a0d911", "#7cb305", "#5b8c00", "#3f6600", "#254000"];
lime.primary = lime[5];
var green = ["#f6ffed", "#d9f7be", "#b7eb8f", "#95de64", "#73d13d", "#52c41a", "#389e0d", "#237804", "#135200", "#092b00"];
green.primary = green[5];
var cyan = ["#e6fffb", "#b5f5ec", "#87e8de", "#5cdbd3", "#36cfc9", "#13c2c2", "#08979c", "#006d75", "#00474f", "#002329"];
cyan.primary = cyan[5];
var blue = ["#e6f4ff", "#bae0ff", "#91caff", "#69b1ff", "#4096ff", "#1677ff", "#0958d9", "#003eb3", "#002c8c", "#001d66"];
blue.primary = blue[5];
var geekblue = ["#f0f5ff", "#d6e4ff", "#adc6ff", "#85a5ff", "#597ef7", "#2f54eb", "#1d39c4", "#10239e", "#061178", "#030852"];
geekblue.primary = geekblue[5];
var purple = ["#f9f0ff", "#efdbff", "#d3adf7", "#b37feb", "#9254de", "#722ed1", "#531dab", "#391085", "#22075e", "#120338"];
purple.primary = purple[5];
var magenta = ["#fff0f6", "#ffd6e7", "#ffadd2", "#ff85c0", "#f759ab", "#eb2f96", "#c41d7f", "#9e1068", "#780650", "#520339"];
magenta.primary = magenta[5];
var grey = ["#a6a6a6", "#999999", "#8c8c8c", "#808080", "#737373", "#666666", "#404040", "#1a1a1a", "#000000", "#000000"];
grey.primary = grey[5];
var redDark = ["#2a1215", "#431418", "#58181c", "#791a1f", "#a61d24", "#d32029", "#e84749", "#f37370", "#f89f9a", "#fac8c3"];
redDark.primary = redDark[5];
var volcanoDark = ["#2b1611", "#441d12", "#592716", "#7c3118", "#aa3e19", "#d84a1b", "#e87040", "#f3956a", "#f8b692", "#fad4bc"];
volcanoDark.primary = volcanoDark[5];
var orangeDark = ["#2b1d11", "#442a11", "#593815", "#7c4a15", "#aa6215", "#d87a16", "#e89a3c", "#f3b765", "#f8cf8d", "#fae3b7"];
orangeDark.primary = orangeDark[5];
var goldDark = ["#2b2111", "#443111", "#594214", "#7c5914", "#aa7714", "#d89614", "#e8b339", "#f3cc62", "#f8df8b", "#faedb5"];
goldDark.primary = goldDark[5];
var yellowDark = ["#2b2611", "#443b11", "#595014", "#7c6e14", "#aa9514", "#d8bd14", "#e8d639", "#f3ea62", "#f8f48b", "#fafab5"];
yellowDark.primary = yellowDark[5];
var limeDark = ["#1f2611", "#2e3c10", "#3e4f13", "#536d13", "#6f9412", "#8bbb11", "#a9d134", "#c9e75d", "#e4f88b", "#f0fab5"];
limeDark.primary = limeDark[5];
var greenDark = ["#162312", "#1d3712", "#274916", "#306317", "#3c8618", "#49aa19", "#6abe39", "#8fd460", "#b2e58b", "#d5f2bb"];
greenDark.primary = greenDark[5];
var cyanDark = ["#112123", "#113536", "#144848", "#146262", "#138585", "#13a8a8", "#33bcb7", "#58d1c9", "#84e2d8", "#b2f1e8"];
cyanDark.primary = cyanDark[5];
var blueDark = ["#111a2c", "#112545", "#15325b", "#15417e", "#1554ad", "#1668dc", "#3c89e8", "#65a9f3", "#8dc5f8", "#b7dcfa"];
blueDark.primary = blueDark[5];
var geekblueDark = ["#131629", "#161d40", "#1c2755", "#203175", "#263ea0", "#2b4acb", "#5273e0", "#7f9ef3", "#a8c1f8", "#d2e0fa"];
geekblueDark.primary = geekblueDark[5];
var purpleDark = ["#1a1325", "#24163a", "#301c4d", "#3e2069", "#51258f", "#642ab5", "#854eca", "#ab7ae0", "#cda8f0", "#ebd7fa"];
purpleDark.primary = purpleDark[5];
var magentaDark = ["#291321", "#40162f", "#551c3b", "#75204f", "#a02669", "#cb2b83", "#e0529c", "#f37fb7", "#f8a8cc", "#fad2e3"];
magentaDark.primary = magentaDark[5];
var greyDark = ["#151515", "#1f1f1f", "#2d2d2d", "#393939", "#494949", "#5a5a5a", "#6a6a6a", "#7b7b7b", "#888888", "#969696"];
greyDark.primary = greyDark[5];

// node_modules/@ant-design/icons-angular/fesm2022/ant-design-icons-angular.mjs
var ANT_ICON_ANGULAR_CONSOLE_PREFIX = "[@ant-design/icons-angular]:";
function error(message) {
  console.error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX} ${message}.`);
}
function warn(message) {
  if (isDevMode()) {
    console.warn(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX} ${message}.`);
  }
}
function getSecondaryColor(primaryColor) {
  return generate(primaryColor)[0];
}
function withSuffix(name2, theme) {
  switch (theme) {
    case "fill":
      return `${name2}-fill`;
    case "outline":
      return `${name2}-o`;
    case "twotone":
      return `${name2}-twotone`;
    case void 0:
      return name2;
    default:
      throw new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}Theme "${theme}" is not a recognized theme!`);
  }
}
function withSuffixAndColor(name2, theme, pri, sec) {
  return `${withSuffix(name2, theme)}-${pri}-${sec}`;
}
function mapAbbrToTheme(abbr) {
  return abbr === "o" ? "outline" : abbr;
}
function alreadyHasAThemeSuffix(name2) {
  return name2.endsWith("-fill") || name2.endsWith("-o") || name2.endsWith("-twotone");
}
function isIconDefinition(target) {
  return typeof target === "object" && typeof target.name === "string" && (typeof target.theme === "string" || target.theme === void 0) && typeof target.icon === "string";
}
function getIconDefinitionFromAbbr(str) {
  const arr = str.split("-");
  const theme = mapAbbrToTheme(arr.splice(arr.length - 1, 1)[0]);
  const name2 = arr.join("-");
  return {
    name: name2,
    theme,
    icon: ""
  };
}
function cloneSVG(svg) {
  return svg.cloneNode(true);
}
function replaceFillColor(raw) {
  return raw.replace(/['"]#333['"]/g, '"primaryColor"').replace(/['"]#E6E6E6['"]/g, '"secondaryColor"').replace(/['"]#D9D9D9['"]/g, '"secondaryColor"').replace(/['"]#D8D8D8['"]/g, '"secondaryColor"');
}
function getNameAndNamespace(type) {
  const split = type.split(":");
  switch (split.length) {
    case 1:
      return [type, ""];
    case 2:
      return [split[1], split[0]];
    default:
      throw new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}The icon type ${type} is not valid!`);
  }
}
function hasNamespace(type) {
  return getNameAndNamespace(type)[1] !== "";
}
function NameSpaceIsNotSpecifyError() {
  return new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}Type should have a namespace. Try "namespace:${name}".`);
}
function IconNotFoundError(icon) {
  return new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}the icon ${icon} does not exist or is not registered.`);
}
function HttpModuleNotImport() {
  error(`you need to import "HttpClientModule" to use dynamic importing.`);
  return null;
}
function UrlNotSafeError(url) {
  return new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}The url "${url}" is unsafe.`);
}
function SVGTagNotFoundError() {
  return new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}<svg> tag not found.`);
}
function DynamicLoadingTimeoutError() {
  return new Error(`${ANT_ICON_ANGULAR_CONSOLE_PREFIX}Importing timeout error.`);
}
var JSONP_HANDLER_NAME = "__ant_icon_load";
var ANT_ICONS = new InjectionToken("ant_icons");
var IconService = class _IconService {
  set twoToneColor({
    primaryColor,
    secondaryColor
  }) {
    this._twoToneColorPalette.primaryColor = primaryColor;
    this._twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
  }
  get twoToneColor() {
    return __spreadValues({}, this._twoToneColorPalette);
  }
  /**
   * Disable dynamic loading (support static loading only).
   */
  get _disableDynamicLoading() {
    return false;
  }
  constructor(_rendererFactory, _handler, _document, sanitizer, _antIcons) {
    this._rendererFactory = _rendererFactory;
    this._handler = _handler;
    this._document = _document;
    this.sanitizer = sanitizer;
    this._antIcons = _antIcons;
    this.defaultTheme = "outline";
    this._svgDefinitions = /* @__PURE__ */ new Map();
    this._svgRenderedDefinitions = /* @__PURE__ */ new Map();
    this._inProgressFetches = /* @__PURE__ */ new Map();
    this._assetsUrlRoot = "";
    this._twoToneColorPalette = {
      primaryColor: "#333333",
      secondaryColor: "#E6E6E6"
    };
    this._enableJsonpLoading = false;
    this._jsonpIconLoad$ = new Subject();
    this._renderer = this._rendererFactory.createRenderer(null, null);
    if (this._handler) {
      this._http = new HttpClient(this._handler);
    }
    if (this._antIcons) {
      this.addIcon(...this._antIcons);
    }
  }
  /**
   * Call this method to switch to jsonp like loading.
   */
  useJsonpLoading() {
    if (!this._enableJsonpLoading) {
      this._enableJsonpLoading = true;
      window[JSONP_HANDLER_NAME] = (icon) => {
        this._jsonpIconLoad$.next(icon);
      };
    } else {
      warn("You are already using jsonp loading.");
    }
  }
  /**
   * Change the prefix of the inline svg resources, so they could be deployed elsewhere, like CDN.
   * @param prefix
   */
  changeAssetsSource(prefix) {
    this._assetsUrlRoot = prefix.endsWith("/") ? prefix : prefix + "/";
  }
  /**
   * Add icons provided by ant design.
   * @param icons
   */
  addIcon(...icons) {
    icons.forEach((icon) => {
      this._svgDefinitions.set(withSuffix(icon.name, icon.theme), icon);
    });
  }
  /**
   * Register an icon. Namespace is required.
   * @param type
   * @param literal
   */
  addIconLiteral(type, literal) {
    const [_, namespace] = getNameAndNamespace(type);
    if (!namespace) {
      throw NameSpaceIsNotSpecifyError();
    }
    this.addIcon({
      name: type,
      icon: literal
    });
  }
  /**
   * Remove all cache.
   */
  clear() {
    this._svgDefinitions.clear();
    this._svgRenderedDefinitions.clear();
  }
  /**
   * Get a rendered `SVGElement`.
   * @param icon
   * @param twoToneColor
   */
  getRenderedContent(icon, twoToneColor) {
    const definition = isIconDefinition(icon) ? icon : this._svgDefinitions.get(icon) || null;
    if (!definition && this._disableDynamicLoading) {
      throw IconNotFoundError(icon);
    }
    const $iconDefinition = definition ? of(definition) : this._loadIconDynamically(icon);
    return $iconDefinition.pipe(map((i) => {
      if (!i) {
        throw IconNotFoundError(icon);
      }
      return this._loadSVGFromCacheOrCreateNew(i, twoToneColor);
    }));
  }
  getCachedIcons() {
    return this._svgDefinitions;
  }
  /**
   * Get raw svg and assemble a `IconDefinition` object.
   * @param type
   */
  _loadIconDynamically(type) {
    if (!this._http && !this._enableJsonpLoading) {
      return of(HttpModuleNotImport());
    }
    let inProgress = this._inProgressFetches.get(type);
    if (!inProgress) {
      const [name2, namespace] = getNameAndNamespace(type);
      const icon = namespace ? {
        name: type,
        icon: ""
      } : getIconDefinitionFromAbbr(name2);
      const suffix = this._enableJsonpLoading ? ".js" : ".svg";
      const url = (namespace ? `${this._assetsUrlRoot}assets/${namespace}/${name2}` : `${this._assetsUrlRoot}assets/${icon.theme}/${icon.name}`) + suffix;
      const safeUrl = this.sanitizer.sanitize(SecurityContext.URL, url);
      if (!safeUrl) {
        throw UrlNotSafeError(url);
      }
      const source = !this._enableJsonpLoading ? this._http.get(safeUrl, {
        responseType: "text"
      }).pipe(map((literal) => __spreadProps(__spreadValues({}, icon), {
        icon: literal
      }))) : this._loadIconDynamicallyWithJsonp(icon, safeUrl);
      inProgress = source.pipe(tap((definition) => this.addIcon(definition)), finalize(() => this._inProgressFetches.delete(type)), catchError(() => of(null)), share());
      this._inProgressFetches.set(type, inProgress);
    }
    return inProgress;
  }
  _loadIconDynamicallyWithJsonp(icon, url) {
    return new Observable((subscriber) => {
      const loader = this._document.createElement("script");
      const timer = setTimeout(() => {
        clean();
        subscriber.error(DynamicLoadingTimeoutError());
      }, 6e3);
      loader.src = url;
      function clean() {
        loader.parentNode.removeChild(loader);
        clearTimeout(timer);
      }
      this._document.body.appendChild(loader);
      this._jsonpIconLoad$.pipe(filter((i) => i.name === icon.name && i.theme === icon.theme), take(1)).subscribe((i) => {
        subscriber.next(i);
        clean();
      });
    });
  }
  /**
   * Render a new `SVGElement` for a given `IconDefinition`, or make a copy from cache.
   * @param icon
   * @param twoToneColor
   */
  _loadSVGFromCacheOrCreateNew(icon, twoToneColor) {
    let svg;
    const pri = twoToneColor || this._twoToneColorPalette.primaryColor;
    const sec = getSecondaryColor(pri) || this._twoToneColorPalette.secondaryColor;
    const key = icon.theme === "twotone" ? withSuffixAndColor(icon.name, icon.theme, pri, sec) : icon.theme === void 0 ? icon.name : withSuffix(icon.name, icon.theme);
    const cached = this._svgRenderedDefinitions.get(key);
    if (cached) {
      svg = cached.icon;
    } else {
      svg = this._setSVGAttribute(this._colorizeSVGIcon(
        // Icons provided by ant design should be refined to remove preset colors.
        this._createSVGElementFromString(hasNamespace(icon.name) ? icon.icon : replaceFillColor(icon.icon)),
        icon.theme === "twotone",
        pri,
        sec
      ));
      this._svgRenderedDefinitions.set(key, __spreadProps(__spreadValues({}, icon), {
        icon: svg
      }));
    }
    return cloneSVG(svg);
  }
  _createSVGElementFromString(str) {
    const div = this._document.createElement("div");
    div.innerHTML = str;
    const svg = div.querySelector("svg");
    if (!svg) {
      throw SVGTagNotFoundError;
    }
    return svg;
  }
  _setSVGAttribute(svg) {
    this._renderer.setAttribute(svg, "width", "1em");
    this._renderer.setAttribute(svg, "height", "1em");
    return svg;
  }
  _colorizeSVGIcon(svg, twotone, pri, sec) {
    if (twotone) {
      const children = svg.childNodes;
      const length = children.length;
      for (let i = 0; i < length; i++) {
        const child = children[i];
        if (child.getAttribute("fill") === "secondaryColor") {
          this._renderer.setAttribute(child, "fill", sec);
        } else {
          this._renderer.setAttribute(child, "fill", pri);
        }
      }
    }
    this._renderer.setAttribute(svg, "fill", "currentColor");
    return svg;
  }
  static {
    this.\u0275fac = function IconService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _IconService)(\u0275\u0275inject(RendererFactory2), \u0275\u0275inject(HttpBackend, 8), \u0275\u0275inject(DOCUMENT, 8), \u0275\u0275inject(DomSanitizer), \u0275\u0275inject(ANT_ICONS, 8));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _IconService,
      factory: _IconService.\u0275fac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IconService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RendererFactory2
  }, {
    type: HttpBackend,
    decorators: [{
      type: Optional
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: DomSanitizer
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ANT_ICONS]
    }]
  }], null);
})();
function checkMeta(prev, after) {
  return prev.type === after.type && prev.theme === after.theme && prev.twoToneColor === after.twoToneColor;
}
var IconDirective = class _IconDirective {
  constructor(_iconService) {
    this._iconService = _iconService;
    this._elementRef = inject(ElementRef);
    this._renderer = inject(Renderer2);
  }
  ngOnChanges(changes) {
    if (changes.type || changes.theme || changes.twoToneColor) {
      this._changeIcon();
    }
  }
  /**
   * Render a new icon in the current element. Remove the icon when `type` is falsy.
   */
  _changeIcon() {
    return new Promise((resolve) => {
      if (!this.type) {
        this._clearSVGElement();
        resolve(null);
        return;
      }
      const beforeMeta = this._getSelfRenderMeta();
      this._iconService.getRenderedContent(this._parseIconType(this.type, this.theme), this.twoToneColor).subscribe((svg) => {
        const afterMeta = this._getSelfRenderMeta();
        if (checkMeta(beforeMeta, afterMeta)) {
          this._setSVGElement(svg);
          resolve(svg);
        } else {
          resolve(null);
        }
      });
    });
  }
  _getSelfRenderMeta() {
    return {
      type: this.type,
      theme: this.theme,
      twoToneColor: this.twoToneColor
    };
  }
  /**
   * Parse a icon to the standard form, an `IconDefinition` or a string like 'account-book-fill` (with a theme suffixed).
   * If namespace is specified, ignore theme because it meaningless for users' icons.
   *
   * @param type
   * @param theme
   */
  _parseIconType(type, theme) {
    if (isIconDefinition(type)) {
      return type;
    } else {
      const [name2, namespace] = getNameAndNamespace(type);
      if (namespace) {
        return type;
      }
      if (alreadyHasAThemeSuffix(name2)) {
        if (!!theme) {
          warn(`'type' ${name2} already gets a theme inside so 'theme' ${theme} would be ignored`);
        }
        return name2;
      } else {
        return withSuffix(name2, theme || this._iconService.defaultTheme);
      }
    }
  }
  _setSVGElement(svg) {
    this._clearSVGElement();
    this._renderer.appendChild(this._elementRef.nativeElement, svg);
  }
  _clearSVGElement() {
    const el = this._elementRef.nativeElement;
    const children = el.childNodes;
    const length = children.length;
    for (let i = length - 1; i >= 0; i--) {
      const child = children[i];
      if (child.tagName?.toLowerCase() === "svg") {
        this._renderer.removeChild(el, child);
      }
    }
  }
  static {
    this.\u0275fac = function IconDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _IconDirective)(\u0275\u0275directiveInject(IconService));
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _IconDirective,
      selectors: [["", "antIcon", ""]],
      inputs: {
        type: "type",
        theme: "theme",
        twoToneColor: "twoToneColor"
      },
      features: [\u0275\u0275NgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IconDirective, [{
    type: Directive,
    args: [{
      selector: "[antIcon]"
    }]
  }], () => [{
    type: IconService
  }], {
    type: [{
      type: Input
    }],
    theme: [{
      type: Input
    }],
    twoToneColor: [{
      type: Input
    }]
  });
})();
var IconModule = class _IconModule {
  static {
    this.\u0275fac = function IconModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _IconModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _IconModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IconModule, [{
    type: NgModule,
    args: [{
      imports: [IconDirective],
      exports: [IconDirective]
    }]
  }], null, null);
})();

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-environments.mjs
var environment2 = {
  isTestMode: false
};

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-logger.mjs
var record = {};
var PREFIX = "[NG-ZORRO]:";
function notRecorded(...args) {
  const asRecord = args.reduce((acc, c) => acc + c.toString(), "");
  if (record[asRecord]) {
    return false;
  } else {
    record[asRecord] = true;
    return true;
  }
}
function consoleCommonBehavior(consoleFunc, ...args) {
  if (environment2.isTestMode || isDevMode() && notRecorded(...args)) {
    consoleFunc(...args);
  }
}
var warn2 = (...args) => consoleCommonBehavior((...arg) => console.warn(PREFIX, ...arg), ...args);

// node_modules/@ctrl/tinycolor/dist/module/util.js
function bound01(n, max) {
  if (isOnePointZero(n)) {
    n = "100%";
  }
  var isPercent = isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
  if (isPercent) {
    n = parseInt(String(n * max), 10) / 100;
  }
  if (Math.abs(n - max) < 1e-6) {
    return 1;
  }
  if (max === 360) {
    n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
  } else {
    n = n % max / parseFloat(String(max));
  }
  return n;
}
function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}
function isOnePointZero(n) {
  return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
}
function isPercentage(n) {
  return typeof n === "string" && n.indexOf("%") !== -1;
}
function boundAlpha(a) {
  a = parseFloat(a);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
}
function convertToPercentage(n) {
  if (n <= 1) {
    return "".concat(Number(n) * 100, "%");
  }
  return n;
}
function pad2(c) {
  return c.length === 1 ? "0" + c : String(c);
}

// node_modules/@ctrl/tinycolor/dist/module/conversion.js
function rgbToRgb(r, g, b) {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b, 255) * 255
  };
}
function rgbToHsl(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var s = 0;
  var l = (max + min) / 2;
  if (max === min) {
    s = 0;
    h = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return {
    h,
    s,
    l
  };
}
function hue2rgb(p, q, t) {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * (6 * t);
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}
function hslToRgb(h, s, l) {
  var r;
  var g;
  var b;
  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);
  if (s === 0) {
    g = l;
    b = l;
    r = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
function rgbToHsv(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var v = max;
  var d = max - min;
  var s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return {
    h,
    s,
    v
  };
}
function hsvToRgb(h, s, v) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);
  var i = Math.floor(h);
  var f = h - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var mod = i % 6;
  var r = [v, q, p, p, t, v][mod];
  var g = [t, v, v, q, p, p][mod];
  var b = [p, p, t, v, v, q][mod];
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
function rgbToHex(r, g, b, allow3Char) {
  var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
  if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }
  return hex.join("");
}
function rgbaToHex(r, g, b, a, allow4Char) {
  var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16)), pad2(convertDecimalToHex(a))];
  if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }
  return hex.join("");
}
function convertDecimalToHex(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
}
function convertHexToDecimal(h) {
  return parseIntFromHex(h) / 255;
}
function parseIntFromHex(val) {
  return parseInt(val, 16);
}
function numberInputToObject(color) {
  return {
    r: color >> 16,
    g: (color & 65280) >> 8,
    b: color & 255
  };
}

// node_modules/@ctrl/tinycolor/dist/module/css-color-names.js
var names = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};

// node_modules/@ctrl/tinycolor/dist/module/format-input.js
function inputToRGB(color) {
  var rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;
  if (typeof color === "string") {
    color = stringInputToObject(color);
  }
  if (typeof color === "object") {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s = convertToPercentage(color.s);
      v = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s, v);
      ok = true;
      format = "hsv";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s = convertToPercentage(color.s);
      l = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s, l);
      ok = true;
      format = "hsl";
    }
    if (Object.prototype.hasOwnProperty.call(color, "a")) {
      a = color.a;
    }
  }
  a = boundAlpha(a);
  return {
    ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a
  };
}
var CSS_INTEGER = "[-\\+]?\\d+%?";
var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var matchers = {
  CSS_UNIT: new RegExp(CSS_UNIT),
  rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
  rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
  hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
  hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
  hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
  hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function stringInputToObject(color) {
  color = color.trim().toLowerCase();
  if (color.length === 0) {
    return false;
  }
  var named = false;
  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color === "transparent") {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      format: "name"
    };
  }
  var match = matchers.rgb.exec(color);
  if (match) {
    return {
      r: match[1],
      g: match[2],
      b: match[3]
    };
  }
  match = matchers.rgba.exec(color);
  if (match) {
    return {
      r: match[1],
      g: match[2],
      b: match[3],
      a: match[4]
    };
  }
  match = matchers.hsl.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      l: match[3]
    };
  }
  match = matchers.hsla.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      l: match[3],
      a: match[4]
    };
  }
  match = matchers.hsv.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      v: match[3]
    };
  }
  match = matchers.hsva.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      v: match[3],
      a: match[4]
    };
  }
  match = matchers.hex8.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex6.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? "name" : "hex"
    };
  }
  match = matchers.hex4.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      a: convertHexToDecimal(match[4] + match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex3.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      format: named ? "name" : "hex"
    };
  }
  return false;
}
function isValidCSSUnit(color) {
  return Boolean(matchers.CSS_UNIT.exec(String(color)));
}

// node_modules/@ctrl/tinycolor/dist/module/index.js
var TinyColor = (
  /** @class */
  function() {
    function TinyColor2(color, opts) {
      if (color === void 0) {
        color = "";
      }
      if (opts === void 0) {
        opts = {};
      }
      var _a;
      if (color instanceof TinyColor2) {
        return color;
      }
      if (typeof color === "number") {
        color = numberInputToObject(color);
      }
      this.originalInput = color;
      var rgb = inputToRGB(color);
      this.originalInput = color;
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
      this.a = rgb.a;
      this.roundA = Math.round(100 * this.a) / 100;
      this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
      this.gradientType = opts.gradientType;
      if (this.r < 1) {
        this.r = Math.round(this.r);
      }
      if (this.g < 1) {
        this.g = Math.round(this.g);
      }
      if (this.b < 1) {
        this.b = Math.round(this.b);
      }
      this.isValid = rgb.ok;
    }
    TinyColor2.prototype.isDark = function() {
      return this.getBrightness() < 128;
    };
    TinyColor2.prototype.isLight = function() {
      return !this.isDark();
    };
    TinyColor2.prototype.getBrightness = function() {
      var rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
    };
    TinyColor2.prototype.getLuminance = function() {
      var rgb = this.toRgb();
      var R;
      var G;
      var B;
      var RsRGB = rgb.r / 255;
      var GsRGB = rgb.g / 255;
      var BsRGB = rgb.b / 255;
      if (RsRGB <= 0.03928) {
        R = RsRGB / 12.92;
      } else {
        R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      }
      if (GsRGB <= 0.03928) {
        G = GsRGB / 12.92;
      } else {
        G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      }
      if (BsRGB <= 0.03928) {
        B = BsRGB / 12.92;
      } else {
        B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };
    TinyColor2.prototype.getAlpha = function() {
      return this.a;
    };
    TinyColor2.prototype.setAlpha = function(alpha) {
      this.a = boundAlpha(alpha);
      this.roundA = Math.round(100 * this.a) / 100;
      return this;
    };
    TinyColor2.prototype.isMonochrome = function() {
      var s = this.toHsl().s;
      return s === 0;
    };
    TinyColor2.prototype.toHsv = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      return {
        h: hsv.h * 360,
        s: hsv.s,
        v: hsv.v,
        a: this.a
      };
    };
    TinyColor2.prototype.toHsvString = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      var h = Math.round(hsv.h * 360);
      var s = Math.round(hsv.s * 100);
      var v = Math.round(hsv.v * 100);
      return this.a === 1 ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHsl = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      return {
        h: hsl.h * 360,
        s: hsl.s,
        l: hsl.l,
        a: this.a
      };
    };
    TinyColor2.prototype.toHslString = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      var h = Math.round(hsl.h * 360);
      var s = Math.round(hsl.s * 100);
      var l = Math.round(hsl.l * 100);
      return this.a === 1 ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHex = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    TinyColor2.prototype.toHexString = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return "#" + this.toHex(allow3Char);
    };
    TinyColor2.prototype.toHex8 = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    TinyColor2.prototype.toHex8String = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return "#" + this.toHex8(allow4Char);
    };
    TinyColor2.prototype.toHexShortString = function(allowShortChar) {
      if (allowShortChar === void 0) {
        allowShortChar = false;
      }
      return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
    };
    TinyColor2.prototype.toRgb = function() {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toRgbString = function() {
      var r = Math.round(this.r);
      var g = Math.round(this.g);
      var b = Math.round(this.b);
      return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toPercentageRgb = function() {
      var fmt = function(x) {
        return "".concat(Math.round(bound01(x, 255) * 100), "%");
      };
      return {
        r: fmt(this.r),
        g: fmt(this.g),
        b: fmt(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toPercentageRgbString = function() {
      var rnd = function(x) {
        return Math.round(bound01(x, 255) * 100);
      };
      return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toName = function() {
      if (this.a === 0) {
        return "transparent";
      }
      if (this.a < 1) {
        return false;
      }
      var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
      for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (hex === value) {
          return key;
        }
      }
      return false;
    };
    TinyColor2.prototype.toString = function(format) {
      var formatSet = Boolean(format);
      format = format !== null && format !== void 0 ? format : this.format;
      var formattedString = false;
      var hasAlpha = this.a < 1 && this.a >= 0;
      var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith("hex") || format === "name");
      if (needsAlphaFormat) {
        if (format === "name" && this.a === 0) {
          return this.toName();
        }
        return this.toRgbString();
      }
      if (format === "rgb") {
        formattedString = this.toRgbString();
      }
      if (format === "prgb") {
        formattedString = this.toPercentageRgbString();
      }
      if (format === "hex" || format === "hex6") {
        formattedString = this.toHexString();
      }
      if (format === "hex3") {
        formattedString = this.toHexString(true);
      }
      if (format === "hex4") {
        formattedString = this.toHex8String(true);
      }
      if (format === "hex8") {
        formattedString = this.toHex8String();
      }
      if (format === "name") {
        formattedString = this.toName();
      }
      if (format === "hsl") {
        formattedString = this.toHslString();
      }
      if (format === "hsv") {
        formattedString = this.toHsvString();
      }
      return formattedString || this.toHexString();
    };
    TinyColor2.prototype.toNumber = function() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    };
    TinyColor2.prototype.clone = function() {
      return new TinyColor2(this.toString());
    };
    TinyColor2.prototype.lighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l += amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.brighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var rgb = this.toRgb();
      rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
      rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
      rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
      return new TinyColor2(rgb);
    };
    TinyColor2.prototype.darken = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l -= amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.tint = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("white", amount);
    };
    TinyColor2.prototype.shade = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("black", amount);
    };
    TinyColor2.prototype.desaturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s -= amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.saturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s += amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.greyscale = function() {
      return this.desaturate(100);
    };
    TinyColor2.prototype.spin = function(amount) {
      var hsl = this.toHsl();
      var hue = (hsl.h + amount) % 360;
      hsl.h = hue < 0 ? 360 + hue : hue;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.mix = function(color, amount) {
      if (amount === void 0) {
        amount = 50;
      }
      var rgb1 = this.toRgb();
      var rgb2 = new TinyColor2(color).toRgb();
      var p = amount / 100;
      var rgba = {
        r: (rgb2.r - rgb1.r) * p + rgb1.r,
        g: (rgb2.g - rgb1.g) * p + rgb1.g,
        b: (rgb2.b - rgb1.b) * p + rgb1.b,
        a: (rgb2.a - rgb1.a) * p + rgb1.a
      };
      return new TinyColor2(rgba);
    };
    TinyColor2.prototype.analogous = function(results, slices) {
      if (results === void 0) {
        results = 6;
      }
      if (slices === void 0) {
        slices = 30;
      }
      var hsl = this.toHsl();
      var part = 360 / slices;
      var ret = [this];
      for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(new TinyColor2(hsl));
      }
      return ret;
    };
    TinyColor2.prototype.complement = function() {
      var hsl = this.toHsl();
      hsl.h = (hsl.h + 180) % 360;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.monochromatic = function(results) {
      if (results === void 0) {
        results = 6;
      }
      var hsv = this.toHsv();
      var h = hsv.h;
      var s = hsv.s;
      var v = hsv.v;
      var res = [];
      var modification = 1 / results;
      while (results--) {
        res.push(new TinyColor2({
          h,
          s,
          v
        }));
        v = (v + modification) % 1;
      }
      return res;
    };
    TinyColor2.prototype.splitcomplement = function() {
      var hsl = this.toHsl();
      var h = hsl.h;
      return [this, new TinyColor2({
        h: (h + 72) % 360,
        s: hsl.s,
        l: hsl.l
      }), new TinyColor2({
        h: (h + 216) % 360,
        s: hsl.s,
        l: hsl.l
      })];
    };
    TinyColor2.prototype.onBackground = function(background) {
      var fg = this.toRgb();
      var bg = new TinyColor2(background).toRgb();
      var alpha = fg.a + bg.a * (1 - fg.a);
      return new TinyColor2({
        r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
        g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
        b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
        a: alpha
      });
    };
    TinyColor2.prototype.triad = function() {
      return this.polyad(3);
    };
    TinyColor2.prototype.tetrad = function() {
      return this.polyad(4);
    };
    TinyColor2.prototype.polyad = function(n) {
      var hsl = this.toHsl();
      var h = hsl.h;
      var result = [this];
      var increment = 360 / n;
      for (var i = 1; i < n; i++) {
        result.push(new TinyColor2({
          h: (h + i * increment) % 360,
          s: hsl.s,
          l: hsl.l
        }));
      }
      return result;
    };
    TinyColor2.prototype.equals = function(color) {
      return this.toRgbString() === new TinyColor2(color).toRgbString();
    };
    return TinyColor2;
  }()
);

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-color.mjs
var statusColors = ["success", "processing", "error", "default", "warning"];
var presetColors = ["pink", "red", "yellow", "orange", "cyan", "green", "blue", "purple", "geekblue", "magenta", "volcano", "gold", "lime"];
function isPresetColor(color) {
  return presetColors.indexOf(color) !== -1;
}
function isStatusColor(color) {
  return statusColors.indexOf(color) !== -1;
}
var hueStep2 = 2;
var saturationStep3 = 0.16;
var saturationStep22 = 0.05;
var brightnessStep12 = 0.05;
var brightnessStep22 = 0.15;
var lightColorCount2 = 5;
var darkColorCount2 = 4;
var darkColorMap2 = [{
  index: 7,
  opacity: 0.15
}, {
  index: 6,
  opacity: 0.25
}, {
  index: 5,
  opacity: 0.3
}, {
  index: 5,
  opacity: 0.45
}, {
  index: 5,
  opacity: 0.65
}, {
  index: 5,
  opacity: 0.85
}, {
  index: 4,
  opacity: 0.9
}, {
  index: 3,
  opacity: 0.95
}, {
  index: 2,
  opacity: 0.97
}, {
  index: 1,
  opacity: 0.98
}];
function toHsv({
  r,
  g,
  b
}) {
  const hsv = rgbToHsv(r, g, b);
  return {
    h: hsv.h * 360,
    s: hsv.s,
    v: hsv.v
  };
}
function toHex({
  r,
  g,
  b
}) {
  return `#${rgbToHex(r, g, b, false)}`;
}
function mix(rgb1, rgb2, amount) {
  const p = amount / 100;
  const rgb = {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b
  };
  return rgb;
}
function getHue2(hsv, i, light) {
  let hue;
  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
    hue = light ? Math.round(hsv.h) - hueStep2 * i : Math.round(hsv.h) + hueStep2 * i;
  } else {
    hue = light ? Math.round(hsv.h) + hueStep2 * i : Math.round(hsv.h) - hueStep2 * i;
  }
  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }
  return hue;
}
function getSaturation2(hsv, i, light) {
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }
  let saturation;
  if (light) {
    saturation = hsv.s - saturationStep3 * i;
  } else if (i === darkColorCount2) {
    saturation = hsv.s + saturationStep3;
  } else {
    saturation = hsv.s + saturationStep22 * i;
  }
  if (saturation > 1) {
    saturation = 1;
  }
  if (light && i === lightColorCount2 && saturation > 0.1) {
    saturation = 0.1;
  }
  if (saturation < 0.06) {
    saturation = 0.06;
  }
  return Number(saturation.toFixed(2));
}
function getValue2(hsv, i, light) {
  let value;
  if (light) {
    value = hsv.v + brightnessStep12 * i;
  } else {
    value = hsv.v - brightnessStep22 * i;
  }
  if (value > 1) {
    value = 1;
  }
  return Number(value.toFixed(2));
}
function generate2(color, opts = {}) {
  const patterns = [];
  const pColor = inputToRGB(color);
  for (let i = lightColorCount2; i > 0; i -= 1) {
    const hsv = toHsv(pColor);
    const colorString = toHex(inputToRGB({
      h: getHue2(hsv, i, true),
      s: getSaturation2(hsv, i, true),
      v: getValue2(hsv, i, true)
    }));
    patterns.push(colorString);
  }
  patterns.push(toHex(pColor));
  for (let i = 1; i <= darkColorCount2; i += 1) {
    const hsv = toHsv(pColor);
    const colorString = toHex(inputToRGB({
      h: getHue2(hsv, i),
      s: getSaturation2(hsv, i),
      v: getValue2(hsv, i)
    }));
    patterns.push(colorString);
  }
  if (opts.theme === "dark") {
    return darkColorMap2.map(({
      index,
      opacity
    }) => {
      const darkColorString = toHex(mix(inputToRGB(opts.backgroundColor || "#141414"), inputToRGB(patterns[index]), opacity * 100));
      return darkColorString;
    });
  }
  return patterns;
}

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-util.mjs
function isNotNil(value) {
  return typeof value !== "undefined" && value !== null;
}
function isTemplateRef(value) {
  return value instanceof TemplateRef;
}
function toBoolean(value) {
  return coerceBooleanProperty(value);
}
function numberAttributeWithZeroFallback(value) {
  return numberAttribute(value, 0);
}
function toCssPixel(value) {
  return coerceCssPixelValue(value);
}
function isTouchEvent(event) {
  return event.type.startsWith("touch");
}
function getEventPosition(event) {
  return isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
}
var isBrowser = typeof window !== "undefined";
var isFirefox = isBrowser && window.mozInnerScreenX != null;
function isStyleSupport(styleName) {
  if (typeof window !== "undefined" && window.document && window.document.documentElement) {
    const styleNameList = Array.isArray(styleName) ? styleName : [styleName];
    const {
      documentElement
    } = window.document;
    return styleNameList.some((name2) => name2 in documentElement.style);
  }
  return false;
}
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var ellipsisContainer;
var wrapperStyle = {
  padding: "0",
  margin: "0",
  display: "inline",
  lineHeight: "inherit"
};
function pxToNumber(value) {
  if (!value) {
    return 0;
  }
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
}
function styleToString(style2) {
  const styleNames = Array.prototype.slice.apply(style2);
  return styleNames.map((name2) => `${name2}: ${style2.getPropertyValue(name2)};`).join("");
}
function mergeChildren(children) {
  const childList = [];
  children.forEach((child) => {
    const prevChild = childList[childList.length - 1];
    if (prevChild && child.nodeType === TEXT_NODE && prevChild.nodeType === TEXT_NODE) {
      prevChild.data += child.data;
    } else {
      childList.push(child);
    }
  });
  return childList;
}
function measure(originEle, rows, contentNodes, fixedContent, ellipsisStr, suffixStr = "") {
  if (!ellipsisContainer) {
    ellipsisContainer = document.createElement("div");
    ellipsisContainer.setAttribute("aria-hidden", "true");
    document.body.appendChild(ellipsisContainer);
  }
  const originStyle = window.getComputedStyle(originEle);
  const originCSS = styleToString(originStyle);
  const lineHeight = pxToNumber(originStyle.lineHeight);
  const maxHeight = Math.round(lineHeight * (rows + 1) + pxToNumber(originStyle.paddingTop) + pxToNumber(originStyle.paddingBottom));
  ellipsisContainer.setAttribute("style", originCSS);
  ellipsisContainer.style.position = "fixed";
  ellipsisContainer.style.left = "0";
  ellipsisContainer.style.height = "auto";
  ellipsisContainer.style.minHeight = "auto";
  ellipsisContainer.style.maxHeight = "auto";
  ellipsisContainer.style.top = "-999999px";
  ellipsisContainer.style.zIndex = "-1000";
  ellipsisContainer.style.textOverflow = "clip";
  ellipsisContainer.style.whiteSpace = "normal";
  ellipsisContainer.style.webkitLineClamp = "none";
  const contentList = mergeChildren(contentNodes);
  const container = document.createElement("div");
  const contentContainer = document.createElement("span");
  const suffixContainer = document.createTextNode(suffixStr);
  const fixedContainer = document.createElement("span");
  Object.assign(container.style, wrapperStyle);
  Object.assign(contentContainer.style, wrapperStyle);
  Object.assign(fixedContainer.style, wrapperStyle);
  contentList.forEach((n) => {
    contentContainer.appendChild(n);
  });
  contentContainer.appendChild(suffixContainer);
  fixedContent.forEach((node) => {
    fixedContainer.appendChild(node.cloneNode(true));
  });
  container.appendChild(contentContainer);
  container.appendChild(fixedContainer);
  ellipsisContainer.appendChild(container);
  function inRange() {
    return ellipsisContainer.offsetHeight < maxHeight;
  }
  if (inRange()) {
    const text = ellipsisContainer.innerHTML;
    ellipsisContainer.removeChild(container);
    return {
      contentNodes,
      text,
      ellipsis: false
    };
  }
  const childNodes = Array.prototype.slice.apply(ellipsisContainer.childNodes[0].childNodes[0].cloneNode(true).childNodes).filter(({
    nodeType
  }) => nodeType !== COMMENT_NODE);
  const fixedNodes = Array.prototype.slice.apply(ellipsisContainer.childNodes[0].childNodes[1].cloneNode(true).childNodes);
  ellipsisContainer.removeChild(container);
  ellipsisContainer.innerHTML = "";
  const ellipsisContentHolder = document.createElement("span");
  ellipsisContainer.appendChild(ellipsisContentHolder);
  const ellipsisTextNode = document.createTextNode(ellipsisStr + suffixStr);
  ellipsisContentHolder.appendChild(ellipsisTextNode);
  fixedNodes.forEach((childNode) => {
    ellipsisContainer.appendChild(childNode);
  });
  function appendChildNode(node) {
    ellipsisContentHolder.insertBefore(node, ellipsisTextNode);
  }
  function measureText(textNode, fullText, startLoc = 0, endLoc = fullText.length, lastSuccessLoc = 0) {
    const midLoc = Math.floor((startLoc + endLoc) / 2);
    textNode.textContent = fullText.slice(0, midLoc);
    if (startLoc >= endLoc - 1) {
      for (let step = endLoc; step >= startLoc; step -= 1) {
        const currentStepText = fullText.slice(0, step);
        textNode.textContent = currentStepText;
        if (inRange() || !currentStepText) {
          return step === fullText.length ? {
            finished: false,
            node: document.createTextNode(fullText)
          } : {
            finished: true,
            node: document.createTextNode(currentStepText)
          };
        }
      }
    }
    if (inRange()) {
      return measureText(textNode, fullText, midLoc, endLoc, midLoc);
    } else {
      return measureText(textNode, fullText, startLoc, midLoc, lastSuccessLoc);
    }
  }
  function measureNode(childNode, index) {
    const type = childNode.nodeType;
    if (type === ELEMENT_NODE) {
      if (inRange()) {
        return {
          finished: false,
          node: contentList[index]
        };
      }
      ellipsisContentHolder.removeChild(childNode);
      return {
        finished: true,
        node: null
      };
    } else if (type === TEXT_NODE) {
      const fullText = childNode.textContent || "";
      const textNode = document.createTextNode(fullText);
      appendChildNode(textNode);
      return measureText(textNode, fullText);
    }
    return {
      finished: false,
      node: null
    };
  }
  const ellipsisNodes = [];
  childNodes.some((childNode, index) => {
    const {
      finished,
      node
    } = measureNode(childNode, index);
    if (node) {
      ellipsisNodes.push(node);
    }
    return finished;
  });
  const result = {
    contentNodes: ellipsisNodes,
    text: ellipsisContainer.innerHTML,
    ellipsis: true
  };
  while (ellipsisContainer.firstChild) {
    ellipsisContainer.removeChild(ellipsisContainer.firstChild);
  }
  return result;
}
function canUseDom() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
var MARK_KEY = `rc-util-key`;
function getMark({
  mark
} = {}) {
  if (mark) {
    return mark.startsWith("data-") ? mark : `data-${mark}`;
  }
  return MARK_KEY;
}
function getContainer(option) {
  if (option.attachTo) {
    return option.attachTo;
  }
  const head = document.querySelector("head");
  return head || document.body;
}
function injectCSS(css, options = {}) {
  if (!canUseDom()) {
    return null;
  }
  const styleNode = document.createElement("style");
  if (options.cspNonce) {
    styleNode.nonce = options.cspNonce;
  }
  styleNode.innerHTML = css;
  const container = getContainer(options);
  const {
    firstChild
  } = container;
  if (options.prepend && container.prepend) {
    container.prepend(styleNode);
  } else if (options.prepend && firstChild) {
    container.insertBefore(styleNode, firstChild);
  } else {
    container.appendChild(styleNode);
  }
  return styleNode;
}
var containerCache = /* @__PURE__ */ new Map();
function findExistNode(key, option = {}) {
  const container = getContainer(option);
  return Array.from(containerCache.get(container)?.children || []).find((node) => node.tagName === "STYLE" && node.getAttribute(getMark(option)) === key);
}
function updateCSS(css, key, options = {}) {
  const container = getContainer(options);
  if (!containerCache.has(container)) {
    const placeholderStyle = injectCSS("", options);
    const {
      parentNode
    } = placeholderStyle;
    containerCache.set(container, parentNode);
    parentNode.removeChild(placeholderStyle);
  }
  const existNode = findExistNode(key, options);
  if (existNode) {
    if (options.cspNonce && existNode.nonce !== options.cspNonce) {
      existNode.nonce = options.cspNonce;
    }
    if (existNode.innerHTML !== css) {
      existNode.innerHTML = css;
    }
    return existNode;
  }
  const newNode = injectCSS(css, options);
  newNode?.setAttribute(getMark(options), key);
  return newNode;
}
function getStatusClassNames(prefixCls, status, hasFeedback) {
  return {
    [`${prefixCls}-status-success`]: status === "success",
    [`${prefixCls}-status-warning`]: status === "warning",
    [`${prefixCls}-status-error`]: status === "error",
    [`${prefixCls}-status-validating`]: status === "validating",
    [`${prefixCls}-has-feedback`]: hasFeedback
  };
}
function runOutsideAngular(fn) {
  return typeof Zone !== "undefined" ? Zone.root.run(fn) : fn();
}
function fromEventOutsideAngular(target, name2, options) {
  if (!target) {
    return EMPTY;
  }
  return new Observable((subscriber) => {
    return runOutsideAngular(() => (
      // Casting because the inferred overload is incorrect :(
      fromEvent(target, name2, options).subscribe(subscriber)
    ));
  });
}

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-config.mjs
var NZ_CONFIG = new InjectionToken("nz-config");
var dynamicStyleMark = `-ant-${Date.now()}-${Math.random()}`;
function getStyle(globalPrefixCls, theme) {
  const variables = {};
  const formatColor = (color, updater) => {
    let clone = color.clone();
    clone = updater?.(clone) || clone;
    return clone.toRgbString();
  };
  const fillColor = (colorVal, type) => {
    const baseColor = new TinyColor(colorVal);
    const colorPalettes = generate2(baseColor.toRgbString());
    variables[`${type}-color`] = formatColor(baseColor);
    variables[`${type}-color-disabled`] = colorPalettes[1];
    variables[`${type}-color-hover`] = colorPalettes[4];
    variables[`${type}-color-active`] = colorPalettes[7];
    variables[`${type}-color-outline`] = baseColor.clone().setAlpha(0.2).toRgbString();
    variables[`${type}-color-deprecated-bg`] = colorPalettes[1];
    variables[`${type}-color-deprecated-border`] = colorPalettes[3];
  };
  if (theme.primaryColor) {
    fillColor(theme.primaryColor, "primary");
    const primaryColor = new TinyColor(theme.primaryColor);
    const primaryColors = generate2(primaryColor.toRgbString());
    primaryColors.forEach((color, index) => {
      variables[`primary-${index + 1}`] = color;
    });
    variables["primary-color-deprecated-l-35"] = formatColor(primaryColor, (c) => c.lighten(35));
    variables["primary-color-deprecated-l-20"] = formatColor(primaryColor, (c) => c.lighten(20));
    variables["primary-color-deprecated-t-20"] = formatColor(primaryColor, (c) => c.tint(20));
    variables["primary-color-deprecated-t-50"] = formatColor(primaryColor, (c) => c.tint(50));
    variables["primary-color-deprecated-f-12"] = formatColor(primaryColor, (c) => c.setAlpha(c.getAlpha() * 0.12));
    const primaryActiveColor = new TinyColor(primaryColors[0]);
    variables["primary-color-active-deprecated-f-30"] = formatColor(primaryActiveColor, (c) => c.setAlpha(c.getAlpha() * 0.3));
    variables["primary-color-active-deprecated-d-02"] = formatColor(primaryActiveColor, (c) => c.darken(2));
  }
  if (theme.successColor) {
    fillColor(theme.successColor, "success");
  }
  if (theme.warningColor) {
    fillColor(theme.warningColor, "warning");
  }
  if (theme.errorColor) {
    fillColor(theme.errorColor, "error");
  }
  if (theme.infoColor) {
    fillColor(theme.infoColor, "info");
  }
  const cssList = Object.keys(variables).map((key) => `--${globalPrefixCls}-${key}: ${variables[key]};`);
  return `
  :root {
    ${cssList.join("\n")}
  }
  `.trim();
}
function registerTheme(globalPrefixCls, theme, cspNonce) {
  const style2 = getStyle(globalPrefixCls, theme);
  if (canUseDom()) {
    updateCSS(style2, `${dynamicStyleMark}-dynamic-theme`, {
      cspNonce
    });
  } else {
    warn2(`NzConfigService: SSR do not support dynamic theme with css variables.`);
  }
}
var isDefined = function(value) {
  return value !== void 0;
};
var defaultPrefixCls = "ant";
var NzConfigService = class _NzConfigService {
  configUpdated$ = new Subject();
  /** Global config holding property. */
  config = inject(NZ_CONFIG, {
    optional: true
  }) || {};
  cspNonce = inject(CSP_NONCE, {
    optional: true
  });
  constructor() {
    if (this.config.theme) {
      registerTheme(this.getConfig().prefixCls?.prefixCls || defaultPrefixCls, this.config.theme, this.cspNonce);
    }
  }
  getConfig() {
    return this.config;
  }
  getConfigForComponent(componentName) {
    return this.config[componentName];
  }
  getConfigChangeEventForComponent(componentName) {
    return this.configUpdated$.pipe(filter((n) => n === componentName), map(() => void 0));
  }
  set(componentName, value) {
    this.config[componentName] = __spreadValues(__spreadValues({}, this.config[componentName]), value);
    if (componentName === "theme" && this.config.theme) {
      registerTheme(this.getConfig().prefixCls?.prefixCls || defaultPrefixCls, this.config.theme, this.cspNonce);
    }
    this.configUpdated$.next(componentName);
  }
  static \u0275fac = function NzConfigService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzConfigService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NzConfigService,
    factory: _NzConfigService.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzConfigService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function WithConfig() {
  return function(_value, context) {
    context.addInitializer(function() {
      const nzConfigService = inject(NzConfigService);
      const originalValue = this[context.name];
      let value;
      let assignedByUser = false;
      Object.defineProperty(this, context.name, {
        get: () => {
          const configValue = nzConfigService.getConfigForComponent(this["_nzModuleName"])?.[context.name];
          if (assignedByUser) {
            return value;
          }
          if (isDefined(configValue)) {
            return configValue;
          }
          return originalValue;
        },
        set: (newValue) => {
          assignedByUser = isDefined(newValue);
          value = newValue;
        },
        enumerable: true,
        configurable: true
      });
    });
  };
}

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-icon.mjs
var NZ_ICONS_USED_BY_ZORRO = [BarsOutline, CalendarOutline, CaretUpFill, CaretUpOutline, CaretDownFill, CaretDownOutline, CheckCircleFill, CheckCircleOutline, CheckOutline, ClockCircleOutline, CloseCircleOutline, CloseCircleFill, CloseOutline, CopyOutline, DeleteOutline, DoubleLeftOutline, DoubleRightOutline, DownOutline, EditOutline, EllipsisOutline, ExclamationCircleFill, ExclamationCircleOutline, EyeOutline, FileFill, FileOutline, FilterFill, InfoCircleFill, InfoCircleOutline, LeftOutline, LoadingOutline, PaperClipOutline, QuestionCircleOutline, RightOutline, RotateRightOutline, RotateLeftOutline, StarFill, SearchOutline, StarFill, UploadOutline, VerticalAlignTopOutline, UpOutline, SwapOutline, SwapRightOutline, ZoomInOutline, ZoomOutOutline];
var NZ_ICONS = new InjectionToken("nz_icons");
var NZ_ICON_DEFAULT_TWOTONE_COLOR = new InjectionToken("nz_icon_default_twotone_color");
var DEFAULT_TWOTONE_COLOR = "#1890ff";
var NzIconService = class _NzIconService extends IconService {
  nzConfigService;
  platform;
  configUpdated$ = new Subject();
  get _disableDynamicLoading() {
    return !this.platform.isBrowser;
  }
  iconfontCache = /* @__PURE__ */ new Set();
  subscription = null;
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
  normalizeSvgElement(svg) {
    if (!svg.getAttribute("viewBox")) {
      this._renderer.setAttribute(svg, "viewBox", "0 0 1024 1024");
    }
    if (!svg.getAttribute("width") || !svg.getAttribute("height")) {
      this._renderer.setAttribute(svg, "width", "1em");
      this._renderer.setAttribute(svg, "height", "1em");
    }
    if (!svg.getAttribute("fill")) {
      this._renderer.setAttribute(svg, "fill", "currentColor");
    }
  }
  fetchFromIconfont(opt) {
    const {
      scriptUrl
    } = opt;
    if (this._document && !this.iconfontCache.has(scriptUrl)) {
      const script = this._renderer.createElement("script");
      this._renderer.setAttribute(script, "src", scriptUrl);
      this._renderer.setAttribute(script, "data-namespace", scriptUrl.replace(/^(https?|http):/g, ""));
      this._renderer.appendChild(this._document.body, script);
      this.iconfontCache.add(scriptUrl);
    }
  }
  createIconfontIcon(type) {
    return this._createSVGElementFromString(`<svg><use xlink:href="${type}"></svg>`);
  }
  constructor(rendererFactory, sanitizer, nzConfigService, platform) {
    super(
      rendererFactory,
      inject(HttpBackend, {
        optional: true
      }),
      // TODO: fix the type
      inject(DOCUMENT),
      sanitizer,
      [...NZ_ICONS_USED_BY_ZORRO, ...inject(NZ_ICONS, {
        optional: true
      }) || []]
    );
    this.nzConfigService = nzConfigService;
    this.platform = platform;
    this.onConfigChange();
    this.configDefaultTwotoneColor();
    this.configDefaultTheme();
  }
  onConfigChange() {
    this.subscription = this.nzConfigService.getConfigChangeEventForComponent("icon").subscribe(() => {
      this.configDefaultTwotoneColor();
      this.configDefaultTheme();
      this.configUpdated$.next();
    });
  }
  configDefaultTheme() {
    const iconConfig = this.getConfig();
    this.defaultTheme = iconConfig.nzTheme || "outline";
  }
  configDefaultTwotoneColor() {
    const iconConfig = this.getConfig();
    const defaultTwotoneColor = iconConfig.nzTwotoneColor || DEFAULT_TWOTONE_COLOR;
    let primaryColor = DEFAULT_TWOTONE_COLOR;
    if (defaultTwotoneColor) {
      if (defaultTwotoneColor.startsWith("#")) {
        primaryColor = defaultTwotoneColor;
      } else {
        warn2("Twotone color must be a hex color!");
      }
    }
    this.twoToneColor = {
      primaryColor
    };
  }
  getConfig() {
    return this.nzConfigService.getConfigForComponent("icon") || {};
  }
  static \u0275fac = function NzIconService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzIconService)(\u0275\u0275inject(RendererFactory2), \u0275\u0275inject(DomSanitizer), \u0275\u0275inject(NzConfigService), \u0275\u0275inject(Platform));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NzIconService,
    factory: _NzIconService.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzIconService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RendererFactory2
  }, {
    type: DomSanitizer
  }, {
    type: NzConfigService
  }, {
    type: Platform
  }], null);
})();
var NZ_ICONS_PATCH = new InjectionToken("nz_icons_patch");
var NzIconPatchService = class _NzIconPatchService {
  rootIconService;
  patched = false;
  extraIcons = inject(NZ_ICONS_PATCH, {
    self: true
  });
  constructor(rootIconService) {
    this.rootIconService = rootIconService;
  }
  doPatch() {
    if (this.patched) {
      return;
    }
    this.extraIcons.forEach((iconDefinition) => this.rootIconService.addIcon(iconDefinition));
    this.patched = true;
  }
  static \u0275fac = function NzIconPatchService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzIconPatchService)(\u0275\u0275inject(NzIconService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NzIconPatchService,
    factory: _NzIconPatchService.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzIconPatchService, [{
    type: Injectable
  }], () => [{
    type: NzIconService
  }], null);
})();
var NzIconDirective = class _NzIconDirective extends IconDirective {
  ngZone;
  changeDetectorRef;
  iconService;
  renderer;
  cacheClassName = null;
  set nzSpin(value) {
    this.spin = value;
  }
  nzRotate = 0;
  set nzType(value) {
    this.type = value;
  }
  set nzTheme(value) {
    this.theme = value;
  }
  set nzTwotoneColor(value) {
    this.twoToneColor = value;
  }
  set nzIconfont(value) {
    this.iconfont = value;
  }
  hostClass;
  el;
  iconfont;
  spin = false;
  destroy$ = new Subject();
  constructor(ngZone, changeDetectorRef, iconService, renderer) {
    super(iconService);
    this.ngZone = ngZone;
    this.changeDetectorRef = changeDetectorRef;
    this.iconService = iconService;
    this.renderer = renderer;
    const iconPatch = inject(NzIconPatchService, {
      optional: true
    });
    if (iconPatch) {
      iconPatch.doPatch();
    }
    this.el = this._elementRef.nativeElement;
  }
  ngOnChanges(changes) {
    const {
      nzType,
      nzTwotoneColor,
      nzSpin,
      nzTheme,
      nzRotate
    } = changes;
    if (nzType || nzTwotoneColor || nzSpin || nzTheme) {
      this.changeIcon2();
    } else if (nzRotate) {
      this.handleRotate(this.el.firstChild);
    } else {
      this._setSVGElement(this.iconService.createIconfontIcon(`#${this.iconfont}`));
    }
  }
  /**
   * If custom content is provided, try to normalize SVG elements.
   */
  ngAfterContentChecked() {
    if (!this.type) {
      const children = this.el.children;
      let length = children.length;
      if (!this.type && children.length) {
        while (length--) {
          const child = children[length];
          if (child.tagName.toLowerCase() === "svg") {
            this.iconService.normalizeSvgElement(child);
          }
        }
      }
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
  /**
   * Replacement of `changeIcon` for more modifications.
   */
  changeIcon2() {
    this.setClassName();
    this.ngZone.runOutsideAngular(() => {
      from(this._changeIcon()).pipe(takeUntil(this.destroy$)).subscribe({
        next: (svgOrRemove) => {
          this.ngZone.run(() => {
            this.changeDetectorRef.detectChanges();
            if (svgOrRemove) {
              this.setSVGData(svgOrRemove);
              this.handleSpin(svgOrRemove);
              this.handleRotate(svgOrRemove);
            }
          });
        },
        error: warn2
      });
    });
  }
  handleSpin(svg) {
    if (this.spin || this.type === "loading") {
      this.renderer.addClass(svg, "anticon-spin");
    } else {
      this.renderer.removeClass(svg, "anticon-spin");
    }
  }
  handleRotate(svg) {
    if (this.nzRotate) {
      this.renderer.setAttribute(svg, "style", `transform: rotate(${this.nzRotate}deg)`);
    } else {
      this.renderer.removeAttribute(svg, "style");
    }
  }
  setClassName() {
    if (this.cacheClassName) {
      this.renderer.removeClass(this.el, this.cacheClassName);
    }
    this.cacheClassName = `anticon-${this.type}`;
    this.renderer.addClass(this.el, this.cacheClassName);
  }
  setSVGData(svg) {
    this.renderer.setAttribute(svg, "data-icon", this.type);
    this.renderer.setAttribute(svg, "aria-hidden", "true");
  }
  static \u0275fac = function NzIconDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzIconDirective)(\u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(NzIconService), \u0275\u0275directiveInject(Renderer2));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NzIconDirective,
    selectors: [["nz-icon"], ["", "nz-icon", ""]],
    hostAttrs: [1, "anticon"],
    inputs: {
      nzSpin: [2, "nzSpin", "nzSpin", booleanAttribute],
      nzRotate: [2, "nzRotate", "nzRotate", numberAttribute],
      nzType: "nzType",
      nzTheme: "nzTheme",
      nzTwotoneColor: "nzTwotoneColor",
      nzIconfont: "nzIconfont"
    },
    exportAs: ["nzIcon"],
    features: [\u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzIconDirective, [{
    type: Directive,
    args: [{
      selector: "nz-icon,[nz-icon]",
      exportAs: "nzIcon",
      host: {
        class: "anticon"
      }
    }]
  }], () => [{
    type: NgZone
  }, {
    type: ChangeDetectorRef
  }, {
    type: NzIconService
  }, {
    type: Renderer2
  }], {
    nzSpin: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzRotate: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    nzType: [{
      type: Input
    }],
    nzTheme: [{
      type: Input
    }],
    nzTwotoneColor: [{
      type: Input
    }],
    nzIconfont: [{
      type: Input
    }]
  });
})();
var provideNzIcons = (icons) => {
  return makeEnvironmentProviders([{
    provide: NZ_ICONS,
    useValue: icons
  }]);
};
var provideNzIconsPatch = (icons) => {
  return [NzIconPatchService, {
    provide: NZ_ICONS_PATCH,
    useValue: icons
  }];
};
var NzIconModule = class _NzIconModule {
  static forRoot(icons) {
    return {
      ngModule: _NzIconModule,
      providers: [provideNzIcons(icons)]
    };
  }
  static forChild(icons) {
    return {
      ngModule: _NzIconModule,
      providers: [provideNzIconsPatch(icons)]
    };
  }
  static \u0275fac = function NzIconModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzIconModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NzIconModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzIconModule, [{
    type: NgModule,
    args: [{
      imports: [NzIconDirective],
      exports: [NzIconDirective]
    }]
  }], null, null);
})();

// node_modules/@angular/core/fesm2022/rxjs-interop.mjs
function toSignal(source, options) {
  typeof ngDevMode !== "undefined" && ngDevMode && assertNotInReactiveContext(toSignal, "Invoking `toSignal` causes new subscriptions every time. Consider moving `toSignal` outside of the reactive context and read the signal value where needed.");
  const requiresCleanup = !options?.manualCleanup;
  requiresCleanup && !options?.injector && assertInInjectionContext(toSignal);
  const cleanupRef = requiresCleanup ? options?.injector?.get(DestroyRef) ?? inject(DestroyRef) : null;
  const equal = makeToSignalEqual(options?.equal);
  let state2;
  if (options?.requireSync) {
    state2 = signal({
      kind: 0
      /* StateKind.NoValue */
    }, {
      equal
    });
  } else {
    state2 = signal({
      kind: 1,
      value: options?.initialValue
    }, {
      equal
    });
  }
  const sub = source.subscribe({
    next: (value) => state2.set({
      kind: 1,
      value
    }),
    error: (error2) => {
      if (options?.rejectErrors) {
        throw error2;
      }
      state2.set({
        kind: 2,
        error: error2
      });
    }
    // Completion of the Observable is meaningless to the signal. Signals don't have a concept of
    // "complete".
  });
  if (options?.requireSync && state2().kind === 0) {
    throw new RuntimeError(601, (typeof ngDevMode === "undefined" || ngDevMode) && "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
  }
  cleanupRef?.onDestroy(sub.unsubscribe.bind(sub));
  return computed(() => {
    const current = state2();
    switch (current.kind) {
      case 1:
        return current.value;
      case 2:
        throw current.error;
      case 0:
        throw new RuntimeError(601, (typeof ngDevMode === "undefined" || ngDevMode) && "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
    }
  }, {
    equal: options?.equal
  });
}
function makeToSignalEqual(userEquality = Object.is) {
  return (a, b) => a.kind === 1 && b.kind === 1 && userEquality(a.value, b.value);
}

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-outlet.mjs
var NzStringTemplateOutletDirective = class _NzStringTemplateOutletDirective {
  viewContainer;
  templateRef;
  embeddedViewRef = null;
  context = new NzStringTemplateOutletContext();
  nzStringTemplateOutletContext = null;
  nzStringTemplateOutlet = null;
  static ngTemplateContextGuard(_dir, _ctx) {
    return true;
  }
  recreateView() {
    this.viewContainer.clear();
    if (isTemplateRef(this.nzStringTemplateOutlet)) {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.nzStringTemplateOutlet, this.nzStringTemplateOutletContext);
    } else {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }
  updateContext() {
    const newCtx = isTemplateRef(this.nzStringTemplateOutlet) ? this.nzStringTemplateOutletContext : this.context;
    const oldCtx = this.embeddedViewRef.context;
    if (newCtx) {
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
  }
  constructor(viewContainer, templateRef) {
    this.viewContainer = viewContainer;
    this.templateRef = templateRef;
  }
  ngOnChanges(changes) {
    const {
      nzStringTemplateOutletContext,
      nzStringTemplateOutlet
    } = changes;
    const shouldRecreateView = () => {
      let shouldOutletRecreate = false;
      if (nzStringTemplateOutlet) {
        shouldOutletRecreate = nzStringTemplateOutlet.firstChange || isTemplateRef(nzStringTemplateOutlet.previousValue) || isTemplateRef(nzStringTemplateOutlet.currentValue);
      }
      const hasContextShapeChanged = (ctxChange) => {
        const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
        const currCtxKeys = Object.keys(ctxChange.currentValue || {});
        if (prevCtxKeys.length === currCtxKeys.length) {
          for (const propName of currCtxKeys) {
            if (prevCtxKeys.indexOf(propName) === -1) {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      };
      const shouldContextRecreate = nzStringTemplateOutletContext && hasContextShapeChanged(nzStringTemplateOutletContext);
      return shouldContextRecreate || shouldOutletRecreate;
    };
    if (nzStringTemplateOutlet) {
      this.context.$implicit = nzStringTemplateOutlet.currentValue;
    }
    const recreateView = shouldRecreateView();
    if (recreateView) {
      this.recreateView();
    } else {
      this.updateContext();
    }
  }
  static \u0275fac = function NzStringTemplateOutletDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzStringTemplateOutletDirective)(\u0275\u0275directiveInject(ViewContainerRef), \u0275\u0275directiveInject(TemplateRef));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NzStringTemplateOutletDirective,
    selectors: [["", "nzStringTemplateOutlet", ""]],
    inputs: {
      nzStringTemplateOutletContext: "nzStringTemplateOutletContext",
      nzStringTemplateOutlet: "nzStringTemplateOutlet"
    },
    exportAs: ["nzStringTemplateOutlet"],
    features: [\u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzStringTemplateOutletDirective, [{
    type: Directive,
    args: [{
      selector: "[nzStringTemplateOutlet]",
      exportAs: "nzStringTemplateOutlet"
    }]
  }], () => [{
    type: ViewContainerRef
  }, {
    type: TemplateRef
  }], {
    nzStringTemplateOutletContext: [{
      type: Input
    }],
    nzStringTemplateOutlet: [{
      type: Input
    }]
  });
})();
var NzStringTemplateOutletContext = class {
  $implicit;
};
var NzOutletModule = class _NzOutletModule {
  static \u0275fac = function NzOutletModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzOutletModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NzOutletModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzOutletModule, [{
    type: NgModule,
    args: [{
      imports: [NzStringTemplateOutletDirective],
      exports: [NzStringTemplateOutletDirective]
    }]
  }], null, null);
})();

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-space.mjs
var _c0 = ["*"];
var _c1 = (a0) => ({
  $implicit: a0
});
function NzSpaceComponent_For_2_Conditional_2_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275textInterpolate(ctx_r0.nzSplit);
  }
}
function NzSpaceComponent_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275template(1, NzSpaceComponent_For_2_Conditional_2_ng_template_1_Template, 1, 1, "ng-template", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const \u0275$index_2_r3 = ctx_r1.$index;
    const \u0275$count_2_r4 = ctx_r1.$count;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("margin-block-end", ctx_r0.nzDirection === "vertical" ? \u0275$index_2_r3 === \u0275$count_2_r4 - 1 ? null : ctx_r0.spaceSize : null, "px")("margin-inline-end", ctx_r0.nzDirection === "horizontal" ? \u0275$index_2_r3 === \u0275$count_2_r4 - 1 ? null : ctx_r0.spaceSize : null, "px");
    \u0275\u0275advance();
    \u0275\u0275property("nzStringTemplateOutlet", ctx_r0.nzSplit)("nzStringTemplateOutletContext", \u0275\u0275pureFunction1(6, _c1, \u0275$index_2_r3));
  }
}
function NzSpaceComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275elementContainer(1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275template(2, NzSpaceComponent_For_2_Conditional_2_Template, 2, 8, "span", 2);
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const \u0275$index_2_r3 = ctx.$index;
    const \u0275$count_2_r4 = ctx.$count;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("margin-block-end", ctx_r0.nzDirection === "vertical" ? \u0275$index_2_r3 === \u0275$count_2_r4 - 1 ? null : ctx_r0.spaceSize : null, "px")("margin-inline-end", ctx_r0.nzDirection === "horizontal" ? \u0275$index_2_r3 === \u0275$count_2_r4 - 1 ? null : ctx_r0.spaceSize : null, "px");
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", item_r5);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.nzSplit && !(\u0275$index_2_r3 === \u0275$count_2_r4 - 1) ? 2 : -1);
  }
}
var NZ_SPACE_COMPACT_SIZE = new InjectionToken("NZ_SPACE_COMPACT_SIZE");
var NZ_SPACE_COMPACT_ITEMS = new InjectionToken("NZ_SPACE_COMPACT_ITEMS");
var NZ_SPACE_COMPACT_ITEM_TYPE = new InjectionToken("NZ_SPACE_COMPACT_ITEM_TYPE");
var NzSpaceCompactComponent = class _NzSpaceCompactComponent {
  nzBlock = input(false, {
    transform: booleanAttribute
  });
  nzDirection = input("horizontal");
  nzSize = input("default");
  elementRef = inject(ElementRef);
  static \u0275fac = function NzSpaceCompactComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSpaceCompactComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _NzSpaceCompactComponent,
    selectors: [["nz-space-compact"]],
    hostAttrs: [1, "ant-space-compact"],
    hostVars: 4,
    hostBindings: function NzSpaceCompactComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("ant-space-compact-block", ctx.nzBlock())("ant-space-compact-vertical", ctx.nzDirection() === "vertical");
      }
    },
    inputs: {
      nzBlock: [1, "nzBlock"],
      nzDirection: [1, "nzDirection"],
      nzSize: [1, "nzSize"]
    },
    exportAs: ["nzSpaceCompact"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: NZ_SPACE_COMPACT_SIZE,
      useFactory: () => inject(_NzSpaceCompactComponent).nzSize
    }, {
      provide: NZ_SPACE_COMPACT_ITEMS,
      useFactory: () => signal([])
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NzSpaceCompactComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275projection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSpaceCompactComponent, [{
    type: Component,
    args: [{
      selector: "nz-space-compact",
      exportAs: "nzSpaceCompact",
      template: `<ng-content></ng-content>`,
      host: {
        class: "ant-space-compact",
        "[class.ant-space-compact-block]": `nzBlock()`,
        "[class.ant-space-compact-vertical]": `nzDirection() === 'vertical'`
      },
      providers: [{
        provide: NZ_SPACE_COMPACT_SIZE,
        useFactory: () => inject(NzSpaceCompactComponent).nzSize
      }, {
        provide: NZ_SPACE_COMPACT_ITEMS,
        useFactory: () => signal([])
      }],
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var NzSpaceCompactItemDirective = class _NzSpaceCompactItemDirective {
  /**
   * Ancestor component injected from the parent.
   * Note that it is not necessarily the direct parent component.
   */
  spaceCompactCmp = inject(NzSpaceCompactComponent, {
    host: true,
    optional: true
  });
  items = inject(NZ_SPACE_COMPACT_ITEMS, {
    host: true,
    optional: true
  });
  type = inject(NZ_SPACE_COMPACT_ITEM_TYPE);
  elementRef = inject(ElementRef);
  directionality = inject(Directionality);
  dir = toSignal(this.directionality.change, {
    initialValue: this.directionality.value
  });
  get parentElement() {
    return this.elementRef.nativeElement?.parentElement;
  }
  class = computed(() => {
    if (!this.spaceCompactCmp || !this.items) return null;
    if (this.parentElement !== this.spaceCompactCmp.elementRef.nativeElement) return null;
    const items = this.items();
    const direction = this.spaceCompactCmp.nzDirection();
    const classes = [compactItemClassOf(this.type, direction, this.dir() === "rtl")];
    const index = items.indexOf(this);
    const firstIndex = items.findIndex((element) => element);
    if (index === firstIndex) {
      classes.push(compactFirstItemClassOf(this.type, direction));
    } else if (index === items.length - 1) {
      classes.push(compactLastItemClassOf(this.type, direction));
    }
    return classes;
  });
  constructor() {
    if (!this.spaceCompactCmp || !this.items) return;
    afterNextRender(() => {
      if (this.parentElement === this.spaceCompactCmp.elementRef.nativeElement) {
        const index = Array.from(this.parentElement.children).indexOf(this.elementRef.nativeElement);
        this.items.update((value) => {
          const newValue = value.slice();
          newValue.splice(index, 0, this);
          return newValue;
        });
      }
    });
  }
  ngOnDestroy() {
    this.items?.update((value) => value.filter((o) => o !== this));
  }
  static \u0275fac = function NzSpaceCompactItemDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSpaceCompactItemDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NzSpaceCompactItemDirective,
    hostVars: 2,
    hostBindings: function NzSpaceCompactItemDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classMap(ctx.class());
      }
    },
    exportAs: ["nzSpaceCompactItem"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSpaceCompactItemDirective, [{
    type: Directive,
    args: [{
      exportAs: "nzSpaceCompactItem",
      host: {
        "[class]": "class()"
      }
    }]
  }], () => [], null);
})();
function generateCompactClass(type, direction, position) {
  const directionPrefix = direction === "vertical" ? "vertical-" : "";
  return `ant-${type}-compact-${directionPrefix}${position}`;
}
function compactItemClassOf(type, direction, rtl) {
  const rtlSuffix = rtl ? "-rtl" : "";
  return `${generateCompactClass(type, direction, "item")}${rtlSuffix}`;
}
function compactFirstItemClassOf(type, direction) {
  return generateCompactClass(type, direction, "first-item");
}
function compactLastItemClassOf(type, direction) {
  return generateCompactClass(type, direction, "last-item");
}
var NzSpaceItemDirective = class _NzSpaceItemDirective {
  static \u0275fac = function NzSpaceItemDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSpaceItemDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NzSpaceItemDirective,
    selectors: [["", "nzSpaceItem", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSpaceItemDirective, [{
    type: Directive,
    args: [{
      selector: "[nzSpaceItem]"
    }]
  }], null, null);
})();
var NZ_CONFIG_MODULE_NAME = "space";
var SPACE_SIZE = {
  small: 8,
  middle: 16,
  large: 24
};
var NzSpaceComponent = (() => {
  let _nzSize_decorators;
  let _nzSize_initializers = [];
  let _nzSize_extraInitializers = [];
  return class NzSpaceComponent2 {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
      _nzSize_decorators = [WithConfig()];
      __esDecorate(null, null, _nzSize_decorators, {
        kind: "field",
        name: "nzSize",
        static: false,
        private: false,
        access: {
          has: (obj) => "nzSize" in obj,
          get: (obj) => obj.nzSize,
          set: (obj, value) => {
            obj.nzSize = value;
          }
        },
        metadata: _metadata
      }, _nzSize_initializers, _nzSize_extraInitializers);
      if (_metadata) Object.defineProperty(this, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata
      });
    }
    nzConfigService;
    cdr;
    _nzModuleName = NZ_CONFIG_MODULE_NAME;
    nzDirection = "horizontal";
    nzAlign;
    nzSplit = null;
    nzWrap = false;
    nzSize = __runInitializers(this, _nzSize_initializers, "small");
    items = __runInitializers(this, _nzSize_extraInitializers);
    mergedAlign;
    spaceSize = SPACE_SIZE.small;
    destroy$ = new Subject();
    constructor(nzConfigService, cdr) {
      this.nzConfigService = nzConfigService;
      this.cdr = cdr;
    }
    updateSpaceItems() {
      const numberSize = typeof this.nzSize === "string" ? SPACE_SIZE[this.nzSize] : this.nzSize;
      this.spaceSize = numberSize / (this.nzSplit ? 2 : 1);
      this.cdr.markForCheck();
    }
    ngOnChanges() {
      this.updateSpaceItems();
      this.mergedAlign = this.nzAlign === void 0 && this.nzDirection === "horizontal" ? "center" : this.nzAlign;
    }
    ngOnDestroy() {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
    ngAfterContentInit() {
      this.updateSpaceItems();
      this.items.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.cdr.markForCheck();
      });
    }
    static \u0275fac = function NzSpaceComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NzSpaceComponent2)(\u0275\u0275directiveInject(NzConfigService), \u0275\u0275directiveInject(ChangeDetectorRef));
    };
    static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: NzSpaceComponent2,
      selectors: [["nz-space"], ["", "nz-space", ""]],
      contentQueries: function NzSpaceComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, NzSpaceItemDirective, 4, TemplateRef);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.items = _t);
        }
      },
      hostAttrs: [1, "ant-space"],
      hostVars: 14,
      hostBindings: function NzSpaceComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275styleProp("flex-wrap", ctx.nzWrap ? "wrap" : null);
          \u0275\u0275classProp("ant-space-horizontal", ctx.nzDirection === "horizontal")("ant-space-vertical", ctx.nzDirection === "vertical")("ant-space-align-start", ctx.mergedAlign === "start")("ant-space-align-end", ctx.mergedAlign === "end")("ant-space-align-center", ctx.mergedAlign === "center")("ant-space-align-baseline", ctx.mergedAlign === "baseline");
        }
      },
      inputs: {
        nzDirection: "nzDirection",
        nzAlign: "nzAlign",
        nzSplit: "nzSplit",
        nzWrap: [2, "nzWrap", "nzWrap", booleanAttribute],
        nzSize: "nzSize"
      },
      exportAs: ["nzSpace"],
      features: [\u0275\u0275NgOnChangesFeature],
      ngContentSelectors: _c0,
      decls: 3,
      vars: 0,
      consts: [[1, "ant-space-item"], [3, "ngTemplateOutlet"], [1, "ant-space-split", 3, "margin-block-end", "margin-inline-end"], [1, "ant-space-split"], [3, "nzStringTemplateOutlet", "nzStringTemplateOutletContext"]],
      template: function NzSpaceComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
          \u0275\u0275repeaterCreate(1, NzSpaceComponent_For_2_Template, 3, 6, null, null, \u0275\u0275repeaterTrackByIdentity);
        }
        if (rf & 2) {
          \u0275\u0275advance();
          \u0275\u0275repeater(ctx.items);
        }
      },
      dependencies: [NgTemplateOutlet, NzStringTemplateOutletDirective],
      encapsulation: 2,
      changeDetection: 0
    });
  };
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSpaceComponent, [{
    type: Component,
    args: [{
      selector: "nz-space, [nz-space]",
      exportAs: "nzSpace",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <ng-content></ng-content>
    @for (item of items; track item; let last = $last; let index = $index) {
      <div
        class="ant-space-item"
        [style.margin-block-end.px]="nzDirection === 'vertical' ? (last ? null : spaceSize) : null"
        [style.margin-inline-end.px]="nzDirection === 'horizontal' ? (last ? null : spaceSize) : null"
      >
        <ng-container [ngTemplateOutlet]="item"></ng-container>
      </div>
      @if (nzSplit && !last) {
        <span
          class="ant-space-split"
          [style.margin-block-end.px]="nzDirection === 'vertical' ? (last ? null : spaceSize) : null"
          [style.margin-inline-end.px]="nzDirection === 'horizontal' ? (last ? null : spaceSize) : null"
        >
          <ng-template [nzStringTemplateOutlet]="nzSplit" [nzStringTemplateOutletContext]="{ $implicit: index }">{{
            nzSplit
          }}</ng-template>
        </span>
      }
    }
  `,
      host: {
        class: "ant-space",
        "[class.ant-space-horizontal]": 'nzDirection === "horizontal"',
        "[class.ant-space-vertical]": 'nzDirection === "vertical"',
        "[class.ant-space-align-start]": 'mergedAlign === "start"',
        "[class.ant-space-align-end]": 'mergedAlign === "end"',
        "[class.ant-space-align-center]": 'mergedAlign === "center"',
        "[class.ant-space-align-baseline]": 'mergedAlign === "baseline"',
        "[style.flex-wrap]": 'nzWrap ? "wrap" : null'
      },
      imports: [NgTemplateOutlet, NzStringTemplateOutletDirective]
    }]
  }], () => [{
    type: NzConfigService
  }, {
    type: ChangeDetectorRef
  }], {
    nzDirection: [{
      type: Input
    }],
    nzAlign: [{
      type: Input
    }],
    nzSplit: [{
      type: Input
    }],
    nzWrap: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzSize: [{
      type: Input
    }],
    items: [{
      type: ContentChildren,
      args: [NzSpaceItemDirective, {
        read: TemplateRef
      }]
    }]
  });
})();
var NzSpaceModule = class _NzSpaceModule {
  static \u0275fac = function NzSpaceModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSpaceModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NzSpaceModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSpaceModule, [{
    type: NgModule,
    args: [{
      imports: [NzSpaceComponent, NzSpaceItemDirective, NzSpaceCompactComponent],
      exports: [NzSpaceComponent, NzSpaceItemDirective, NzSpaceCompactComponent]
    }]
  }], null, null);
})();

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-transition-patch.mjs
var NzTransitionPatchDirective = class _NzTransitionPatchDirective {
  elementRef;
  renderer;
  hidden = null;
  setHiddenAttribute() {
    if (this.hidden) {
      if (typeof this.hidden === "string") {
        this.renderer.setAttribute(this.elementRef.nativeElement, "hidden", this.hidden);
      } else {
        this.renderer.setAttribute(this.elementRef.nativeElement, "hidden", "");
      }
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, "hidden");
    }
  }
  constructor(elementRef, renderer) {
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.renderer.setAttribute(this.elementRef.nativeElement, "hidden", "");
  }
  ngOnChanges() {
    this.setHiddenAttribute();
  }
  ngAfterViewInit() {
    this.setHiddenAttribute();
  }
  static \u0275fac = function NzTransitionPatchDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzTransitionPatchDirective)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Renderer2));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NzTransitionPatchDirective,
    selectors: [["", "nz-button", ""], ["nz-button-group"], ["", "nz-icon", ""], ["nz-icon"], ["", "nz-menu-item", ""], ["", "nz-submenu", ""], ["nz-select-top-control"], ["nz-select-placeholder"], ["nz-input-group"]],
    inputs: {
      hidden: "hidden"
    },
    features: [\u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzTransitionPatchDirective, [{
    type: Directive,
    args: [{
      selector: "[nz-button], nz-button-group, [nz-icon], nz-icon, [nz-menu-item], [nz-submenu], nz-select-top-control, nz-select-placeholder, nz-input-group"
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }], {
    hidden: [{
      type: Input
    }]
  });
})();
var NzTransitionPatchModule = class _NzTransitionPatchModule {
  static \u0275fac = function NzTransitionPatchModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzTransitionPatchModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NzTransitionPatchModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzTransitionPatchModule, [{
    type: NgModule,
    args: [{
      imports: [NzTransitionPatchDirective],
      exports: [NzTransitionPatchDirective]
    }]
  }], null, null);
})();

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-wave.mjs
var NzWaveRenderer = class {
  triggerElement;
  ngZone;
  insertExtraNode;
  platform;
  cspNonce;
  waveTransitionDuration = 400;
  styleForPseudo = null;
  extraNode = null;
  lastTime = 0;
  clickHandler;
  get waveAttributeName() {
    return this.insertExtraNode ? "ant-click-animating" : "ant-click-animating-without-extra-node";
  }
  constructor(triggerElement, ngZone, insertExtraNode, platform, cspNonce) {
    this.triggerElement = triggerElement;
    this.ngZone = ngZone;
    this.insertExtraNode = insertExtraNode;
    this.platform = platform;
    this.cspNonce = cspNonce;
    this.clickHandler = this.onClick.bind(this);
    this.bindTriggerEvent();
  }
  onClick = (event) => {
    if (!this.triggerElement || !this.triggerElement.getAttribute || this.triggerElement.getAttribute("disabled") || event.target.tagName === "INPUT" || this.triggerElement.className.indexOf("disabled") >= 0) {
      return;
    }
    this.fadeOutWave();
  };
  bindTriggerEvent() {
    if (this.platform.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        this.removeTriggerEvent();
        if (this.triggerElement) {
          this.triggerElement.addEventListener("click", this.clickHandler, true);
        }
      });
    }
  }
  removeTriggerEvent() {
    if (this.triggerElement) {
      this.triggerElement.removeEventListener("click", this.clickHandler, true);
    }
  }
  removeStyleAndExtraNode() {
    if (this.styleForPseudo && document.body.contains(this.styleForPseudo)) {
      document.body.removeChild(this.styleForPseudo);
      this.styleForPseudo = null;
    }
    if (this.insertExtraNode && this.triggerElement.contains(this.extraNode)) {
      this.triggerElement.removeChild(this.extraNode);
    }
  }
  destroy() {
    this.removeTriggerEvent();
    this.removeStyleAndExtraNode();
  }
  fadeOutWave() {
    const node = this.triggerElement;
    const waveColor = this.getWaveColor(node);
    node.setAttribute(this.waveAttributeName, "true");
    if (Date.now() < this.lastTime + this.waveTransitionDuration) {
      return;
    }
    if (this.isValidColor(waveColor)) {
      if (!this.styleForPseudo) {
        this.styleForPseudo = document.createElement("style");
        if (this.cspNonce) {
          this.styleForPseudo.nonce = this.cspNonce;
        }
      }
      this.styleForPseudo.innerHTML = `
      [ant-click-animating-without-extra-node='true']::after, .ant-click-animating-node {
        --antd-wave-shadow-color: ${waveColor};
      }`;
      document.body.appendChild(this.styleForPseudo);
    }
    if (this.insertExtraNode) {
      if (!this.extraNode) {
        this.extraNode = document.createElement("div");
      }
      this.extraNode.className = "ant-click-animating-node";
      node.appendChild(this.extraNode);
    }
    this.lastTime = Date.now();
    this.runTimeoutOutsideZone(() => {
      node.removeAttribute(this.waveAttributeName);
      this.removeStyleAndExtraNode();
    }, this.waveTransitionDuration);
  }
  isValidColor(color) {
    return !!color && color !== "#ffffff" && color !== "rgb(255, 255, 255)" && this.isNotGrey(color) && !/rgba\(\d*, \d*, \d*, 0\)/.test(color) && color !== "transparent";
  }
  isNotGrey(color) {
    const match = color.match(/rgba?\((\d*), (\d*), (\d*)(, [.\d]*)?\)/);
    if (match && match[1] && match[2] && match[3]) {
      return !(match[1] === match[2] && match[2] === match[3]);
    }
    return true;
  }
  getWaveColor(node) {
    const nodeStyle = getComputedStyle(node);
    return nodeStyle.getPropertyValue("border-top-color") || // Firefox Compatible
    nodeStyle.getPropertyValue("border-color") || nodeStyle.getPropertyValue("background-color");
  }
  runTimeoutOutsideZone(fn, delay) {
    this.ngZone.runOutsideAngular(() => setTimeout(fn, delay));
  }
};
var NZ_WAVE_GLOBAL_DEFAULT_CONFIG = {
  disabled: false
};
var NZ_WAVE_GLOBAL_CONFIG = new InjectionToken("nz-wave-global-options");
function provideNzWave(config) {
  return makeEnvironmentProviders([{
    provide: NZ_WAVE_GLOBAL_CONFIG,
    useValue: config
  }]);
}
var NzWaveDirective = class _NzWaveDirective {
  ngZone;
  elementRef;
  nzWaveExtraNode = false;
  waveRenderer;
  waveDisabled = false;
  get disabled() {
    return this.waveDisabled;
  }
  get rendererRef() {
    return this.waveRenderer;
  }
  cspNonce = inject(CSP_NONCE, {
    optional: true
  });
  platform = inject(Platform);
  config = inject(NZ_WAVE_GLOBAL_CONFIG, {
    optional: true
  });
  animationType = inject(ANIMATION_MODULE_TYPE, {
    optional: true
  });
  constructor(ngZone, elementRef) {
    this.ngZone = ngZone;
    this.elementRef = elementRef;
    this.waveDisabled = this.isConfigDisabled();
  }
  isConfigDisabled() {
    let disabled = false;
    if (this.config && typeof this.config.disabled === "boolean") {
      disabled = this.config.disabled;
    }
    if (this.animationType === "NoopAnimations") {
      disabled = true;
    }
    return disabled;
  }
  ngOnDestroy() {
    if (this.waveRenderer) {
      this.waveRenderer.destroy();
    }
  }
  ngOnInit() {
    this.renderWaveIfEnabled();
  }
  renderWaveIfEnabled() {
    if (!this.waveDisabled && this.elementRef.nativeElement) {
      this.waveRenderer = new NzWaveRenderer(this.elementRef.nativeElement, this.ngZone, this.nzWaveExtraNode, this.platform, this.cspNonce);
    }
  }
  disable() {
    this.waveDisabled = true;
    if (this.waveRenderer) {
      this.waveRenderer.removeTriggerEvent();
      this.waveRenderer.removeStyleAndExtraNode();
    }
  }
  enable() {
    this.waveDisabled = this.isConfigDisabled() || false;
    if (this.waveRenderer) {
      this.waveRenderer.bindTriggerEvent();
    }
  }
  static \u0275fac = function NzWaveDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzWaveDirective)(\u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(ElementRef));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NzWaveDirective,
    selectors: [["", "nz-wave", ""], ["button", "nz-button", "", 3, "nzType", "link", 3, "nzType", "text"]],
    inputs: {
      nzWaveExtraNode: "nzWaveExtraNode"
    },
    exportAs: ["nzWave"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzWaveDirective, [{
    type: Directive,
    args: [{
      selector: '[nz-wave],button[nz-button]:not([nzType="link"]):not([nzType="text"])',
      exportAs: "nzWave"
    }]
  }], () => [{
    type: NgZone
  }, {
    type: ElementRef
  }], {
    nzWaveExtraNode: [{
      type: Input
    }]
  });
})();
var NzWaveModule = class _NzWaveModule {
  static \u0275fac = function NzWaveModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzWaveModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NzWaveModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: [provideNzWave(NZ_WAVE_GLOBAL_DEFAULT_CONFIG)]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzWaveModule, [{
    type: NgModule,
    args: [{
      imports: [NzWaveDirective],
      exports: [NzWaveDirective],
      providers: [provideNzWave(NZ_WAVE_GLOBAL_DEFAULT_CONFIG)]
    }]
  }], null, null);
})();

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-polyfill.mjs
var availablePrefixes = ["moz", "ms", "webkit"];
function requestAnimationFramePolyfill() {
  let lastTime = 0;
  return function(callback) {
    const currTime = (/* @__PURE__ */ new Date()).getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(() => {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}
function getRequestAnimationFrame() {
  if (typeof window === "undefined") {
    return () => 0;
  }
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame.bind(window);
  }
  const prefix = availablePrefixes.filter((key) => `${key}RequestAnimationFrame` in window)[0];
  return prefix ? window[`${prefix}RequestAnimationFrame`] : requestAnimationFramePolyfill();
}
function cancelRequestAnimationFrame(id) {
  if (typeof window === "undefined") {
    return null;
  }
  if (window.cancelAnimationFrame) {
    return window.cancelAnimationFrame(id);
  }
  const prefix = availablePrefixes.filter((key) => `${key}CancelAnimationFrame` in window || `${key}CancelRequestAnimationFrame` in window)[0];
  return prefix ? (window[`${prefix}CancelAnimationFrame`] || window[`${prefix}CancelRequestAnimationFrame`]).call(this, id) : clearTimeout(id);
}
var reqAnimFrame = getRequestAnimationFrame();

// node_modules/@angular/cdk/fesm2022/layout.mjs
var LayoutModule = class _LayoutModule {
  static \u0275fac = function LayoutModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _LayoutModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-services.mjs
var NOOP = () => {
};
var NzResizeService = class _NzResizeService {
  ngZone;
  rendererFactory2;
  resizeSource$ = new Subject();
  listeners = 0;
  renderer;
  disposeHandle = NOOP;
  handler = () => {
    this.ngZone.run(() => {
      this.resizeSource$.next();
    });
  };
  constructor(ngZone, rendererFactory2) {
    this.ngZone = ngZone;
    this.rendererFactory2 = rendererFactory2;
    this.renderer = this.rendererFactory2.createRenderer(null, null);
  }
  ngOnDestroy() {
    this.handler = NOOP;
  }
  subscribe() {
    this.registerListener();
    return this.resizeSource$.pipe(auditTime(16), finalize(() => this.unregisterListener()));
  }
  unsubscribe() {
    this.unregisterListener();
  }
  registerListener() {
    if (this.listeners === 0) {
      this.ngZone.runOutsideAngular(() => {
        this.disposeHandle = this.renderer.listen("window", "resize", this.handler);
      });
    }
    this.listeners += 1;
  }
  unregisterListener() {
    this.listeners -= 1;
    if (this.listeners === 0) {
      this.disposeHandle();
      this.disposeHandle = NOOP;
    }
  }
  static \u0275fac = function NzResizeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzResizeService)(\u0275\u0275inject(NgZone), \u0275\u0275inject(RendererFactory2));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NzResizeService,
    factory: _NzResizeService.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzResizeService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: NgZone
  }, {
    type: RendererFactory2
  }], null);
})();
var testSingleRegistry = /* @__PURE__ */ new Map();
var NzSingletonService = class _NzSingletonService {
  get singletonRegistry() {
    return environment2.isTestMode ? testSingleRegistry : this._singletonRegistry;
  }
  /**
   * This registry is used to register singleton in dev mode.
   * So that singletons get destroyed when hot module reload happens.
   *
   * This works in prod mode too but with no specific effect.
   */
  _singletonRegistry = /* @__PURE__ */ new Map();
  registerSingletonWithKey(key, target) {
    const alreadyHave = this.singletonRegistry.has(key);
    const item = alreadyHave ? this.singletonRegistry.get(key) : this.withNewTarget(target);
    if (!alreadyHave) {
      this.singletonRegistry.set(key, item);
    }
  }
  unregisterSingletonWithKey(key) {
    if (this.singletonRegistry.has(key)) {
      this.singletonRegistry.delete(key);
    }
  }
  getSingletonWithKey(key) {
    return this.singletonRegistry.has(key) ? this.singletonRegistry.get(key).target : null;
  }
  withNewTarget(target) {
    return {
      target
    };
  }
  static \u0275fac = function NzSingletonService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSingletonService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NzSingletonService,
    factory: _NzSingletonService.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSingletonService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function getPagePosition(event) {
  const e = getEventPosition(event);
  return {
    x: e.pageX,
    y: e.pageY
  };
}
var NzDragService = class _NzDragService {
  draggingThreshold = 5;
  currentDraggingSequence = null;
  currentStartingPoint = null;
  handleRegistry = /* @__PURE__ */ new Set();
  renderer;
  constructor(rendererFactory2) {
    this.renderer = rendererFactory2.createRenderer(null, null);
  }
  requestDraggingSequence(event) {
    if (!this.handleRegistry.size) {
      this.registerDraggingHandler(isTouchEvent(event));
    }
    if (this.currentDraggingSequence) {
      this.currentDraggingSequence.complete();
    }
    this.currentStartingPoint = getPagePosition(event);
    this.currentDraggingSequence = new Subject();
    return this.currentDraggingSequence.pipe(map((e) => ({
      x: e.pageX - this.currentStartingPoint.x,
      y: e.pageY - this.currentStartingPoint.y
    })), filter((e) => Math.abs(e.x) > this.draggingThreshold || Math.abs(e.y) > this.draggingThreshold), finalize(() => this.teardownDraggingSequence()));
  }
  registerDraggingHandler(isTouch) {
    if (isTouch) {
      this.handleRegistry.add({
        teardown: this.renderer.listen("document", "touchmove", (e) => {
          if (this.currentDraggingSequence) {
            this.currentDraggingSequence.next(e.touches[0] || e.changedTouches[0]);
          }
        })
      });
      this.handleRegistry.add({
        teardown: this.renderer.listen("document", "touchend", () => {
          if (this.currentDraggingSequence) {
            this.currentDraggingSequence.complete();
          }
        })
      });
    } else {
      this.handleRegistry.add({
        teardown: this.renderer.listen("document", "mousemove", (e) => {
          if (this.currentDraggingSequence) {
            this.currentDraggingSequence.next(e);
          }
        })
      });
      this.handleRegistry.add({
        teardown: this.renderer.listen("document", "mouseup", () => {
          if (this.currentDraggingSequence) {
            this.currentDraggingSequence.complete();
          }
        })
      });
    }
  }
  teardownDraggingSequence() {
    this.currentDraggingSequence = null;
  }
  static \u0275fac = function NzDragService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzDragService)(\u0275\u0275inject(RendererFactory2));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NzDragService,
    factory: _NzDragService.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzDragService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RendererFactory2
  }], null);
})();
function easeInOutCubic(t, b, c, d) {
  const cc = c - b;
  let tt = t / (d / 2);
  if (tt < 1) {
    return cc / 2 * tt * tt * tt + b;
  } else {
    return cc / 2 * ((tt -= 2) * tt * tt + 2) + b;
  }
}
var NzScrollService = class _NzScrollService {
  ngZone;
  doc = inject(DOCUMENT);
  constructor(ngZone) {
    this.ngZone = ngZone;
  }
  /** Set the position of the scroll bar of `el`. */
  setScrollTop(el, topValue = 0) {
    if (el === window) {
      this.doc.body.scrollTop = topValue;
      this.doc.documentElement.scrollTop = topValue;
    } else {
      el.scrollTop = topValue;
    }
  }
  /** Get position of `el` against window. */
  getOffset(el) {
    const ret = {
      top: 0,
      left: 0
    };
    if (!el || !el.getClientRects().length) {
      return ret;
    }
    const rect = el.getBoundingClientRect();
    if (rect.width || rect.height) {
      const doc = el.ownerDocument.documentElement;
      ret.top = rect.top - doc.clientTop;
      ret.left = rect.left - doc.clientLeft;
    } else {
      ret.top = rect.top;
      ret.left = rect.left;
    }
    return ret;
  }
  /** Get the position of the scoll bar of `el`. */
  // TODO: remove '| Window' as the fallback already happens here
  getScroll(target, top = true) {
    if (typeof window === "undefined") {
      return 0;
    }
    const method = top ? "scrollTop" : "scrollLeft";
    let result = 0;
    if (this.isWindow(target)) {
      result = target[top ? "pageYOffset" : "pageXOffset"];
    } else if (target instanceof Document) {
      result = target.documentElement[method];
    } else if (target) {
      result = target[method];
    }
    if (target && !this.isWindow(target) && typeof result !== "number") {
      result = (target.ownerDocument || target).documentElement[method];
    }
    return result;
  }
  isWindow(obj) {
    return obj !== null && obj !== void 0 && obj === obj.window;
  }
  /**
   * Scroll `el` to some position with animation.
   *
   * @param containerEl container, `window` by default
   * @param y Scroll to `top`, 0 by default
   */
  scrollTo(containerEl, y = 0, options = {}) {
    const target = containerEl ? containerEl : window;
    const scrollTop = this.getScroll(target);
    const startTime = Date.now();
    const {
      easing,
      callback,
      duration = 450
    } = options;
    const frameFunc = () => {
      const timestamp = Date.now();
      const time = timestamp - startTime;
      const nextScrollTop = (easing || easeInOutCubic)(time > duration ? duration : time, scrollTop, y, duration);
      if (this.isWindow(target)) {
        target.scrollTo(window.pageXOffset, nextScrollTop);
      } else if (target instanceof HTMLDocument || target.constructor.name === "HTMLDocument") {
        target.documentElement.scrollTop = nextScrollTop;
      } else {
        target.scrollTop = nextScrollTop;
      }
      if (time < duration) {
        reqAnimFrame(frameFunc);
      } else if (typeof callback === "function") {
        this.ngZone.run(callback);
      }
    };
    this.ngZone.runOutsideAngular(() => reqAnimFrame(frameFunc));
  }
  static \u0275fac = function NzScrollService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzScrollService)(\u0275\u0275inject(NgZone));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NzScrollService,
    factory: _NzScrollService.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzScrollService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: NgZone
  }], null);
})();
var NzBreakpointEnum;
(function(NzBreakpointEnum2) {
  NzBreakpointEnum2["xxl"] = "xxl";
  NzBreakpointEnum2["xl"] = "xl";
  NzBreakpointEnum2["lg"] = "lg";
  NzBreakpointEnum2["md"] = "md";
  NzBreakpointEnum2["sm"] = "sm";
  NzBreakpointEnum2["xs"] = "xs";
})(NzBreakpointEnum || (NzBreakpointEnum = {}));
var gridResponsiveMap = {
  xs: "(max-width: 575px)",
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1600px)"
};
var NzBreakpointService = class _NzBreakpointService {
  resizeService;
  mediaMatcher;
  destroy$ = new Subject();
  constructor(resizeService, mediaMatcher) {
    this.resizeService = resizeService;
    this.mediaMatcher = mediaMatcher;
    this.resizeService.subscribe().pipe(takeUntil(this.destroy$)).subscribe(() => {
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
  subscribe(breakpointMap, fullMap) {
    if (fullMap) {
      const get = () => this.matchMedia(breakpointMap, true);
      return this.resizeService.subscribe().pipe(map(get), startWith(get()), distinctUntilChanged((x, y) => x[0] === y[0]), map((x) => x[1]));
    } else {
      const get = () => this.matchMedia(breakpointMap);
      return this.resizeService.subscribe().pipe(map(get), startWith(get()), distinctUntilChanged());
    }
  }
  matchMedia(breakpointMap, fullMap) {
    let bp = NzBreakpointEnum.md;
    const breakpointBooleanMap = {};
    Object.keys(breakpointMap).map((breakpoint) => {
      const castBP = breakpoint;
      const matched = this.mediaMatcher.matchMedia(gridResponsiveMap[castBP]).matches;
      breakpointBooleanMap[breakpoint] = matched;
      if (matched) {
        bp = castBP;
      }
    });
    if (fullMap) {
      return [bp, breakpointBooleanMap];
    } else {
      return bp;
    }
  }
  static \u0275fac = function NzBreakpointService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzBreakpointService)(\u0275\u0275inject(NzResizeService), \u0275\u0275inject(MediaMatcher));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NzBreakpointService,
    factory: _NzBreakpointService.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzBreakpointService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: NzResizeService
  }, {
    type: MediaMatcher
  }], null);
})();
var NzDestroyService = class _NzDestroyService extends Subject {
  ngOnDestroy() {
    this.next();
    this.complete();
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275NzDestroyService_BaseFactory;
    return function NzDestroyService_Factory(__ngFactoryType__) {
      return (\u0275NzDestroyService_BaseFactory || (\u0275NzDestroyService_BaseFactory = \u0275\u0275getInheritedFactory(_NzDestroyService)))(__ngFactoryType__ || _NzDestroyService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NzDestroyService,
    factory: _NzDestroyService.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzDestroyService, [{
    type: Injectable
  }], null, null);
})();
var ImagePreloadService = class _ImagePreloadService {
  platform;
  counter = /* @__PURE__ */ new Map();
  linkRefs = /* @__PURE__ */ new Map();
  document = inject(DOCUMENT);
  constructor(platform) {
    this.platform = platform;
  }
  addPreload(option) {
    if (this.platform.isBrowser) {
      return () => void 0;
    }
    const uniqueKey = `${option.src}${option.srcset}`;
    let currentCount = this.counter.get(uniqueKey) || 0;
    currentCount++;
    this.counter.set(uniqueKey, currentCount);
    if (!this.linkRefs.has(uniqueKey)) {
      const linkNode = this.appendPreloadLink(option);
      this.linkRefs.set(uniqueKey, linkNode);
    }
    return () => {
      if (this.counter.has(uniqueKey)) {
        let count = this.counter.get(uniqueKey);
        count--;
        if (count === 0) {
          const linkNode = this.linkRefs.get(uniqueKey);
          this.removePreloadLink(linkNode);
          this.counter.delete(uniqueKey);
          this.linkRefs.delete(uniqueKey);
        } else {
          this.counter.set(uniqueKey, count);
        }
      }
    };
  }
  appendPreloadLink(option) {
    const linkNode = this.document.createElement("link");
    linkNode.setAttribute("rel", "preload");
    linkNode.setAttribute("as", "image");
    linkNode.setAttribute("href", option.src);
    if (option.srcset) {
      linkNode.setAttribute("imagesrcset", option.srcset);
    }
    this.document.head.appendChild(linkNode);
    return linkNode;
  }
  removePreloadLink(linkNode) {
    if (this.document.head.contains(linkNode)) {
      this.document.head.removeChild(linkNode);
    }
  }
  static \u0275fac = function ImagePreloadService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImagePreloadService)(\u0275\u0275inject(Platform));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ImagePreloadService,
    factory: _ImagePreloadService.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImagePreloadService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Platform
  }], null);
})();

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-button.mjs
var _c02 = ["nz-button", ""];
var _c12 = ["*"];
function NzButtonComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "nz-icon", 0);
  }
}
var NZ_CONFIG_MODULE_NAME2 = "button";
var NzButtonComponent = (() => {
  let _nzSize_decorators;
  let _nzSize_initializers = [];
  let _nzSize_extraInitializers = [];
  return class NzButtonComponent2 {
    static {
      const _metadata = typeof Symbol === "function" && Symbol.metadata ? /* @__PURE__ */ Object.create(null) : void 0;
      _nzSize_decorators = [WithConfig()];
      __esDecorate(null, null, _nzSize_decorators, {
        kind: "field",
        name: "nzSize",
        static: false,
        private: false,
        access: {
          has: (obj) => "nzSize" in obj,
          get: (obj) => obj.nzSize,
          set: (obj, value) => {
            obj.nzSize = value;
          }
        },
        metadata: _metadata
      }, _nzSize_initializers, _nzSize_extraInitializers);
      if (_metadata) Object.defineProperty(this, Symbol.metadata, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _metadata
      });
    }
    elementRef;
    cdr;
    renderer;
    nzConfigService;
    directionality;
    _nzModuleName = NZ_CONFIG_MODULE_NAME2;
    nzIconDirectiveElement;
    nzBlock = false;
    nzGhost = false;
    nzSearch = false;
    nzLoading = false;
    nzDanger = false;
    disabled = false;
    tabIndex = null;
    nzType = null;
    nzShape = null;
    nzSize = __runInitializers(this, _nzSize_initializers, "default");
    dir = (__runInitializers(this, _nzSize_extraInitializers), "ltr");
    finalSize = computed(() => {
      if (this.compactSize) {
        return this.compactSize();
      }
      return this.size();
    });
    size = signal(this.nzSize);
    compactSize = inject(NZ_SPACE_COMPACT_SIZE, {
      optional: true
    });
    destroy$ = inject(NzDestroyService);
    loading$ = new Subject();
    insertSpan(nodes, renderer) {
      nodes.forEach((node) => {
        if (node.nodeName === "#text") {
          const span = renderer.createElement("span");
          const parent = renderer.parentNode(node);
          renderer.insertBefore(parent, span, node);
          renderer.appendChild(span, node);
        }
      });
    }
    get iconOnly() {
      const listOfNode = Array.from(this.elementRef?.nativeElement?.childNodes || []);
      const noText = listOfNode.every((node) => node.nodeName !== "#text");
      const noSpan = listOfNode.filter((node) => {
        return !(node.nodeName === "#comment" || !!node?.classList?.contains("anticon"));
      }).length == 0;
      return !!this.nzIconDirectiveElement && noSpan && noText;
    }
    constructor(elementRef, cdr, renderer, nzConfigService, directionality) {
      this.elementRef = elementRef;
      this.cdr = cdr;
      this.renderer = renderer;
      this.nzConfigService = nzConfigService;
      this.directionality = directionality;
    }
    ngOnInit() {
      this.size.set(this.nzSize);
      this.nzConfigService.getConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME2).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.size.set(this.nzSize);
        this.cdr.markForCheck();
      });
      this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
        this.dir = direction;
        this.cdr.detectChanges();
      });
      this.dir = this.directionality.value;
      fromEventOutsideAngular(this.elementRef.nativeElement, "click", {
        capture: true
      }).pipe(takeUntil(this.destroy$)).subscribe((event) => {
        if (this.disabled && event.target?.tagName === "A" || this.nzLoading) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      });
    }
    ngOnChanges({
      nzLoading,
      nzSize
    }) {
      if (nzLoading) {
        this.loading$.next(this.nzLoading);
      }
      if (nzSize) {
        this.size.set(nzSize.currentValue);
      }
    }
    ngAfterViewInit() {
      this.insertSpan(this.elementRef.nativeElement.childNodes, this.renderer);
    }
    ngAfterContentInit() {
      this.loading$.pipe(startWith(this.nzLoading), filter(() => !!this.nzIconDirectiveElement), takeUntil(this.destroy$)).subscribe((loading) => {
        const nativeElement = this.nzIconDirectiveElement.nativeElement;
        if (loading) {
          this.renderer.setStyle(nativeElement, "display", "none");
        } else {
          this.renderer.removeStyle(nativeElement, "display");
        }
      });
    }
    static \u0275fac = function NzButtonComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NzButtonComponent2)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(NzConfigService), \u0275\u0275directiveInject(Directionality));
    };
    static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: NzButtonComponent2,
      selectors: [["button", "nz-button", ""], ["a", "nz-button", ""]],
      contentQueries: function NzButtonComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, NzIconDirective, 5, ElementRef);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.nzIconDirectiveElement = _t.first);
        }
      },
      hostAttrs: [1, "ant-btn"],
      hostVars: 34,
      hostBindings: function NzButtonComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("tabindex", ctx.disabled ? -1 : ctx.tabIndex === null ? null : ctx.tabIndex)("disabled", ctx.disabled || null);
          \u0275\u0275classProp("ant-btn-default", ctx.nzType === "default")("ant-btn-primary", ctx.nzType === "primary")("ant-btn-dashed", ctx.nzType === "dashed")("ant-btn-link", ctx.nzType === "link")("ant-btn-text", ctx.nzType === "text")("ant-btn-circle", ctx.nzShape === "circle")("ant-btn-round", ctx.nzShape === "round")("ant-btn-lg", ctx.finalSize() === "large")("ant-btn-sm", ctx.finalSize() === "small")("ant-btn-dangerous", ctx.nzDanger)("ant-btn-loading", ctx.nzLoading)("ant-btn-background-ghost", ctx.nzGhost)("ant-btn-block", ctx.nzBlock)("ant-input-search-button", ctx.nzSearch)("ant-btn-rtl", ctx.dir === "rtl")("ant-btn-icon-only", ctx.iconOnly);
        }
      },
      inputs: {
        nzBlock: [2, "nzBlock", "nzBlock", booleanAttribute],
        nzGhost: [2, "nzGhost", "nzGhost", booleanAttribute],
        nzSearch: [2, "nzSearch", "nzSearch", booleanAttribute],
        nzLoading: [2, "nzLoading", "nzLoading", booleanAttribute],
        nzDanger: [2, "nzDanger", "nzDanger", booleanAttribute],
        disabled: [2, "disabled", "disabled", booleanAttribute],
        tabIndex: "tabIndex",
        nzType: "nzType",
        nzShape: "nzShape",
        nzSize: "nzSize"
      },
      exportAs: ["nzButton"],
      features: [\u0275\u0275ProvidersFeature([NzDestroyService, {
        provide: NZ_SPACE_COMPACT_ITEM_TYPE,
        useValue: "btn"
      }]), \u0275\u0275HostDirectivesFeature([NzSpaceCompactItemDirective]), \u0275\u0275NgOnChangesFeature],
      attrs: _c02,
      ngContentSelectors: _c12,
      decls: 2,
      vars: 1,
      consts: [["nzType", "loading"]],
      template: function NzButtonComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275template(0, NzButtonComponent_Conditional_0_Template, 1, 0, "nz-icon", 0);
          \u0275\u0275projection(1);
        }
        if (rf & 2) {
          \u0275\u0275conditional(ctx.nzLoading ? 0 : -1);
        }
      },
      dependencies: [NzIconModule, NzIconDirective],
      encapsulation: 2,
      changeDetection: 0
    });
  };
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzButtonComponent, [{
    type: Component,
    args: [{
      selector: "button[nz-button], a[nz-button]",
      exportAs: "nzButton",
      imports: [NzIconModule],
      preserveWhitespaces: false,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `
    @if (nzLoading) {
      <nz-icon nzType="loading" />
    }
    <ng-content></ng-content>
  `,
      host: {
        class: "ant-btn",
        "[class.ant-btn-default]": `nzType === 'default'`,
        "[class.ant-btn-primary]": `nzType === 'primary'`,
        "[class.ant-btn-dashed]": `nzType === 'dashed'`,
        "[class.ant-btn-link]": `nzType === 'link'`,
        "[class.ant-btn-text]": `nzType === 'text'`,
        "[class.ant-btn-circle]": `nzShape === 'circle'`,
        "[class.ant-btn-round]": `nzShape === 'round'`,
        "[class.ant-btn-lg]": `finalSize() === 'large'`,
        "[class.ant-btn-sm]": `finalSize() === 'small'`,
        "[class.ant-btn-dangerous]": `nzDanger`,
        "[class.ant-btn-loading]": `nzLoading`,
        "[class.ant-btn-background-ghost]": `nzGhost`,
        "[class.ant-btn-block]": `nzBlock`,
        "[class.ant-input-search-button]": `nzSearch`,
        "[class.ant-btn-rtl]": `dir === 'rtl'`,
        "[class.ant-btn-icon-only]": `iconOnly`,
        "[attr.tabindex]": "disabled ? -1 : (tabIndex === null ? null : tabIndex)",
        "[attr.disabled]": "disabled || null"
      },
      hostDirectives: [NzSpaceCompactItemDirective],
      providers: [NzDestroyService, {
        provide: NZ_SPACE_COMPACT_ITEM_TYPE,
        useValue: "btn"
      }]
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: ChangeDetectorRef
  }, {
    type: Renderer2
  }, {
    type: NzConfigService
  }, {
    type: Directionality
  }], {
    nzIconDirectiveElement: [{
      type: ContentChild,
      args: [NzIconDirective, {
        read: ElementRef
      }]
    }],
    nzBlock: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzGhost: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzSearch: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzLoading: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzDanger: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    tabIndex: [{
      type: Input
    }],
    nzType: [{
      type: Input
    }],
    nzShape: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }]
  });
})();
var NzButtonGroupComponent = class _NzButtonGroupComponent {
  directionality;
  nzSize = "default";
  dir = "ltr";
  destroy$ = new Subject();
  constructor(directionality) {
    this.directionality = directionality;
  }
  ngOnInit() {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
      this.dir = direction;
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  static \u0275fac = function NzButtonGroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzButtonGroupComponent)(\u0275\u0275directiveInject(Directionality));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _NzButtonGroupComponent,
    selectors: [["nz-button-group"]],
    hostAttrs: [1, "ant-btn-group"],
    hostVars: 6,
    hostBindings: function NzButtonGroupComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("ant-btn-group-lg", ctx.nzSize === "large")("ant-btn-group-sm", ctx.nzSize === "small")("ant-btn-group-rtl", ctx.dir === "rtl");
      }
    },
    inputs: {
      nzSize: "nzSize"
    },
    exportAs: ["nzButtonGroup"],
    ngContentSelectors: _c12,
    decls: 1,
    vars: 0,
    template: function NzButtonGroupComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275projection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzButtonGroupComponent, [{
    type: Component,
    args: [{
      selector: "nz-button-group",
      exportAs: "nzButtonGroup",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        class: "ant-btn-group",
        "[class.ant-btn-group-lg]": `nzSize === 'large'`,
        "[class.ant-btn-group-sm]": `nzSize === 'small'`,
        "[class.ant-btn-group-rtl]": `dir === 'rtl'`
      },
      preserveWhitespaces: false,
      template: `<ng-content></ng-content>`
    }]
  }], () => [{
    type: Directionality
  }], {
    nzSize: [{
      type: Input
    }]
  });
})();
var NzButtonModule = class _NzButtonModule {
  static \u0275fac = function NzButtonModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzButtonModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NzButtonModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [NzButtonComponent, NzTransitionPatchModule, NzWaveModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzButtonModule, [{
    type: NgModule,
    args: [{
      imports: [NzButtonComponent, NzButtonGroupComponent],
      exports: [NzButtonComponent, NzButtonGroupComponent, NzTransitionPatchModule, NzWaveModule]
    }]
  }], null, null);
})();

// node_modules/@angular/animations/fesm2022/animations.mjs
var AnimationBuilder = class _AnimationBuilder {
  static \u0275fac = function AnimationBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnimationBuilder)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _AnimationBuilder,
    factory: () => (() => inject(BrowserAnimationBuilder))(),
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => inject(BrowserAnimationBuilder)
    }]
  }], null, null);
})();
var AnimationFactory = class {
};
var BrowserAnimationBuilder = class _BrowserAnimationBuilder extends AnimationBuilder {
  animationModuleType = inject(ANIMATION_MODULE_TYPE, {
    optional: true
  });
  _nextAnimationId = 0;
  _renderer;
  constructor(rootRenderer, doc) {
    super();
    const typeData = {
      id: "0",
      encapsulation: ViewEncapsulation.None,
      styles: [],
      data: {
        animation: []
      }
    };
    this._renderer = rootRenderer.createRenderer(doc.body, typeData);
    if (this.animationModuleType === null && !isAnimationRenderer(this._renderer)) {
      throw new RuntimeError(3600, (typeof ngDevMode === "undefined" || ngDevMode) && "Angular detected that the `AnimationBuilder` was injected, but animation support was not enabled. Please make sure that you enable animations in your application by calling `provideAnimations()` or `provideAnimationsAsync()` function.");
    }
  }
  build(animation2) {
    const id = this._nextAnimationId;
    this._nextAnimationId++;
    const entry = Array.isArray(animation2) ? sequence(animation2) : animation2;
    issueAnimationCommand(this._renderer, null, id, "register", [entry]);
    return new BrowserAnimationFactory(id, this._renderer);
  }
  static \u0275fac = function BrowserAnimationBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserAnimationBuilder)(\u0275\u0275inject(RendererFactory2), \u0275\u0275inject(DOCUMENT));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _BrowserAnimationBuilder,
    factory: _BrowserAnimationBuilder.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RendererFactory2
  }, {
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], null);
})();
var BrowserAnimationFactory = class extends AnimationFactory {
  _id;
  _renderer;
  constructor(_id, _renderer) {
    super();
    this._id = _id;
    this._renderer = _renderer;
  }
  create(element, options) {
    return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
  }
};
var RendererAnimationPlayer = class {
  id;
  element;
  _renderer;
  parentPlayer = null;
  _started = false;
  constructor(id, element, options, _renderer) {
    this.id = id;
    this.element = element;
    this._renderer = _renderer;
    this._command("create", options);
  }
  _listen(eventName, callback) {
    return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
  }
  _command(command, ...args) {
    issueAnimationCommand(this._renderer, this.element, this.id, command, args);
  }
  onDone(fn) {
    this._listen("done", fn);
  }
  onStart(fn) {
    this._listen("start", fn);
  }
  onDestroy(fn) {
    this._listen("destroy", fn);
  }
  init() {
    this._command("init");
  }
  hasStarted() {
    return this._started;
  }
  play() {
    this._command("play");
    this._started = true;
  }
  pause() {
    this._command("pause");
  }
  restart() {
    this._command("restart");
  }
  finish() {
    this._command("finish");
  }
  destroy() {
    this._command("destroy");
  }
  reset() {
    this._command("reset");
    this._started = false;
  }
  setPosition(p) {
    this._command("setPosition", p);
  }
  getPosition() {
    return unwrapAnimationRenderer(this._renderer)?.engine?.players[this.id]?.getPosition() ?? 0;
  }
  totalTime = 0;
};
function issueAnimationCommand(renderer, element, id, command, args) {
  renderer.setProperty(element, `@@${id}:${command}`, args);
}
function unwrapAnimationRenderer(renderer) {
  const type = renderer.\u0275type;
  if (type === 0) {
    return renderer;
  } else if (type === 1) {
    return renderer.animationRenderer;
  }
  return null;
}
function isAnimationRenderer(renderer) {
  const type = renderer.\u0275type;
  return type === 0 || type === 1;
}

// node_modules/ngx-toastr/fesm2022/ngx-toastr.mjs
var _c03 = ["toast-component", ""];
function Toast_button_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 5);
    \u0275\u0275listener("click", function Toast_button_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.remove());
    });
    \u0275\u0275elementStart(1, "span", 6);
    \u0275\u0275text(2, "\xD7");
    \u0275\u0275elementEnd()();
  }
}
function Toast_div_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("[", ctx_r1.duplicatesCount + 1, "]");
  }
}
function Toast_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1);
    \u0275\u0275template(2, Toast_div_1_ng_container_2_Template, 2, 1, "ng-container", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.options.titleClass);
    \u0275\u0275attribute("aria-label", ctx_r1.title);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.title, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.duplicatesCount);
  }
}
function Toast_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 7);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.options.messageClass);
    \u0275\u0275property("innerHTML", ctx_r1.message, \u0275\u0275sanitizeHtml);
  }
}
function Toast_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.options.messageClass);
    \u0275\u0275attribute("aria-label", ctx_r1.message);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.message, " ");
  }
}
function Toast_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "div", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", ctx_r1.width() + "%");
  }
}
function ToastNoAnimation_button_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 5);
    \u0275\u0275listener("click", function ToastNoAnimation_button_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.remove());
    });
    \u0275\u0275elementStart(1, "span", 6);
    \u0275\u0275text(2, "\xD7");
    \u0275\u0275elementEnd()();
  }
}
function ToastNoAnimation_div_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("[", ctx_r1.duplicatesCount + 1, "]");
  }
}
function ToastNoAnimation_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1);
    \u0275\u0275template(2, ToastNoAnimation_div_1_ng_container_2_Template, 2, 1, "ng-container", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.options.titleClass);
    \u0275\u0275attribute("aria-label", ctx_r1.title);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.title, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.duplicatesCount);
  }
}
function ToastNoAnimation_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 7);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.options.messageClass);
    \u0275\u0275property("innerHTML", ctx_r1.message, \u0275\u0275sanitizeHtml);
  }
}
function ToastNoAnimation_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.options.messageClass);
    \u0275\u0275attribute("aria-label", ctx_r1.message);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.message, " ");
  }
}
function ToastNoAnimation_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "div", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", ctx_r1.width() + "%");
  }
}
var ToastContainerDirective = class _ToastContainerDirective {
  el;
  constructor(el) {
    this.el = el;
  }
  getContainerElement() {
    return this.el.nativeElement;
  }
  static \u0275fac = function ToastContainerDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastContainerDirective)(\u0275\u0275directiveInject(ElementRef));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _ToastContainerDirective,
    selectors: [["", "toastContainer", ""]],
    exportAs: ["toastContainer"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastContainerDirective, [{
    type: Directive,
    args: [{
      selector: "[toastContainer]",
      exportAs: "toastContainer",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }], null);
})();
var ComponentPortal = class {
  _attachedHost;
  /** The type of the component that will be instantiated for attachment. */
  component;
  /**
   * [Optional] Where the attached component should live in Angular's *logical* component tree.
   * This is different from where the component *renders*, which is determined by the PortalHost.
   * The origin necessary when the host is outside of the Angular application context.
   */
  viewContainerRef;
  /** Injector used for the instantiation of the component. */
  injector;
  constructor(component, injector) {
    this.component = component;
    this.injector = injector;
  }
  /** Attach this portal to a host. */
  attach(host, newestOnTop) {
    this._attachedHost = host;
    return host.attach(this, newestOnTop);
  }
  /** Detach this portal from its host */
  detach() {
    const host = this._attachedHost;
    if (host) {
      this._attachedHost = void 0;
      return host.detach();
    }
  }
  /** Whether this portal is attached to a host. */
  get isAttached() {
    return this._attachedHost != null;
  }
  /**
   * Sets the PortalHost reference without performing `attach()`. This is used directly by
   * the PortalHost when it is performing an `attach()` or `detach()`.
   */
  setAttachedHost(host) {
    this._attachedHost = host;
  }
};
var BasePortalHost = class {
  /** The portal currently attached to the host. */
  _attachedPortal;
  /** A function that will permanently dispose this host. */
  _disposeFn;
  attach(portal, newestOnTop) {
    this._attachedPortal = portal;
    return this.attachComponentPortal(portal, newestOnTop);
  }
  detach() {
    if (this._attachedPortal) {
      this._attachedPortal.setAttachedHost();
    }
    this._attachedPortal = void 0;
    if (this._disposeFn) {
      this._disposeFn();
      this._disposeFn = void 0;
    }
  }
  setDisposeFn(fn) {
    this._disposeFn = fn;
  }
};
var ToastRef = class {
  _overlayRef;
  /** The instance of component opened into the toast. */
  componentInstance;
  /** Count of duplicates of this toast */
  duplicatesCount = 0;
  /** Subject for notifying the user that the toast has finished closing. */
  _afterClosed = new Subject();
  /** triggered when toast is activated */
  _activate = new Subject();
  /** notifies the toast that it should close before the timeout */
  _manualClose = new Subject();
  /** notifies the toast that it should reset the timeouts */
  _resetTimeout = new Subject();
  /** notifies the toast that it should count a duplicate toast */
  _countDuplicate = new Subject();
  constructor(_overlayRef) {
    this._overlayRef = _overlayRef;
  }
  manualClose() {
    this._manualClose.next();
    this._manualClose.complete();
  }
  manualClosed() {
    return this._manualClose.asObservable();
  }
  timeoutReset() {
    return this._resetTimeout.asObservable();
  }
  countDuplicate() {
    return this._countDuplicate.asObservable();
  }
  /**
   * Close the toast.
   */
  close() {
    this._overlayRef.detach();
    this._afterClosed.next();
    this._manualClose.next();
    this._afterClosed.complete();
    this._manualClose.complete();
    this._activate.complete();
    this._resetTimeout.complete();
    this._countDuplicate.complete();
  }
  /** Gets an observable that is notified when the toast is finished closing. */
  afterClosed() {
    return this._afterClosed.asObservable();
  }
  isInactive() {
    return this._activate.isStopped;
  }
  activate() {
    this._activate.next();
    this._activate.complete();
  }
  /** Gets an observable that is notified when the toast has started opening. */
  afterActivate() {
    return this._activate.asObservable();
  }
  /** Reset the toast timouts and count duplicates */
  onDuplicate(resetTimeout, countDuplicate) {
    if (resetTimeout) {
      this._resetTimeout.next();
    }
    if (countDuplicate) {
      this._countDuplicate.next(++this.duplicatesCount);
    }
  }
};
var ToastPackage = class {
  toastId;
  config;
  message;
  title;
  toastType;
  toastRef;
  _onTap = new Subject();
  _onAction = new Subject();
  constructor(toastId, config, message, title, toastType, toastRef) {
    this.toastId = toastId;
    this.config = config;
    this.message = message;
    this.title = title;
    this.toastType = toastType;
    this.toastRef = toastRef;
    this.toastRef.afterClosed().subscribe(() => {
      this._onAction.complete();
      this._onTap.complete();
    });
  }
  /** Fired on click */
  triggerTap() {
    this._onTap.next();
    if (this.config.tapToDismiss) {
      this._onTap.complete();
    }
  }
  onTap() {
    return this._onTap.asObservable();
  }
  /** available for use in custom toast */
  triggerAction(action) {
    this._onAction.next(action);
  }
  onAction() {
    return this._onAction.asObservable();
  }
};
var DefaultNoComponentGlobalConfig = {
  maxOpened: 0,
  autoDismiss: false,
  newestOnTop: true,
  preventDuplicates: false,
  countDuplicates: false,
  resetTimeoutOnDuplicate: false,
  includeTitleDuplicates: false,
  iconClasses: {
    error: "toast-error",
    info: "toast-info",
    success: "toast-success",
    warning: "toast-warning"
  },
  // Individual
  closeButton: false,
  disableTimeOut: false,
  timeOut: 5e3,
  extendedTimeOut: 1e3,
  enableHtml: false,
  progressBar: false,
  toastClass: "ngx-toastr",
  positionClass: "toast-top-right",
  titleClass: "toast-title",
  messageClass: "toast-message",
  easing: "ease-in",
  easeTime: 300,
  tapToDismiss: true,
  onActivateTick: false,
  progressAnimation: "decreasing"
};
var TOAST_CONFIG = new InjectionToken("ToastConfig");
var DomPortalHost = class extends BasePortalHost {
  _hostDomElement;
  _componentFactoryResolver;
  _appRef;
  constructor(_hostDomElement, _componentFactoryResolver, _appRef) {
    super();
    this._hostDomElement = _hostDomElement;
    this._componentFactoryResolver = _componentFactoryResolver;
    this._appRef = _appRef;
  }
  /**
   * Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver.
   * @param portal Portal to be attached
   */
  attachComponentPortal(portal, newestOnTop) {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(portal.component);
    let componentRef;
    componentRef = componentFactory.create(portal.injector);
    this._appRef.attachView(componentRef.hostView);
    this.setDisposeFn(() => {
      this._appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });
    if (newestOnTop) {
      this._hostDomElement.insertBefore(this._getComponentRootNode(componentRef), this._hostDomElement.firstChild);
    } else {
      this._hostDomElement.appendChild(this._getComponentRootNode(componentRef));
    }
    return componentRef;
  }
  /** Gets the root HTMLElement for an instantiated component. */
  _getComponentRootNode(componentRef) {
    return componentRef.hostView.rootNodes[0];
  }
};
var OverlayContainer = class _OverlayContainer {
  _document = inject(DOCUMENT);
  _containerElement;
  ngOnDestroy() {
    if (this._containerElement && this._containerElement.parentNode) {
      this._containerElement.parentNode.removeChild(this._containerElement);
    }
  }
  /**
   * This method returns the overlay container element. It will lazily
   * create the element the first time  it is called to facilitate using
   * the container in non-browser environments.
   * @returns the container element
   */
  getContainerElement() {
    if (!this._containerElement) {
      this._createContainer();
    }
    return this._containerElement;
  }
  /**
   * Create the overlay container element, which is simply a div
   * with the 'cdk-overlay-container' class on the document body
   * and 'aria-live="polite"'
   */
  _createContainer() {
    const container = this._document.createElement("div");
    container.classList.add("overlay-container");
    container.setAttribute("aria-live", "polite");
    this._document.body.appendChild(container);
    this._containerElement = container;
  }
  static \u0275fac = function OverlayContainer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OverlayContainer)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _OverlayContainer,
    factory: _OverlayContainer.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayContainer, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var OverlayRef = class {
  _portalHost;
  constructor(_portalHost) {
    this._portalHost = _portalHost;
  }
  attach(portal, newestOnTop = true) {
    return this._portalHost.attach(portal, newestOnTop);
  }
  /**
   * Detaches an overlay from a portal.
   * @returns Resolves when the overlay has been detached.
   */
  detach() {
    return this._portalHost.detach();
  }
};
var Overlay = class _Overlay {
  _overlayContainer = inject(OverlayContainer);
  _componentFactoryResolver = inject(ComponentFactoryResolver$1);
  _appRef = inject(ApplicationRef);
  _document = inject(DOCUMENT);
  // Namespace panes by overlay container
  _paneElements = /* @__PURE__ */ new Map();
  /**
   * Creates an overlay.
   * @returns A reference to the created overlay.
   */
  create(positionClass, overlayContainer) {
    return this._createOverlayRef(this.getPaneElement(positionClass, overlayContainer));
  }
  getPaneElement(positionClass = "", overlayContainer) {
    if (!this._paneElements.get(overlayContainer)) {
      this._paneElements.set(overlayContainer, {});
    }
    if (!this._paneElements.get(overlayContainer)[positionClass]) {
      this._paneElements.get(overlayContainer)[positionClass] = this._createPaneElement(positionClass, overlayContainer);
    }
    return this._paneElements.get(overlayContainer)[positionClass];
  }
  /**
   * Creates the DOM element for an overlay and appends it to the overlay container.
   * @returns Newly-created pane element
   */
  _createPaneElement(positionClass, overlayContainer) {
    const pane = this._document.createElement("div");
    pane.id = "toast-container";
    pane.classList.add(positionClass);
    pane.classList.add("toast-container");
    if (!overlayContainer) {
      this._overlayContainer.getContainerElement().appendChild(pane);
    } else {
      overlayContainer.getContainerElement().appendChild(pane);
    }
    return pane;
  }
  /**
   * Create a DomPortalHost into which the overlay content can be loaded.
   * @param pane The DOM element to turn into a portal host.
   * @returns A portal host for the given DOM element.
   */
  _createPortalHost(pane) {
    return new DomPortalHost(pane, this._componentFactoryResolver, this._appRef);
  }
  /**
   * Creates an OverlayRef for an overlay in the given DOM element.
   * @param pane DOM element for the overlay
   */
  _createOverlayRef(pane) {
    return new OverlayRef(this._createPortalHost(pane));
  }
  static \u0275fac = function Overlay_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Overlay)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _Overlay,
    factory: _Overlay.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Overlay, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var ToastrService = class _ToastrService {
  overlay;
  _injector;
  sanitizer;
  ngZone;
  toastrConfig;
  currentlyActive = 0;
  toasts = [];
  overlayContainer;
  previousToastMessage;
  index = 0;
  constructor(token, overlay, _injector, sanitizer, ngZone) {
    this.overlay = overlay;
    this._injector = _injector;
    this.sanitizer = sanitizer;
    this.ngZone = ngZone;
    this.toastrConfig = __spreadValues(__spreadValues({}, token.default), token.config);
    if (token.config.iconClasses) {
      this.toastrConfig.iconClasses = __spreadValues(__spreadValues({}, token.default.iconClasses), token.config.iconClasses);
    }
  }
  /** show toast */
  show(message, title, override = {}, type = "") {
    return this._preBuildNotification(type, message, title, this.applyConfig(override));
  }
  /** show successful toast */
  success(message, title, override = {}) {
    const type = this.toastrConfig.iconClasses.success || "";
    return this._preBuildNotification(type, message, title, this.applyConfig(override));
  }
  /** show error toast */
  error(message, title, override = {}) {
    const type = this.toastrConfig.iconClasses.error || "";
    return this._preBuildNotification(type, message, title, this.applyConfig(override));
  }
  /** show info toast */
  info(message, title, override = {}) {
    const type = this.toastrConfig.iconClasses.info || "";
    return this._preBuildNotification(type, message, title, this.applyConfig(override));
  }
  /** show warning toast */
  warning(message, title, override = {}) {
    const type = this.toastrConfig.iconClasses.warning || "";
    return this._preBuildNotification(type, message, title, this.applyConfig(override));
  }
  /**
   * Remove all or a single toast by id
   */
  clear(toastId) {
    for (const toast of this.toasts) {
      if (toastId !== void 0) {
        if (toast.toastId === toastId) {
          toast.toastRef.manualClose();
          return;
        }
      } else {
        toast.toastRef.manualClose();
      }
    }
  }
  /**
   * Remove and destroy a single toast by id
   */
  remove(toastId) {
    const found = this._findToast(toastId);
    if (!found) {
      return false;
    }
    found.activeToast.toastRef.close();
    this.toasts.splice(found.index, 1);
    this.currentlyActive = this.currentlyActive - 1;
    if (!this.toastrConfig.maxOpened || !this.toasts.length) {
      return false;
    }
    if (this.currentlyActive < this.toastrConfig.maxOpened && this.toasts[this.currentlyActive]) {
      const p = this.toasts[this.currentlyActive].toastRef;
      if (!p.isInactive()) {
        this.currentlyActive = this.currentlyActive + 1;
        p.activate();
      }
    }
    return true;
  }
  /**
   * Determines if toast message is already shown
   */
  findDuplicate(title = "", message = "", resetOnDuplicate, countDuplicates) {
    const {
      includeTitleDuplicates
    } = this.toastrConfig;
    for (const toast of this.toasts) {
      const hasDuplicateTitle = includeTitleDuplicates && toast.title === title;
      if ((!includeTitleDuplicates || hasDuplicateTitle) && toast.message === message) {
        toast.toastRef.onDuplicate(resetOnDuplicate, countDuplicates);
        return toast;
      }
    }
    return null;
  }
  /** create a clone of global config and apply individual settings */
  applyConfig(override = {}) {
    return __spreadValues(__spreadValues({}, this.toastrConfig), override);
  }
  /**
   * Find toast object by id
   */
  _findToast(toastId) {
    for (let i = 0; i < this.toasts.length; i++) {
      if (this.toasts[i].toastId === toastId) {
        return {
          index: i,
          activeToast: this.toasts[i]
        };
      }
    }
    return null;
  }
  /**
   * Determines the need to run inside angular's zone then builds the toast
   */
  _preBuildNotification(toastType, message, title, config) {
    if (config.onActivateTick) {
      return this.ngZone.run(() => this._buildNotification(toastType, message, title, config));
    }
    return this._buildNotification(toastType, message, title, config);
  }
  /**
   * Creates and attaches toast data to component
   * returns the active toast, or in case preventDuplicates is enabled the original/non-duplicate active toast.
   */
  _buildNotification(toastType, message, title, config) {
    if (!config.toastComponent) {
      throw new Error("toastComponent required");
    }
    const duplicate = this.findDuplicate(title, message, this.toastrConfig.resetTimeoutOnDuplicate && config.timeOut > 0, this.toastrConfig.countDuplicates);
    if ((this.toastrConfig.includeTitleDuplicates && title || message) && this.toastrConfig.preventDuplicates && duplicate !== null) {
      return duplicate;
    }
    this.previousToastMessage = message;
    let keepInactive = false;
    if (this.toastrConfig.maxOpened && this.currentlyActive >= this.toastrConfig.maxOpened) {
      keepInactive = true;
      if (this.toastrConfig.autoDismiss) {
        this.clear(this.toasts[0].toastId);
      }
    }
    const overlayRef = this.overlay.create(config.positionClass, this.overlayContainer);
    this.index = this.index + 1;
    let sanitizedMessage = message;
    if (message && config.enableHtml) {
      sanitizedMessage = this.sanitizer.sanitize(SecurityContext.HTML, message);
    }
    const toastRef = new ToastRef(overlayRef);
    const toastPackage = new ToastPackage(this.index, config, sanitizedMessage, title, toastType, toastRef);
    const providers = [{
      provide: ToastPackage,
      useValue: toastPackage
    }];
    const toastInjector = Injector.create({
      providers,
      parent: this._injector
    });
    const component = new ComponentPortal(config.toastComponent, toastInjector);
    const portal = overlayRef.attach(component, config.newestOnTop);
    toastRef.componentInstance = portal.instance;
    const ins = {
      toastId: this.index,
      title: title || "",
      message: message || "",
      toastRef,
      onShown: toastRef.afterActivate(),
      onHidden: toastRef.afterClosed(),
      onTap: toastPackage.onTap(),
      onAction: toastPackage.onAction(),
      portal
    };
    if (!keepInactive) {
      this.currentlyActive = this.currentlyActive + 1;
      setTimeout(() => {
        ins.toastRef.activate();
      });
    }
    this.toasts.push(ins);
    return ins;
  }
  static \u0275fac = function ToastrService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastrService)(\u0275\u0275inject(TOAST_CONFIG), \u0275\u0275inject(Overlay), \u0275\u0275inject(Injector), \u0275\u0275inject(DomSanitizer), \u0275\u0275inject(NgZone));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ToastrService,
    factory: _ToastrService.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastrService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [TOAST_CONFIG]
    }]
  }, {
    type: Overlay
  }, {
    type: Injector
  }, {
    type: DomSanitizer
  }, {
    type: NgZone
  }], null);
})();
var Toast = class _Toast {
  toastrService;
  toastPackage;
  ngZone;
  message;
  title;
  options;
  duplicatesCount;
  originalTimeout;
  /** width of progress bar */
  width = signal(-1);
  /** a combination of toast type and options.toastClass */
  toastClasses = "";
  state;
  /** controls animation */
  get _state() {
    return this.state();
  }
  /** hides component when waiting to be displayed */
  get displayStyle() {
    if (this.state().value === "inactive") {
      return "none";
    }
    return;
  }
  timeout;
  intervalId;
  hideTime;
  sub;
  sub1;
  sub2;
  sub3;
  constructor(toastrService, toastPackage, ngZone) {
    this.toastrService = toastrService;
    this.toastPackage = toastPackage;
    this.ngZone = ngZone;
    this.message = toastPackage.message;
    this.title = toastPackage.title;
    this.options = toastPackage.config;
    this.originalTimeout = toastPackage.config.timeOut;
    this.toastClasses = `${toastPackage.toastType} ${toastPackage.config.toastClass}`;
    this.sub = toastPackage.toastRef.afterActivate().subscribe(() => {
      this.activateToast();
    });
    this.sub1 = toastPackage.toastRef.manualClosed().subscribe(() => {
      this.remove();
    });
    this.sub2 = toastPackage.toastRef.timeoutReset().subscribe(() => {
      this.resetTimeout();
    });
    this.sub3 = toastPackage.toastRef.countDuplicate().subscribe((count) => {
      this.duplicatesCount = count;
    });
    this.state = signal({
      value: "inactive",
      params: {
        easeTime: this.toastPackage.config.easeTime,
        easing: "ease-in"
      }
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
  }
  /**
   * activates toast and sets timeout
   */
  activateToast() {
    this.state.update((state2) => __spreadProps(__spreadValues({}, state2), {
      value: "active"
    }));
    if (!(this.options.disableTimeOut === true || this.options.disableTimeOut === "timeOut") && this.options.timeOut) {
      this.outsideTimeout(() => this.remove(), this.options.timeOut);
      this.hideTime = (/* @__PURE__ */ new Date()).getTime() + this.options.timeOut;
      if (this.options.progressBar) {
        this.outsideInterval(() => this.updateProgress(), 10);
      }
    }
  }
  /**
   * updates progress bar width
   */
  updateProgress() {
    if (this.width() === 0 || this.width() === 100 || !this.options.timeOut) {
      return;
    }
    const now = (/* @__PURE__ */ new Date()).getTime();
    const remaining = this.hideTime - now;
    this.width.set(remaining / this.options.timeOut * 100);
    if (this.options.progressAnimation === "increasing") {
      this.width.update((width) => 100 - width);
    }
    if (this.width() <= 0) {
      this.width.set(0);
    }
    if (this.width() >= 100) {
      this.width.set(100);
    }
  }
  resetTimeout() {
    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state.update((state2) => __spreadProps(__spreadValues({}, state2), {
      value: "active"
    }));
    this.outsideTimeout(() => this.remove(), this.originalTimeout);
    this.options.timeOut = this.originalTimeout;
    this.hideTime = (/* @__PURE__ */ new Date()).getTime() + (this.options.timeOut || 0);
    this.width.set(-1);
    if (this.options.progressBar) {
      this.outsideInterval(() => this.updateProgress(), 10);
    }
  }
  /**
   * tells toastrService to remove this toast after animation time
   */
  remove() {
    if (this.state().value === "removed") {
      return;
    }
    clearTimeout(this.timeout);
    this.state.update((state2) => __spreadProps(__spreadValues({}, state2), {
      value: "removed"
    }));
    this.outsideTimeout(() => this.toastrService.remove(this.toastPackage.toastId), +this.toastPackage.config.easeTime);
  }
  tapToast() {
    if (this.state().value === "removed") {
      return;
    }
    this.toastPackage.triggerTap();
    if (this.options.tapToDismiss) {
      this.remove();
    }
  }
  stickAround() {
    if (this.state().value === "removed") {
      return;
    }
    if (this.options.disableTimeOut !== "extendedTimeOut") {
      clearTimeout(this.timeout);
      this.options.timeOut = 0;
      this.hideTime = 0;
      clearInterval(this.intervalId);
      this.width.set(0);
    }
  }
  delayedHideToast() {
    if (this.options.disableTimeOut === true || this.options.disableTimeOut === "extendedTimeOut" || this.options.extendedTimeOut === 0 || this.state().value === "removed") {
      return;
    }
    this.outsideTimeout(() => this.remove(), this.options.extendedTimeOut);
    this.options.timeOut = this.options.extendedTimeOut;
    this.hideTime = (/* @__PURE__ */ new Date()).getTime() + (this.options.timeOut || 0);
    this.width.set(-1);
    if (this.options.progressBar) {
      this.outsideInterval(() => this.updateProgress(), 10);
    }
  }
  outsideTimeout(func, timeout) {
    if (this.ngZone) {
      this.ngZone.runOutsideAngular(() => this.timeout = setTimeout(() => this.runInsideAngular(func), timeout));
    } else {
      this.timeout = setTimeout(() => func(), timeout);
    }
  }
  outsideInterval(func, timeout) {
    if (this.ngZone) {
      this.ngZone.runOutsideAngular(() => this.intervalId = setInterval(() => this.runInsideAngular(func), timeout));
    } else {
      this.intervalId = setInterval(() => func(), timeout);
    }
  }
  runInsideAngular(func) {
    if (this.ngZone) {
      this.ngZone.run(() => func());
    } else {
      func();
    }
  }
  static \u0275fac = function Toast_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Toast)(\u0275\u0275directiveInject(ToastrService), \u0275\u0275directiveInject(ToastPackage), \u0275\u0275directiveInject(NgZone));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _Toast,
    selectors: [["", "toast-component", ""]],
    hostVars: 5,
    hostBindings: function Toast_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("click", function Toast_click_HostBindingHandler() {
          return ctx.tapToast();
        })("mouseenter", function Toast_mouseenter_HostBindingHandler() {
          return ctx.stickAround();
        })("mouseleave", function Toast_mouseleave_HostBindingHandler() {
          return ctx.delayedHideToast();
        });
      }
      if (rf & 2) {
        \u0275\u0275syntheticHostProperty("@flyInOut", ctx._state);
        \u0275\u0275classMap(ctx.toastClasses);
        \u0275\u0275styleProp("display", ctx.displayStyle);
      }
    },
    attrs: _c03,
    decls: 5,
    vars: 5,
    consts: [["type", "button", "class", "toast-close-button", "aria-label", "Close", 3, "click", 4, "ngIf"], [3, "class", 4, "ngIf"], ["role", "alert", 3, "class", "innerHTML", 4, "ngIf"], ["role", "alert", 3, "class", 4, "ngIf"], [4, "ngIf"], ["type", "button", "aria-label", "Close", 1, "toast-close-button", 3, "click"], ["aria-hidden", "true"], ["role", "alert", 3, "innerHTML"], ["role", "alert"], [1, "toast-progress"]],
    template: function Toast_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, Toast_button_0_Template, 3, 0, "button", 0)(1, Toast_div_1_Template, 3, 5, "div", 1)(2, Toast_div_2_Template, 1, 3, "div", 2)(3, Toast_div_3_Template, 2, 4, "div", 3)(4, Toast_div_4_Template, 2, 2, "div", 4);
      }
      if (rf & 2) {
        \u0275\u0275property("ngIf", ctx.options.closeButton);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.title);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.message && ctx.options.enableHtml);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.message && !ctx.options.enableHtml);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.options.progressBar);
      }
    },
    dependencies: [NgIf],
    encapsulation: 2,
    data: {
      animation: [trigger("flyInOut", [state("inactive", style({
        opacity: 0
      })), state("active", style({
        opacity: 1
      })), state("removed", style({
        opacity: 0
      })), transition("inactive => active", animate("{{ easeTime }}ms {{ easing }}")), transition("active => removed", animate("{{ easeTime }}ms {{ easing }}"))])]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Toast, [{
    type: Component,
    args: [{
      selector: "[toast-component]",
      template: `
  <button *ngIf="options.closeButton" (click)="remove()" type="button" class="toast-close-button" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  <div *ngIf="title" [class]="options.titleClass" [attr.aria-label]="title">
    {{ title }} <ng-container *ngIf="duplicatesCount">[{{ duplicatesCount + 1 }}]</ng-container>
  </div>
  <div *ngIf="message && options.enableHtml" role="alert"
    [class]="options.messageClass" [innerHTML]="message">
  </div>
  <div *ngIf="message && !options.enableHtml" role="alert"
    [class]="options.messageClass" [attr.aria-label]="message">
    {{ message }}
  </div>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width]="width() + '%'"></div>
  </div>
  `,
      animations: [trigger("flyInOut", [state("inactive", style({
        opacity: 0
      })), state("active", style({
        opacity: 1
      })), state("removed", style({
        opacity: 0
      })), transition("inactive => active", animate("{{ easeTime }}ms {{ easing }}")), transition("active => removed", animate("{{ easeTime }}ms {{ easing }}"))])],
      preserveWhitespaces: false,
      standalone: true,
      imports: [NgIf],
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [{
    type: ToastrService
  }, {
    type: ToastPackage
  }, {
    type: NgZone
  }], {
    toastClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    _state: [{
      type: HostBinding,
      args: ["@flyInOut"]
    }],
    displayStyle: [{
      type: HostBinding,
      args: ["style.display"]
    }],
    tapToast: [{
      type: HostListener,
      args: ["click"]
    }],
    stickAround: [{
      type: HostListener,
      args: ["mouseenter"]
    }],
    delayedHideToast: [{
      type: HostListener,
      args: ["mouseleave"]
    }]
  });
})();
var DefaultGlobalConfig = __spreadProps(__spreadValues({}, DefaultNoComponentGlobalConfig), {
  toastComponent: Toast
});
var provideToastr = (config = {}) => {
  const providers = [{
    provide: TOAST_CONFIG,
    useValue: {
      default: DefaultGlobalConfig,
      config
    }
  }];
  return makeEnvironmentProviders(providers);
};
var ToastrModule = class _ToastrModule {
  static forRoot(config = {}) {
    return {
      ngModule: _ToastrModule,
      providers: [provideToastr(config)]
    };
  }
  static \u0275fac = function ToastrModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastrModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _ToastrModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastrModule, [{
    type: NgModule,
    args: [{
      imports: [Toast],
      exports: [Toast]
    }]
  }], null, null);
})();
var ToastrComponentlessModule = class _ToastrComponentlessModule {
  static forRoot(config = {}) {
    return {
      ngModule: ToastrModule,
      providers: [{
        provide: TOAST_CONFIG,
        useValue: {
          default: DefaultNoComponentGlobalConfig,
          config
        }
      }]
    };
  }
  static \u0275fac = function ToastrComponentlessModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastrComponentlessModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _ToastrComponentlessModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastrComponentlessModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();
var ToastNoAnimation = class _ToastNoAnimation {
  toastrService;
  toastPackage;
  appRef;
  message;
  title;
  options;
  duplicatesCount;
  originalTimeout;
  /** width of progress bar */
  width = signal(-1);
  /** a combination of toast type and options.toastClass */
  toastClasses = "";
  /** hides component when waiting to be displayed */
  get displayStyle() {
    if (this.state() === "inactive") {
      return "none";
    }
    return null;
  }
  /** controls animation */
  state = signal("inactive");
  timeout;
  intervalId;
  hideTime;
  sub;
  sub1;
  sub2;
  sub3;
  constructor(toastrService, toastPackage, appRef) {
    this.toastrService = toastrService;
    this.toastPackage = toastPackage;
    this.appRef = appRef;
    this.message = toastPackage.message;
    this.title = toastPackage.title;
    this.options = toastPackage.config;
    this.originalTimeout = toastPackage.config.timeOut;
    this.toastClasses = `${toastPackage.toastType} ${toastPackage.config.toastClass}`;
    this.sub = toastPackage.toastRef.afterActivate().subscribe(() => {
      this.activateToast();
    });
    this.sub1 = toastPackage.toastRef.manualClosed().subscribe(() => {
      this.remove();
    });
    this.sub2 = toastPackage.toastRef.timeoutReset().subscribe(() => {
      this.resetTimeout();
    });
    this.sub3 = toastPackage.toastRef.countDuplicate().subscribe((count) => {
      this.duplicatesCount = count;
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
  }
  /**
   * activates toast and sets timeout
   */
  activateToast() {
    this.state.set("active");
    if (!(this.options.disableTimeOut === true || this.options.disableTimeOut === "timeOut") && this.options.timeOut) {
      this.timeout = setTimeout(() => {
        this.remove();
      }, this.options.timeOut);
      this.hideTime = (/* @__PURE__ */ new Date()).getTime() + this.options.timeOut;
      if (this.options.progressBar) {
        this.intervalId = setInterval(() => this.updateProgress(), 10);
      }
    }
    if (this.options.onActivateTick) {
      this.appRef.tick();
    }
  }
  /**
   * updates progress bar width
   */
  updateProgress() {
    if (this.width() === 0 || this.width() === 100 || !this.options.timeOut) {
      return;
    }
    const now = (/* @__PURE__ */ new Date()).getTime();
    const remaining = this.hideTime - now;
    this.width.set(remaining / this.options.timeOut * 100);
    if (this.options.progressAnimation === "increasing") {
      this.width.update((width) => 100 - width);
    }
    if (this.width() <= 0) {
      this.width.set(0);
    }
    if (this.width() >= 100) {
      this.width.set(100);
    }
  }
  resetTimeout() {
    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state.set("active");
    this.options.timeOut = this.originalTimeout;
    this.timeout = setTimeout(() => this.remove(), this.originalTimeout);
    this.hideTime = (/* @__PURE__ */ new Date()).getTime() + (this.originalTimeout || 0);
    this.width.set(-1);
    if (this.options.progressBar) {
      this.intervalId = setInterval(() => this.updateProgress(), 10);
    }
  }
  /**
   * tells toastrService to remove this toast after animation time
   */
  remove() {
    if (this.state() === "removed") {
      return;
    }
    clearTimeout(this.timeout);
    this.state.set("removed");
    this.timeout = setTimeout(() => this.toastrService.remove(this.toastPackage.toastId));
  }
  tapToast() {
    if (this.state() === "removed") {
      return;
    }
    this.toastPackage.triggerTap();
    if (this.options.tapToDismiss) {
      this.remove();
    }
  }
  stickAround() {
    if (this.state() === "removed") {
      return;
    }
    clearTimeout(this.timeout);
    this.options.timeOut = 0;
    this.hideTime = 0;
    clearInterval(this.intervalId);
    this.width.set(0);
  }
  delayedHideToast() {
    if (this.options.disableTimeOut === true || this.options.disableTimeOut === "extendedTimeOut" || this.options.extendedTimeOut === 0 || this.state() === "removed") {
      return;
    }
    this.timeout = setTimeout(() => this.remove(), this.options.extendedTimeOut);
    this.options.timeOut = this.options.extendedTimeOut;
    this.hideTime = (/* @__PURE__ */ new Date()).getTime() + (this.options.timeOut || 0);
    this.width.set(-1);
    if (this.options.progressBar) {
      this.intervalId = setInterval(() => this.updateProgress(), 10);
    }
  }
  static \u0275fac = function ToastNoAnimation_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastNoAnimation)(\u0275\u0275directiveInject(ToastrService), \u0275\u0275directiveInject(ToastPackage), \u0275\u0275directiveInject(ApplicationRef));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _ToastNoAnimation,
    selectors: [["", "toast-component", ""]],
    hostVars: 4,
    hostBindings: function ToastNoAnimation_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("click", function ToastNoAnimation_click_HostBindingHandler() {
          return ctx.tapToast();
        })("mouseenter", function ToastNoAnimation_mouseenter_HostBindingHandler() {
          return ctx.stickAround();
        })("mouseleave", function ToastNoAnimation_mouseleave_HostBindingHandler() {
          return ctx.delayedHideToast();
        });
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.toastClasses);
        \u0275\u0275styleProp("display", ctx.displayStyle);
      }
    },
    attrs: _c03,
    decls: 5,
    vars: 5,
    consts: [["type", "button", "class", "toast-close-button", "aria-label", "Close", 3, "click", 4, "ngIf"], [3, "class", 4, "ngIf"], ["role", "alert", 3, "class", "innerHTML", 4, "ngIf"], ["role", "alert", 3, "class", 4, "ngIf"], [4, "ngIf"], ["type", "button", "aria-label", "Close", 1, "toast-close-button", 3, "click"], ["aria-hidden", "true"], ["role", "alert", 3, "innerHTML"], ["role", "alert"], [1, "toast-progress"]],
    template: function ToastNoAnimation_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, ToastNoAnimation_button_0_Template, 3, 0, "button", 0)(1, ToastNoAnimation_div_1_Template, 3, 5, "div", 1)(2, ToastNoAnimation_div_2_Template, 1, 3, "div", 2)(3, ToastNoAnimation_div_3_Template, 2, 4, "div", 3)(4, ToastNoAnimation_div_4_Template, 2, 2, "div", 4);
      }
      if (rf & 2) {
        \u0275\u0275property("ngIf", ctx.options.closeButton);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.title);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.message && ctx.options.enableHtml);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.message && !ctx.options.enableHtml);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.options.progressBar);
      }
    },
    dependencies: [NgIf],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastNoAnimation, [{
    type: Component,
    args: [{
      selector: "[toast-component]",
      template: `
  <button *ngIf="options.closeButton" (click)="remove()" type="button" class="toast-close-button" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  <div *ngIf="title" [class]="options.titleClass" [attr.aria-label]="title">
    {{ title }} <ng-container *ngIf="duplicatesCount">[{{ duplicatesCount + 1 }}]</ng-container>
  </div>
  <div *ngIf="message && options.enableHtml" role="alert"
    [class]="options.messageClass" [innerHTML]="message">
  </div>
  <div *ngIf="message && !options.enableHtml" role="alert"
    [class]="options.messageClass" [attr.aria-label]="message">
    {{ message }}
  </div>
  <div *ngIf="options.progressBar">
    <div class="toast-progress" [style.width]="width() + '%'"></div>
  </div>
  `,
      standalone: true,
      imports: [NgIf],
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [{
    type: ToastrService
  }, {
    type: ToastPackage
  }, {
    type: ApplicationRef
  }], {
    toastClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    displayStyle: [{
      type: HostBinding,
      args: ["style.display"]
    }],
    tapToast: [{
      type: HostListener,
      args: ["click"]
    }],
    stickAround: [{
      type: HostListener,
      args: ["mouseenter"]
    }],
    delayedHideToast: [{
      type: HostListener,
      args: ["mouseleave"]
    }]
  });
})();
var DefaultNoAnimationsGlobalConfig = __spreadProps(__spreadValues({}, DefaultNoComponentGlobalConfig), {
  toastComponent: ToastNoAnimation
});
var ToastNoAnimationModule = class _ToastNoAnimationModule {
  static forRoot(config = {}) {
    return {
      ngModule: _ToastNoAnimationModule,
      providers: [{
        provide: TOAST_CONFIG,
        useValue: {
          default: DefaultNoAnimationsGlobalConfig,
          config
        }
      }]
    };
  }
  static \u0275fac = function ToastNoAnimationModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastNoAnimationModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _ToastNoAnimationModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastNoAnimationModule, [{
    type: NgModule,
    args: [{
      imports: [ToastNoAnimation],
      exports: [ToastNoAnimation]
    }]
  }], null, null);
})();

export {
  provideAnimations,
  AcessService,
  statusColors,
  presetColors,
  isPresetColor,
  isStatusColor,
  PREFIX,
  warn2 as warn,
  isNotNil,
  toBoolean,
  numberAttributeWithZeroFallback,
  toCssPixel,
  isStyleSupport,
  measure,
  getStatusClassNames,
  fromEventOutsideAngular,
  NzConfigService,
  WithConfig,
  cancelRequestAnimationFrame,
  reqAnimFrame,
  NzResizeService,
  NzSingletonService,
  gridResponsiveMap,
  NzBreakpointService,
  NzDestroyService,
  _typeof,
  toPropertyKey,
  _defineProperty,
  ArrowLeftOutline,
  CalendarOutline,
  CarOutline,
  CheckOutline,
  ClockCircleOutline,
  CloseCircleOutline,
  CheckCircleOutline,
  CheckCircleFill,
  CopyOutline,
  EnvironmentOutline,
  ExclamationCircleOutline,
  CrownOutline,
  FireFill,
  FlagOutline,
  HeartFill,
  HeartOutline,
  HomeOutline,
  InfoCircleOutline,
  LoadingOutline,
  LeftOutline,
  MailOutline,
  LoginOutline,
  KeyOutline,
  QuestionCircleOutline,
  ReloadOutline,
  RightOutline,
  SafetyCertificateOutline,
  ShopOutline,
  StarOutline,
  StarFill,
  TeamOutline,
  UserAddOutline,
  NZ_ICONS,
  NzIconDirective,
  NzIconModule,
  NzStringTemplateOutletDirective,
  NzOutletModule,
  NZ_SPACE_COMPACT_SIZE,
  NZ_SPACE_COMPACT_ITEM_TYPE,
  NzSpaceCompactItemDirective,
  NzSpaceModule,
  NzTransitionPatchDirective,
  NzWaveDirective,
  NzButtonComponent,
  NzButtonGroupComponent,
  NzButtonModule,
  ToastrService,
  provideToastr
};
/*! Bundled license information:

@angular/platform-browser/fesm2022/animations.mjs:
  (**
   * @license Angular v19.2.9
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)

@angular/core/fesm2022/rxjs-interop.mjs:
  (**
   * @license Angular v19.2.9
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)

@angular/animations/fesm2022/animations.mjs:
  (**
   * @license Angular v19.2.9
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=chunk-JWFN2V33.js.map
