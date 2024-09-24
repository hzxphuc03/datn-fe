import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-layout-admin',
  templateUrl: './master-layout-admin.component.html',
  styleUrls: ['./master-layout-admin.component.scss'],
})
export class MasterLayoutAdminComponent implements OnInit {
  isOpen: boolean = true;
  constructor() {}

  ngOnInit(): void {}
  openSlide() {
    this.isOpen = !this.isOpen;
  }
}
