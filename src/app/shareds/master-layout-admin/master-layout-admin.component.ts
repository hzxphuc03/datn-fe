import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-layout-admin',
  templateUrl: './master-layout-admin.component.html',
  styleUrls: ['./master-layout-admin.component.scss'],
})
export class MasterLayoutAdminComponent implements OnInit {
  isOpen: boolean = true;
  actionNavItems: any[] = [
    { icon: 'bx bx-home-circle', name: 'Home', url: '/auth/admin/home' },
    { icon: 'bx bx-cube', name: 'Thương hiệu', url: '/auth/admin/thuong-hieu' },
    { icon: 'bx bx-cube', name: 'Thể loại', url: '/auth/admin/the-loai' },
    { icon: 'bx bx-cube', name: 'Kích cỡ', url: '/auth/admin/kich-co' },
    { icon: 'bx bx-cube', name: 'CTSP', url: '/auth/admin/chi-tiet-san-pham' },
  ];
  constructor() {}

  ngOnInit(): void {}
  openSlide() {
    this.isOpen = !this.isOpen;
  }
}
