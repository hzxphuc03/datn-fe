import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { KhachHangServiceService } from '../../service/khach-hang-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddDiaChiComponent } from '../../khach-hang/add-dia-chi/add-dia-chi.component';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';
import { PhuongThucThanhToanService } from '../../service/phuong-thuc-thanh-toan.service';
import { HoaDonService } from '../../service/hoa-don.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-thong-tin-nhan-hang',
  templateUrl: './thong-tin-nhan-hang.component.html',
  styleUrls: ['./thong-tin-nhan-hang.component.scss'],
})
export class ThongTinNhanHangComponent implements OnInit {
  data: any;
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData: any;

  tinhThanh: any;
  listTinhThanh: any[] = [];
  //
  quanHuyen: any;
  listQuanHuyen: any[] = [];
  //
  quanXa: any;
  listQuanXa: any[] = [];
  //
  ghiChu: any;
  listPhuongThuc: any[] = [];
  phuongThucThanhToanId: any;

  constructor(
    private matDialogRef: MatDialogRef<ThongTinNhanHangComponent>,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private serviceDiaChi: KhachHangServiceService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private serviceLocation: DiaChiServiceService,
    private phuongThucService: PhuongThucThanhToanService,
    private hoaDonService: HoaDonService,
    private errorService: ErrorTsService
  ) {
    this.data = getData.data;
    this.searchQuery.idKhachHang = this.data?.khachHang?.id;
    this.searchQuery.pageSize = 10;
    this.getListWords('rows');
    this.data.idTinhThanh = Number(this.data.idTinhThanh);
    this.getAllTinhThanh();
    if (this.data.idQuanHuyen) {
      this.data.idQuanHuyen = Number(this.data.idQuanHuyen);
      this.getAllQuanHuyen(this.data.idTinhThanh);
    }
    if (this.data.idPhuongXa) {
      // this.data.idPhuongXa = Number(this.data.idPhuongXa);
      this.getAllPhuongXa(this.data.idQuanHuyen);
    }
    this.getPhuongThuc();
  }
  async getPhuongThuc() {
    this.spinner.show();
    const data = await this.phuongThucService
      .getAll({
        page: 1,
      })
      .toPromise();
    if (data && data?.item) {
      this.listPhuongThuc = data?.item;
      this.spinner.hide();
    }
  }
  ngOnInit(): void {}
  async getListWords(type: string, action?: string): Promise<void> {
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
  addLocation() {
    const dialogRef = this.dialog.open(AddDiaChiComponent, {
      data: {
        data: this.data,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getListWords('rows');
      }
    });
  }
  async getAllTinhThanh() {
    this.spinner.show();
    const data = await this.serviceLocation.getAllTinhThanh().toPromise();
    if (data) {
      this.listTinhThanh = data.data;
      this.spinner.hide();
    }
  }
  async getAllQuanHuyen(id: any) {
    this.spinner.show();
    const data = await this.serviceLocation.getAllQuanHuyen(id).toPromise();
    if (data) {
      this.listQuanHuyen = data.data;
      this.spinner.hide();
    }
  }
  async getAllPhuongXa(id: any) {
    this.spinner.show();
    const data = await this.serviceLocation.getAllPhuongXa(id).toPromise();
    if (data) {
      this.listQuanXa = data.data;
      this.spinner.hide();
    }
  }
  changeTinhThanh() {
    if (this.data.idTinhThanh !== null) {
      this.getAllQuanHuyen(this.data.idTinhThanh);
    } else {
      this.listQuanHuyen = [];
      this.listQuanXa = [];
    }
  }
  changeQuanHuyen() {
    if (this.data.idQuanHuyen !== null) {
      this.getAllPhuongXa(this.data.idQuanHuyen);
    } else {
      this.listQuanXa = [];
    }
  }
  choseOptionThanhToan() {}
  back() {
    this.matDialogRef.close();
  }
  useLocation(item: any) {
    // chỉ khi có tinhThanh hoặc idQuanHuyen
    this.data.idTinhThanh = Number(item.idTinhThanh);
    this.tinhThanh = item.tinhThanh;
    this.data.idPhuongXa = item.idPhuongXa;
    this.quanHuyen = item.quanHuyen;
    this.data.idQuanHuyen = Number(item.idQuanHuyen);
    this.getAllPhuongXa(this.data.idQuanHuyen);
    this.getAllQuanHuyen(this.data.idTinhThanh);
    this.data.ghiChu = item.ghiChu;
    this.ghiChu = item.ghiChu;
    this.quanXa = item.phuongXa;
  }
  async updateInfoHoaDon() {
    if (
      !this.data.idTinhThanh ||
      !this.data.idQuanHuyen ||
      !this.data.idPhuongXa
    ) {
      this.errorService.displayError('Không để trống địa chỉ', 'error');
      return;
    }
    if (
      this.data.tenNguoiNhan === '' ||
      this.data.tenNguoiNhan === undefined ||
      this.data.tenNguoiNhan === null
    ) {
      this.errorService.displayError('Không để trống tên người nhận', 'error');
      return;
    }
    const regex = /^0\d{9}$/;
    if (!regex.test(this.data.sdtNguoiNhan)) {
      this.errorService.displayError('Đúng định dạng số điện thoại', 'error');
      return;
    }
    const tenTinhThanh = this.listTinhThanh.find(
      (location) => location.ProvinceID === this.data.idTinhThanh
    );
    const tenQuanHuyen = this.listQuanHuyen.find(
      (location) => location.DistrictID === this.data.idQuanHuyen
    );
    const tenPhuongXa = this.listQuanXa.find(
      (location) => location.WardCode === this.data.idPhuongXa
    );
    if (tenTinhThanh && tenQuanHuyen && tenPhuongXa) {
      const hoaDon = {
        idHoaDon: this.data.id,
        tenNguoiNhan: this.data.tenNguoiNhan,
        sdtNguoiNhan: this.data.sdtNguoiNhan,
        idTinhThanh: this.data.idTinhThanh,
        tinhThanh: tenTinhThanh.ProvinceName,
        idQuanHuyen: this.data.idQuanHuyen,
        quanHuyen: tenQuanHuyen.DistrictName,
        idPhuongXa: this.data.idPhuongXa,
        phuongXa: tenPhuongXa.WardName,
        ghiChu: this.data.ghiChu,
      };
      const data = await this.hoaDonService.updateDiaChi(hoaDon).toPromise();
      if (data) {
        this.errorService.displayError('Cập nhật thành công', 'success');
        this.matDialogRef.close('done');
      }
    }
  }
}
