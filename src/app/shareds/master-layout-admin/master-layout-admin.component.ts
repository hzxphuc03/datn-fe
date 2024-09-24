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
    { icon: 'bx bx-cube', name: 'Product', url: '/auth/admin/home' },
  ];
  constructor() {}

  ngOnInit(): void {}
  openSlide() {
    this.isOpen = !this.isOpen;
  }
}
