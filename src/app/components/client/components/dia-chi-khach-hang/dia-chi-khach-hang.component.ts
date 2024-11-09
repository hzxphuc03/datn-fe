import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { KhachHangServiceService } from 'src/app/components/admin/service/khach-hang-service.service';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { TokenService } from 'src/app/services/token.service';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { MuaHangService } from '../../services/mua-hang.service';
import { AddDiaChiComponent } from '../add-dia-chi/add-dia-chi.component';

@Component({
  selector: 'app-dia-chi-khach-hang',
  templateUrl: './dia-chi-khach-hang.component.html',
  styleUrls: ['./dia-chi-khach-hang.component.scss']
})
export class DiaChiKhachHangComponent implements OnInit {
  steps = [1, 2, 3]; // Danh sách các bước
  currentStep = 1; // Bước hiện tại
  listGh: any[] = [];
  isSomeThingCheck: boolean = false;
  //
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData: any;
  //  tinh thanh
  data: any = {};
  //
  listTinhThanh: any[] = [];
  //
  listQuanHuyen: any[] = [];
  //
  listQuanXa: any[] = [];
  //
  ghiChu: any;
  //
  visible: boolean = false;
  visibleVoucher: boolean = false;
  visibleThanhToan : boolean = false;
  optionPhuongThucThanhToan = [
    { id: 2, title: 'Online' },
    { id: 3, title: 'Thanh toán sau khi nhận hàng' },
  ];
  productList: { sanPham: any; chiTietSanPham: any[]; isShow: boolean }[] = [];
  //
  listVoucherKhanhHang: any;
  voucherHoaDon: any = {};
  voucherVanChuyen: any = {};
  constructor(
    private service: MuaHangService,
    private tokenService: TokenService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private serviceLocation: DiaChiServiceService,
    private serviceDiaChi: KhachHangServiceService,
    private dialog: MatDialog,
    private errorService: ErrorTsService,
    private broadcastService: BroadcastService
  ) { }

  ngOnInit(): void {
    const { decoded } = this.tokenService.getToken();
    if (!decoded) {
      this.router.navigate(['/g4/shop/login']);
    }
    this.searchQuery.idKhachHang = decoded.user.id;
    this.getAllDiaChi('rows');
  }
  addLocation() {
    const dialogRef = this.dialog.open(AddDiaChiComponent, {
      data: {
        data: {
          khachHang: {
            id: this.searchQuery.idKhachHang,
          },
        },
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.visible = true;
      if (result) {
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
    const data = await this.serviceDiaChi
      .getDiaChiByKH(this.searchQuery)
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

}
