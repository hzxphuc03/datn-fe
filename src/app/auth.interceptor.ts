import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './services/token.service';
import { LoginServiceService } from './components/admin/service/login-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private tokenService: TokenService | null = null;
  private router: Router | null = null;
  private loginService: LoginServiceService | null = null;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private injector: Injector) {}

  private getTokenService(): TokenService {
    if (!this.tokenService) {
      this.tokenService = this.injector.get(TokenService);
    }
    return this.tokenService;
  }

  private getRouter(): Router {
    if (!this.router) {
      this.router = this.injector.get(Router);
    }
    return this.router;
  }

  private getLoginService(): LoginServiceService {
    if (!this.loginService) {
      this.loginService = this.injector.get(LoginServiceService);
    }
    return this.loginService;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Bỏ qua interceptor cho auth endpoints
    if (this.isAuthEndpoint(request.url)) {
      return next.handle(request);
    }

    try {
      const tokenService = this.getTokenService();
      
      // FORCE: Lấy token trực tiếp từ localStorage
      let token = localStorage.getItem('jwtToken');
      
      // Fallback: thử các key khác
      if (!token) {
        token = localStorage.getItem('token') || 
                localStorage.getItem('accessToken') ||
                localStorage.getItem('auth_token');
        if (token) {
          console.warn('⚠️ Using fallback token key, updating to jwtToken');
          localStorage.setItem('jwtToken', token);
        }
      }
      
      // CRITICAL: Log chi tiết để debug
      const userInfo = tokenService.getUserInfo();
      console.log('🔍 Interceptor Check:', {
        url: request.url,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? token.substring(0, 30) + '...' : 'NO TOKEN',
        userId: userInfo?.id,
        userRole: userInfo?.role,
        isAuthenticated: tokenService.isAuthenticated(),
        isExpired: token ? tokenService.isTokenExpired() : null,
        allKeys: Object.keys(localStorage).filter(k => k.includes('token') || k.includes('Token') || k.includes('user'))
      });
      
      // FORCE ATTACH: Nếu có token, LUÔN attach vào request
      if (token && token.length > 0) {
        const isExpired = tokenService.isTokenExpired();
        
        if (!isExpired) {
          // Token còn hiệu lực - ATTACH NGAY
          request = this.addTokenHeader(request, token);
          console.log('✅ Token ATTACHED to request:', request.url);
        } else {
          console.warn('⏰ Token expired, attempting refresh');
          return this.handleTokenExpired(request, next);
        }
      } else {
        console.error('❌ NO TOKEN FOUND - Request will fail with 401:', {
          url: request.url,
          localStorage: Object.keys(localStorage)
        });
      }

      // Handle the request and catch any authentication errors
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          // Log chi tiết lỗi 401
          if (error.status === 401) {
            // Lấy lại token để kiểm tra (có thể đã thay đổi)
            const currentToken = localStorage.getItem('jwtToken');
            const userInfo = tokenService.getUserInfo();
            
            console.error('🔴 401 Unauthorized:', {
              url: error.url,
              status: error.status,
              statusText: error.statusText,
              hasToken: !!currentToken,
              isExpired: currentToken ? tokenService.isTokenExpired() : null,
              userRole: tokenService.getUserRole(),
              userId: userInfo?.id,
              localStorage: {
                jwtToken: !!localStorage.getItem('jwtToken'),
                userInfo: !!localStorage.getItem('userInfo'),
                refreshToken: !!localStorage.getItem('refreshToken')
              }
            });
            
            // Xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
            if (!this.isAuthEndpoint(request.url)) {
              return this.handle401Error(request, next);
            }
          }
          
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Error in interceptor:', error);
      return next.handle(request);
    }
  }

  private addTokenHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokenService = this.getTokenService();
    const refreshToken = tokenService.getRefreshToken();

    // Nếu không có refresh token hoặc refresh token đã hết hạn, redirect to login
    if (!refreshToken || tokenService.isRefreshTokenExpired()) {
      return this.logoutAndRedirect();
    }

    // Nếu đang refresh token, đợi kết quả
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => {
          const newToken = tokenService.getRawToken();
          if (newToken) {
            return next.handle(this.addTokenHeader(request, newToken));
          }
          return this.logoutAndRedirect();
        }),
        catchError(() => this.logoutAndRedirect())
      );
    }

    // Bắt đầu refresh token
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const loginService = this.getLoginService();
    
    return loginService.refreshToken(refreshToken).pipe(
      switchMap((response: any) => {
        this.isRefreshing = false;
        
        // Kiểm tra nếu response có lỗi
        if (response.errorCode) {
          this.refreshTokenSubject.next(null);
          return this.logoutAndRedirect();
        }
        
        const newAccessToken = response.accessToken || response.token;
        if (newAccessToken) {
          tokenService.setToken(newAccessToken, response.user, response.refreshToken);
          this.refreshTokenSubject.next(newAccessToken);
          return next.handle(this.addTokenHeader(request, newAccessToken));
        }
        
        this.refreshTokenSubject.next(null);
        return this.logoutAndRedirect();
      }),
      catchError((err) => {
        console.error('Error refreshing token:', err);
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        return this.logoutAndRedirect();
      })
    );
  }

  private handleTokenExpired(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.handle401Error(request, next);
  }

  private logoutAndRedirect(): Observable<never> {
    const tokenService = this.getTokenService();
    const router = this.getRouter();
    
    // Clear all tokens
    tokenService.logout();
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refreshToken');
    
    const currentUrl = router.url;
    
    // Chỉ redirect nếu không đang ở trang login
    if (!currentUrl.includes('/login')) {
      console.log('🔄 Redirecting to login...');
      
      // Xác định login path dựa vào route hiện tại
      let loginPath = '/g4/shop/login';
      if (currentUrl.includes('/auth/admin')) {
        loginPath = '/auth/admin/login';
      }
      
      // Redirect với fallback
      router.navigate([loginPath]).catch(() => {
        window.location.href = loginPath;
      });
    }
    
    return throwError(() => new Error('Authentication failed'));
  }

  /**
   * Kiểm tra có phải auth endpoint không
   */
  private isAuthEndpoint(url: string): boolean {
    return url.includes('/api/auth/login/') || 
           url.includes('/api/auth/register') ||
           url.includes('/auth/login') || 
           url.includes('/auth/register');
  }
}
