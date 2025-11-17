import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { TokenService } from './token.service';
import { ErrorTsService } from '../shareds/message/error.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private errorService: ErrorTsService
  ) {}

  /**
   * Logout user and redirect to appropriate login page
   */
  logout(showMessage: boolean = true, redirectPath?: string): Observable<boolean> {
    try {
      // Get user role before clearing token
      const userRole = this.tokenService.getUserRole();
      
      // Clear authentication data
      this.tokenService.logout();
      
      // Show logout message if requested
      if (showMessage) {
        this.errorService.displayError('Đăng xuất thành công', 'success');
      }
      
      // Redirect to appropriate login page
      this.redirectAfterLogout(userRole, redirectPath);
      
      return of(true);
    } catch (error) {
      console.error('Error during logout:', error);
      this.errorService.displayError('Có lỗi xảy ra khi đăng xuất', 'error');
      return of(false);
    }
  }

  /**
   * Force logout (for expired tokens, security issues, etc.)
   */
  forceLogout(reason?: string): void {
    const message = reason || 'Phiên đăng nhập đã hết hạn';
    this.logout(false).subscribe(() => {
      this.errorService.displayError(message, 'warning');
    });
  }

  /**
   * Logout with confirmation dialog
   */
  logoutWithConfirmation(): Observable<boolean> {
    return new Observable(observer => {
      const confirmed = confirm('Bạn có chắc chắn muốn đăng xuất?');
      if (confirmed) {
        this.logout().subscribe(result => {
          observer.next(result);
          observer.complete();
        });
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }

  /**
   * Check if user should be logged out due to inactivity
   */
  checkInactivityLogout(): void {
    if (this.tokenService.isTokenExpired()) {
      this.forceLogout('Phiên đăng nhập đã hết hạn do không hoạt động');
    }
  }

  /**
   * Redirect user to appropriate page after logout
   */
  private redirectAfterLogout(userRole: string | null, customPath?: string): void {
    if (customPath) {
      this.router.navigate([customPath]);
      return;
    }

    // Default redirect based on user role
    if (userRole === 'ADMIN' || userRole === 'EMPLOYEE' || userRole === 'MANAGER') {
      this.router.navigate(['/auth/admin/login']);
    } else {
      this.router.navigate(['/g4/login']);
    }
  }

  /**
   * Clear all user data and storage
   */
  clearAllUserData(): void {
    // Clear authentication data
    this.tokenService.logout();
    
    // Clear other user-specific data from localStorage
    const keysToRemove = [
      'rememberedUsername',
      'userPreferences',
      'cartData',
      'recentSearches'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
  }
}