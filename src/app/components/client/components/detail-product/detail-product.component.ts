import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HoaDonService } from 'src/app/components/admin/service/hoa-don.service';
import { CTSPServiceService } from 'src/app/components/admin/service/sp-ctsp-service.service';
import { TokenService } from 'src/app/services/token.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import {
  SwiperOptions,
  A11y,
  Autoplay,
  Mousewheel,
  Navigation,
  Pagination,
} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { MuaHangService } from '../../services/mua-hang.service';
import { DataService } from '../../services/data.service';
interface Size {
  size: string; // Hoặc 'any' nếu bạn không chắc chắn về kiểu
  id: number;
  idSP: any;
  soLuong: any;
  giaBan: any;
  hinhAnh: any;
  trangThai : any;
}

interface Color {
  coler: string;
  id: number;
  listSize: any[]; // Mảng chứa các kích thước
}
@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
})
export class DetailProductComponent implements OnInit {
  @ViewChild('swiperSlideShow') swiperRef!: SwiperComponent;
  @ViewChild('targetElement') targetElement!: ElementRef;
  id: any;
  getData: any;
  coler: Color[] = [];
  indexActiveColer: number = 1;
  indexActiveSize: number = 1;
  listImg: string[] = [];
  totalItem : any = 0;
  public config: SwiperOptions = {
    autoHeight: true,
    spaceBetween: 20,
    navigation: false,
    pagination: { clickable: true },
    slidesPerView: 1,
    centeredSlides: true,
    breakpoints: {
      400: {
        slidesPerView: 'auto',
        centeredSlides: false,
      },
    },
  };
  isGiamGia: boolean = false;
  phanTramGiam: number = 0;
  openAdd: boolean = false;
  soLuongWantToAdd: number = 0;
  fromMoneny: number = 0;
  toMoneny: number = 0;
  soLuongBuy: number = 1;
  danhGiaParams : any = {};
  listData : any[] = [];
  listPageNumber : any[] = [];
  private intervalId: any; // Khai báo biến để lưu ID của interval
  constructor(
    private route: ActivatedRoute,
    private errorService: ErrorTsService,
    private service: CTSPServiceService,
    private spinner: NgxSpinnerService,
    private serverHD: HoaDonService,
    private tokenService: TokenService,
    private router: Router,
    private gioHangService: MuaHangService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.danhGiaParams.idSanPham  = this.id;
        this.getAll(this.id);
      }
    });
    this.getListDataDanhGia('rows');;
    
    this.startAutoSlide();
    setTimeout(() => {
      this.scrollToTarget();
    }, 200);
  }
  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.slideNext(); // Gọi slideNext mỗi 4 giây
    }, 15000);
  }
  async getAll(id: any) {
    this.spinner.show();
    const data = await this.service.getByIdSP(id).toPromise();
    if (data) {
      this.getData = data;
      this.checkVoucher();
      this.custumData();
      this.imgs();
      this.spinner.hide();
    }
  }
  scrollToTarget() {
    this.targetElement.nativeElement.scrollIntoView({
      behavior: 'smooth', // Cuộn mượt mà
      block: 'center', // Vị trí cuộn đến
    });
  }
  checkVoucher() {
    if (this.getData && this.getData.sanPham.giamGia) {
      const today = new Date(); // Ngày hiện tại
      const ngayBatDau = new Date(this.getData?.sanPham.giamGia.ngayBatDau);
      const ngayKetThuc = new Date(this.getData?.sanPham.giamGia.ngayKetThuc);
      if (today >= ngayBatDau && today <= ngayKetThuc) {
        this.isGiamGia = true;
        this.phanTramGiam = this.getData?.sanPham.giamGia.mucGiam;
        this.fromMoneny =
          this.getData?.sanPham.giaThapNhat -
          (this.getData?.sanPham.giaThapNhat * this.phanTramGiam) / 100;

        this.toMoneny =
          this.getData?.sanPham.giaCaoNhat -
          (this.getData?.sanPham.giaCaoNhat * this.phanTramGiam) / 100;
      }
    }
  }
  imgs() {
    this.listImg.push(this.getData?.sanPham?.hinhAnh);
    if (this.getData && this.getData.sanPhamChiTietList) {
      this.getData.sanPhamChiTietList.map((item: any) => {
        this.listImg.push(item.hinhAnh);
      });
    }
  }
  custumData() {
    if (this.getData && this.getData.sanPhamChiTietList) {
      this.getData.sanPhamChiTietList.map((item: any) => {
        // Kiểm tra xem màu đã tồn tại trong mảng
        if (!this.coler.some((a: Color) => a.coler === item?.mauSac.maMau)) {
          const coler: Color = {
            coler: item?.mauSac.maMau,
            id: item?.mauSac.id,
            listSize: [], // Khởi tạo mảng listSize rỗng
          };

          // Thêm kích thước vào listSize
          coler?.listSize.push({
            size: item.kichCo.ten, // Giả định ten là string
            id: item.kichCo.id, // Giả định id là number
            idSP: item.id,
            soLuong: item.soLuong,
            giaBan: item.giaBan,
            hinhAnh: item.hinhAnh,
            trangThai : item.trangThai
          });

          this.coler.push(coler); // Thêm đối tượng vào mảng
        } else {
          // Nếu màu đã tồn tại, thêm kích thước vào listSize của màu đó
          const existingColor = this.coler.find(
            (a: Color) => a.coler === item?.mauSac.maMau
          );
          if (existingColor) {
            existingColor?.listSize.push({
              size: item.kichCo.ten,
              id: item.kichCo.id,
              idSP: item.id,
              soLuong: item.soLuong,
              giaBan: item.giaBan,
              hinhAnh: item.hinhAnh,
              trangThai : item.trangThai
            });
          }
        }
      });
    }
    const listSize = this.coler[this.indexActiveColer - 1]?.listSize;
    if (listSize) {
      listSize?.some((item, index) => {
          if (item.trangThai !== 0) {
              this.indexActiveSize = index + 1; // Gán giá trị cho indexActiveSize
              return true; // Dừng vòng lặp
          }
          return false; // Tiếp tục vòng lặp
      });
  }
    
  }
  async addSPToGHCT() {
    this.checkToken();
    const { decoded } = this.tokenService.getToken();
    const param = {
      soLuong: this.soLuongBuy,
      idKhachhang: decoded.user.id,
      idSanPhamChiTiet:
        this.coler[this.indexActiveColer - 1]?.listSize[this.indexActiveSize - 1]
          ?.idSP,
    };
    const data = await this.gioHangService
      .themSanPhamVaoGioHang(param)
      .toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
      } else {
        this.dataService.updateData('');
        this.errorService.displayError(
          `Thêm vào giỏ hàng thành công`,
          'success'
        );
      }
    }
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
  slideNext() {
    this.swiperRef?.swiperRef?.slideNext(); // Gọi slideNext
  }
  slidePrev() {
    this.swiperRef?.swiperRef?.slidePrev(); // Gọi slidePrev
  }
  change(index : any){
    this.indexActiveColer =  index;
    const listSize = this.coler[this.indexActiveColer - 1]?.listSize;
    if (listSize) {
      listSize?.some((item, index) => {
          if (item.trangThai !== 0) {
              this.indexActiveSize = index + 1; // Gán giá trị cho indexActiveSize
              return true; // Dừng vòng lặp
          }
          return false; // Tiếp tục vòng lặp
      });
  }

  }
  async getListDataDanhGia(type: string, action?: string): Promise<void> {
    // this.spinner.show();
    if (type && type === 'rows') {
      this.danhGiaParams.page = 1;
    }
    if (action) {
      if (action === 'prev' && Number(this.danhGiaParams.page) > 1) {
        this.danhGiaParams.page = Number(this.danhGiaParams.page) - 1;
      }
      if (
        action === 'next' &&
        Number(this.danhGiaParams.page) + 1 <= this.listPageNumber.length
      ) {
        this.danhGiaParams.page = Number(this.danhGiaParams.page) + 1;
      }
    } else {
      this.danhGiaParams.page = this.danhGiaParams.page;
    }
    Object.keys(this.danhGiaParams).forEach((key) => {
      if (this.danhGiaParams[key] === null || this.danhGiaParams[key] === '') {
        delete this.danhGiaParams[key];
      }
    });
    this.spinner.show();
    const data = await this.service.getAllDanhGia(this.danhGiaParams).toPromise();
    if (data) {
      this.getTotalPage(data);
      if (data.item.length) {
        data.item?.map((item: any) => {
          this.listData.push(item);
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
    this.totalItem = data.totalItem;
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
}
