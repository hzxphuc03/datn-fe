import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { LoginServiceService, LoginRequest } from '../service/login-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isActive = false;
  isLoading = false;
  showPassword = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private loginService: LoginServiceService,
    private errorService: ErrorTsService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.createLoginForm();
  }

  ngOnInit(): void {
    // Check if already authenticated
    if (this.tokenService.isAuthenticated()) {
      this.router.navigate(['/auth/admin/home']);
      return;
    }

    // Activate animation
    setTimeout(() => {
      this.isActive = true;
    }, 600);
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
        errors.push('Tên đăng nhập là bắt buộc');
      } else if (this.f['username'].errors['minlength']) {
        errors.push('Tên đăng nhập phải có ít nhất 3 ký tự');
      } else if (this.f['username'].errors['maxlength']) {
        errors.push('Tên đăng nhập không được quá 50 ký tự');
      }
    }

    if (this.f['password'].errors) {
      if (this.f['password'].errors['required']) {
        errors.push('Mật khẩu là bắt buộc');
      } else if (this.f['password'].errors['minlength']) {
        errors.push('Mật khẩu phải có ít nhất 6 ký tự');
      } else if (this.f['password'].errors['maxlength']) {
        errors.push('Mật khẩu không được quá 100 ký tự');
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

    this.loginService.loginEmployee(credentials)
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
    if (response.errorCode) {
      this.errorService.displayError(
        response.message || 'Tài khoản hoặc mật khẩu không đúng',
        'error'
      );
      return;
    }

    const token = response.accessToken || response.token;
    if (token) {
      this.tokenService.setToken(token, response.user, response.refreshToken);
      this.errorService.displayError(
        response.message || 'Đăng nhập thành công',
        'success'
      );
      
      // Navigate to admin dashboard
      setTimeout(() => {
        this.router.navigate(['/auth/admin/home']);
      }, 1000);
    } else {
      this.errorService.displayError('Không nhận được token xác thực', 'error');
    }
  }

  private handleLoginError(error: any): void {
    const errorMessage = error.message || 'Có lỗi xảy ra khi đăng nhập';
    this.errorService.displayError(errorMessage, 'error');
    
    // Clear password field on error
    this.loginForm.patchValue({ password: '' });
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
      return fieldName === 'username' ? 'Tên đăng nhập là bắt buộc' : 'Mật khẩu là bắt buộc';
    }
    
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${fieldName === 'username' ? 'Tên đăng nhập' : 'Mật khẩu'} phải có ít nhất ${requiredLength} ký tự`;
    }
    
    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `${fieldName === 'username' ? 'Tên đăng nhập' : 'Mật khẩu'} không được quá ${requiredLength} ký tự`;
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
