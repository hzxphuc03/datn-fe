import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KhachHangServiceService } from '../../service/khach-hang-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddDiaChiComponent } from '../../khach-hang/add-dia-chi/add-dia-chi.component';

@Component({
  selector: 'app-thong-tin-nhan-hang',
  templateUrl: './thong-tin-nhan-hang.component.html',
  styleUrls: ['./thong-tin-nhan-hang.component.scss'],
})
export class ThongTinNhanHangComponent implements OnInit {
  data : any ;
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData : any;
  constructor(
    private matDialogRef: MatDialogRef<ThongTinNhanHangComponent>,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private serviceDiaChi : KhachHangServiceService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) {
    this.data = getData.data;
    this.searchQuery.idKhachHang = this.data?.khachHang?.id;
    this.getListWords('rows')
  }
  ngOnInit(): void {}
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
    const data = await this.serviceDiaChi.getDiaChiByKH(this.searchQuery).toPromise();
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
  addLocation(){
    const dialogRef = this.dialog.open(AddDiaChiComponent, {
      data:  {
        data : this.data,
        
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
       
      }
    });
  }
}
