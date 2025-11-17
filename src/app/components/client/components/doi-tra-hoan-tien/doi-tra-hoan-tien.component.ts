import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaoPhieuDoiTraComponent } from '../tao-phieu-doi-tra/tao-phieu-doi-tra.component';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { KhachHangServiceService } from 'src/app/components/admin/service/khach-hang-service.service';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { TokenService } from 'src/app/services/token.service';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { MuaHangService } from '../../services/mua-hang.service';
import { HomeServoceService } from '../../services/home-service.service';

@Component({
  selector: 'app-doi-tra-hoan-tien',
  templateUrl: './doi-tra-hoan-tien.component.html',
  styleUrls: ['./doi-tra-hoan-tien.component.scss'],
})
export class DoiTraHoanTienComponent implements OnInit {
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData: any;
  constructor(
    private dialog: MatDialog,
    private service: HomeServoceService,
    private tokenService: TokenService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private serviceLocation: DiaChiServiceService,
    private serviceDiaChi: KhachHangServiceService,
    private errorService: ErrorTsService,
    private broadcastService: BroadcastService
  ) {}

  ngOnInit(): void {
    const isExpired = this.tokenService.isTokenExpired();
    const { decoded } = this.tokenService.getToken();
    const a = this.tokenService.getToken();
    if (a.decoded === null) {
      this.router.navigate(['/g4/shop/login']);
    }
    if (a.decoded?.role !== 'KHACH_HANG') {
      this.tokenService.removeToken();
      this.router.navigate(['/g4/shop/login']);
      return;
    }
    if (decoded) {
      if (isExpired) {
        this.errorService.displayError(
          'hết thời gian đăng nhập, vui lòng đăng nhập lại',
          'normal'
        );
        this.tokenService.removeToken();
        this.router.navigate(['/g4/shop/login']);
      }
    } else {
      this.router.navigate(['/g4/shop/login']);
    }
    this.searchQuery.idKhachHang = decoded?.["user"].id;
    this.getAllDiaChi('rows');
  }
  openTapMoi() {
    const dialogRef = this.dialog.open(TaoPhieuDoiTraComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // load lại trang
        this.getAllDiaChi('rows');
      }
    });
  }
  async getAllDiaChi(type: string, action?: string): Promise<void> {
    // this.spinner.show();
    if (type && type === 'rows') {
      this.searchQuery.page = 1;
    }
    if (action) {
      if (action === 'prev' && Number(this.searchQuery.page) > 1) {
        this.searchQuery.page = Number(this.searchQuery.page) - 1;
      }
      if (
        action === 'next' &&
        Number(this.searchQuery.page) + 1 <= this.listPageNumber.length
      ) {
        this.searchQuery.page = Number(this.searchQuery.page) + 1;
      }
    } else {
      this.searchQuery.page = this.searchQuery.page;
    }
    Object.keys(this.searchQuery).forEach((key) => {
      if (this.searchQuery[key] === null || this.searchQuery[key] === '') {
        delete this.searchQuery[key];
      }
    });
    this.spinner.show();
    const data = await this.service
      .getPhieuDoiTraByKH(this.searchQuery)
      .toPromise();
    if (data) {
      this.getTotalPage(data);
      this.listData = data.item;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }

    //   gọi api
  }
  getTotalPage(data: any): number {
    let totalPage = 0;
    if (Number(data.totalItem) < Number(data.pageSize)) {
      totalPage = 1;
    } else {
      totalPage = Math.floor(Number(data.totalItem) / Number(data.pageSize));
      if (Number(data.totalItem) % Number(data.pageSize) > 0) {
        totalPage = totalPage + 1;
      }
    }
    this.listPageNumber = [];
    for (let i = 1; i <= totalPage; i++) {
      this.listPageNumber.push(i);
    }
    return totalPage;
  }
  goToChiTiet(item: any) {
    const queryParams = {
      activeItem: 9,
      idphieu: item.id,
    };
    this.router.navigate(['/g4/shop/khach-hang'], { queryParams });
  }
}
