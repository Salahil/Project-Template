import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, EMPTY, throwError } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { AuthService } from '../services/auth.service';
import { AccessService } from '../services/access.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

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

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApiRequest = request.url.startsWith(`${environment.apiUrl}`);
    const isPublicRoute = this.publicRoutes.some((route) => request.url.includes(route));

    if (!isApiRequest || isPublicRoute) {
      return next.handle(request);
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
          return this.handle401Error(authReq, next);
        }

        return throwError(() => err);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.accessService.postAuthRefreshToken().pipe(
        switchMap((res) => {
          const tkn = res.token || '';
          this.refreshTokenSubject.next(tkn);
          const retry = request.clone({
            setHeaders: tkn ? { Authorization: `Bearer ${tkn}` } : {},
            withCredentials: true
          });
          return next.handle(retry);
        }),
        catchError(() => {
          this.auth.clearAuthData();
          this.router.navigate(['/login']);
          return EMPTY;
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((t): t is string => t != null),
      take(1),
      switchMap((tkn) => {
        const retry = request.clone({
          setHeaders: tkn ? { Authorization: `Bearer ${tkn}` } : {},
          withCredentials: true
        });
        return next.handle(retry);
      })
    );
  }
}
