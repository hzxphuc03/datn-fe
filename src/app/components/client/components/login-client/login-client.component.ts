import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginServiceService } from 'src/app/components/admin/service/login-service.service';
import { TokenService } from 'src/app/services/token.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-login-client',
  templateUrl: './login-client.component.html',
  styleUrls: ['./login-client.component.scss'],
})
export class LoginClientComponent implements OnInit {
  username: string = '';
  password: string = '';
  backUrl: string | null = null;
  constructor(
    private loginService: LoginServiceService,
    private errorService: ErrorTsService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.backUrl = params['backurl'] || null;
    });
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
      .loginKH({
        username: this.username,
        pass: this.password,
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
            if (this.backUrl !== null) {
              this.router.navigate([this.backUrl]);
            } else {
              this.router.navigate(['/g4/shop']);
            }
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
