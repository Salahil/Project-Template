import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AccessService } from '../services/access.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Router) private router: Router,
    private auth: AuthService,
    private accessService: AccessService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    if (this.auth.hasSessionHint()) {
      return of(true);
    }
    return this.accessService.postAuthRefreshToken().pipe(
      map(() => true),
      catchError(() => of(this.router.createUrlTree(['/login'])))
    );
  }
}
