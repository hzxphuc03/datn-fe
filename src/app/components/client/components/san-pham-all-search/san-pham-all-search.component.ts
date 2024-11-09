import { Component, OnInit } from '@angular/core';
import { HomeServoceService } from '../../services/home-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-san-pham-all-search',
  templateUrl: './san-pham-all-search.component.html',
  styleUrls: ['./san-pham-all-search.component.scss']
})
export class SanPhamAllSearchComponent implements OnInit {
  get12update : any[] = [];
  listvatLieu : any[] = [];
  listTheLoai : any[] = [];
  listThuongHieu : any[] = [];
  listLoaiDe : any[] = [];
  listLoaiCo : any[] = [];
  listGiamGia : any[] = [];
  isOpenThuongHieu : boolean = false;
  isOpenVatLieu : boolean = false;
  isOpenTheLoai : boolean = false;
  isOpenLoaiDe : boolean = false;
  isOpenLoaiCo : boolean = false;
  isOpenGiamGia : boolean = false;

  searchQuery: any = {};

  listPageNumber: number[] = [];
  listData : any[] = [];
  // phân trang
  totalPages: number = 12; // Tổng số trang
  currentPage: number = 1;  // Trang hiện tại
  constructor(  private service: HomeServoceService,  private spinner: NgxSpinnerService,private router : Router) { }

  ngOnInit(): void {
    // this.searchQuery.pageSize = 2;
    this.searchQuery.sort = 1;
    this.getListWords('rows');
    this.getAllvatLieu(); 
    this.getAlltheLoai();
    this.getAllThuongHieu();
    this.getAllLoaiDe();
    this.getAllLoaiCo();
    this.getAllGiamGia();
  }
  async getListWords(type: string, action?: string): Promise<void> {
    this.spinner.show();
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
    const data = await this.service.getAllSearch(this.searchQuery).toPromise();
    if (data) {
      data.body.item.map((item : any) =>{
        item.status = (new Date().getTime() - new Date(item.ngayTao).getTime()) < (7 * 24 * 60 * 60 * 1000) ? 'NEW' : item.status;
        const today = new Date().setHours(0, 0, 0, 0);
        item.status = (today >= new Date(item.giamGia?.ngayBatDau).getTime() && today <= new Date(item.giamGia?.ngayKetThuc).getTime()) ? 'SALE' : item.status;
        item.isSales = (today >= new Date(item.giamGia?.ngayBatDau).getTime() && today <= new Date(item.giamGia?.ngayKetThuc).getTime()) ? true : false;
      })
      this.getTotalPage(data.body);
      this.listData = data.body.item;   
      setTimeout(()=>{
        this.spinner.hide();
      },300)   
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
  async get12SanPhamMoiCapNhat(){
    const data = await this.service.getTop12UpdateMoiNhat().toPromise();
    if (data) {
      // custum data
      data.map((item : any) =>{
        item.status = (new Date().getTime() - new Date(item.ngayTao).getTime()) < (7 * 24 * 60 * 60 * 1000) ? 'NEW' : item.status;
        const today = new Date().setHours(0, 0, 0, 0);
        item.status = (today >= new Date(item.giamGia?.ngayBatDau).getTime() && today <= new Date(item.giamGia?.ngayKetThuc).getTime()) ? 'SALE' : item.status;
        item.isSales = (today >= new Date(item.giamGia?.ngayBatDau).getTime() && today <= new Date(item.giamGia?.ngayKetThuc).getTime()) ? true : false;
      })
      this.get12update = data;      
    }
  }
  async getAllvatLieu(){
    const data = await this.service.getAllVatLieu().toPromise();
    if (data) {
     this.listvatLieu = data.body;
  }
}
  async getAlltheLoai(){
    const data = await this.service.getAllTheLoai().toPromise();
    if (data) {
     this.listTheLoai = data;;
  }
}
  async getAllThuongHieu(){
    const data = await this.service.getAllThuongHieu().toPromise();
    if (data) {
     this.listThuongHieu = data;;
  }
}
  async getAllLoaiDe(){
    const data = await this.service.getAllLoaiDe().toPromise();
    if (data) {
     this.listLoaiDe = data.body;
  }
}
  async getAllLoaiCo(){
    const data = await this.service.getAllLoaiDe().toPromise();
    if (data) {
     this.listLoaiCo = data.body;
  }
}
  async getAllGiamGia(){
    const data = await this.service.getAllGiamGia().toPromise();
    if (data) {
     this.listGiamGia = data.body;
  }
}
chon(type : any , item : any){
  if(type === 'thuonghieu'){
    if(item.checked){
      this.searchQuery.thuongHieu = null;
    }else{
      this.searchQuery.thuongHieu = item.id;
    }
    this.listThuongHieu.forEach(now => {
      if(now.id === item.id){
        item.checked = !item.checked
      }else{
        now.checked = now.id === item.id; // Đặt checked cho item được chọn
      }
    });
  }
  if(type === 'vatlieu'){
    if(item.checked){
      this.searchQuery.vatLieu = null;
    }else{
      this.searchQuery.vatLieu = item.id;
    }
    this.listvatLieu.forEach(now => {
      if(now.id === item.id){
        item.checked = !item.checked
      }else{
        now.checked = now.id === item.id; // Đặt checked cho item được chọn
      }
    });
  }
  if(type === 'theloai'){
    if(item.checked){
      this.searchQuery.theLoai = null;
    }else{
      this.searchQuery.theloai = item.id;
    }
    this.listTheLoai.forEach(now => {
      if(now.id === item.id){
        item.checked = !item.checked
      }else{
        now.checked = now.id === item.id; // Đặt checked cho item được chọn
      }
    });
  }
  if(type === 'loaide'){
    if(item.checked){
      this.searchQuery.loaiDe = null;
    }else{
      this.searchQuery.loaiDe = item.id;
    }
    this.listLoaiDe.forEach(now => {
      if(now.id === item.id){
        item.checked = !item.checked
      }else{
        now.checked = now.id === item.id; // Đặt checked cho item được chọn
      }
    });
  }
  if(type === 'loaico'){
    if(item.checked){
      this.searchQuery.loaiCo = null;
    }else{
      this.searchQuery.loaiCo = item.id;
    }
    this.listLoaiCo.forEach(now => {
      if(now.id === item.id){
        item.checked = !item.checked
      }else{
        now.checked = now.id === item.id; // Đặt checked cho item được chọn
      }
    });
  }
  if(type === 'giamgia'){
    if(item.checked){
      this.searchQuery.giamGia = null;
    }else{
      this.searchQuery.giamGia = item.id;
    }
    this.listGiamGia.forEach(now => {
      if(now.id === item.id){
        item.checked = !item.checked
      }else{
        now.checked = now.id === item.id; // Đặt checked cho item được chọn
      }
    });
  }
  this.getListWords('rows')
}
get pages(): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 3; // Số trang hiển thị
  const index = this.listPageNumber.indexOf(this.currentPage);

  // Tính toán start và end
  const startIndex = Math.max(0, index - maxVisiblePages);
  const endIndex = Math.min(this.listPageNumber.length - 1, index + maxVisiblePages);

  // Luôn thêm trang đầu tiên
  if (this.listPageNumber[0] !== 1) {
    pages.push(1);
  }

  // Thêm dấu "..." nếu cần
  if (startIndex > 0) {
    pages.push('...');
  }

  // Thêm các trang từ startIndex đến endIndex
  for (let i = startIndex; i <= endIndex; i++) {
    pages.push(this.listPageNumber[i]);
  }

  // Thêm dấu "..." nếu cần
  if (endIndex < this.listPageNumber.length - 1) {
    pages.push('...');
  }

  // Luôn thêm trang cuối
  if (this.listPageNumber[this.listPageNumber.length - 1] !== this.listPageNumber.length) {
    pages.push(this.listPageNumber[this.listPageNumber.length - 1]);
  }

  return pages;
}

onPageChange(page: number | string): void {
  if (page === '...') return;  // Bỏ qua nếu nhấn vào dấu "..."
  if (page === '') return;  // Bỏ qua nếu nhấn vào dấu "..."
  if (page === null) return;  // Bỏ qua nếu nhấn vào dấu "..."
  if (page === undefined) return;  // Bỏ qua nếu nhấn vào dấu "..."
  this.currentPage = page as number; // Cập nhật trang hiện tại
  this.searchQuery.page = page as number;
  this.getListWords('');
}
nextPage(): void {
  const nextIndex = this.listPageNumber.indexOf(this.currentPage) + 1;
  if (nextIndex < this.listPageNumber.length) {
    this.currentPage = this.listPageNumber[nextIndex];
    this.searchQuery.page =  this.currentPage;
    this.getListWords('');
  }
}

previousPage(): void {
  const prevIndex = this.listPageNumber.indexOf(this.currentPage) - 1;
  if (prevIndex >= 0) {
    this.currentPage = this.listPageNumber[prevIndex];
    this.searchQuery.page =  this.currentPage;
    this.getListWords('');
  }
}
goToDetailSanPham(item: any) {
  this.router.navigate([`/g4/shop/san-pham/${item}`]);
}
}
