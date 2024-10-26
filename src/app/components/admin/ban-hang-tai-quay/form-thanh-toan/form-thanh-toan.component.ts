import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { HoaDonService } from '../../service/hoa-don.service';

@Component({
  selector: 'app-form-thanh-toan',
  templateUrl: './form-thanh-toan.component.html',
  styleUrls: ['./form-thanh-toan.component.scss'],
})
export class FormThanhToanComponent implements OnInit {
  typeThanhToan: number = 1;
  tienKhachTra: number = 0;
  allOnlineThanhToan: any[] = [
    {
      id: 1,
      img: 'https://alumninetwork.rmit.edu.vn/wp-content/uploads/formidable/9/229119139_1248271018953845_3256448855090805583_n-1.png',
      title: 'Thanh Toán VNpay',
    },
    {
      id: 2,
      img: 'https://seeklogo.com/images/Z/zalopay-logo-643ADC36A4-seeklogo.com.png',
      title: 'Thanh Toán ZaloPay',
    },
  ];
  isCheckOnlinePay: number = 1;
  constructor(
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private router: Router,
    private matDialogRef: MatDialogRef<FormThanhToanComponent>,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private errorService: ErrorTsService,
    private service: HoaDonService
  ) {}

  ngOnInit(): void {
    this.checkThanhToan();
  }
  checkThanhToan() {
    // ship = false && thanh toan tai quay => showpopup nhap tien va tra tien => trang thai = 6
    if (this.getData.phuongThucThanhToan.id === 1) {
      this.typeThanhToan = 1;
    }
    if (this.getData.phuongThucThanhToan.id === 2) {
      this.typeThanhToan = 2;
    }
    if (this.getData.phuongThucThanhToan.id === 3) {
      this.typeThanhToan = 3;
    }
    // ship = true && thanh toan tai quay => showpopup nhap tien va tra tien => trang thai = 2
    // ship = false && thanh toan online => showpopup link thanh toan => trang thai = 6
    // ship = true && thanh toan online => showpopup link thanh toan va tra tien => trang thai = 2
    // ship = true && thanh toan khi nhan hang => oke show hoa don luon => 2
  }
  close() {
    this.matDialogRef.close();
  }
  async thanhToan() {
    const params = {
      idHoaDon: this.getData.id,
      phiShip: this.getData.phiShip,
      tongTien: this.getData.tongTien,
      tongTienSanPhamChuaGiam: this.getData.tongTienSanPhamChuaGiam,
      tongTienGiam: this.getData.tongTienGiam,
      trangThai: 0,
    };
    if (this.typeThanhToan === 1) {
      if (this.tienKhachTra >= this.getData.tongTien) {
        if (this.getData.giaoHang) {
          params.trangThai = 2;
        } else {
          params.trangThai = 6;
        }
        const data = await this.service.thanhToanHoaDOn(params).toPromise();
        if (data) {
          if (data?.errorCode) {
            this.errorService.displayError(data.messageError, 'error');
          } else {
            this.errorService.displayError('Thanh toán thành công', 'sussces');
            this.matDialogRef.close(this.getData.id);
          }
        }
      } else {
        this.errorService.displayError('Vui lòng thanh toán đủ!!', 'error');
      }
    }
    if (this.typeThanhToan === 2) {
      // test nên để 1
      params.trangThai = 1;
      const data = await this.service.thanhToanHoaDOn(params).toPromise();
      if (data) {
        if (data?.errorCode) {
          this.errorService.displayError(data.messageError, 'error');
        } else {
          if (data.body) {
            // Chuyển hướng đến link cụ thể trong tab hiện tại
            window.location.href = data.body;
          }
        }
      }
    }
    if (this.typeThanhToan === 3) {
      // test nên để 1
      params.trangThai = 2;
      const data = await this.service.thanhToanHoaDOn(params).toPromise();
      if (data) {
        if (data?.errorCode) {
          this.errorService.displayError(data.messageError, 'error');
        } else {
          this.errorService.displayError('Xác nhận thanh toán thành công', 'sussces');
          this.matDialogRef.close( this.getData.id);
        }
      }
    }
  }
}
