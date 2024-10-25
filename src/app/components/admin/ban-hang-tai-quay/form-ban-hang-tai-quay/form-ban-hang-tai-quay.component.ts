import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { KhachHangPopupComponent } from '../khach-hang-popup/khach-hang-popup.component';
import { ThongTinNhanHangComponent } from '../thong-tin-nhan-hang/thong-tin-nhan-hang.component';
import { HoaDonService } from '../../service/hoa-don.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenService } from 'src/app/services/token.service';
import { ChiTietSanPhamBanHangComponent } from '../chi-tiet-san-pham/chi-tiet-san-pham.component';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';
import { VoucherHoaDonComponent } from '../voucher-hoa-don/voucher-hoa-don.component';

interface Item {
  name: string;
  quantity: number;
  height: number;
  weight: number;
  length: number;
  width: number;
}

interface Data {
  service_type_id: number;
  from_district_id: number;
  to_district_id: number;
  to_ward_code: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  items: Item[];
}
@Component({
  selector: 'app-form-ban-hang-tai-quay',
  templateUrl: './form-ban-hang-tai-quay.component.html',
  styleUrls: ['./form-ban-hang-tai-quay.component.scss'],
})
export class FormBanHangTaiQuayComponent implements OnInit {
  data: any = {};
  searchQuery: any = {};
  searchQueryCT: any = {};
  listHoaDonPageNumber: number[] = [];
  listHoaDonCtPageNumber: number[] = [];
  listDataHoaDon: any = [];
  listDataHoaDonCt: any = [];
  thongTinNHanHang: any;
  thongTinVoucher: any;
  constructor(
    private dialog: MatDialog,
    private errorService: ErrorTsService,
    private hoaDonService: HoaDonService,
    private spinner: NgxSpinnerService,
    private tokenService: TokenService,
    private diaChiService: DiaChiServiceService
  ) {}

  ngOnInit(): void {
    this.data.khachHang = {};
    const { decoded } = this.tokenService.getToken();
    if (decoded && decoded?.user.id) {
      this.searchQuery.idNhanVien = decoded?.user.id;
    }
    this.getListHoaDon('rows');
  }
  getKhachHang() {
    const dialogRef = this.dialog.open(KhachHangPopupComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.data.khachHang = result;
        const params = {
          idObject: this.data?.khachHang?.id,
          idHoaDon: this.data.id,
        };
        this.spinner.show();
        const data = await this.hoaDonService
          .addKhachHangToHD(params)
          .toPromise();
        if (data) {
          if (data?.errorCode) {
            this.errorService.displayError(data.messageError, 'error');
            this.spinner.hide();
          } else {
            this.errorService.displayError(
              'Cập nhật khách hàng thành công',
              'normal'
            );
            this.spinner.hide();
          }
        }
      }
    });
  }
  thongTinNhanHang() {
    if (!this.data?.khachHang?.id) {
      this.errorService.displayError(
        'Vui lòng chọn khách hàng trước',
        'normal'
      );
      return;
    }
    const dialogRef = this.dialog.open(ThongTinNhanHangComponent, {
      data: {
        data: this.data,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.getListHoaDon('rows');
        const idHD = this.data.id;
        const data = this.listDataHoaDon.find((item: any) => item.id === idHD);
        if (data) {
          this.detailHoaDon(data);
        }
      }
    });
  }
  async getListHoaDon(type: string, action?: string): Promise<void> {
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
        Number(this.searchQuery.page) + 1 <= this.listHoaDonPageNumber.length
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
    const data = await this.hoaDonService.getAll(this.searchQuery).toPromise();
    if (data) {
      this.getTotalHoaDonPage(data);
      this.listDataHoaDon = data.item;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }

    //   gọi api
  }
  async getListCTHoaDon(type: string, action?: string): Promise<void> {
    // this.spinner.show();
    if (type && type === 'rows') {
      this.searchQueryCT.page = 1;
    }
    if (action) {
      if (action === 'prev' && Number(this.searchQueryCT.page) > 1) {
        this.searchQueryCT.page = Number(this.searchQueryCT.page) - 1;
      }
      if (
        action === 'next' &&
        Number(this.searchQueryCT.page) + 1 <=
          this.listHoaDonCtPageNumber.length
      ) {
        this.searchQueryCT.page = Number(this.searchQueryCT.page) + 1;
      }
    } else {
      this.searchQueryCT.page = this.searchQueryCT.page;
    }
    Object.keys(this.searchQueryCT).forEach((key) => {
      if (this.searchQueryCT[key] === null || this.searchQueryCT[key] === '') {
        delete this.searchQueryCT[key];
      }
    });
    this.spinner.show();
    const data = await this.hoaDonService
      .getAllCt(this.searchQueryCT)
      .toPromise();
    if (data) {
      this.getTotalHoaDonCtPage(data);
      this.listDataHoaDonCt = data.item;
      await this.getShipPrice();
      await this.tinhThongTien();
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }

    //   gọi api
  }
  getTotalHoaDonCtPage(data: any): number {
    let totalPage = 0;
    if (Number(data.totalItem) < Number(data.pageSize)) {
      totalPage = 1;
    } else {
      totalPage = Math.floor(Number(data.totalItem) / Number(data.pageSize));
      if (Number(data.totalItem) % Number(data.pageSize) > 0) {
        totalPage = totalPage + 1;
      }
    }
    this.listHoaDonPageNumber = [];
    for (let i = 1; i <= totalPage; i++) {
      this.listHoaDonCtPageNumber.push(i);
    }
    return totalPage;
  }
  getTotalHoaDonPage(data: any): number {
    let totalPage = 0;
    if (Number(data.totalItem) < Number(data.pageSize)) {
      totalPage = 1;
    } else {
      totalPage = Math.floor(Number(data.totalItem) / Number(data.pageSize));
      if (Number(data.totalItem) % Number(data.pageSize) > 0) {
        totalPage = totalPage + 1;
      }
    }
    this.listHoaDonPageNumber = [];
    for (let i = 1; i <= totalPage; i++) {
      this.listHoaDonPageNumber.push(i);
    }
    return totalPage;
  }
  async addNhanhHoaDon() {
    this.spinner.show();
    const data = await this.hoaDonService
      .ThemNhanhHoaDon(this.searchQuery.idNhanVien)
      .toPromise();
    if (data) {
      this.errorService.displayError('Tạo hóa đơn thành công', 'sucsses');
      this.getListHoaDon('rows');
      this.spinner.hide();
    }
  }
  detailHoaDon(item: any) {
    this.data = {};
    this.data = item;
    this.thongTinNHanHang = `${this.data.tinhThanh}-${this.data.quanHuyen}-${this.data.phuongXa} && ${this.data.phuongThucThanhToan.ten}`;
    console.log('ádasd', this.data);

    if (!this?.data?.khachHang && !this?.data?.khachHang?.id) {
      this.data.khachHang = {};
    }
    if (this.data) {
      this.searchQueryCT = {};
      this.listHoaDonCtPageNumber = [];
      this.listDataHoaDonCt = [];
      this.searchQueryCT.idHoaDon = this.data.id;
      this.getListCTHoaDon('rows');
      //chạy get all chiTietSanPham
    }
  }
  addSanPham() {
    if (!this.data.id) {
      return;
    }
    const dialogRef = this.dialog.open(ChiTietSanPhamBanHangComponent, {
      data: {
        idHoaDon: this.data.id,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getListCTHoaDon('rows');
      }
    });
  }
  async deleteProduct(item: any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        inputTitle: `Bạn có muốn xóa sản phẩm này ?`,
        inputBtn: `Đồng ý xóa`,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const data = await this.hoaDonService
          .deleteSPFromCTSP(item.id)
          .toPromise();
        if (data) {
          if (data?.errorCode) {
            this.errorService.displayError(data.messageError, 'error');
          } else {
            this.errorService.displayError(
              'Xóa sản phẩm thành công',
              'sussces'
            );
            this.getListCTHoaDon('rows');
          }
        }
      }
    });
  }
  async getShipPrice() {
    if (this.listDataHoaDonCt.length <= 0) {
      this.data.phiShip = 0;
      return;
    }
    let data: Data = {
      service_type_id: 2,
      from_district_id: 201,
      height: 0,
      length: 0,
      width: 0,
      to_district_id: Number(this.data.idQuanHuyen),
      to_ward_code: this.data.idPhuongXa + '',
      weight: 0,
      items: [],
    };

    this.listDataHoaDonCt.map((item: any) => {
      data.height += 5;
      data.length += 5;
      data.width += 5;
      data.weight += item?.sanPhamChiTiet?.sanPham?.trongLuong * item?.soLuong;
      data.items.push({
        name: item.id + '',
        quantity: item.soLuong,
        height: 5,
        weight: item?.sanPhamChiTiet?.sanPham?.trongLuong * item?.soLuong,
        length: 5,
        width: 5,
      });
    });
    const api = await this.diaChiService.getOder(data).toPromise();
    if (api) {
      if (api.code === 200) {
        this.data.phiShip = Math.ceil(api.data.total) || 25000;
      } else {
        data.service_type_id = 5;
        const api5 = await this.diaChiService.getOder(data).toPromise();
        if (api5) {
          if (api5.code === 200) {
            this.data.phiShip = Math.ceil(api5.data.total) * 0.1 || 25000;
          } else {
            this.data.phiShip = 35000;
          }
        }
      }
    }
  }
  tinhThongTien() {
    let tongTienHoaDon = 0;
    this.data.tongTienGiam = 0;
    this.listDataHoaDonCt?.map((data: any) => {
      const tongTienItem = data?.soLuong * data?.giaDaGiam;
      tongTienHoaDon += tongTienItem;
    });
    this.data.tongTienSanPhamChuaGiam = tongTienHoaDon;
    if (this.data.phiShip && this.data.giaoHang) {
      this.data.tongTienGiam += this.data.phiShip;
    }
  }
  openVoucher() {
    if (
      (this.listDataHoaDonCt && this.listDataHoaDonCt.length === 0) ||
      this.listDataHoaDonCt === null ||
      this.listDataHoaDonCt === undefined
    ) {
      this.errorService.displayError('Vui lòng chọn trước sản phẩm', 'error');
      return;
    }
    const dialogRef = this.dialog.open(VoucherHoaDonComponent, {
      data: {
        price: this.data?.tongTienSanPhamChuaGiam || 0,
        data: this.data,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.getListHoaDon('rows');
        const idHD = this.data.id;
        const data = this.listDataHoaDon.find((item: any) => item.id === idHD);
        if (data) {
          this.detailHoaDon(data);
        }
      }
    });
  }
  async updateSoLuong(product: any) {
    this.spinner.show();
    const data = await this.hoaDonService
      .updateSoLuong({
        idHoaDonChiTiet: product.id,
        soLuong: product.soLuong,
      })
      .toPromise();
    if (data) {
      if (data?.errorCode) {
        this.errorService.displayError(data.messageError, 'error');
        this.spinner.hide();
      } else {
        this.errorService.displayError('Cập nhật thành công', 'sussces');
        product.isEdit = !product.isEdit;
        this.getListCTHoaDon('rows');
        this.spinner.hide();
      }
    }
  }
}
