import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service
    const { token } = this.tokenService.getToken();
    
    // Skip token attachment for login endpoints
    const isLoginRequest = request.url.includes('/auth/') && 
                          (request.url.includes('login') || request.url.includes('register'));
    
    // Clone the request and add the authorization header if token exists
    if (token && !isLoginRequest && !this.tokenService.isTokenExpired()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    // Handle the request and catch any authentication errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          this.tokenService.removeToken();
          
          // Redirect to appropriate login page based on current route
          const currentUrl = this.router.url;
          if (currentUrl.includes('/auth/admin')) {
            this.router.navigate(['/auth/admin/login']);
          } else if (currentUrl.includes('/g4')) {
            this.router.navigate(['/g4/login'], { 
              queryParams: { backurl: currentUrl } 
            });
          } else {
            // Default redirect
            this.router.navigate(['/g4/login']);
          }
        }
        
        return throwError(() => error);
      })
    );
  }
}
