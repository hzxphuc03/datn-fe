import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { ErrorTsService } from '../message/error.service';
import { Subscription } from 'rxjs';
import { AutoServiceService } from '../auto-service.service';

@Component({
  selector: 'app-master-layout-admin',
  templateUrl: './master-layout-admin.component.html',
  styleUrls: ['./master-layout-admin.component.scss'],
})
export class MasterLayoutAdminComponent implements OnInit, OnDestroy {
  isOpen: boolean = true;
  errorMessage: any | null = null; // Đảm bảo kiểu dữ liệu cho phép null
  private errorSubscription?: Subscription;
  actionNavItems: any[] = [
    { icon: 'bx bx-home-circle', name: 'Trang chủ', url: '/auth/admin/home' },
    {
      icon: 'bx bx-home-circle',
      name: 'Sản phẩm',
      url: '',
      type: 'drop',
      item: [
        {
          icon: 'bx bx-cube',
          name: 'Sản phẩm',
          url: '/auth/admin/chi-tiet-san-pham',
        },
        {
          icon: 'bx bx-cube',
          name: 'Thương hiệu',
          url: '/auth/admin/thuong-hieu',
        },
        { icon: 'bx bx-cube', name: 'Thể loại', url: '/auth/admin/the-loai' },
        { icon: 'bx bx-cube', name: 'Kích cỡ', url: '/auth/admin/kich-co' },
        { icon: 'bx bx-cube', name: 'Loại cổ', url: '/auth/admin/loai-co' },
        { icon: 'bx bx-cube', name: 'Loại đế', url: '/auth/admin/loai-de' },
        { icon: 'bx bx-cube', name: 'Vật liệu', url: '/auth/admin/vat-lieu' },
        { icon: 'bx bx-cube', name: 'Màu Sắc', url: '/auth/admin/mau-sac' },
        { icon: 'bx bx-cube', name: 'Giảm giá', url: '/auth/admin/giam-gia' },
      ],
    },
    {
      icon: 'bx bx-home-circle',
      name: 'Nhân viên',
      url: '',
      type: 'drop',
      item: [
        { icon: 'bx bx-cube', name: 'Chức vụ', url: '/auth/admin/chuc-vu' },
        { icon: 'bx bx-cube', name: 'Nhân Viên', url: '/auth/admin/nhan-vien' },
      ],
    },
    {
      icon: 'bx bx-home-circle',
      name: 'Khách hàng',
      url: '/auth/admin/khach-hang',
    },
    {
      icon: 'bx bx-cube',
      name: 'Phiếu giảm giá',
      url: '/auth/admin/voucher',
    },
    {
      icon: 'bx bx-cube',
      name: 'Bán hàng',
      url: '/auth/admin/ban-hang-tai-quay',
    },
    {
      icon: 'bx bx-cube',
      name: 'Hóa đơn',
      url: '/auth/admin/quan-ly-hoa-don',
    },
    {
      icon: 'bx bx-cube',
      name: 'Sự kiện',
      url: '/auth/admin/event',
    },
  ];
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private errorService: ErrorTsService,
    private autoVoucher: AutoServiceService
  ) {
    this.checkToken();
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkToken();
      }
    });
    this.errorSubscription = this.errorService
      .getErrorObservable()
      .subscribe((message) => {
        this.errorMessage = message;
      });
  }
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    this.checkToken();
  }
  checkToken() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isExpired = this.tokenService.isTokenExpired();
        const { decoded } = this.tokenService.getToken();
        const a = this.tokenService.getToken();
        if(a.decoded === null){
          this.router.navigate(['/auth/shop/login']);
        }
        if (a.decoded.role !== 'Admin' && a.decoded.role !== 'NhanVien') {
          this.tokenService.removeToken();
          this.router.navigate(['/auth/shop/login']);
          return;
        }
        if (decoded) {
          if (isExpired) {
            this.errorService.displayError(
              'hết thời gian đăng nhập, vui lòng đăng nhập lại',
              'normal'
            );
            this.tokenService.removeToken();
            this.router.navigate(['/auth/shop/login']);
          }
        } else {
          this.router.navigate(['/auth/shop/login']);
        }
      }
    });
    this.auto();
  }
  async auto() {
    const voucherAuto = await this.autoVoucher.autoVoucher().toPromise();
  }
  openSlide() {
    if (this.isOpen) {
      this.actionNavItems.map((a) => {
        a.open = false;
      });
    }
    this.isOpen = !this.isOpen;
  }
  logOut() {
    this.tokenService.removeToken();
    this.errorService.displayError('Đăng xuất thành công', 'normal');
    this.router.navigate(['/auth/shop/login']);
  }
  ngOnDestroy(): void {
    this.errorSubscription?.unsubscribe();
  }
}
