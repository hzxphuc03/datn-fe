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
import { FormThanhToanComponent } from '../form-thanh-toan/form-thanh-toan.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ThanhCongOrThatBaiThanhToanComponent } from '../thanh-cong-or-that-bai-thanh-toan/thanh-cong-or-that-bai-thanh-toan.component';

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
  voucherGiamGiaHoaDon: any = {};
  voucherGiamGiaVanChuyen: any = {};
  tongTien: number = 0;
  dialogVoucher: any;
  // vnpay
  vnpOrderInfo: string | null = null;
  transactionStatus: boolean | null = null;
  constructor(
    private dialog: MatDialog,
    private errorService: ErrorTsService,
    private hoaDonService: HoaDonService,
    private spinner: NgxSpinnerService,
    private tokenService: TokenService,
    private diaChiService: DiaChiServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    //
    // const dialogRef = this.dialog.open(ThanhCongOrThatBaiThanhToanComponent, {
    //   data: {
    //     vnpOrderInfo: 2,
    //     responseCode: '00',
    //     transactionStatus: '0',
    //     status: true,
    //   },
    //   disableClose: true,
    // });
    //
    this.route.queryParams.subscribe(async (params) => {
      this.vnpOrderInfo = params['vnp_OrderInfo'];
      const responseCode = params['vnp_ResponseCode'];
      const transactionStatus = params['vnp_TransactionStatus'];

      // Xác định trạng thái giao dịch
      if (responseCode === '00' && transactionStatus === '00') {
        this.transactionStatus = true; // Giao dịch thành công
      } else {
        this.transactionStatus = false; // Giao dịch thất bại
      }
      if (this.transactionStatus !== null && this.vnpOrderInfo) {
        if (this.transactionStatus) {
          const data = await this.hoaDonService.updateAfterOnlinePayment(this.vnpOrderInfo).toPromise();
          if(data){
            const dialogRef = this.dialog.open(
              ThanhCongOrThatBaiThanhToanComponent,
              {
                data: {
                  vnpOrderInfo: this.vnpOrderInfo,
                  responseCode: responseCode,
                  transactionStatus: transactionStatus,
                  status: this.transactionStatus,
                },
                disableClose: true,
              }
            );
            dialogRef.afterClosed().subscribe(async (result) => {
              if (result) {
                this.router.navigate(['/auth/admin/ban-hang-tai-quay']);
              }
            });
          }

        }
      }
    });
    this.data.khachHang = {};
    const { decoded } = this.tokenService.getToken();
    if (decoded && decoded?.user.id) {
      this.searchQuery.idNhanVien = decoded?.user.id;
    }
    this.getListHoaDon('rows');
  }
  async updateStatusHoaDon() {
    this.spinner.show();
    const data = await this.hoaDonService
      .updateAfterOnlinePayment(this.vnpOrderInfo)
      .toPromise();
    if (data) {
      if (data?.errorCode) {
        this.errorService.displayError(data.messageError, 'error');
        this.spinner.hide();
      } else {
        this.errorService.displayError('Thanh toán thành công', 'sussces');
        this.spinner.hide();
      }
    }
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
      await this.checkVoucher();
      await this.checkTongTienGiam();
      await this.checkTongTien();
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }

    //   gọi api
  }
  checkVoucher() {
    this.voucherGiamGiaHoaDon = {};
    this.voucherGiamGiaVanChuyen = {};
    if (
      (this.listDataHoaDonCt && this.listDataHoaDonCt.length === 0) ||
      this.listDataHoaDonCt === null ||
      this.listDataHoaDonCt === undefined
    ) {
      this.voucherGiamGiaHoaDon = {};
      this.voucherGiamGiaVanChuyen = {};
      this.errorService.displayError('Vui lòng chọn trước sản phẩm', 'error');
      return;
    }
    let errorVoucherHoaDon = '';
    if (this.data.vouchers.length > 0) {
      const today = new Date();
      this.thongTinVoucher = this.data.vouchers
        .map((item: any) => {
          const startDateHoaDonVoucher = new Date(item.ngayBatDau);
          const endDateHoaDonVoucher = new Date(item.ngayKetThuc);
          // Sử dụng điều kiện trong hàm map
          if (
            this.data.tongTienSanPhamChuaGiam >= item.giaTriGiamToiThieu &&
            today >= startDateHoaDonVoucher &&
            today <= endDateHoaDonVoucher
          ) {
            return item.ten + ' - ' + item.phanTramGiam + '%';
          } else {
            item.isVoucherfalse = true;
            errorVoucherHoaDon = `Voucher ${item.ma} đang không thỏa mãn điều kiện của hóa đơn`;
            // Log item không thỏa mãn
            return null; // Trả về null nếu không thỏa mãn
          }
        })
        .filter((item: any) => item !== null) // Lọc bỏ các giá trị null
        .join(', '); // Kết hợp các giá trị thành chuỗi
    } else {
      this.thongTinVoucher = 'Vui lòng chọn voucher'; // Hoặc giá trị mặc định khác nếu không có voucher
    }
    if (errorVoucherHoaDon !== '') {
      this.errorService.displayError(
        'có Voucher đang không thỏa mãn điều kiện hóa đơn vui lòng check lại',
        'error'
      );
      this.thongTinVoucher = 'Cập nhật lại voucher';
      this.openVoucher();
    }
    if (this.data.vouchers.length > 0) {
      this.data.vouchers.map((item: any) => {
        if (item.theLoai === 0) {
          this.voucherGiamGiaHoaDon = item;
        }
        if (item.theLoai === 1) {
          this.voucherGiamGiaVanChuyen = item;
        }
      });
    }
    // kiem tra xem gia hien sau khi giam vuot qua giamToiDa hay khoong neu khong dung luon
    // check neu no voucher hao don
    if (this.data.vouchers.length > 0) {
      const today = new Date();
      const startDateHoaDonVoucher = new Date(
        this.voucherGiamGiaHoaDon.ngayBatDau
      );
      const endDateHoaDonVoucher = new Date(
        this.voucherGiamGiaHoaDon.ngayKetThuc
      );
      const startDateVanChuyenVoucher = new Date(
        this.voucherGiamGiaVanChuyen.ngayBatDau
      );
      const endDateVanChuyenVoucher = new Date(
        this.voucherGiamGiaVanChuyen.ngayKetThuc
      );
      if (
        this.voucherGiamGiaHoaDon.soLuong === 0 ||
        this.voucherGiamGiaVanChuyen.soLuong === 0
      ) {
        this.voucherGiamGiaHoaDon.giam = 'lỗi voucher';
        this.errorService.displayError(
          'có Voucher đang không thỏa mãn điều kiện hóa đơn vui lòng check lại',
          'error'
        );
        this.openVoucher();
      }
      // nêu voucher có tồn tại
      if (this.voucherGiamGiaHoaDon.id) {
        const giamToiDa = this.voucherGiamGiaHoaDon.giamToiDa; //2000
        const tienSauKhiGiam =
          (this.data.tongTienSanPhamChuaGiam *
            this.voucherGiamGiaHoaDon.phanTramGiam) /
          100; // 1000
        if (
          this.data.tongTienSanPhamChuaGiam >=
          this.voucherGiamGiaHoaDon.giaTriGiamToiThieu
        ) {
          if (tienSauKhiGiam > giamToiDa) {
            this.voucherGiamGiaHoaDon.giam = giamToiDa;
          } else {
            this.voucherGiamGiaHoaDon.giam = tienSauKhiGiam;
          }
        } else {
          this.voucherGiamGiaHoaDon.giam = 'lỗi voucher';
        }
      }
      if (this.voucherGiamGiaHoaDon.id) {
        if (today >= startDateHoaDonVoucher && today <= endDateHoaDonVoucher) {
        } else {
          this.voucherGiamGiaHoaDon.giam = 'lỗi voucher';
          this.openVoucher();
        }
      }

      if (this.voucherGiamGiaVanChuyen.id && this.data.giaoHang) {
        if (this.voucherGiamGiaVanChuyen.id) {
          const giamToiDa = this.data.phiShip; // tiền ship hiện tại
          const tienSauKhiGiam =
            (giamToiDa * this.voucherGiamGiaVanChuyen.phanTramGiam) / 100; // 1000
          if (
            this.data.tongTienSanPhamChuaGiam >=
            this.voucherGiamGiaVanChuyen.giaTriGiamToiThieu
          ) {
            if (tienSauKhiGiam > giamToiDa) {
              this.voucherGiamGiaVanChuyen.giam = giamToiDa;
            } else {
              this.voucherGiamGiaVanChuyen.giam = tienSauKhiGiam;
            }
          } else {
            this.voucherGiamGiaVanChuyen.giam = 'lỗi voucher';
          }
        }
      } else {
        // this.voucherGiamGiaVanChuyen.giam = 'Không áp dụng';
      }
      if (this.voucherGiamGiaVanChuyen.id) {
        if (
          today >= startDateVanChuyenVoucher &&
          today <= endDateVanChuyenVoucher
        ) {
        } else {
          this.voucherGiamGiaVanChuyen.giam = 'lỗi voucher';
          this.openVoucher();
        }
      }
      if (!this.data.giaoHang) {
        this.data.vouchers.map((item: any) => {
          if (item.theLoai === 1) {
            this.errorService.displayError(
              'Vui lòng loại bỏ voucher vận chuyển khi không vận chuyển',
              'error'
            );
            this.openVoucher();
            return;
          }
        });
      }
    }
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
    if (
      this.data.khachHang &&
      this.data.khachHang.id &&
      this.data.tinhThanh &&
      this.data.quanHuyen &&
      this.data.phuongXa
    ) {
      this.thongTinNHanHang = `${this.data.tinhThanh}-${this.data.quanHuyen}-${this.data.phuongXa} && ${this.data.phuongThucThanhToan.ten}`;
    } else {
      this.thongTinNHanHang = 'Vui lòng cập nhật thông tin';
    }
    // thongTinVoucher
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
            await this.getListHoaDon('rows');
            const idHD = this.data.id;
            const data = this.listDataHoaDon.find(
              (item: any) => item.id === idHD
            );
            if (data) {
              this.detailHoaDon(data);
            }
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
  }
  checkTongTienGiam() {
    if (this.data.vouchers.length > 0) {
      this.data.vouchers.map((item: any) => {
        if (item.isVoucherfalse !== true) {
          if (item.theLoai === 0) {
            this.data.tongTienGiam += this.voucherGiamGiaHoaDon.giam;
          }
          if (item.theLoai === 1 && this.data.giaoHang) {
            this.data.tongTienGiam += this.voucherGiamGiaVanChuyen.giam;
          }
        }
      });
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
    if (this.dialogVoucher) {
      this.dialogVoucher.close();
    }
    this.dialogVoucher = this.dialog.open(VoucherHoaDonComponent, {
      data: {
        price: this.data?.tongTienSanPhamChuaGiam || 0,
        data: this.data,
      },
      disableClose: true,
    });
    this.dialogVoucher.afterClosed().subscribe(async (result: any) => {
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
  checkTongTien() {
    this.tongTien = 0;

    if (this.data.tongTienSanPhamChuaGiam > 0) {
      this.tongTien = this.tongTien + this.data.tongTienSanPhamChuaGiam;
    }
    if (this.data.tongTienGiam > 0) {
      this.tongTien = this.tongTien - this.data.tongTienGiam;
    }
    if (this.data.giaoHang && this.data.phiShip > 0) {
      this.tongTien = this.tongTien + this.data.phiShip;
    }
  }
  submit() {
    // check xem có đang bị thiếu hay lỗi gì không
    // check giỏ hàng có sp không
    let isFalse = false;
    if (
      (this.listDataHoaDonCt && this.listDataHoaDonCt.length === 0) ||
      this.listDataHoaDonCt === null ||
      this.listDataHoaDonCt === undefined
    ) {
      this.errorService.displayError(
        'Sản phẩm đang không có trong hóa đơn vui lòng kiểm tra lại',
        'normal'
      );
      isFalse = true;
      return;
    }
    // khách hàng
    if (!this.data?.khachHang?.id) {
      this.errorService.displayError('Chưa chọn khách hàng', 'normal');
      isFalse = true;
      return;
    }
    if (this.data.giaoHang) {
      if (
        !this.data?.idPhuongXa ||
        !this.data?.idQuanHuyen ||
        !this.data?.idTinhThanh
      ) {
        this.errorService.displayError('Vui lòng cập nhật địa chỉ', 'normal');
        isFalse = true;
        return;
      }
    }
    if (!this.data?.tenNguoiNhan || !this.data?.sdtNguoiNhan) {
      this.errorService.displayError(
        'Cập nhật thông tin người nhận hàng',
        'normal'
      );
      isFalse = true;
      return;
    }
    // check san pham
    if (this.listDataHoaDonCt.length > 0) {
      this.listDataHoaDonCt.map((item: any) => {
        if (item.sanPhamChiTiet.trangThai === 0) {
          this.errorService.displayError(
            'Vui lòng kiểm tra lại sản phẩm đang không hoạt động',
            'error'
          );
          isFalse = true;
          return;
        }
        if (item.sanPhamChiTiet.soLuong === 0) {
          this.errorService.displayError(
            'Vui lòng kiểm tra lại sản phẩm đã hết hàng',
            'error'
          );
          isFalse = true;
          return;
        }
        if (item.sanPhamChiTiet.soLuong < item.soLuong) {
          this.errorService.displayError(
            'Vui lòng kiểm tra lại , sản phẩm không đủ để thực hiện thanh toán',
            'error'
          );
          isFalse = true;
          return;
        }
      });
    }
    // kiểm tra lại voucher
    const today = new Date();
    if (this.data.vouchers.length > 0) {
      this.data.vouchers.map((item: any) => {
        const startDateHoaDonVoucher = new Date(item.ngayBatDau);
        const endDateHoaDonVoucher = new Date(item.ngayKetThuc);
        // check ngày
        if (
          !(today >= startDateHoaDonVoucher && today <= endDateHoaDonVoucher)
        ) {
          this.errorService.displayError(
            'Vui lòng kiểm tra lại voucher không hoạt động',
            'error'
          );
          isFalse = true;
          return;
        }
        if (item.soLuong === 0) {
          this.errorService.displayError(
            'Vui lòng kiểm tra lại voucher hết lượt dùng',
            'error'
          );
          isFalse = true;
          return;
        }
        if (item.giaTriGiamToiThieu > this.data.tongTienSanPhamChuaGiam) {
          this.errorService.displayError(
            'Vui lòng kiểm tra lại voucher không phù hợp',
            'error'
          );
          isFalse = true;
          return;
        }
      });
    }
    if (!isFalse) {
      this.data.tongTien = this.tongTien;
      const dialogRef = this.dialog.open(FormThanhToanComponent, {
        data: this.data,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          await this.getListHoaDon('rows');
          this.data = {};
          const dialogRef = this.dialog.open(
            ThanhCongOrThatBaiThanhToanComponent,
            {
              data: {
                vnpOrderInfo: result,
                responseCode: '00',
                transactionStatus: '0',
                status: true,
              },
              disableClose: true,
            }
          );
        }
      });
    }
  }
}
