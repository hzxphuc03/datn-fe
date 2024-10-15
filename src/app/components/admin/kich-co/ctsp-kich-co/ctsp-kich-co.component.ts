import { Component, Inject, OnInit } from '@angular/core';
import { KIchCoServiceService } from '../../service/kich-co-service.service copy';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-ctsp-kich-co',
  templateUrl: './ctsp-kich-co.component.html',
  styleUrls: ['./ctsp-kich-co.component.scss'],
})
export class CtspKichCoComponent implements OnInit {
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData = [];
  optionStatus: any = [
    { value: '1', name: 'Hoạt Động' },
    { value: '0', name: 'Dừng Hoạt Động' },
  ];
  openDialog: boolean = false;
  dataDialog: any;
  constructor(
    private service: KIchCoServiceService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private matDialogRef: MatDialogRef<CtspKichCoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
          if (item.trangThai === 1) {
            item.status = true;
          } else {
            item.status = false;
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
    this.openDialog = true;
    this.dataDialog = item;
  }
  getAction(event: any) {
    this.openDialog = false;
    this.getListWords('page');
    this.dataDialog = {};
  }
  add() {
    this.openDialog = true;
    this.dataDialog = {};
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
  getColer(coler: any) {
    this.matDialogRef.close(coler);
  }
}
