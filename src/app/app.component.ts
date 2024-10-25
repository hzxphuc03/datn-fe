import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorTsService } from './shareds/message/error.service';
import { Subscription } from 'rxjs';
import { TokenService } from './services/token.service';
import { NavigationEnd, Router } from '@angular/router';
import { AutoServiceService } from './shareds/auto-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  errorMessage: any | null = null; // Đảm bảo kiểu dữ liệu cho phép null
  private errorSubscription?: Subscription;

  title = 'datn_fe';
  constructor(
    private errorService: ErrorTsService,
    private tokenService: TokenService,
    private router: Router,
    private autoVoucher: AutoServiceService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isExpired = this.tokenService.isTokenExpired();
        const { decoded } = this.tokenService.getToken();
        if (decoded) {
          if (isExpired) {
            this.errorService.displayError(
              'hết thời gian đăng nhập, vui lòng đăng nhập lại',
              'normal'
            );
            this.tokenService.removeToken();
            this.router.navigate(['/auth/shop/login']);
          }
        } else {
          this.router.navigate(['/auth/shop/login']);
        }
      }
    });
    this.errorSubscription = this.errorService
      .getErrorObservable()
      .subscribe((message) => {
        this.errorMessage = message;
      });
    this.auto();
  }
  async auto() {
    const voucherAuto = await this.autoVoucher.autoVoucher().toPromise();
  }

  ngOnDestroy(): void {
    this.errorSubscription?.unsubscribe();
  }
}
