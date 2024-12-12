import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherService } from '../../service/voucher.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-voucher-add-or-edit',
  templateUrl: './voucher-add-or-edit.component.html',
  styleUrls: ['./voucher-add-or-edit.component.scss'],
})
export class VoucherAddOrEditComponent implements OnInit {
  data: any = {};
  id: string | null = null;
  isAdd: boolean = true;
  optionStatus: any = [
    { value: 0, name: 'Giảm hóa đơn' },
    { value: 1, name: 'Giảm giá ship' },
  ];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: VoucherService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private errorService: ErrorTsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id && this.id !== 'add') {
        this.isAdd = false;
        this.getAll();
      }
    });
  }
  async getAll() {
    this.spinner.show();
    const data = await this.service.getById(this.id).toPromise();
    if (data) {
      this.data = data;
      this.data.ngayKetThuc = new Date(this.data.ngayKetThuc);
      this.data.ngayBatDau = new Date(this.data.ngayBatDau);
      this.spinner.hide();
    }
  }
  async addOrEdit() {
    const isCheck = this.validate();
    if (isCheck) {
      const body = {
        id: this.data.id || null,
        ma: this.data.ma,
        ten: this.data.ten,
        ngayBatDau: this.data.ngayBatDau,
        ngayKetThuc: this.data.ngayKetThuc,
        ngayTao: this.data.ngayTao || null,
        ngaySua: this.data.ngaySua || null,
        soLuong: this.data.soLuong,
        phanTramGiam: this.data.phanTramGiam,
        giamToiDa: this.data.giamToiDa,
        giaTriGiamToiThieu: this.data.giaTriGiamToiThieu,
        theLoai: this.data.theLoai,
      };
      if (this.isAdd) {
        const data = await this.service.add(body).toPromise();
        if (data) {
          if (data.body.errorCode === 400) {
            this.errorService.displayError(data.body.messageError, 'error');
          } else{
            this.errorService.displayError('Thêm thành công', 'success');
            this.router.navigate(['/auth/admin/voucher']);
          }
      
        }
      } else {
        const data = await this.service.update(body).toPromise();
        if (data) {
          if (data.body.errorCode === 400) {
            this.errorService.displayError(data.body.messageError, 'error');
          }else{
            this.errorService
            .displayError('Cập nhật thành công', 'success');
            this.router.navigate(['/auth/admin/voucher']);
          }
        }
      }
    }
  }
  validate() {
    let isDone = true;
    let message = '';
    if (
      this.data.ma === null ||
      this.data.ma === '' ||
      this.data.ma === undefined
    ) {
      isDone = false;
      this.errorService.displayError('Mã voucher không được để trống', 'error');
      return isDone;
    }
    if (
      this.data.ten === null ||
      this.data.ten === '' ||
      this.data.ten === undefined
    ) {
      isDone = false;
      this.errorService.displayError(
        'Tên voucher không được để trống',
        'error'
      );
      return isDone;
    }
    if (
      this.data.soLuong === null ||
      this.data.soLuong === '' ||
      this.data.soLuong === undefined ||
      this.data.soLuong === 0
    ) {
      isDone = false;
      this.errorService.displayError(
        'Số lượng voucher không được để trống',
        'error'
      );
      return isDone;
    }
    if (
      this.data.phanTramGiam === null ||
      this.data.phanTramGiam === '' ||
      this.data.phanTramGiam === undefined ||
      this.data.phanTramGiam === 0
    ) {
      isDone = false;
      this.errorService.displayError(
        'Phần trăm giảm voucher không được để trống',
        'error'
      );
      return isDone;
    }
    if (
      this.data.giamToiDa === null ||
      this.data.giamToiDa === '' ||
      this.data.giamToiDa === undefined ||
      this.data.giamToiDa === 0
    ) {
      isDone = false;
      this.errorService.displayError(
        'Giảm tối đa voucher không được để trống',
        'error'
      );
      return isDone;
    }
    if (
      this.data.theLoai === null ||
      this.data.theLoai === '' ||
      this.data.theLoai === undefined
    ) {
      isDone = false;
      this.errorService.displayError(
        'Loại Voucher không được để trống',
        'error'
      );
      return isDone;
    }
    if (
      this.data.giaTriGiamToiThieu === null ||
      this.data.giaTriGiamToiThieu === '' ||
      this.data.giaTriGiamToiThieu === undefined ||
      this.data.giaTriGiamToiThieu === 0
    ) {
      isDone = false;
      this.errorService.displayError(
        'Giá trị tối thiểu để giảm voucher không được để trống',
        'error'
      );
      return isDone;
    }
    if (
      this.data.ngayBatDau === null ||
      this.data.ngayBatDau === '' ||
      this.data.ngayBatDau === undefined
    ) {
      isDone = false;
      this.errorService.displayError(
        'Ngày bắt đầu không được để trống',
        'error'
      );
      return isDone;
    }
    if (
      this.data.ngayKetThuc === null ||
      this.data.ngayKetThuc === '' ||
      this.data.ngayKetThuc === undefined
    ) {
      isDone = false;
      this.errorService.displayError(
        'Ngày kết thúc không được để trống',
        'error'
      );
      return isDone;
    }
    const ngayBatDau = new Date(this.data.ngayBatDau);
    const ngayKetThuc = new Date(this.data.ngayKetThuc);

    // So sánh hai ngày
    if (ngayKetThuc < ngayBatDau) {
      isDone = false;
      this.errorService.displayError(
        'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu',
        'error'
      );
      return isDone;
    }
    if (this.data.phanTramGiam < 0 || this.data.phanTramGiam > 100) {
      isDone = false;
      this.errorService.displayError('Phần trăm giảm từ 0 - 100%', 'error');
      return isDone;
    }

    return isDone;
  }
}
