import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isActive = false;
  constructor(
    private loginService: LoginServiceService,
    private errorService: ErrorTsService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isActive = true;
    }, 600); // Kích hoạt sau 1 giây
  }

  async onSubmit() {
    if (!this.username && !this.password) {
      this.errorService.displayError(
        'Vui lòng điền đủ thông tin đăng nhập',
        'error'
      );
      return;
    }
    this.loginService
      .login({
        username: this.username,
        pass: this.password,
        role: null,
      })
      .subscribe(
        (response) => {
          if (response.errorCode) {
            // Xử lý lỗi đăng nhập
            this.errorService.displayError(
              'Tài khoản hoặc mật khẩu bị sai ,vui lòng kiểm tra lại',
              'error'
            );
            // Hiển thị thông báo lỗi cho người dùng nếu cần
          } else {
            if (response.token) {
              this.tokenService.setToken(response.token);
            }
            const isExpired = this.tokenService.isTokenExpired();
            // Xử lý đăng nhập thành công
            this.errorService.displayError('Đăng nhập thành công', 'success');
            this.router.navigate(['/auth/admin/home']);
          }
        },
        (err) => {
          // Xử lý lỗi nếu có lỗi không mong muốn xảy ra
          this.errorService.displayError(
            'Tài khoản hoặc mật khẩu bị sai ,vui lòng kiểm tra lại',
            'error'
          );
        }
      );
  }
}
