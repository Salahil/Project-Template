import {
  ComponentPortal,
  Overlay
} from "./chunk-KEYB2N5R.js";
import {
  NzConfigService,
  NzIconDirective,
  NzIconModule,
  NzOutletModule,
  NzSingletonService,
  NzStringTemplateOutletDirective,
  toCssPixel
} from "./chunk-JWFN2V33.js";
import {
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger
} from "./chunk-53AACB3W.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  EventEmitter,
  Injectable,
  Injector,
  Input,
  NgModule,
  Output,
  Subject,
  ViewEncapsulation,
  __spreadValues,
  filter,
  inject,
  setClassMetadata,
  take,
  takeUntil,
  ɵɵInheritDefinitionFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleProp,
  ɵɵtemplate
} from "./chunk-IKAMEZHE.js";

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-core-animation.mjs
var AnimationDuration = class {
  static SLOW = "0.3s";
  // Modal
  static BASE = "0.2s";
  static FAST = "0.1s";
  // Tooltip
};
var AnimationCurves = class {
  static EASE_BASE_OUT = "cubic-bezier(0.7, 0.3, 0.1, 1)";
  static EASE_BASE_IN = "cubic-bezier(0.9, 0, 0.3, 0.7)";
  static EASE_OUT = "cubic-bezier(0.215, 0.61, 0.355, 1)";
  static EASE_IN = "cubic-bezier(0.55, 0.055, 0.675, 0.19)";
  static EASE_IN_OUT = "cubic-bezier(0.645, 0.045, 0.355, 1)";
  static EASE_OUT_BACK = "cubic-bezier(0.12, 0.4, 0.29, 1.46)";
  static EASE_IN_BACK = "cubic-bezier(0.71, -0.46, 0.88, 0.6)";
  static EASE_IN_OUT_BACK = "cubic-bezier(0.71, -0.46, 0.29, 1.46)";
  static EASE_OUT_CIRC = "cubic-bezier(0.08, 0.82, 0.17, 1)";
  static EASE_IN_CIRC = "cubic-bezier(0.6, 0.04, 0.98, 0.34)";
  static EASE_IN_OUT_CIRC = "cubic-bezier(0.78, 0.14, 0.15, 0.86)";
  static EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";
  static EASE_IN_QUINT = "cubic-bezier(0.755, 0.05, 0.855, 0.06)";
  static EASE_IN_OUT_QUINT = "cubic-bezier(0.86, 0, 0.07, 1)";
};
var collapseMotion = trigger("collapseMotion", [state("expanded", style({
  height: "*"
})), state("collapsed", style({
  height: 0,
  overflow: "hidden"
})), state("hidden", style({
  height: 0,
  overflow: "hidden",
  borderTopWidth: "0"
})), transition("expanded => collapsed", animate(`150ms ${AnimationCurves.EASE_IN_OUT}`)), transition("expanded => hidden", animate(`150ms ${AnimationCurves.EASE_IN_OUT}`)), transition("collapsed => expanded", animate(`150ms ${AnimationCurves.EASE_IN_OUT}`)), transition("hidden => expanded", animate(`150ms ${AnimationCurves.EASE_IN_OUT}`))]);
var treeCollapseMotion = trigger("treeCollapseMotion", [transition("* => *", [query("nz-tree-node:leave,nz-tree-builtin-node:leave", [style({
  overflow: "hidden"
}), stagger(0, [animate(`150ms ${AnimationCurves.EASE_IN_OUT}`, style({
  height: 0,
  opacity: 0,
  "padding-bottom": 0
}))])], {
  optional: true
}), query("nz-tree-node:enter,nz-tree-builtin-node:enter", [style({
  overflow: "hidden",
  height: 0,
  opacity: 0,
  "padding-bottom": 0
}), stagger(0, [animate(`150ms ${AnimationCurves.EASE_IN_OUT}`, style({
  overflow: "hidden",
  height: "*",
  opacity: "*",
  "padding-bottom": "*"
}))])], {
  optional: true
})])]);
var drawerMaskMotion = trigger("drawerMaskMotion", [transition(":enter", [style({
  opacity: 0
}), animate(`${AnimationDuration.SLOW}`, style({
  opacity: 1
}))]), transition(":leave", [style({
  opacity: 1
}), animate(`${AnimationDuration.SLOW}`, style({
  opacity: 0
}))])]);
var fadeMotion = trigger("fadeMotion", [transition("* => enter", [style({
  opacity: 0
}), animate(`${AnimationDuration.BASE}`, style({
  opacity: 1
}))]), transition("* => leave, :leave", [style({
  opacity: 1
}), animate(`${AnimationDuration.BASE}`, style({
  opacity: 0
}))])]);
var helpMotion = trigger("helpMotion", [transition(":enter", [style({
  opacity: 0,
  transform: "translateY(-5px)"
}), animate(`${AnimationDuration.SLOW} ${AnimationCurves.EASE_IN_OUT}`, style({
  opacity: 1,
  transform: "translateY(0)"
}))]), transition(":leave", [style({
  opacity: 1,
  transform: "translateY(0)"
}), animate(`${AnimationDuration.SLOW} ${AnimationCurves.EASE_IN_OUT}`, style({
  opacity: 0,
  transform: "translateY(-5px)"
}))])]);
var moveUpMotion = trigger("moveUpMotion", [transition("* => enter", [style({
  transformOrigin: "0 0",
  transform: "translateY(-100%)",
  opacity: 0
}), animate(`${AnimationDuration.BASE}`, style({
  transformOrigin: "0 0",
  transform: "translateY(0%)",
  opacity: 1
}))]), transition("* => leave", [style({
  transformOrigin: "0 0",
  transform: "translateY(0%)",
  opacity: 1
}), animate(`${AnimationDuration.BASE}`, style({
  transformOrigin: "0 0",
  transform: "translateY(-100%)",
  opacity: 0
}))])]);
var notificationMotion = trigger("notificationMotion", [state("enterRight", style({
  opacity: 1,
  transform: "translateX(0)"
})), transition("* => enterRight", [style({
  opacity: 0,
  transform: "translateX(5%)"
}), animate("100ms linear")]), state("enterLeft", style({
  opacity: 1,
  transform: "translateX(0)"
})), transition("* => enterLeft", [style({
  opacity: 0,
  transform: "translateX(-5%)"
}), animate("100ms linear")]), state("enterTop", style({
  opacity: 1,
  transform: "translateY(0)"
})), transition("* => enterTop", [style({
  opacity: 0,
  transform: "translateY(-5%)"
}), animate("100ms linear")]), state("enterBottom", style({
  opacity: 1,
  transform: "translateY(0)"
})), transition("* => enterBottom", [style({
  opacity: 0,
  transform: "translateY(5%)"
}), animate("100ms linear")]), state("leave", style({
  opacity: 0,
  transform: "scaleY(0.8)",
  transformOrigin: "0% 0%"
})), transition("* => leave", [style({
  opacity: 1,
  transform: "scaleY(1)",
  transformOrigin: "0% 0%"
}), animate("100ms linear")])]);
var ANIMATION_TRANSITION_IN = `${AnimationDuration.BASE} ${AnimationCurves.EASE_OUT_QUINT}`;
var ANIMATION_TRANSITION_OUT = `${AnimationDuration.BASE} ${AnimationCurves.EASE_IN_QUINT}`;
var slideMotion = trigger("slideMotion", [state("void", style({
  opacity: 0,
  transform: "scaleY(0.8)"
})), state("enter", style({
  opacity: 1,
  transform: "scaleY(1)"
})), transition("void => *", [animate(ANIMATION_TRANSITION_IN)]), transition("* => void", [animate(ANIMATION_TRANSITION_OUT)])]);
var slideAlertMotion = trigger("slideAlertMotion", [transition(":leave", [style({
  opacity: 1,
  transform: "scaleY(1)",
  transformOrigin: "0% 0%"
}), animate(`${AnimationDuration.SLOW} ${AnimationCurves.EASE_IN_OUT_CIRC}`, style({
  opacity: 0,
  transform: "scaleY(0)",
  transformOrigin: "0% 0%"
}))])]);
var tabSwitchMotion = trigger("tabSwitchMotion", [state("leave", style({
  display: "none"
})), transition("* => enter", [style({
  display: "block",
  opacity: 0
}), animate(AnimationDuration.SLOW)]), transition("* => leave, :leave", [style({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%"
}), animate(AnimationDuration.SLOW, style({
  opacity: 0
})), style({
  display: "none"
})])]);
var thumbMotion = trigger("thumbMotion", [state("from", style({
  transform: "translateX({{ transform }}px)",
  width: "{{ width }}px"
}), {
  params: {
    transform: 0,
    width: 0
  }
}), state("to", style({
  transform: "translateX({{ transform }}px)",
  width: "{{ width }}px"
}), {
  params: {
    transform: 100,
    width: 0
  }
}), transition("from => to", animate(`300ms ${AnimationCurves.EASE_IN_OUT}`))]);
var zoomBigMotion = trigger("zoomBigMotion", [transition("void => active", [style({
  opacity: 0,
  transform: "scale(0.8)"
}), animate(`${AnimationDuration.BASE} ${AnimationCurves.EASE_OUT_CIRC}`, style({
  opacity: 1,
  transform: "scale(1)"
}))]), transition("active => void", [style({
  opacity: 1,
  transform: "scale(1)"
}), animate(`${AnimationDuration.BASE} ${AnimationCurves.EASE_IN_OUT_CIRC}`, style({
  opacity: 0,
  transform: "scale(0.8)"
}))])]);
var zoomBadgeMotion = trigger("zoomBadgeMotion", [transition(":enter", [style({
  opacity: 0,
  transform: "scale(0) translate(50%, -50%)"
}), animate(`${AnimationDuration.SLOW} ${AnimationCurves.EASE_OUT_BACK}`, style({
  opacity: 1,
  transform: "scale(1) translate(50%, -50%)"
}))]), transition(":leave", [style({
  opacity: 1,
  transform: "scale(1) translate(50%, -50%)"
}), animate(`${AnimationDuration.SLOW} ${AnimationCurves.EASE_IN_BACK}`, style({
  opacity: 0,
  transform: "scale(0) translate(50%, -50%)"
}))])]);

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-message.mjs
var _c0 = (a0, a1) => ({
  $implicit: a0,
  data: a1
});
function NzMessageComponent_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "nz-icon", 3);
  }
}
function NzMessageComponent_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "nz-icon", 4);
  }
}
function NzMessageComponent_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "nz-icon", 5);
  }
}
function NzMessageComponent_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "nz-icon", 6);
  }
}
function NzMessageComponent_Case_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "nz-icon", 7);
  }
}
function NzMessageComponent_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275element(1, "span", 9);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("innerHTML", ctx_r0.instance.content, \u0275\u0275sanitizeHtml);
  }
}
function NzMessageContainerComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "nz-message", 2);
    \u0275\u0275listener("destroyed", function NzMessageContainerComponent_For_2_Template_nz_message_destroyed_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.remove($event.id, $event.userAction));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const instance_r3 = ctx.$implicit;
    \u0275\u0275property("instance", instance_r3);
  }
}
var globalCounter = 0;
var NzMNService = class {
  overlay;
  injector;
  container;
  nzSingletonService = inject(NzSingletonService);
  constructor(overlay, injector) {
    this.overlay = overlay;
    this.injector = injector;
  }
  remove(id) {
    if (this.container) {
      if (id) {
        this.container.remove(id);
      } else {
        this.container.removeAll();
      }
    }
  }
  getInstanceId() {
    return `${this.componentPrefix}-${globalCounter++}`;
  }
  withContainer(ctor) {
    let containerInstance = this.nzSingletonService.getSingletonWithKey(this.componentPrefix);
    if (containerInstance) {
      return containerInstance;
    }
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global()
    });
    const componentPortal = new ComponentPortal(ctor, null, this.injector);
    const componentRef = overlayRef.attach(componentPortal);
    const overlayWrapper = overlayRef.hostElement;
    overlayWrapper.style.zIndex = "1010";
    if (!containerInstance) {
      this.container = containerInstance = componentRef.instance;
      this.nzSingletonService.registerSingletonWithKey(this.componentPrefix, containerInstance);
      this.container.afterAllInstancesRemoved.subscribe(() => {
        this.container = void 0;
        this.nzSingletonService.unregisterSingletonWithKey(this.componentPrefix);
        overlayRef.dispose();
      });
    }
    return containerInstance;
  }
};
var NzMNContainerComponent = class _NzMNContainerComponent {
  config;
  instances = [];
  _afterAllInstancesRemoved = new Subject();
  afterAllInstancesRemoved = this._afterAllInstancesRemoved.asObservable();
  cdr = inject(ChangeDetectorRef);
  nzConfigService = inject(NzConfigService);
  destroy$ = new Subject();
  ngOnInit() {
    this.subscribeConfigChange();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  create(data) {
    const instance = this.onCreate(data);
    if (this.instances.length >= this.config.nzMaxStack) {
      this.instances = this.instances.slice(1);
    }
    this.instances = [...this.instances, instance];
    this.readyInstances();
    return instance;
  }
  remove(id, userAction = false) {
    this.instances.map((instance, index) => ({
      index,
      instance
    })).filter(({
      instance
    }) => instance.messageId === id).forEach(({
      index,
      instance
    }) => {
      this.instances.splice(index, 1);
      this.instances = [...this.instances];
      this.onRemove(instance, userAction);
      this.readyInstances();
    });
    if (!this.instances.length) {
      this.onAllInstancesRemoved();
    }
  }
  removeAll() {
    this.instances.forEach((i) => this.onRemove(i, false));
    this.instances = [];
    this.readyInstances();
    this.onAllInstancesRemoved();
  }
  onCreate(instance) {
    instance.options = this.mergeOptions(instance.options);
    instance.onClose = new Subject();
    return instance;
  }
  onRemove(instance, userAction) {
    instance.onClose.next(userAction);
    instance.onClose.complete();
  }
  onAllInstancesRemoved() {
    this._afterAllInstancesRemoved.next();
    this._afterAllInstancesRemoved.complete();
  }
  readyInstances() {
    this.cdr.detectChanges();
  }
  mergeOptions(options) {
    const {
      nzDuration,
      nzAnimate,
      nzPauseOnHover
    } = this.config;
    return __spreadValues({
      nzDuration,
      nzAnimate,
      nzPauseOnHover
    }, options);
  }
  static \u0275fac = function NzMNContainerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzMNContainerComponent)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NzMNContainerComponent
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMNContainerComponent, [{
    type: Directive
  }], null, null);
})();
var NzMNComponent = class _NzMNComponent {
  cdr = inject(ChangeDetectorRef);
  animationStateChanged = new Subject();
  options;
  autoClose;
  closeTimer;
  userAction = false;
  eraseTimer;
  eraseTimingStart;
  eraseTTL;
  ngOnInit() {
    this.options = this.instance.options;
    if (this.options.nzAnimate) {
      this.instance.state = "enter";
      this.animationStateChanged.pipe(filter((event) => event.phaseName === "done" && event.toState === "leave"), take(1)).subscribe(() => {
        clearTimeout(this.closeTimer);
        this.destroyed.next({
          id: this.instance.messageId,
          userAction: this.userAction
        });
      });
    }
    this.autoClose = this.options.nzDuration > 0;
    if (this.autoClose) {
      this.initErase();
      this.startEraseTimeout();
    }
  }
  ngOnDestroy() {
    if (this.autoClose) {
      this.clearEraseTimeout();
    }
    this.animationStateChanged.complete();
  }
  onEnter() {
    if (this.autoClose && this.options.nzPauseOnHover) {
      this.clearEraseTimeout();
      this.updateTTL();
    }
  }
  onLeave() {
    if (this.autoClose && this.options.nzPauseOnHover) {
      this.startEraseTimeout();
    }
  }
  destroy(userAction = false) {
    this.userAction = userAction;
    if (this.options.nzAnimate) {
      this.instance.state = "leave";
      this.cdr.detectChanges();
      this.closeTimer = setTimeout(() => {
        this.closeTimer = void 0;
        this.destroyed.next({
          id: this.instance.messageId,
          userAction
        });
      }, 200);
    } else {
      this.destroyed.next({
        id: this.instance.messageId,
        userAction
      });
    }
  }
  initErase() {
    this.eraseTTL = this.options.nzDuration;
    this.eraseTimingStart = Date.now();
  }
  updateTTL() {
    if (this.autoClose) {
      this.eraseTTL -= Date.now() - this.eraseTimingStart;
    }
  }
  startEraseTimeout() {
    if (this.eraseTTL > 0) {
      this.clearEraseTimeout();
      this.eraseTimer = setTimeout(() => this.destroy(), this.eraseTTL);
      this.eraseTimingStart = Date.now();
    } else {
      this.destroy();
    }
  }
  clearEraseTimeout() {
    if (this.eraseTimer !== null) {
      clearTimeout(this.eraseTimer);
      this.eraseTimer = void 0;
    }
  }
  static \u0275fac = function NzMNComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzMNComponent)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NzMNComponent
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMNComponent, [{
    type: Directive
  }], null, null);
})();
var NzMessageComponent = class _NzMessageComponent extends NzMNComponent {
  instance;
  destroyed = new EventEmitter();
  index;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275NzMessageComponent_BaseFactory;
    return function NzMessageComponent_Factory(__ngFactoryType__) {
      return (\u0275NzMessageComponent_BaseFactory || (\u0275NzMessageComponent_BaseFactory = \u0275\u0275getInheritedFactory(_NzMessageComponent)))(__ngFactoryType__ || _NzMessageComponent);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _NzMessageComponent,
    selectors: [["nz-message"]],
    inputs: {
      instance: "instance"
    },
    outputs: {
      destroyed: "destroyed"
    },
    exportAs: ["nzMessage"],
    features: [\u0275\u0275InheritDefinitionFeature],
    decls: 9,
    vars: 9,
    consts: [[1, "ant-message-notice", 3, "mouseenter", "mouseleave"], [1, "ant-message-notice-content"], [1, "ant-message-custom-content"], ["nzType", "check-circle"], ["nzType", "info-circle"], ["nzType", "exclamation-circle"], ["nzType", "close-circle"], ["nzType", "loading"], [4, "nzStringTemplateOutlet", "nzStringTemplateOutletContext"], [3, "innerHTML"]],
    template: function NzMessageComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275listener("@moveUpMotion.done", function NzMessageComponent_Template_div_animation_moveUpMotion_done_0_listener($event) {
          return ctx.animationStateChanged.next($event);
        })("mouseenter", function NzMessageComponent_Template_div_mouseenter_0_listener() {
          return ctx.onEnter();
        })("mouseleave", function NzMessageComponent_Template_div_mouseleave_0_listener() {
          return ctx.onLeave();
        });
        \u0275\u0275elementStart(1, "div", 1)(2, "div", 2);
        \u0275\u0275template(3, NzMessageComponent_Case_3_Template, 1, 0, "nz-icon", 3)(4, NzMessageComponent_Case_4_Template, 1, 0, "nz-icon", 4)(5, NzMessageComponent_Case_5_Template, 1, 0, "nz-icon", 5)(6, NzMessageComponent_Case_6_Template, 1, 0, "nz-icon", 6)(7, NzMessageComponent_Case_7_Template, 1, 0, "nz-icon", 7)(8, NzMessageComponent_ng_container_8_Template, 2, 1, "ng-container", 8);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        let tmp_2_0;
        \u0275\u0275property("@moveUpMotion", ctx.instance.state);
        \u0275\u0275advance(2);
        \u0275\u0275classMap("ant-message-" + ctx.instance.type);
        \u0275\u0275advance();
        \u0275\u0275conditional((tmp_2_0 = ctx.instance.type) === "success" ? 3 : tmp_2_0 === "info" ? 4 : tmp_2_0 === "warning" ? 5 : tmp_2_0 === "error" ? 6 : tmp_2_0 === "loading" ? 7 : -1);
        \u0275\u0275advance(5);
        \u0275\u0275property("nzStringTemplateOutlet", ctx.instance.content)("nzStringTemplateOutletContext", \u0275\u0275pureFunction2(6, _c0, ctx, ctx.instance.options == null ? null : ctx.instance.options.nzData));
      }
    },
    dependencies: [NzIconModule, NzIconDirective, NzOutletModule, NzStringTemplateOutletDirective],
    encapsulation: 2,
    data: {
      animation: [moveUpMotion]
    },
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMessageComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      selector: "nz-message",
      exportAs: "nzMessage",
      preserveWhitespaces: false,
      animations: [moveUpMotion],
      template: `
    <div
      class="ant-message-notice"
      [@moveUpMotion]="instance.state"
      (@moveUpMotion.done)="animationStateChanged.next($event)"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
    >
      <div class="ant-message-notice-content">
        <div class="ant-message-custom-content" [class]="'ant-message-' + instance.type">
          @switch (instance.type) {
            @case ('success') {
              <nz-icon nzType="check-circle" />
            }
            @case ('info') {
              <nz-icon nzType="info-circle" />
            }
            @case ('warning') {
              <nz-icon nzType="exclamation-circle" />
            }
            @case ('error') {
              <nz-icon nzType="close-circle" />
            }
            @case ('loading') {
              <nz-icon nzType="loading" />
            }
          }
          <ng-container
            *nzStringTemplateOutlet="instance.content; context: { $implicit: this, data: instance.options?.nzData }"
          >
            <span [innerHTML]="instance.content"></span>
          </ng-container>
        </div>
      </div>
    </div>
  `,
      imports: [NzIconModule, NzOutletModule]
    }]
  }], null, {
    instance: [{
      type: Input
    }],
    destroyed: [{
      type: Output
    }]
  });
})();
var NZ_CONFIG_COMPONENT_NAME = "message";
var NZ_MESSAGE_DEFAULT_CONFIG = {
  nzAnimate: true,
  nzDuration: 3e3,
  nzMaxStack: 7,
  nzPauseOnHover: true,
  nzTop: 24,
  nzDirection: "ltr"
};
var NzMessageContainerComponent = class _NzMessageContainerComponent extends NzMNContainerComponent {
  dir = this.nzConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME)?.nzDirection || "ltr";
  top;
  constructor() {
    super();
    this.updateConfig();
  }
  subscribeConfigChange() {
    this.nzConfigService.getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateConfig();
      this.dir = this.nzConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME)?.nzDirection || this.dir;
    });
  }
  updateConfig() {
    this.config = __spreadValues(__spreadValues(__spreadValues({}, NZ_MESSAGE_DEFAULT_CONFIG), this.config), this.nzConfigService.getConfigForComponent(NZ_CONFIG_COMPONENT_NAME));
    this.top = toCssPixel(this.config.nzTop);
    this.cdr.markForCheck();
  }
  static \u0275fac = function NzMessageContainerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzMessageContainerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _NzMessageContainerComponent,
    selectors: [["nz-message-container"]],
    exportAs: ["nzMessageContainer"],
    features: [\u0275\u0275InheritDefinitionFeature],
    decls: 3,
    vars: 4,
    consts: [[1, "ant-message"], [3, "instance"], [3, "destroyed", "instance"]],
    template: function NzMessageContainerComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275repeaterCreate(1, NzMessageContainerComponent_For_2_Template, 1, 1, "nz-message", 1, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275styleProp("top", ctx.top);
        \u0275\u0275classProp("ant-message-rtl", ctx.dir === "rtl");
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.instances);
      }
    },
    dependencies: [NzMessageComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMessageContainerComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      selector: "nz-message-container",
      exportAs: "nzMessageContainer",
      preserveWhitespaces: false,
      template: `
    <div class="ant-message" [class.ant-message-rtl]="dir === 'rtl'" [style.top]="top">
      @for (instance of instances; track instance) {
        <nz-message [instance]="instance" (destroyed)="remove($event.id, $event.userAction)"></nz-message>
      }
    </div>
  `,
      imports: [NzMessageComponent]
    }]
  }], () => [], null);
})();
var NzMessageModule = class _NzMessageModule {
  static \u0275fac = function NzMessageModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzMessageModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _NzMessageModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [NzMessageContainerComponent, NzMessageComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMessageModule, [{
    type: NgModule,
    args: [{
      imports: [NzMessageContainerComponent, NzMessageComponent]
    }]
  }], null, null);
})();
var NzMessageService = class _NzMessageService extends NzMNService {
  componentPrefix = "message-";
  constructor(overlay, injector) {
    super(overlay, injector);
  }
  success(content, options) {
    return this.createInstance({
      type: "success",
      content
    }, options);
  }
  error(content, options) {
    return this.createInstance({
      type: "error",
      content
    }, options);
  }
  info(content, options) {
    return this.createInstance({
      type: "info",
      content
    }, options);
  }
  warning(content, options) {
    return this.createInstance({
      type: "warning",
      content
    }, options);
  }
  loading(content, options) {
    return this.createInstance({
      type: "loading",
      content
    }, options);
  }
  create(type, content, options) {
    return this.createInstance({
      type,
      content
    }, options);
  }
  createInstance(message, options) {
    this.container = this.withContainer(NzMessageContainerComponent);
    return this.container.create(__spreadValues(__spreadValues({}, message), {
      createdAt: /* @__PURE__ */ new Date(),
      messageId: this.getInstanceId(),
      options
    }));
  }
  static \u0275fac = function NzMessageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzMessageService)(\u0275\u0275inject(Overlay), \u0275\u0275inject(Injector));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NzMessageService,
    factory: _NzMessageService.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzMessageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Overlay
  }, {
    type: Injector
  }], null);
})();

export {
  collapseMotion,
  fadeMotion,
  slideMotion,
  zoomBigMotion,
  NzMessageModule,
  NzMessageService
};
//# sourceMappingURL=chunk-Y7YD3C5P.js.map
