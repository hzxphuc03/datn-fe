import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NhanVienServiceService } from '../../service/nhan-vien-service.service';
import { ChucVuServiceService } from '../../service/chuc-vu-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadImgService } from '../../service/upload-img.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-nhan-vien-add-or-edit',
  templateUrl: './nhan-vien-add-or-edit.component.html',
  styleUrls: ['./nhan-vien-add-or-edit.component.scss'],
})
export class NhanVienAddOrEditComponent implements OnInit {
  id: string | null = null;
  isAdd: boolean = false;
  data: any;
  //
  searchQueryChucVu: any = {
    page: 1,
  };
  chucVu: any = [];
  totalItemChucVu: any;
  //
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: NhanVienServiceService,
    private serviceCV: ChucVuServiceService,
    private spinner: NgxSpinnerService,
    private serviceIMG: UploadImgService,
    private errorService: ErrorTsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.isAdd = false;
        this.getDetail();
      } else {
        this.isAdd = true;
        this.data = {
          id: null,
          ma: null,
          hoTen: null,
          ngaySinh: '',
          ngayTao: '2024-10-16T13:54:19.752Z',
          soDienThoai: null,
          gioiTinh: 1,
          diaChi: '',
          hinhAnh: null,
          email: null,
          taiKhoan: null,
          matKhau: null,
          chucVu: {},
          trangThai: 1,
        };
      }
    });
    this.getAllChucVu();
  }
  async getDetail() {
    this.spinner.show();
    const data = await this.service.getById(this.id).toPromise();
    if (data) {
      this.data = data;
      this.data.ngaySinh = new Date(this.data.ngaySinh);
      this.spinner.hide();
    }
  }
  async getAllChucVu() {
    this.spinner.show();
    const data = await this.serviceCV
      .getAll(this.searchQueryChucVu)
      .toPromise();
    if (data && data.item) {
      data?.item.map((a: any) => {
        this.chucVu.push(a);
      });
      this.totalItemChucVu = data.totalItem;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }
  onScrollChucVu() {
    const element = document.querySelector('.chuc-vu-dropdown') as HTMLElement;
    if (element) {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const offsetHeight = element.offsetHeight;

      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this.chucVu.length === this.totalItemChucVu) {
          return;
        } else {
          this.searchQueryChucVu.page++;
        }
        this.getAllChucVu();
      }
    }
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Kiểm tra xem click có xảy ra bên trong phần tử có class 'drop-down' hay không
    const isDropDownClick = target.closest('.drop-down') !== null;
    if (!isDropDownClick) {
      if (this.data.chucVu) {
        this.data.chucVu.isOpen = false;
      }
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

  validateBody() {
    let isDone = true; // Mặc định là hợp lệ
    if (this.data.ma === '' || this.data.ma === null) {
      this.errorService.displayError('Mã không được để trống.', 'error');
      isDone = false;
      return;
    }
    if (this.data.hoTen === '' || this.data.hoTen === null) {
      this.errorService.displayError('Họ tên không được để trống.', 'error');
      isDone = false;
      return;
    }
    if (this.data.ngaySinh === '' || this.data.ngaySinh === null) {
      this.errorService.displayError('Ngày sinh không được để trống.', 'error');
      isDone = false;
      return;
    }
    if (this.data.soDienThoai === '' || this.data.soDienThoai === null) {
      this.errorService.displayError(
        'Số điện thoại không được để trống.',
        'error'
      );
      isDone = false;
      return;
    }
    if (this.data.email === '' || this.data.email === null) {
      this.errorService.displayError('Email không được để trống.', 'error');
      isDone = false;
      return;
    }
    if (this.data.taiKhoan === '' || this.data.taiKhoan === null) {
      this.errorService.displayError('Tài khoản không được để trống.', 'error');
      isDone = false;
      return;
    }
    if (this.data.matKhau === '' || this.data.matKhau === null) {
      this.errorService.displayError('Mật khẩu không được để trống.', 'error');
      isDone = false;
      return;
    }
    if (!this.data.chucVu.id) {
      this.errorService.displayError('Chức vụ không được để trống.', 'error');
      isDone = false;
      return;
    }
    if (this.data.diaChi === '' || this.data.diaChi === null) {
      this.errorService.displayError('Địa chỉ không được để trống.', 'error');
      isDone = false;
      return;
    }

    // Kiểm tra định dạng số điện thoại
    const phonePattern = /^0[0-9]{9,10}$/; // Chấp nhận số điện thoại 10-11 chữ số
    if (!phonePattern.test(this.data.soDienThoai)) {
      this.errorService.displayError(
        'Số điện thoại không đúng định dạng.',
        'error'
      );
      isDone = false;
      return;
    }

    // Kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Định dạng email cơ bản
    if (!emailPattern.test(this.data.email)) {
      this.errorService.displayError('Email không đúng định dạng.', 'error');
      isDone = false;
      return;
    }

    // Trả về giá trị của isDone
    return isDone;
  }

  async addOrEdit() {
    const body = {
      id: this.data.id,
      ma: this.data.ma,
      hoten: this.data.hoTen,
      ngaySinh: this.data.ngaySinh,
      ngayTao: '2024-10-16T13:54:19.752Z',
      soDienThoai: this.data.soDienThoai,
      gioiTinh: this.data.gioiTinh,
      diaChi: this.data.diaChi,
      hinhAnh: this.data.hinhAnh,
      email: this.data.email,
      taiKhoan: this.data.taiKhoan,
      matKhau: this.data.matKhau,
      idChucVu: this.data.chucVu.id,
      trangThai: 1,
    };
    const result = this.validateBody();
    if (!result) {
      return;
    }
    if (this.isAdd) {
      const data = await this.service.add(body).toPromise();
      if (data) {
        if (data.body.errorCode === 400) {
          this.errorService.displayError(data.body.messageError, 'error');
          this.spinner.hide();
        }else{
          this.errorService.displayError('Thêm nhân viên thành công', 'success');
          this.router.navigate(['/auth/admin/nhan-vien']);
        }

      }
    } else {
      const data = await this.service.update(body).toPromise();
      if (data) {
        if (data.body.errorCode === 400) {
          this.errorService.displayError(data.body.messageError, 'error');
          this.spinner.hide();
        }else{
          this.errorService.displayError(
            'Cập nhật nhân viên thành công',
            'success'
          );
          this.router.navigate(['/auth/admin/nhan-vien']);
        }
      }
    }
  }
}
