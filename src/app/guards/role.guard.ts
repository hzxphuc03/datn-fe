import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { TokenService } from '../services/token.service';
import { ErrorTsService } from '../shareds/message/error.service';

export enum UserRole {
  ADMIN = 'ADMIN',
  NHAN_VIEN = 'NHAN_VIEN',
  KHACH_HANG = 'KHACH_HANG',
  EMPLOYEE = 'NHAN_VIEN', // Legacy alias
  CUSTOMER = 'KHACH_HANG', // Legacy alias
  MANAGER = 'ADMIN' // Legacy alias
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private errorService: ErrorTsService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkRole(route, state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkRole(childRoute, state.url);
  }

  private checkRole(route: ActivatedRouteSnapshot, url: string): Observable<boolean> {
    const requiredRoles = route.data['roles'] as string[];
    const requiredAuthorities = route.data['authorities'] as string[];

    return this.tokenService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.redirectToLogin(url);
          return false;
        }

        // Check roles if specified
        if (requiredRoles && requiredRoles.length > 0) {
          const hasRole = this.tokenService.hasAnyRole(requiredRoles);
          if (!hasRole) {
            this.handleAccessDenied(requiredRoles, 'role');
            return false;
          }
        }

        // Check authorities if specified
        if (requiredAuthorities && requiredAuthorities.length > 0) {
          const hasAuthority = requiredAuthorities.some(auth => 
            this.tokenService.hasAuthority(auth)
          );
          if (!hasAuthority) {
            this.handleAccessDenied(requiredAuthorities, 'authority');
            return false;
          }
        }

        return true;
      })
    );
  }

  private handleAccessDenied(required: string[], type: 'role' | 'authority'): void {
    const userRole = this.tokenService.getUserRole();
    const message = type === 'role' 
      ? `Bạn cần quyền ${required.join(' hoặc ')} để truy cập. Quyền hiện tại: ${userRole}`
      : `Bạn không có quyền thực hiện chức năng này`;

    this.errorService.displayError(message, 'error');

    // Redirect based on user role
    const normalizedRole = userRole?.replace(/^ROLE_/, '') || '';
    if (normalizedRole === 'ADMIN' || normalizedRole === 'NHAN_VIEN') {
      this.router.navigate(['/auth/admin/home']);
    } else {
      this.router.navigate(['/g4/shop']);
    }
  }

  private redirectToLogin(url: string): void {
    if (url.includes('/auth/admin')) {
      this.router.navigate(['/auth/admin/login']);
    } else {
      this.router.navigate(['/g4/login'], { 
        queryParams: { backurl: url } 
      });
    }
  }
}

// Helper functions for route configuration
export const requireRoles = (roles: UserRole[]) => ({ roles });
export const requireAuthorities = (authorities: string[]) => ({ authorities });
export const requireAdmin = () => requireRoles([UserRole.ADMIN]);
export const requireEmployee = () => requireRoles([UserRole.ADMIN, UserRole.NHAN_VIEN]);
export const requireCustomer = () => requireRoles([UserRole.KHACH_HANG]);