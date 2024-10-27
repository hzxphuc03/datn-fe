import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { ErrorTsService } from '../message/error.service';

@Component({
  selector: 'app-master-layout-admin',
  templateUrl: './master-layout-admin.component.html',
  styleUrls: ['./master-layout-admin.component.scss'],
})
export class MasterLayoutAdminComponent implements OnInit {
  isOpen: boolean = true;
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
  ];
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private errorService: ErrorTsService
  ) {}

  ngOnInit(): void {}
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
}
