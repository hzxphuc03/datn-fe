import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  CanLoad, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Route, 
  UrlSegment 
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { TokenService } from '../services/token.service';
import { ErrorTsService } from '../shareds/message/error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private errorService: ErrorTsService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthentication(state.url, route.data);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthentication(state.url, childRoute.data);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url = segments.map(segment => segment.path).join('/');
    return this.checkAuthentication(`/${url}`, route.data);
  }

  private checkAuthentication(url: string, routeData?: any): Observable<boolean> {
    return this.tokenService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Check role-based access if required
          if (routeData?.['roles']) {
            const requiredRoles: string[] = routeData['roles'];
            const hasRequiredRole = this.tokenService.hasAnyRole(requiredRoles);
            
            if (!hasRequiredRole) {
              this.errorService.displayError(
                'Bạn không có quyền truy cập trang này',
                'error'
              );
              this.redirectToAppropriateLogin(url);
              return false;
            }
          }

          // Check authority-based access if required
          if (routeData?.['authorities']) {
            const requiredAuthorities: string[] = routeData['authorities'];
            const hasRequiredAuthority = requiredAuthorities.some(auth => 
              this.tokenService.hasAuthority(auth)
            );
            
            if (!hasRequiredAuthority) {
              this.errorService.displayError(
                'Bạn không có quyền truy cập chức năng này',
                'error'
              );
              this.redirectToAppropriateLogin(url);
              return false;
            }
          }

          return true;
        } else {
          this.redirectToAppropriateLogin(url);
          return false;
        }
      })
    );
  }

  private redirectToAppropriateLogin(url: string): void {
    if (url.includes('/auth/admin')) {
      // Admin area - redirect to admin login
      this.router.navigate(['/auth/admin/login']);
    } else {
      // Client area - redirect to client login with return URL
      this.router.navigate(['/g4/login'], { 
        queryParams: { backurl: url } 
      });
    }
  }
}