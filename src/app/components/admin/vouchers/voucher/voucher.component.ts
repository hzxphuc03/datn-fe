import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../../service/voucher.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss'],
})
export class VoucherComponent implements OnInit {
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData = [];
  optionStatus: any = [
    { value: '1', name: 'Giảm hóa đơn' },
    { value: '2', name: 'Giảm giá ship' },
    { value: '0', name: 'Dừng Hoạt Động' },
  ];
  openDialog: boolean = false;
  dataDialog: any;
  constructor(
    private service: VoucherService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getListWords('rows');
  }
  async getListWords(type: string, action?: string): Promise<void> {
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
    const data = await this.service.getAll(this.searchQuery).toPromise();
    if (data) {
      this.getTotalPage(data);
      this.listData = data.item;
      if (this.listData.length) {
        this.listData?.map((item: any) => {
          const currentDate = new Date();
          const startDate = new Date(item.ngayBatDau);
          const endDate = new Date(item.ngayKetThuc);
          if (currentDate < startDate) {
            item.status = 'Chưa đến sự kiện';
          } else if (currentDate >= startDate && currentDate <= endDate) {
            item.status = 'Đang trong sự kiện';
          } else {
            item.status = 'Đã quá sự kiện';
          }
        });
      }

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
  filter() {
    this.getListWords('rows');
  }
  details(item: any) {
    this.router.navigate([`auth/admin/voucher/${item.id}`]);
  }
  getAction(event: any) {
    this.openDialog = false;
    this.getListWords('page');
    this.dataDialog = {};
  }
  add() {
    this.router.navigate(['auth/admin/voucher-add']);
  }
  noneClick(event: any) {
    event.stopPropagation();
  }
  async changeStatus(item: any) {
    const data = await this.service
      .udpateStatus(item.id, item.status ? 1 : 0)
      .toPromise();
    if (data) {
      this.getListWords('page');
    }
  }
}
