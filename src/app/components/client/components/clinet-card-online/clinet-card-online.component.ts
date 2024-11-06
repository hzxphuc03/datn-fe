import { Component, OnInit } from '@angular/core';
import { MuaHangService } from '../../services/mua-hang.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';
import { KhachHangServiceService } from 'src/app/components/admin/service/khach-hang-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDiaChiComponent } from 'src/app/components/admin';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-clinet-card-online',
  templateUrl: './clinet-card-online.component.html',
  styleUrls: ['./clinet-card-online.component.scss'],
})
export class ClinetCardOnlineComponent implements OnInit {
  steps = [1, 2, 3, 4]; // Danh sách các bước
  currentStep = 1; // Bước hiện tại
  listGh: any[] = [];
  //
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData: any;
  //  tinh thanh
  data : any = {};
//
  listTinhThanh: any[] = [];
  //
  listQuanHuyen: any[] = [];
  //
  listQuanXa: any[] = [];
  //
  ghiChu: any;
  //
  optionPhuongThucThanhToan = [
    {id : 2 , title : 'Online'},
    {id : 3 , title : 'Thanh toán sau khi nhận hàng'},
  ]
  productList: { sanPham: any, chiTietSanPham: any[] , isShow : boolean}[] = [];
  //
  constructor(
    private service: MuaHangService,
    private tokenService: TokenService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private serviceLocation: DiaChiServiceService,
    private serviceDiaChi: KhachHangServiceService,
    private dialog: MatDialog,
    private errorService: ErrorTsService,
  ) {}

  ngOnInit(): void {
    const { decoded } = this.tokenService.getToken();
    this.searchQuery.idKhachHang = decoded.user.id;
    this.getGioHang();
    this.getAllTinhThanh();
    this.getAllDiaChi('rows');
    this.data.optionPhuongThucThanhToan = 2;
  }
  async getAllDiaChi(type: string, action?: string): Promise<void> {
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
    const data = await this.serviceDiaChi
      .getDiaChiByKH(this.searchQuery)
      .toPromise();
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
  async getAllTinhThanh() {
    this.spinner.show();
    const data = await this.serviceLocation.getAllTinhThanh().toPromise();
    if (data) {
      this.listTinhThanh = data.data;
      this.spinner.hide();
    }
  }
  get progressWidth(): number {
    return ((this.currentStep - 1) / (this.steps.length - 1)) * 100;
  }
  next(): void {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
  }

  prev(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  async getGioHang() {
    this.checkToken();
    this.spinner.show();
    const { decoded } = this.tokenService.getToken();
    const data = await this.service
      .getGoHangByIdKH(decoded.user.id)
      .toPromise();
    if (data) {
      this.listGh = data;
      this.productList = this.groupByProductId(this.listGh);
      console.log(this.productList);
      
      // this.listGh = data;
      this.spinner.hide();
    }
  }
  groupByProductId(data: any[]): { sanPham: any, chiTietSanPham: any[] , isShow : boolean }[] {
    const result: { [key: number]: { sanPham: any, chiTietSanPham: any[] , isShow : boolean } } = {};

    for (const item of data) {
      const productId = item.sanPhamChiTiet.sanPham.id;
      if (!result[productId]) {
        result[productId] = { sanPham: item.sanPhamChiTiet.sanPham, chiTietSanPham: [] , isShow : true };
      }
      result[productId].chiTietSanPham.push(item.sanPhamChiTiet);
    }

    return Object.values(result);
  }
  checkToken() {
    const isExpired = this.tokenService.isTokenExpired();
    const { decoded } = this.tokenService.getToken();
    const currentUrl = this.router.url;
    if (decoded) {
      if (isExpired || decoded.role !== 'KhachHang') {
        this.tokenService.removeToken();
        this.router.navigate(['/g4/shop/login'], {
          queryParams: { backurl: currentUrl },
        });
      }
    } else {
      this.router.navigate(['/g4/shop/login'], {
        queryParams: { backurl: currentUrl },
      });
    }
  }
  addLocation() {
    const dialogRef = this.dialog.open(AddDiaChiComponent, {
      data: {
        data: {
          khachHang :{
            id : this.searchQuery.idKhachHang
          }
        }
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllDiaChi('rows');
      }
    });
  }
  useLocation(item: any) {
    // chỉ khi có tinhThanh hoặc idQuanHuyen
    this.data.idTinhThanh = Number(item.idTinhThanh);
    this.data.tinhThanh = item.tinhThanh;
    this.data.idPhuongXa = item.idPhuongXa;
    this.data.quanHuyen = item.quanHuyen;
    this.data.idQuanHuyen = Number(item.idQuanHuyen);
    this.getAllPhuongXa(this.data.idQuanHuyen);
    this.getAllQuanHuyen(this.data.idTinhThanh);
    this.data.ghiChu = item.ghiChu;
    this.ghiChu = item.ghiChu;
    this.data.phuongXa = item.phuongXa;
    this.errorService.displayError(
      `Đã sử dụng địa chỉ này`,
      'success'
    );
  }
  checkPTGH() {}
  changeTinhThanh() {
    if (this.data.idTinhThanh !== null) {
      this.getAllQuanHuyen(this.data.idTinhThanh);
    } else {
      this.listQuanHuyen = [];
      this.listQuanXa = [];
    }
  }
  changeQuanHuyen() {
    if (this.data.idQuanHuyen !== null) {
      this.getAllPhuongXa(this.data.idQuanHuyen);
    } else {
      this.listQuanXa = [];
    }
  }
  async getAllQuanHuyen(id: any) {
    this.spinner.show();
    const data = await this.serviceLocation.getAllQuanHuyen(id).toPromise();
    if (data) {
      this.listQuanHuyen = data.data;
      this.spinner.hide();
    }
  }
  async getAllPhuongXa(id: any) {
    this.spinner.show();
    const data = await this.serviceLocation.getAllPhuongXa(id).toPromise();
    if (data) {
      this.listQuanXa = data.data;
      this.spinner.hide();
    }
  }
  useInfoCustumer(){

  }
  choseOptionThanhToan(){
    
  }
  checkAll(event : any , item : any){
    event.stopPropagation();
    item.chiTietSanPham.map((a : any)=>{
      a.isChecked = item.sanPham.isCheckAll;
    })
    this.tinhhTongTien();
    
  }
  checkDetail(event : any , item : any){
    event.stopPropagation();
    item.sanPham.isCheckAll =  item.chiTietSanPham.every((item : any) => item.isChecked === true);
    this.tinhhTongTien();
  }
  tinhhTongTien(){
    let tongTien = 0;
    this.productList.map((item : any) =>{
      item.chiTietSanPham.map((detail : any) =>{
        if(detail.isChecked){
          tongTien += detail.giaBan * detail.soLuong
        }
      })
    })
    this.data.tongTien = tongTien;
  }
}
