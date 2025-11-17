import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { AutoServiceService } from 'src/app/shareds/auto-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { DataService } from '../../../services/data.service';
import { HomeServoceService } from '../../../services/home-service.service';
import { InfoService } from '../../../services/info.service';
import { UploadImgService } from 'src/app/components/admin/service/upload-img.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.scss'],
})
export class InfoUserComponent implements OnInit {
  data: any = {};
  idKhachHang: any;
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private errorService: ErrorTsService,
    private autoVoucher: AutoServiceService,
    private service: InfoService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private serviceIMG: UploadImgService,
    private spinner : NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const isExpired = this.tokenService.isTokenExpired();
    const { decoded } = this.tokenService.getToken();
    const a = this.tokenService.getToken();
    
    console.log('🔍 InfoUser - Token decoded:', decoded);
    console.log('🔍 InfoUser - Role:', decoded?.role);
    console.log('🔍 InfoUser - Full decoded:', JSON.stringify(decoded, null, 2));
    
    if (a.decoded === null) {
      console.log('❌ Token decoded is null, redirecting to login');
      this.router.navigate(['/g4/shop/login']);
      return;
    }
    
    // Check role - support multiple formats
    const userRole = a.decoded?.role || a.decoded?.['user']?.role;
    const isKhachHang = userRole === 'KhachHang' || 
                        userRole === 'KHACH_HANG' || 
                        userRole === 'khach_hang' ||
                        a.decoded?.authorities?.includes('ROLE_KHACH_HANG');
    
    if (!isKhachHang) {
      console.log('❌ Not a customer role:', userRole, 'authorities:', a.decoded?.authorities);
      this.tokenService.removeToken();
      this.router.navigate(['/g4/shop/login']);
      return;
    }
    
    console.log('✅ Role check passed:', userRole);
    if (decoded) {
      if (isExpired) {
        this.errorService.displayError(
          'hết thời gian đăng nhập, vui lòng đăng nhập lại',
          'normal'
        );
        this.tokenService.removeToken();
        this.router.navigate(['/g4/shop/login']);
      }
    } else {
      this.router.navigate(['/g4/shop/login']);
    }
    this.idKhachHang = decoded?.["user"].id;
    this.getKh();
  }
  async getKh() {
    const data = await this.service.getUserByIdKh(this.idKhachHang).toPromise();
    if (data) {
      this.data = data;
      this.data.ngaySinh = new Date(this.data.ngaySinh);
      this.data.custumEmail = this.maskEmail(this.data.email);
      this.data.custumSdt = this.maskPhoneNumber(this.data.soDienThoai);
    }
  }
  maskPhoneNumber(phone: string): string {
    // Giữ lại 5 ký tự đầu và 2 ký tự cuối
    return phone.slice(0, 5) + '****';
  }

  maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    // Giữ lại 2 ký tự cuối của local part và toàn bộ domain
    const maskedLocalPart =
      '*'.repeat(localPart.length - 2) + localPart.slice(-2);
    return maskedLocalPart + '@' + domain;
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
  async updateThongTinKhachHang() {
    const data = await this.service.udpate(this.data).toPromise();
        if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
      }else{
        this.errorService.displayError('Cập nhật thành công', 'success');
        this.getKh();
      }
    }
  }
}
