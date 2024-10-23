import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { KhachHangServiceService } from '../../service/khach-hang-service.service';

@Component({
  selector: 'app-add-dia-chi',
  templateUrl: './add-dia-chi.component.html',
  styleUrls: ['./add-dia-chi.component.scss'],
})
export class AddDiaChiComponent implements OnInit {
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
  constructor(
    private serviceLocation: DiaChiServiceService,
    private matDialogRef: MatDialogRef<AddDiaChiComponent>,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private spinner: NgxSpinnerService,
    private errorService: ErrorTsService,
    private khService: KhachHangServiceService
  ) {}
  // add or update

  ngOnInit(): void {
    this.getAllTinhThanh();
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
    if (this.tinhThanh !== null) {
      this.getAllQuanHuyen(this.tinhThanh.ProvinceID);
    } else {
      this.listQuanHuyen = [];
      this.listQuanXa = [];
    }
  }
  changeQuanHuyen() {
    if (this.quanHuyen !== null) {
      this.getAllPhuongXa(this.quanHuyen.DistrictID);
    } else {
      this.listQuanXa = [];
    }
  }
  close() {
    this.matDialogRef.close();
  }
  async addOrEdit() {
    if (!this.tinhThanh || !this.quanHuyen || !this.quanXa) {
      this.errorService.displayError(
        'Vui lòng không để trống địa chỉ',
        'error'
      );
      return;
    }
    const params = {
      id: 0,
      idTinhThanh: this.tinhThanh.ProvinceID,
      tinhThanh: this.tinhThanh.ProvinceName,
      idQuanHuyen: this.quanHuyen.DistrictID + '',
      quanHuyen: this.quanHuyen.DistrictName,
      idPhuongXa: this.quanXa.WardCode + '',
      phuongXa: this.quanXa.WardName,
      ghiChu: this.ghiChu,
      trangThai: 1,
      idKhachHang: this.getData?.data?.khachHang?.id || null,
    };
    const data = await this.khService.addDiaChi(params).toPromise();
    if (data) {
      if (data?.errorCode) {
        this.errorService.displayError(data.messageError, 'error');
      } else {
        this.errorService.displayError('Thêm thành công', 'sussces');
        this.matDialogRef.close('close');
      }
    }
  }
}
