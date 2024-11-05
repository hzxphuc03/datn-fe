import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HoaDonService } from 'src/app/components/admin/service/hoa-don.service';
import { CTSPServiceService } from 'src/app/components/admin/service/sp-ctsp-service.service';
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
interface Size {
  size: string; // Hoặc 'any' nếu bạn không chắc chắn về kiểu
  id: number;
  idSP: any;
  soLuong: any;
  giaBan: any;
  hinhAnh: any;
}

interface Color {
  coler: string;
  id: number;
  listSize: Size[]; // Mảng chứa các kích thước
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
  private intervalId: any; // Khai báo biến để lưu ID của interval
  constructor(
    private route: ActivatedRoute,
    private errorService: ErrorTsService,
    private service: CTSPServiceService,
    private spinner: NgxSpinnerService,
    private serverHD: HoaDonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.getAll(this.id);
      }
    });
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
          coler.listSize.push({
            size: item.kichCo.ten, // Giả định ten là string
            id: item.kichCo.id, // Giả định id là number
            idSP: item.id,
            soLuong: item.soLuong,
            giaBan: item.giaBan,
            hinhAnh: item.hinhAnh,
          });

          this.coler.push(coler); // Thêm đối tượng vào mảng
        } else {
          // Nếu màu đã tồn tại, thêm kích thước vào listSize của màu đó
          const existingColor = this.coler.find(
            (a: Color) => a.coler === item?.mauSac.maMau
          );
          if (existingColor) {
            existingColor.listSize.push({
              size: item.kichCo.ten,
              id: item.kichCo.id,
              idSP: item.id,
              soLuong: item.soLuong,
              giaBan: item.giaBan,
              hinhAnh: item.hinhAnh,
            });
          }
        }
      });
    }
  }
  async addSPToGHCT() {}
  slideNext() {
    this.swiperRef.swiperRef.slideNext(); // Gọi slideNext
  }
  slidePrev() {
    this.swiperRef.swiperRef.slidePrev(); // Gọi slidePrev
  }
}
