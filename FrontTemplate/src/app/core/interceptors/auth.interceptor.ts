import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError, switchMap, shareReplay, tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { AuthService } from '../services/auth.service';
import { AccessService } from '../services/access.service';

function requestPathname(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      return new URL(url).pathname;
    } catch {
      return '';
    }
  }
  const q = url.indexOf('?');
  return q >= 0 ? url.slice(0, q) : url;
}

/** Chamadas ao LogApi: URL absoluta em produção ou paths `/auth`, `/usuarios` no dev com proxy. */
function isBackendRequest(url: string): boolean {
  const base = environment.apiUrl;
  if (base.startsWith('http')) {
    return url.startsWith(base);
  }
  const path = requestPathname(url);
  if (base.startsWith('/')) {
    return path === base || path.startsWith(`${base}/`);
  }
  const prefixes = environment.apiPathPrefixes;
  return prefixes.length > 0 && prefixes.some((p) => path === p || path.startsWith(`${p}/`));
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /** Uma única chamada a /auth/refresh por rajada de 401. */
  private refreshInFlight$: Observable<void> | null = null;

  private publicRoutes = [
    '/auth/login',
    '/auth/login/google',
    '/auth/register',
    '/auth/verificar',
    '/auth/reenviar-codigo',
    '/auth/refresh',
    '/auth/redefinir-senha',
    'auth/mudar-senha/'
  ];

  constructor(
    private auth: AuthService,
    private accessService: AccessService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isApiRequest = isBackendRequest(request.url);
    const isPublicRoute = this.publicRoutes.some((route) => request.url.includes(route));

    if (!isApiRequest || isPublicRoute) {
      return next.handle(isApiRequest ? request.clone({ withCredentials: true }) : request);
    }

    const token = this.auth.getToken();
    const authReq = request.clone({
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true
    });

    return next.handle(authReq).pipe(
      catchError((err) => {
        if (!(err instanceof HttpErrorResponse)) {
          return throwError(() => err);
        }

        if (err.status === 401 && request.url.includes('/auth/refresh')) {
          this.auth.clearAuthData();
          this.router.navigate(['/login']);
          return EMPTY;
        }

        if (err.status === 401) {
          return this.handle401Error(request, next);
        }

        return throwError(() => err);
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.refreshInFlight$) {
      this.refreshInFlight$ = this.accessService.postAuthRefreshToken().pipe(
        tap({
          error: () => {
            this.auth.clearAuthData();
            this.router.navigate(['/login']);
          }
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
        finalize(() => {
          this.refreshInFlight$ = null;
        })
      );
    }

    return this.refreshInFlight$.pipe(
      switchMap(() => next.handle(request.clone({ withCredentials: true }))),
      catchError(() => EMPTY)
    );
  }
}
