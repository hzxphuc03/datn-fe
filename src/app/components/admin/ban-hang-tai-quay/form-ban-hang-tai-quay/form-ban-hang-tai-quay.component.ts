import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { KhachHangPopupComponent } from '../khach-hang-popup/khach-hang-popup.component';
import { ThongTinNhanHangComponent } from '../thong-tin-nhan-hang/thong-tin-nhan-hang.component';
import { HoaDonService } from '../../service/hoa-don.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenService } from 'src/app/services/token.service';
import { ChiTietSanPhamBanHangComponent } from '../chi-tiet-san-pham/chi-tiet-san-pham.component';

@Component({
  selector: 'app-form-ban-hang-tai-quay',
  templateUrl: './form-ban-hang-tai-quay.component.html',
  styleUrls: ['./form-ban-hang-tai-quay.component.scss']
})
export class FormBanHangTaiQuayComponent implements OnInit {
  data : any = {};
  searchQuery: any = {};
  searchQueryCT: any = {};
  listHoaDonPageNumber: number[] = [];
  listHoaDonCtPageNumber: number[] = [];
  listDataHoaDon : any = [];
  listDataHoaDonCt : any = [];
  constructor(    private dialog: MatDialog,
    private errorService: ErrorTsService,
    private hoaDonService : HoaDonService,
    private spinner: NgxSpinnerService,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this.data.khachHang = {}
    const { decoded } = this.tokenService.getToken();
    if(decoded && decoded?.user.id){
      this.searchQuery.idNhanVien = decoded?.user.id
    }
    this.getListHoaDon('rows');    
  }
  getKhachHang(){
    const dialogRef = this.dialog.open(KhachHangPopupComponent, {
      data:  {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
       this.data.khachHang = result
       console.log(this.data);
      }
    });
  }
  thongTinNhanHang(){
    if(!this.data?.khachHang?.id){
      this.errorService.displayError('Vui lòng chọn khách hàng trước','normal');
      return;
    }
    const dialogRef = this.dialog.open(ThongTinNhanHangComponent, {
      data:  {
        data : this.data,
        
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
       
      }
    });
  }
  async getListHoaDon(type: string, action?: string): Promise<void> {
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
        Number(this.searchQuery.page) + 1 <= this.listHoaDonPageNumber.length
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
    const data = await this.hoaDonService.getAll(this.searchQuery).toPromise();
    if (data) {
      this.getTotalHoaDonPage(data);
      this.listDataHoaDon = data.item;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }

    //   gọi api
  }
  async getListCTHoaDon(type: string, action?: string): Promise<void> {
    // this.spinner.show();
    if (type && type === 'rows') {
      this.searchQueryCT.page = 1;
    }
    if (action) {
      if (action === 'prev' && Number(this.searchQueryCT.page) > 1) {
        this.searchQueryCT.page = Number(this.searchQueryCT.page) - 1;
      }
      if (
        action === 'next' &&
        Number(this.searchQueryCT.page) + 1 <= this.listHoaDonCtPageNumber.length
      ) {
        this.searchQueryCT.page = Number(this.searchQueryCT.page) + 1;
      }
    } else {
      this.searchQueryCT.page = this.searchQueryCT.page;
    }
    Object.keys(this.searchQueryCT).forEach((key) => {
      if (this.searchQueryCT[key] === null || this.searchQueryCT[key] === '') {
        delete this.searchQueryCT[key];
      }
    });
    this.spinner.show();
    const data = await this.hoaDonService.getAllCt(this.searchQueryCT).toPromise();
    if (data) {
      this.getTotalHoaDonCtPage(data);
      this.listDataHoaDonCt = data.item;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }

    //   gọi api
  }
  getTotalHoaDonCtPage(data: any): number {
    let totalPage = 0;
    if (Number(data.totalItem) < Number(data.pageSize)) {
      totalPage = 1;
    } else {
      totalPage = Math.floor(Number(data.totalItem) / Number(data.pageSize));
      if (Number(data.totalItem) % Number(data.pageSize) > 0) {
        totalPage = totalPage + 1;
      }
    }
    this.listHoaDonPageNumber = [];
    for (let i = 1; i <= totalPage; i++) {
      this.listHoaDonCtPageNumber.push(i);
    }
    return totalPage;
  }
  getTotalHoaDonPage(data: any): number {
    let totalPage = 0;
    if (Number(data.totalItem) < Number(data.pageSize)) {
      totalPage = 1;
    } else {
      totalPage = Math.floor(Number(data.totalItem) / Number(data.pageSize));
      if (Number(data.totalItem) % Number(data.pageSize) > 0) {
        totalPage = totalPage + 1;
      }
    }
    this.listHoaDonPageNumber = [];
    for (let i = 1; i <= totalPage; i++) {
      this.listHoaDonPageNumber.push(i);
    }
    return totalPage;
  }
  async addNhanhHoaDon(){
    this.spinner.show();
    const data = await this.hoaDonService.ThemNhanhHoaDon(this.searchQuery.idNhanVien).toPromise();
    if(data){
      this.errorService.displayError('Tạo hóa đơn thành công','sucsses')
      this.getListHoaDon('rows');    
      this.spinner.hide();
    }
  }
  detailHoaDon(item : any){
    this.data = item;
    if(!this?.data?.khachHang && !this?.data?.khachHang?.id){
      this.data.khachHang = {}
    }
    if(this.data){
      this.searchQueryCT = {}
      this.listHoaDonCtPageNumber = [];
      this.listDataHoaDonCt = [];
      this.searchQueryCT.idHoaDon = this.data.id;
      this.getListCTHoaDon('rows');
      console.log(this.listDataHoaDonCt);
      
      //chạy get all chiTietSanPham
    }
  }
  addSanPham(){
    if(!this.data.id){
      return;
    }
    const dialogRef = this.dialog.open(ChiTietSanPhamBanHangComponent, {
      data:  {
        idHoaDon : this.data.id,
      }, disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      
      }
    });
  }
}
