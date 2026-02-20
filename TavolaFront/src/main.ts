import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNgxMask } from 'ngx-mask';

import { AppComponent } from './app/app.component';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { appConfig } from './app/app.config';

import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
registerLocaleData(pt);

// ─── ng-zorro ────────────────────────────────────────────────────────────────
import { NZ_I18N, pt_BR as zorroPtBR } from 'ng-zorro-antd/i18n';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import {
  HomeOutline,
  EnvironmentOutline,
  FlagOutline,
  HeartOutline,
  HeartFill,
  StarOutline,
  StarFill,
  TeamOutline
} from '@ant-design/icons-angular/icons';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzMessageModule } from 'ng-zorro-antd/message';
// ─────────────────────────────────────────────────────────────────────────────

// monte o array de ícones que vai usar
const icons = [
  HomeOutline,
  EnvironmentOutline,
  FlagOutline,
  HeartOutline,
  HeartFill,
  StarOutline,
  StarFill,
  TeamOutline
];

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    importProvidersFrom(
      NzIconModule,
      NzBreadCrumbModule,
      NzGridModule,
      NzImageModule,
      NzButtonModule,
      NzTagModule,
      NzTypographyModule,
      NzSpaceModule,
      NzMessageModule
    ),
    { provide: NZ_ICONS, useValue: icons },

    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: NZ_I18N, useValue: zorroPtBR },

    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ...(appConfig.providers || []),
    provideNgxMask(),
    provideAnimations()
  ]
}).catch(err => console.error(err));
