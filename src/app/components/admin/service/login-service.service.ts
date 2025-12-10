import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface LoginRequest {
  username: string;
  pass: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  token?: string; // For backward compatibility
  errorCode?: string;
  message?: string;
  user?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly EMPLOYEE_LOGIN_URL = `${this.API_BASE_URL}/auth/login/nhan-vien`;
  private readonly CUSTOMER_LOGIN_URL = `${this.API_BASE_URL}/auth/login/khach-hang`;
  private readonly REFRESH_TOKEN_URL = `${this.API_BASE_URL}/auth/refresh-token`;
  private readonly LOGOUT_URL = `${this.API_BASE_URL}/auth/logout`;
  private readonly ME_URL = `${this.API_BASE_URL}/auth/me`;

  constructor(private http: HttpClient) {}

  /**
   * Employee login
   */
  loginEmployee(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.EMPLOYEE_LOGIN_URL, credentials).pipe(
      map((response: any) => {
        // Handle successful response from new backend format
        if (response && (response.accessToken || response.token)) {
          return {
            accessToken: response.accessToken || response.token,
            refreshToken: response.refreshToken,
            tokenType: response.tokenType || 'Bearer',
            token: response.accessToken || response.token, // For backward compatibility
            user: response.user,
            message: response.message || 'Đăng nhập thành công'
          };
        }
        // Handle error response
        return {
          errorCode: response.errorCode || 'LOGIN_FAILED',
          message: response.message || 'Đăng nhập thất bại'
        };
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Customer login
   */
  loginCustomer(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.CUSTOMER_LOGIN_URL, credentials).pipe(
      map((response: any) => {
        // Handle successful response from new backend format
        if (response && (response.accessToken || response.token)) {
          return {
            accessToken: response.accessToken || response.token,
            refreshToken: response.refreshToken,
            tokenType: response.tokenType || 'Bearer',
            token: response.accessToken || response.token, // For backward compatibility
            user: response.user,
            message: response.message || 'Đăng nhập thành công'
          };
        }
        // Handle error response
        return {
          errorCode: response.errorCode || 'LOGIN_FAILED',
          message: response.message || 'Đăng nhập thất bại'
        };
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.REFRESH_TOKEN_URL, { refreshToken }).pipe(
      map((response: any) => {
        if (response && (response.accessToken || response.token)) {
          return {
            accessToken: response.accessToken || response.token,
            refreshToken: response.refreshToken,
            tokenType: response.tokenType || 'Bearer',
            token: response.accessToken || response.token,
            user: response.user,
            message: response.message || 'Token refreshed successfully'
          };
        }
        return {
          errorCode: response.errorCode || 'REFRESH_FAILED',
          message: response.message || 'Refresh token failed'
        };
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Legacy method for backward compatibility
   */
  login(params: any): Observable<any> {
    return this.loginEmployee(params);
  }

  /**
   * Legacy method for backward compatibility
   */
  loginKH(params: any): Observable<any> {
    return this.loginCustomer(params);
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    return this.http.post<any>(this.LOGOUT_URL, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get current authenticated user info
   */
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(this.ME_URL).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<LoginResponse> {
    let errorMessage = 'Có lỗi xảy ra khi đăng nhập';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Lỗi: ${error.error.message}`;
      errorCode = 'CLIENT_ERROR';
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Thông tin đăng nhập không hợp lệ';
          errorCode = 'INVALID_CREDENTIALS';
          break;
        case 401:
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = 'Tài khoản hoặc mật khẩu không đúng';
          }
          errorCode = 'UNAUTHORIZED';
          break;
        case 403:
          errorMessage = 'Tài khoản bị khóa hoặc không có quyền truy cập';
          errorCode = 'FORBIDDEN';
          break;
        case 404:
          errorMessage = 'Không tìm thấy dịch vụ đăng nhập';
          errorCode = 'SERVICE_NOT_FOUND';
          break;
        case 500:
          errorMessage = 'Lỗi máy chủ, vui lòng thử lại sau';
          errorCode = 'SERVER_ERROR';
          break;
        default:
          errorMessage = error.error?.message || 'Đăng nhập thất bại';
          errorCode = error.error?.errorCode || 'LOGIN_FAILED';
      }
    }

    return throwError(() => ({
      errorCode,
      message: errorMessage
    }));
  }
}
