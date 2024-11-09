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

@Component({
  selector: 'app-voucher-khach-hang',
  templateUrl: './voucher-khach-hang.component.html',
  styleUrls: ['./voucher-khach-hang.component.scss']
})
export class VoucherKhachHangComponent implements OnInit {
  searchQuery : any = {};
  listVoucherKhanhHang: any;
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
    this.getAllVoucher();
  }
  async getAllVoucher() {
    this.spinner.show();
    const data = await this.service
      .getVoucherKhachHang(this.searchQuery.idKhachHang)
      .toPromise();
    if (data) {
      data.map((item: any) => {
        const ngayBatDau = new Date(item.ngayBatDau);
        const ngayKetThuc = new Date(item.ngayKetThuc);
        const today = new Date(); // Ngày hôm nay
        const isUse = today >= ngayBatDau && today <= ngayKetThuc;
        item.sale = isUse;
      });
      let newDataGop: { voucherHoaDon: any[]; voucherVanCHuyen: any[] } = {
        voucherHoaDon: [],
        voucherVanCHuyen: [],
      };
      data.map((item: any) => {
        if (item.voucher.theLoai === 0) {
          newDataGop.voucherHoaDon.push(item);
        } else {
          newDataGop.voucherVanCHuyen.push(item);
        }
      });
      this.listVoucherKhanhHang = newDataGop;
      this.spinner.hide();
    }
  }

}
