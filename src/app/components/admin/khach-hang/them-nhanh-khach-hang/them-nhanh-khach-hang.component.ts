import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { KhachHangServiceService } from '../../service/khach-hang-service.service';
import { UploadImgService } from '../../service/upload-img.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-them-nhanh-khach-hang',
  templateUrl: './them-nhanh-khach-hang.component.html',
  styleUrls: ['./them-nhanh-khach-hang.component.scss']
})
export class ThemNhanhKhachHangComponent implements OnInit {
  data: any = {};
  id: string | null = null;
  isAdd: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: KhachHangServiceService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorTsService,
    private serviceIMG: UploadImgService,
    private matDialogRef: MatDialogRef<ThemNhanhKhachHangComponent>,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.isAdd = false;
        this.getDetail();
      } else {
        this.isAdd = true;
        this.data.gioiTinh = 1;
      }
    });
  }
  async getDetail() {
    this.spinner.show();
    const data = await this.service.getbyId(this.id).toPromise();
    if (data) {
      this.spinner.hide();
      this.data = data;
      this.data.ngaySinh = new Date(this.data.ngaySinh);
    }
  }
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        const post = await this.serviceIMG.upload(file, 'Images').toPromise();
        if (post) {
          this.data.hinhAnh = post.result;
        }
      }
    }
  }
  addOrEdit() {
    const validate = this.validate();
    if (validate) {
      this.spinner.show();
      if (this.isAdd) {
        this.service.add(this.data).subscribe(
          (res) => {
            this.spinner.hide();
            this.errorService.displayError('Thêm mới thành công', 'success');
            // this.router.navigate(['/auth/admin/khach-hang']);
            this.matDialogRef.close('ádasdasd');
          },
          (error) => {
            this.spinner.hide();
            this.errorService.displayError(error.message, 'error');
          }
        );
      } else {
        this.service.update(this.data).subscribe(
          (res) => {
            this.spinner.hide();
            this.errorService.displayError('Cập nhật thành công', 'success');
            // this.router.navigate(['/auth/admin/khach-hang']);
            this.matDialogRef.close('ádasdasd');
          },
          (error) => {
            this.spinner.hide();
            this.errorService.displayError(error.message, 'error');
          }
        );
      }
    }
  }
  validate() {
    let isDone = true;

    // Kiểm tra họ tên
    if (
      this.data.hoTen === '' ||
      this.data.hoTen === null ||
      this.data.hoTen === undefined
    ) {
      this.errorService.displayError('Họ tên không được để trống', 'error');
      isDone = false;
      return;
    }

    // Kiểm tra ngày sinh
    if (
      this.data.ngaySinh === '' ||
      this.data.ngaySinh === null ||
      this.data.ngaySinh === undefined
    ) {
      this.errorService.displayError('Ngày sinh không được để trống', 'error');
      isDone = false;
      return;
    } else {
      const ngaySinh = new Date(this.data.ngaySinh);
      if (isNaN(ngaySinh.getTime())) {
        this.errorService.displayError('Ngày sinh không hợp lệ', 'error');
        isDone = false;
        return;
      }
    }

    // Kiểm tra số điện thoại
    if (
      this.data.soDienThoai === '' ||
      this.data.soDienThoai === null ||
      this.data.soDienThoai === undefined
    ) {
      this.errorService.displayError(
        'Số điện thoại không được để trống',
        'error'
      );
      isDone = false;
      return;
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(this.data.soDienThoai)) {
        this.errorService.displayError('Số điện thoại không hợp lệ', 'error');
        isDone = false;
        return;
      }
    }

    // Kiểm tra giới tính
    if (this.data.gioiTinh === null) {
      this.errorService.displayError('Giới tính không hợp lệ', 'error');
      isDone = false;
      return;
    }

    // Kiểm tra email
    if (
      this.data.email === '' ||
      this.data.email === null ||
      this.data.email === undefined
    ) {
      this.errorService.displayError('Email không được để trống', 'error');
      isDone = false;
      return;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.data.email)) {
        this.errorService.displayError('Email không hợp lệ', 'error');
        isDone = false;
        return;
      }
    }
    if (
      this.data.taiKhoan === '' ||
      this.data.taiKhoan === null ||
      this.data.taiKhoan === undefined
    ) {
      this.errorService.displayError('Mật khẩu không được để trống', 'error');
      isDone = false;
      return;
    }
    if (
      this.data.matKhau === '' ||
      this.data.matKhau === null ||
      this.data.matKhau === undefined
    ) {
      this.errorService.displayError('Mật khẩu không được để trống', 'error');
      isDone = false;
      return;
    }

    return isDone;
  }
  back(){
    this.matDialogRef.close();
  }
}
