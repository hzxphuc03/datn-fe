import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { TokenService, UserInfo } from '../../../services/token.service';
import { LogoutService } from '../../../services/logout.service';
import { UserService, UserProfile } from '../../../services/user.service';

@Component({
  selector: 'app-auth-status',
  templateUrl: './auth-status.component.html',
  styleUrls: ['./auth-status.component.scss']
})
export class AuthStatusComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userInfo: UserInfo | null = null;
  userProfile: UserProfile | null = null;
  showUserMenu = false;
  private destroy$ = new Subject<void>();

  constructor(
    private tokenService: TokenService,
    private logoutService: LogoutService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication status
    this.tokenService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (!isAuth) {
          this.userInfo = null;
          this.userProfile = null;
        }
      });

    // Subscribe to user info changes
    this.tokenService.userInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userInfo => {
        this.userInfo = userInfo;
      });

    // Subscribe to user profile changes
    this.userService.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        this.userProfile = profile;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  goToProfile(): void {
    this.closeUserMenu();
    if (this.isAdminUser()) {
      this.router.navigate(['/auth/admin/profile']);
    } else {
      this.router.navigate(['/g4/profile']);
    }
  }

  goToOrders(): void {
    this.closeUserMenu();
    if (this.isCustomer()) {
      this.router.navigate(['/g4/orders']);
    }
  }

  goToSettings(): void {
    this.closeUserMenu();
    if (this.isAdminUser()) {
      this.router.navigate(['/auth/admin/settings']);
    } else {
      this.router.navigate(['/g4/settings']);
    }
  }

  logout(): void {
    this.closeUserMenu();
    this.logoutService.logoutWithConfirmation().subscribe();
  }

  login(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/auth/admin')) {
      this.router.navigate(['/auth/admin/login']);
    } else {
      this.router.navigate(['/g4/login'], { 
        queryParams: { backurl: currentUrl } 
      });
    }
  }

  register(): void {
    const currentUrl = this.router.url;
    this.router.navigate(['/g4/register'], { 
      queryParams: { backurl: currentUrl } 
    });
  }

  getUserDisplayName(): string {
    if (this.userProfile?.hoTen) {
      return this.userProfile.hoTen;
    }
    if (this.userInfo?.fullName) {
      return this.userInfo.fullName;
    }
    if (this.userInfo?.username) {
      return this.userInfo.username;
    }
    return 'Người dùng';
  }

  getUserAvatar(): string {
    return this.userProfile?.hinhAnh || '/assets/images/default-avatar.png';
  }

  getUserRole(): string {
    const role = this.userInfo?.role || this.userProfile?.role;
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'EMPLOYEE':
        return 'Nhân viên';
      case 'MANAGER':
        return 'Quản lý';
      case 'CUSTOMER':
        return 'Khách hàng';
      default:
        return 'Người dùng';
    }
  }

  isAdminUser(): boolean {
    const role = this.userInfo?.role || this.userProfile?.role;
    return role === 'ADMIN' || role === 'EMPLOYEE' || role === 'MANAGER';
  }

  isCustomer(): boolean {
    const role = this.userInfo?.role || this.userProfile?.role;
    return role === 'CUSTOMER';
  }

  getTimeUntilExpiration(): string {
    const minutes = this.tokenService.getTimeUntilExpiration();
    if (minutes === null) return '';
    
    if (minutes < 60) {
      return `${minutes} phút`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  }

  isTokenExpiringSoon(): boolean {
    const minutes = this.tokenService.getTimeUntilExpiration();
    return minutes !== null && minutes < 30; // Less than 30 minutes
  }
}