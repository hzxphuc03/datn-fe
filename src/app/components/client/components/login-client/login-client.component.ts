import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

import { LoginServiceService, LoginRequest } from 'src/app/components/admin/service/login-service.service';
import { TokenService } from 'src/app/services/token.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-login-client',
  templateUrl: './login-client.component.html',
  styleUrls: ['./login-client.component.scss'],
})
export class LoginClientComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  backUrl: string | null = null;
  isLoading = false;
  showPassword = false;
  rememberMe = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private loginService: LoginServiceService,
    private errorService: ErrorTsService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.createLoginForm();
  }

  ngOnInit(): void {
    // Check if already authenticated
    if (this.tokenService.isAuthenticated()) {
      this.redirectAfterLogin();
      return;
    }

    // Get return URL from query params
    this.route.queryParams.subscribe((params) => {
      this.backUrl = params['backurl'] || null;
    });

    // Load remembered credentials if any
    this.loadRememberedCredentials();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]]
    });
  }

  private loadRememberedCredentials(): void {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      this.loginForm.patchValue({ username: rememberedUsername });
      this.rememberMe = true;
    }
  }

  private saveCredentials(): void {
    if (this.rememberMe) {
      localStorage.setItem('rememberedUsername', this.loginForm.value.username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  get isFormValid(): boolean {
    return this.loginForm.valid;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      this.showValidationErrors();
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.performLogin();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private showValidationErrors(): void {
    const errors: string[] = [];

    if (this.f['username'].errors) {
      if (this.f['username'].errors['required']) {
        errors.push('Email/Số điện thoại là bắt buộc');
      } else if (this.f['username'].errors['minlength']) {
        errors.push('Email/Số điện thoại phải có ít nhất 3 ký tự');
      }
    }

    if (this.f['password'].errors) {
      if (this.f['password'].errors['required']) {
        errors.push('Mật khẩu là bắt buộc');
      } else if (this.f['password'].errors['minlength']) {
        errors.push('Mật khẩu phải có ít nhất 6 ký tự');
      }
    }

    if (errors.length > 0) {
      this.errorService.displayError(errors.join(', '), 'error');
    }
  }

  private performLogin(): void {
    this.isLoading = true;
    
    const credentials: LoginRequest = {
      username: this.loginForm.value.username.trim(),
      pass: this.loginForm.value.password
    };

    this.loginService.loginCustomer(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleLoginSuccess(response);
        },
        error: (error) => {
          this.handleLoginError(error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  private handleLoginSuccess(response: any): void {
    console.log('🎉 Login response:', response);
    console.log('🎉 Full response structure:', JSON.stringify(response, null, 2));
    
    if (response.errorCode) {
      this.errorService.displayError(
        response.message || 'Email/Số điện thoại hoặc mật khẩu không đúng',
        'error'
      );
      return;
    }

    const token = response.accessToken || response.token;
    if (token) {
      console.log('💾 Saving token...');
      console.log('📦 Response data:', {
        hasAccessToken: !!response.accessToken,
        hasToken: !!response.token,
        hasUser: !!response.user,
        hasRefreshToken: !!response.refreshToken,
        userInfo: response.user,
        userId: response.user?.id,
        userKeys: response.user ? Object.keys(response.user) : []
      });
      
      this.tokenService.setToken(token, response.user, response.refreshToken);
      this.saveCredentials();
      
      // Verify token was saved - wait a bit to ensure localStorage is updated
      setTimeout(() => {
        const savedToken = localStorage.getItem('jwtToken');
        const savedRefreshToken = localStorage.getItem('refreshToken');
        const savedUser = localStorage.getItem('userInfo');
        const userInfo = this.tokenService.getUserInfo();
        
        console.log('✅ Token verification after save:', {
          hasToken: !!savedToken,
          hasRefreshToken: !!savedRefreshToken,
          hasUserInfo: !!savedUser,
          tokenPreview: savedToken ? savedToken.substring(0, 50) + '...' : 'NO TOKEN',
          userInfo,
          userRole: this.tokenService.getUserRole(),
          userId: userInfo?.id,
          isAuthenticated: this.tokenService.isAuthenticated()
        });
        
        // Double-check và retry nếu token chưa được lưu
        if (!savedToken) {
          console.warn('⚠️ Token not saved, retrying...');
          this.tokenService.setToken(token, response.user, response.refreshToken);
          
          // Wait và check lại
          setTimeout(() => {
            const retryToken = localStorage.getItem('jwtToken');
            if (!retryToken) {
              console.error('❌ CRITICAL: Token still not saved after retry!');
              this.errorService.displayError('Lỗi lưu token, vui lòng thử lại', 'error');
              return;
            }
          }, 50);
        }
        
        this.errorService.displayError(
          response.message || 'Đăng nhập thành công',
          'success'
        );
        
        // Navigate after successful login - KHÔNG reload, chỉ navigate
        setTimeout(() => {
          console.log('🔄 Redirecting...');
          const finalToken = localStorage.getItem('jwtToken');
          console.log('🔍 Final token check before redirect:', !!finalToken);
          
          if (finalToken) {
            this.redirectAfterLogin();
            // KHÔNG reload - để components tự khởi tạo lại với token mới
            // window.location.reload() có thể xóa token hoặc gây race condition
          } else {
            console.error('❌ No token before redirect, staying on login page');
            this.errorService.displayError('Lỗi: Token không được lưu. Vui lòng đăng nhập lại.', 'error');
          }
        }, 200);
      }, 100);
    } else {
      console.error('❌ No token in response');
      this.errorService.displayError('Không nhận được token xác thực', 'error');
    }
  }

  private handleLoginError(error: any): void {
    const errorMessage = error.message || 'Có lỗi xảy ra khi đăng nhập';
    this.errorService.displayError(errorMessage, 'error');
    
    // Clear password field on error
    this.loginForm.patchValue({ password: '' });
  }

  private redirectAfterLogin(): void {
    if (this.backUrl) {
      try {
        // Parse URL để tách path và query params
        let urlPath = this.backUrl;
        let queryParams: { [key: string]: string } = {};
        
        // Check if URL contains query params
        if (this.backUrl.includes('?')) {
          const urlParts = this.backUrl.split('?');
          urlPath = urlParts[0];
          
          // Parse query params
          if (urlParts[1]) {
            const params = new URLSearchParams(urlParts[1]);
            params.forEach((value, key) => {
              queryParams[key] = value;
            });
          }
        }
        
        // Navigate với path và query params riêng biệt
        this.router.navigate([urlPath], { queryParams: queryParams }).catch((error) => {
          console.error('Navigation error:', error);
          // Fallback: redirect to shop
          this.router.navigate(['/g4/shop']);
        });
      } catch (error) {
        console.error('Error parsing backUrl:', error);
        this.router.navigate(['/g4/shop']);
      }
    } else {
      this.router.navigate(['/g4/shop']);
    }
  }

  // Navigation methods
  goToRegister(): void {
    // Redirect to backend registration page
    const baseUrl = environment.apiUrl.replace('/api', '');
    window.location.href = `${baseUrl}/dang-ky/lay-ma-opt`;
  }

  goToForgotPassword(): void {
    // Redirect to backend forgot password page
    const baseUrl = environment.apiUrl.replace('/api', '');
    window.location.href = `${baseUrl}/quen-mat-khau/gmail`;
  }

  // Utility methods for template
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.loginForm.get(fieldName);
    if (!field) return false;
    
    if (errorType) {
      return field.hasError(errorType) && (field.dirty || field.touched);
    }
    
    return field.invalid && (field.dirty || field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    
    if (errors['required']) {
      return fieldName === 'username' ? 'Email/Số điện thoại là bắt buộc' : 'Mật khẩu là bắt buộc';
    }
    
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${fieldName === 'username' ? 'Email/Số điện thoại' : 'Mật khẩu'} phải có ít nhất ${requiredLength} ký tự`;
    }
    
    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `${fieldName === 'username' ? 'Email/Số điện thoại' : 'Mật khẩu'} không được quá ${requiredLength} ký tự`;
    }

    return 'Dữ liệu không hợp lệ';
  }

  // Legacy support for existing template
  get username(): string {
    return this.loginForm.get('username')?.value || '';
  }

  set username(value: string) {
    this.loginForm.patchValue({ username: value });
  }

  get password(): string {
    return this.loginForm.get('password')?.value || '';
  }

  set password(value: string) {
    this.loginForm.patchValue({ password: value });
  }
}
