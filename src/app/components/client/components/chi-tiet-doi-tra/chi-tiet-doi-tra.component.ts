import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeServoceService } from '../../services/home-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';
import { TokenService } from 'src/app/services/token.service';
import { KhachHangServiceService } from 'src/app/components/admin/service/khach-hang-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDiaChiComponent } from '../add-dia-chi/add-dia-chi.component';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chi-tiet-doi-tra',
  templateUrl: './chi-tiet-doi-tra.component.html',
  styleUrls: ['./chi-tiet-doi-tra.component.scss'],
})
export class ChiTietDoiTraComponent implements OnInit {
  idPhieu: any = null;
  data: any;
  params : any = {}
  visible: boolean = false;
  visible1: boolean = false;
  visible2: boolean = false;
  visible3: boolean = false;
  visible4: boolean = false;
  visible5: boolean = false;
  listTinhThanh: any[] = [];
  isCheckUrl : boolean = false;
  //
  listQuanHuyen: any[] = [];
  //
  listQuanXa: any[] = [];
  //
  ghiChu: any;
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: HomeServoceService,
    private spinner: NgxSpinnerService,
    private serviceLocation: DiaChiServiceService,
    private tokenService: TokenService,
    private serviceDiaChi: KhachHangServiceService,
    private dialog: MatDialog,
    private errorService: ErrorTsService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.idPhieu = params['idphieu'];
    });
    const { decoded } = this.tokenService.getToken();
    if (!decoded) {
      this.router.navigate(['/g4/shop/login']);
    }
    this.searchQuery.idKhachHang = decoded.user.id;
    this.getAllDiaChi('rows');
    this.getAllDetailPhieu();
    this.getAllTinhThanh();
    this.dataService.data$.subscribe((data: any) => {
      this.getAllDetailPhieu();
    });
  }
  getAllDetailPhieu() {
    this.spinner.show();
    this.service.getPhieuDoiTraById(this.idPhieu).subscribe((res) => {
      this.spinner.hide();
      this.data = res;
      console.log(this.data);
    });
  }
  isVideo(url: string): boolean {
    // Kiểm tra nếu URL kết thúc bằng ".mp4" hoặc các định dạng video khác
    return url.endsWith('.mp4');
  }
  showDialog() {
    this.visible = true;
}
changeTinhThanh() {
  if (this.data.idTinhThanh !== null) {
    this.getAllQuanHuyen(this.data.idTinhThanh);
    const data = this.listTinhThanh.find(
      (item) => item.ProvinceID === this.data.idTinhThanh
    );
    this.data.tinhThanh = data.ProvinceName;
  } else {
    this.listQuanHuyen = [];
    this.listQuanXa = [];
    this.data.tinhThanh = null;
    this.data.quanHuyen = null;
    this.data.phuongXa = null;
  }
  
}
changeQuanHuyen() {
  if (this.data.idQuanHuyen !== null) {
    this.getAllPhuongXa(this.data.idQuanHuyen);
    const data = this.listQuanHuyen.find(
      (item) => item.DistrictID === this.data.idQuanHuyen
    );
    this.data.quanHuyen = data.DistrictName;
  } else {
    this.listQuanXa = [];
    this.data.quanHuyen = null;
    this.data.phuongXa = null;
  }
  
}
changePhuongXa() {
  if (this.data.idPhuongXa !== null) {
    const data = this.listQuanXa.find(
      (item) => item.WardCode === this.data.idPhuongXa
    );
    this.data.phuongXa = data.WardName;
  } else {
    this.data.phuongXa = null;
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
useInfoCustumer() {
  const { decoded } = this.tokenService.getToken();
  this.data.tenNguoiNhan = decoded.user.hoTen;
  this.data.sdtNguoiNhan = decoded.user.soDienThoai;
}
async getAllTinhThanh() {
  this.spinner.show();
  const data = await this.serviceLocation.getAllTinhThanh().toPromise();
  if (data) {
    this.listTinhThanh = data.data;
    this.spinner.hide();
  }
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
useLocation(item: any) {
  // chỉ khi có tinhThanh hoặc idQuanHuyen
  this.data.idTinhThanh = Number(item.idTinhThanh);
  this.data.tinhThanh = item.tinhThanh;
  this.data.idPhuongXa = item.idPhuongXa;
  this.data.quanHuyen = item.quanHuyen;
  this.data.idQuanHuyen = Number(item.idQuanHuyen);
  this.getAllPhuongXa(this.data.idQuanHuyen);
  this.getAllQuanHuyen(this.data.idTinhThanh);
  this.data.ghiChu = item.ghiChu;
  this.ghiChu = item.ghiChu;
  this.data.phuongXa = item.phuongXa;
  this.visible1 = false;
}
addLocation() {
  this.visible1 = false;
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
    this.visible1 = true;
    if (result) {
      this.getAllDiaChi('rows');
    }
  });
}
goto() {
  this.isCheckUrl = true;
  this.removeIdPhieuDoiTraFromUrl();
  this.router.navigate(['/g4/shop/khach-hang'], {
    queryParams: {
      activeItem: 1,
      idhd: this.data.phieuDoiTra.hoaDonMoi.id,
    },
  });
}
removeIdPhieuDoiTraFromUrl(): void {
  // Lấy query parameters hiện tại
  const queryParams = { ...this.router.routerState.snapshot.root.queryParams };
  // Xóa `idPhieuDoiTra` khỏi query parameters
  delete queryParams['idphieu'];
  // Cập nhật lại URL mà không có `idPhieuDoiTra`
  this.router.navigate([], {
    queryParams: queryParams,
    queryParamsHandling: 'merge', // Giữ các query parameters còn lại
  });
}
  async nextStep(){
  const params = {
    idKhachHang :this.searchQuery.idKhachHang,
    trangThai : this.data.phieuDoiTra.trangThai + 1,
    idPhieuDoiTra : this.data.phieuDoiTra.id,
    idNhanVien : null
  }
  this.spinner.show();
  const data = await this.service.udpateTrangThaiPhieu(params).toPromise();
  if (data) {
    if (data?.errorCode) {
      this.errorService.displayError(data.messageError, 'error');
      this.spinner.hide();
    } else {
      if (data.body) {
        // Chuyển hướng đến link cụ thể trong tab hiện tại
        this.getAllDetailPhieu();
        this.dataService.updateData('1232312312');
        this.spinner.hide();
      }
    }
  }
  
}
  async newHoaDon(){
  const params = {
    idPhieuDoiTra : this.data.phieuDoiTra.id,
    tenNguoiNhan : this.data.tenNguoiNhan,
    sdtNguoiNhan : this.data.sdtNguoiNhan,
    idTinhThanh : this.data.idTinhThanh,
    tinhThanh : this.data.tinhThanh,
    idQuanHuyen : this.data.idQuanHuyen,
    quanHuyen :this.data.quanHuyen,
    idPhuongXa : this.data.idPhuongXa,
    phuongXa : this.data.phuongXa,
    ghiChu :  this.ghiChu
  }
  if (!this.validateParams(params)) {
    return; // Ngừng thực hiện nếu params không hợp lệ
  }
  const data = await this.service.craeteNewHoaDonInPhieu(params).toPromise();
  if (data) {
    if (data?.errorCode) {
      this.errorService.displayError(data.messageError, 'error');
      this.spinner.hide();
    } else {
      if (data.body) {
        // Chuyển hướng đến link cụ thể trong tab hiện tại
        this.nextStep();
        this.getAllDetailPhieu();
        this.spinner.hide();
      }
    }
  }
}
  async updateThongTinNganHang(){
  const params = {
    idPhieuDoiTra : this.data.phieuDoiTra.id,
    soTaiKhoanNganHang : this.data?.phieuDoiTra.soTaiKhoanNganHang,
    tenChuTaiKhoan : this.data?.phieuDoiTra.tenChuTaiKhoan,
    tenNganHang : this.data?.phieuDoiTra.tenNganHang,
  }
  const data = await this.service.udpateThongTinNganHang(params).toPromise();
  if (data) {
    if (data?.errorCode) {
      this.errorService.displayError(data.messageError, 'error');
      this.spinner.hide();
    } else {
      if (data.body) {
        // Chuyển hướng đến link cụ thể trong tab hiện tại
        // this.nextStep();
        this.getAllDetailPhieu();
        this.errorService.displayError('Cập nhật thông tin ngân hàng thành công , vui lòng đợi bên nhân viên phảm hồi !!!', 'normal');
        this.spinner.hide();
        this.dataService.updateData('1231231232');
      }
    }
  }
}
validateParams(params: any): boolean {
  if (!params.tenNguoiNhan || params.tenNguoiNhan.trim() === '') {
    this.errorService.displayError('Vui lòng nhập tên người nhận', 'error');
    return false;
  }

  if (!params.sdtNguoiNhan || params.sdtNguoiNhan.trim() === '') {
    this.errorService.displayError('Vui lòng nhập số điện thoại người nhận', 'error');
    return false;
  }

  if (!params.idTinhThanh) {
    this.errorService.displayError('Vui lòng chọn tỉnh thành', 'error');
    return false;
  }

  if (!params.tinhThanh || params.tinhThanh.trim() === '') {
    this.errorService.displayError('Tên tỉnh thành không hợp lệ', 'error');
    return false;
  }

  if (!params.idQuanHuyen) {
    this.errorService.displayError('Vui lòng chọn quận huyện', 'error');
    return false;
  }

  if (!params.quanHuyen || params.quanHuyen.trim() === '') {
    this.errorService.displayError('Tên quận huyện không hợp lệ', 'error');
    return false;
  }

  if (!params.idPhuongXa) {
    this.errorService.displayError('Vui lòng chọn phường xã', 'error');
    return false;
  }

  if (!params.phuongXa || params.phuongXa.trim() === '') {
    this.errorService.displayError('Tên phường xã không hợp lệ', 'error');
    return false;
  }


  return true; // Tất cả các trường đều hợp lệ
}

}
