import { Component, OnInit } from '@angular/core';
import { MuaHangService } from '../../services/mua-hang.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';
import { KhachHangServiceService } from 'src/app/components/admin/service/khach-hang-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDiaChiComponent, DialogConfirmComponent } from 'src/app/components/admin';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { BroadcastService } from 'src/app/services/broadcast.service';
interface Item {
  name: string;
  quantity: number;
  height: number;
  weight: number;
  length: number;
  width: number;
}

interface Data {
  service_type_id: number;
  from_district_id: number;
  to_district_id: number;
  to_ward_code: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  items: Item[];
}
@Component({
  selector: 'app-clinet-card-online',
  templateUrl: './clinet-card-online.component.html',
  styleUrls: ['./clinet-card-online.component.scss'],
})
export class ClinetCardOnlineComponent implements OnInit {
  steps = [1, 2, 3]; // Danh sách các bước
  currentStep = 1; // Bước hiện tại
  listGh: any[] = [];
  isSomeThingCheck: boolean = false;
  //
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData: any;
  //  tinh thanh
  data: any = {};
  //
  listTinhThanh: any[] = [];
  //
  listQuanHuyen: any[] = [];
  //
  listQuanXa: any[] = [];
  //
  ghiChu: any;
  //
  visible: boolean = false;
  visibleVoucher: boolean = false;
  visibleThanhToan : boolean = false;
  optionPhuongThucThanhToan = [
    { id: 2, title: 'Online' },
    { id: 3, title: 'Thanh toán sau khi nhận hàng' },
  ];
  productList: { sanPham: any; chiTietSanPham: any[]; isShow: boolean }[] = [];
  //
  listVoucherKhanhHang: any;
  voucherHoaDon: any = {};
  voucherVanChuyen: any = {};
  constructor(
    private service: MuaHangService,
    private tokenService: TokenService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private serviceLocation: DiaChiServiceService,
    private serviceDiaChi: KhachHangServiceService,
    private dialog: MatDialog,
    private errorService: ErrorTsService,
    private broadcastService: BroadcastService
  ) {}

  ngOnInit(): void {
    this.broadcastService.data$.subscribe(data => {
      if (data) {
        // nhận được dữ liệu kho thành toán thành công
        this.thanhToanOnline(data.idhd , data.message)
      }
    });
    const { decoded } = this.tokenService.getToken();
    if (!decoded) {
      this.router.navigate(['/g4/shop/login']);
    }
    this.searchQuery.idKhachHang = decoded.user.id;
    this.getGioHang();
    this.getAllTinhThanh();
    this.getAllDiaChi('rows');
    this.data.optionPhuongThucThanhToan = 3;
    this.getAllVoucher();
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
    // if(this.currentStep === 1){
    //   if(!this.data.tongTien|| this.data.tongTien === 0){
    //     this.errorService.displayError('Vui lòng chọn sản phẩm để sang bước tiếp theo','normal')
    //     return;
    //   }
    // }
    // if(this.currentStep === 2){
    //   if(!this.data.idTinhThanh || !this.data.idPhuongXa || !this.data.idQuanHuyen || !this.data.tenNguoiNhan || !this.data.sdtNguoiNhan){
    //     this.errorService.displayError('Vui lòng không để trống thông tin giao hàng','normal')
    //     return;
    //   }
    // }
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
      this.listGh.map((item: any) => {
        // nếu có giảm giá
        if (item.sanPhamChiTiet.sanPham.giamGia?.id) {
          const ngayBatDau = new Date(
            item.sanPhamChiTiet.sanPham.giamGia.ngayBatDau
          );
          const ngayKetThuc = new Date(
            item.sanPhamChiTiet.sanPham.giamGia.ngayKetThuc
          );
          const today = new Date(); // Ngày hôm nay
          // Kiểm tra xem ngày hôm nay có nằm trong khoảng không
          const isSale = today >= ngayBatDau && today <= ngayKetThuc;
          item.isSale = isSale;
          if (isSale) {
            item.salePrice =
              item.sanPhamChiTiet.giaBan -
              (item.sanPhamChiTiet.giaBan *
                item.sanPhamChiTiet.sanPham.giamGia.mucGiam) /
                100;
            item.mucGiam = item.sanPhamChiTiet.sanPham.giamGia.mucGiam;
          }
        } else {
          item.isSale = false;
          item.salePrice = item.sanPhamChiTiet.giaBan;
        }
      });
      this.productList = this.groupByProductId(this.listGh);
      // this.listGh = data;
      this.spinner.hide();
    }
  }
  groupByProductId(
    data: any[]
  ): { sanPham: any; chiTietSanPham: any[]; isShow: boolean }[] {
    const result: {
      [key: number]: { sanPham: any; chiTietSanPham: any[]; isShow: boolean };
    } = {};

    for (const item of data) {
      const productId = item.sanPhamChiTiet.sanPham.id;
      if (!result[productId]) {
        result[productId] = {
          sanPham: item.sanPhamChiTiet.sanPham,
          chiTietSanPham: [],
          isShow: true,
        };
      }
      result[productId].chiTietSanPham.push(item); // Thay đổi ở đây
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
          khachHang: {
            id: this.searchQuery.idKhachHang,
          },
        },
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.visible = true;
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
    this.errorService.displayError(`Đã sử dụng địa chỉ này`, 'success');
    this.getShipPrice();
  }
  checkPTGH() {}
  changeTinhThanh() {
    if (this.data.idTinhThanh !== null) {
      this.getAllQuanHuyen(this.data.idTinhThanh);
      const data = this.listTinhThanh.find(
        (item) => item.ProvinceID === this.data.idTinhThanh
      );
      this.data.tinhThanh = data.ProvinceName;
    } else {
      this.listQuanHuyen = [];
      this.listQuanXa = [];
      this.data.tinhThanh = null;
      this.data.quanHuyen = null;
      this.data.phuongXa = null;
    }
    this.getShipPrice();
  }
  changeQuanHuyen() {
    if (this.data.idQuanHuyen !== null) {
      this.getAllPhuongXa(this.data.idQuanHuyen);
      const data = this.listQuanHuyen.find(
        (item) => item.DistrictID === this.data.idQuanHuyen
      );
      this.data.quanHuyen = data.DistrictName;
    } else {
      this.listQuanXa = [];
      this.data.quanHuyen = null;
      this.data.phuongXa = null;
    }
    this.getShipPrice();
  }
  changePhuongXa() {
    if (this.data.idPhuongXa !== null) {
      const data = this.listQuanXa.find(
        (item) => item.WardCode === this.data.idPhuongXa
      );
      this.data.phuongXa = data.WardName;
    } else {
      this.data.phuongXa = null;
    }
    this.getShipPrice();
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
  useInfoCustumer() {
    const { decoded } = this.tokenService.getToken();
    this.data.tenNguoiNhan = decoded.user.hoTen;
    this.data.sdtNguoiNhan = decoded.user.soDienThoai;
  }
  choseOptionThanhToan() {}
  checkAll(event: any, item: any) {
    event.stopPropagation();
    item.chiTietSanPham.map((a: any) => {
      a.isChecked = item.sanPham.isCheckAll;
    });
    this.tinhhTongTien();
    this.getShipPrice();
  }
  checkDetail(event: any, item: any) {
    event.stopPropagation();
    item.sanPham.isCheckAll = item.chiTietSanPham.every(
      (item: any) => item.isChecked === true
    );
    this.tinhhTongTien();
    this.getShipPrice();
  }
  tinhhTongTien() {
    let tongTien = 0;
    this.productList.map((item: any) => {
      item.chiTietSanPham.map((detail: any) => {
        if (detail.isChecked) {
          tongTien += detail.salePrice * detail.soLuong;
        }
      });
    });
    this.data.tongTien = tongTien;
    this.updateVoucherList();
    
  }
  async getShipPrice() {
    if (
      !this.data.tongTien ||
      this.data.tongTien === 0 ||
      !this.data.idTinhThanh ||
      !this.data.idQuanHuyen ||
      !this.data.idPhuongXa
    ) {
      this.data.phiShip = 0;
      return;
    }
    let listDataHoaDonCt: any[] = [];
    this.productList.map((item: any) => {
      item.chiTietSanPham.map((detail: any) => {
        if (detail.isChecked) {
          listDataHoaDonCt.push(detail);
        }
      });
    });
    let data: Data = {
      service_type_id: 2,
      from_district_id: 201,
      height: 0,
      length: 0,
      width: 0,
      to_district_id: Number(this.data.idQuanHuyen),
      to_ward_code: this.data.idPhuongXa + '',
      weight: 0,
      items: [],
    };
    this.productList;
    listDataHoaDonCt.map((item: any) => {
      data.height += 5;
      data.length += 5;
      data.width += 5;
      data.weight += item?.sanPhamChiTiet?.sanPham?.trongLuong * item?.soLuong;
      data.items.push({
        name: item.id + '',
        quantity: item.soLuong,
        height: 5,
        weight: item?.sanPhamChiTiet?.sanPham?.trongLuong * item?.soLuong,
        length: 5,
        width: 5,
      });
    });
    const api = await this.serviceLocation.getOder(data).toPromise();
    if (api) {
      if (api.code === 200) {
        this.data.phiShip = Math.ceil(api.data.total) || 25000;
      } else {
        data.service_type_id = 5;
        const api5 = await this.serviceLocation.getOder(data).toPromise();
        if (api5) {
          if (api5.code === 200) {
            this.data.phiShip = Math.ceil(api5.data.total) * 0.1 || 25000;
          } else {
            this.data.phiShip = 35000;
          }
        }
      }
    }
    this.updateVoucherList();
  }
  async getAllVoucher() {
    const data = await this.service
      .getVoucherKhachHang(this.searchQuery.idKhachHang)
      .toPromise();
    if (data) {
      data.map((item: any) => {
        const ngayBatDau = new Date(item.ngayBatDau);
        const ngayKetThuc = new Date(item.ngayKetThuc);
        const today = new Date(); // Ngày hôm nay
        const isUse = today >= ngayBatDau && today <= ngayKetThuc;
        item.sale = isUse;
      });
      let newDataGop: { voucherHoaDon: any[]; voucherVanCHuyen: any[] } = {
        voucherHoaDon: [],
        voucherVanCHuyen: [],
      };
      data.map((item: any) => {
        if (item.voucher.theLoai === 0) {
          newDataGop.voucherHoaDon.push(item);
        } else {
          newDataGop.voucherVanCHuyen.push(item);
        }
      });
      this.listVoucherKhanhHang = newDataGop;
      this.updateVoucherList();
    }
  }
  useVoucher(item: any, type: string) {
    if (type === 'bill') {
      if (item.isChecked) {
        item.isChecked = false;
      } else {
        this.listVoucherKhanhHang.voucherHoaDon.map((voucher: any) => {
          if (item.id === voucher.id) {
            voucher.isChecked = true;
            this.voucherHoaDon = voucher;
          } else {
            voucher.isChecked = false;
          }
        });
      }
    }
    if (type === 'ship') {
      if (item.isChecked) {
        item.isChecked = false;
      } else {
        this.listVoucherKhanhHang.voucherVanCHuyen.map((voucher: any) => {
          if (item.id === voucher.id) {
            voucher.isChecked = true;
            this.voucherVanChuyen = voucher;
          } else {
            voucher.isChecked = false;
          }
        });
      }
    }
    this.tinhToanVoucherHoaDon();
  }
  tinhToanVoucherHoaDon(){
    this.data.giamGiaHoaDon = 0;
    this.data.giamGiaVanChuyen = 0;
      this.listVoucherKhanhHang.voucherHoaDon.map((item : any) =>{
        if(item.isChecked){
          const discountValueByPercentage =  (this.data.tongTien * item.voucher.phanTramGiam) / 100;
          if(discountValueByPercentage <= item.voucher.giamToiDa){
            this.data.giamGiaHoaDon = discountValueByPercentage
          }else{
            this.data.giamGiaHoaDon = item.voucher.giamToiDa
          }
        }
      })
      this.listVoucherKhanhHang.voucherVanCHuyen.map((item : any) =>{
        if(item.isChecked){
          const discountValueByPercentage = (this.data.tienShip * item.voucher.phanTramGiam) / 100;
          if(discountValueByPercentage <= item.voucher.giamToiDa){
            this.data.giamGiaVanChuyen = discountValueByPercentage
          }else{
            this.data.giamGiaVanChuyen = item.voucher.giamToiDa
          }
        }
      })
  }
  updateVoucherList() {
    //
    // kiểm tra voucher hiện tại có phù hợp với giá tiền hay không
    if (this.voucherHoaDon) {
      if (this.data.tongTien < this.voucherHoaDon?.voucher?.giaTriGiamToiThieu) {
        this.voucherHoaDon.isUse = false;
      } else {
        this.voucherHoaDon.isUse = true;
      }
    }
    if (this.voucherVanChuyen) {
      if (
        this.data.phiShip < this.voucherVanChuyen?.voucher?.giaTriGiamToiThieu
      ) {
        this.voucherVanChuyen.isUse = false;
      } else {
        this.voucherVanChuyen.isUse = true;
      }
    }
    if (!this.data.tongTien) {
      this.data.tinhhTongTien = 0;
    }  
    if (!this.data.phiShip) {
      this.data.phiShip = 0;
    }  
    this.listVoucherKhanhHang?.voucherHoaDon.map((item: any) => {    
      if (this.data.tongTien >= item.voucher.giaTriGiamToiThieu) {
        item.isUse = true;
      }else{
        item.isUse = false;
        item.isChecked = false;
      }
    });
    this.listVoucherKhanhHang?.voucherVanCHuyen.map((item: any) => {
      if (this.data.phiShip >= item.voucher.giaTriGiamToiThieu) {
        item.isUse = true;
      }else{
        item.isUse = false;
        item.isChecked = false;
      }
    });
    this.tinhToanVoucherHoaDon();
  }
  async submitThanhToan(){
    const orderDetails = {
      ghiChu: this.data.ghiChu,
      tenNguoiNhan:  this.data.tenNguoiNhan,
      sdtNguoiNhan:  this.data.sdtNguoiNhan,
      idTinhThanh:  this.data.idTinhThanh,
      tinhThanh:  this.data.tinhThanh,
      idQuanHuyen:  this.data.idQuanHuyen,
      quanHuyen:  this.data.quanHuyen,
      idPhuongXa:  this.data.idPhuongXa,
      phuongXa:  this.data.phuongXa,
      phiShip: this.data.phiShip,
      tongTien: this.data.tongTien +  this.data.phiShip - (this.data.giamGiaHoaDon + this.data.giamGiaVanChuyen),
      tongTienSanPhamChuaGiam: this.data.tongTien,
      tongTienGiam: this.data.giamGiaHoaDon + this.data.giamGiaVanChuyen,
      idGioHangChiTietList: [] as any[],
      idVoucherList: [] as any[],
      idKhachHang: this.searchQuery.idKhachHang
    };
    // push list gio hàng chi tiết vào 
    this.productList.map((item : any) =>{
      item.chiTietSanPham.map((product : any) =>{
        if(product.isChecked){
          orderDetails.idGioHangChiTietList.push(product.id)
        }
      })
    })
    //  thêm voucher vào giỏ hàng
    this.listVoucherKhanhHang.voucherHoaDon.map((a :any) =>{
      if(a.isChecked){
        orderDetails.idVoucherList.push(a.id)
      }
    })
    this.listVoucherKhanhHang.voucherVanCHuyen.map((a :any) =>{
      if(a.isChecked){
        orderDetails.idVoucherList.push(a.id)
      }
    })
    //check api
    if(this.data.optionPhuongThucThanhToan === 3){
      const data = await this.service.thanhToan3(orderDetails).toPromise();
      if (data?.errorCode) {
        this.errorService.displayError(data.messageError, 'error');
      } else {
        this.errorService.displayError(
          'Tạo hóa đơn thành công',
          'sussces'
        );
        this.data = {};
        this.getGioHang();
        this.getAllTinhThanh();
        this.getAllDiaChi('rows');
        this.data.optionPhuongThucThanhToan = 3;
        this.getAllVoucher();
    }
  }
    
    if(this.data.optionPhuongThucThanhToan === 2){
      // run url
      const data = await this.service.thanhToan3(orderDetails).toPromise();
      if (data?.errorCode) {
        this.errorService.displayError(data.messageError, 'error');
      } else {
        console.log(data);
        
      }
      // this.openCenteredPopup('http://localhost:4200/thanh-toan-online-res');
    }
   
  }
  openCenteredPopup(url: any) {
    const width = Math.floor(window.innerWidth * 0.9);  // Chiều rộng 90% màn hình
    const height = Math.floor(window.innerHeight * 0.9); // Chiều cao 90% màn hình
    
    // Tính toán vị trí để căn giữa
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    
    // Mở cửa sổ popup
    window.open(url, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
  }
  thanhToanOnline(idhd : any , trangThai : any){
    // gọi api ở đây bú bú bú 
  }
  async deleteAll(){
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        inputTitle: `Bạn có muốn xóa toàn bộ sản phẩm ?`,
        inputBtn: `Đồng ý xóa`,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const data = await this.service.DeleteAll(this.searchQuery.idKhachHang).toPromise();
        if(data){
          this.errorService.displayError('Xóa sản phẩm thành công','normal');
          await this.getGioHang();
          this.tinhhTongTien();
          this.getShipPrice();
          this.data.giamGiaVanChuyen = 0;
        }
      }
    });
  }
  async deleteChose(){
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        inputTitle: `Bạn có muốn xóa những sản phẩm ?`,
        inputBtn: `Đồng ý xóa`,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        // Tạo một mảng để lưu trữ các promise
        const deletePromises = this.productList.map((item: any) => {
          return Promise.all(item.chiTietSanPham.map(async (product: any) => {
            if (product.isChecked) {
              const data = await this.service.DeleteChose(product.id).toPromise();
              return data; // Trả về kết quả của mỗi promise
            }
          }));
        });
      
        // Chờ tất cả các promise hoàn thành
        Promise.all(deletePromises)
          .then(async () => {
            this.errorService.displayError('Xóa sản phẩm thành công', 'normal');
             await this.getGioHang();
             this.tinhhTongTien();
             this.getShipPrice();
             this.data.giamGiaVanChuyen = 0;
          })
          .catch(error => {
            // Xử lý lỗi nếu có
            this.errorService.displayError('Có lỗi xảy ra khi xóa sản phẩm', 'error');
            console.error(error);
          });
      }
    });
  }
}
