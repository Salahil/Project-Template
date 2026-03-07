import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import {
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  SOCIAL_AUTH_CONFIG
} from '@abacritt/angularx-social-login';

// Imports necessários para NG-ZORRO e internacionalização
import { registerLocaleData } from '@angular/common';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import pt from '@angular/common/locales/pt';
import { provideNzI18n, pt_BR } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  // Ícones que já estavam no app.config.ts
  CarOutline, HomeOutline, EnvironmentOutline, FlagOutline, HeartOutline, HeartFill,
  LeftOutline, RightOutline, CalendarOutline, TeamOutline,
  ExclamationCircleOutline, FireFill, CopyOutline, CheckOutline,

  // Ícones que estavam faltando (dos componentes de acesso)
  MailOutline,
  CheckCircleFill,
  UserAddOutline,
  ReloadOutline,
  ClockCircleOutline,
  KeyOutline,
  QuestionCircleOutline,
  ArrowLeftOutline,
  LoginOutline,
  ShopOutline,
  SafetyCertificateOutline,
  LoadingOutline,
  CheckCircleOutline,
  CloseCircleOutline,
  InfoCircleOutline,

  // Ícone VIP para mesas
  CrownOutline

} from '@ant-design/icons-angular/icons';

// Registra a localidade "pt" para o Angular
registerLocaleData(pt);

// Define o conjunto de ícones que será usado na aplicação
export const ICONS: IconDefinition[] = [
  CarOutline, HomeOutline, EnvironmentOutline, FlagOutline, HeartOutline, HeartFill,
  LeftOutline, RightOutline, CalendarOutline, TeamOutline,
  ExclamationCircleOutline, FireFill, CopyOutline, CheckOutline,
  MailOutline,
  CheckCircleFill,
  UserAddOutline,
  ReloadOutline,
  ClockCircleOutline,
  KeyOutline,
  QuestionCircleOutline,
  ArrowLeftOutline,
  LoginOutline,
  ShopOutline,
  SafetyCertificateOutline,
  LoadingOutline,
  CheckCircleOutline,
  CloseCircleOutline,
  InfoCircleOutline,
  CrownOutline
];

const googleClientId = '48867302798-cu3d9mpbmlmt9hepff9oc7cjqjs22fiq.apps.googleusercontent.com';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provedores existentes
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    // Login com Google
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(googleClientId)
          }
        ],
        onError: (err) => console.error(err)
      } as SocialAuthServiceConfig
    },

    // CORREÇÃO: Provedores centralizados adicionados aqui
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideNzI18n(pt_BR),
    { provide: NZ_ICONS, useValue: ICONS }
  ]
};
