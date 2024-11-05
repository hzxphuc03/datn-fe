import { Component, OnInit } from '@angular/core';
import { MuaHangService } from '../../services/mua-hang.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-clinet-card-online',
  templateUrl: './clinet-card-online.component.html',
  styleUrls: ['./clinet-card-online.component.scss'],
})
export class ClinetCardOnlineComponent implements OnInit {
  steps = [1, 2, 3, 4]; // Danh sách các bước
  currentStep = 1; // Bước hiện tại
  listGh: any[] = [];
  constructor(
    private service: MuaHangService,
    private tokenService: TokenService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getGioHang();
  }
  get progressWidth(): number {
    return ((this.currentStep - 1) / (this.steps.length - 1)) * 100;
  }
  next(): void {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
  }

  prev(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  async getGioHang() {
    this.checkToken();
    this.spinner.show();
    const { decoded } = this.tokenService.getToken();
    const data = await this.service
      .getGoHangByIdKH(decoded.user.id)
      .toPromise();
    if (data) {
      this.listGh = data.item;
      // this.listGh = data;
      this.spinner.hide();
    }
  }
  checkToken() {
    const isExpired = this.tokenService.isTokenExpired();
    const { decoded } = this.tokenService.getToken();
    const currentUrl = this.router.url;
    if (decoded) {
      if (isExpired || decoded.role !== 'KhachHang') {
        this.tokenService.removeToken();
        this.router.navigate(['/g4/shop/login'], {
          queryParams: { backurl: currentUrl },
        });
      }
    } else {
      this.router.navigate(['/g4/shop/login'], {
        queryParams: { backurl: currentUrl },
      });
    }
  }
}
