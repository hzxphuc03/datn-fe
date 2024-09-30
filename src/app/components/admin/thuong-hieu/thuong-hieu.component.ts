import { Component, OnInit } from '@angular/core';
import { ThuongHieuServiceService } from '../service/thuong-hieu-service.service';

@Component({
  selector: 'app-thuong-hieu',
  templateUrl: './thuong-hieu.component.html',
  styleUrls: ['./thuong-hieu.component.scss'],
})
export class ThuongHieuComponent implements OnInit {
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData = [];
  optionStatus: any = [
    { value: '', name: 'All' },
    { value: '1', name: 'Hoạt Động' },
    { value: '0', name: 'Dừng Hoạt Động' },
  ];
  constructor(private service: ThuongHieuServiceService) {}

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
    const data = await this.service.getAll(this.searchQuery).toPromise();
    if (data) {
      this.getTotalPage(data);
      this.listData = data.item;
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
}
