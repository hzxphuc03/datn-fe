import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HomeServoceService } from '../../services/home-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import SwiperCore, { A11y, Autoplay, Mousewheel, Navigation, Pagination, SwiperOptions } from 'swiper'
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit,AfterViewInit {
  @ViewChild('swiperSlideShow') swiperRef!: SwiperComponent;
  topsNew: any[] = [];
  topsSale: any[] = [];
  topsSell: any[] = [];
  private intervalId: any; // Khai báo biến để lưu ID của interval
  public config: SwiperOptions = {
    autoHeight: true,
    autoplay : true,
    loop : true,
    spaceBetween: 20,
    navigation: false,
    pagination: {clickable: true, dynamicBullets: true},
    slidesPerView: 1,
    centeredSlides: true,
    breakpoints: {
      400: {
        slidesPerView: "auto",
        centeredSlides: false
      },
    }
  }
  constructor(
    private service: HomeServoceService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(){
  }
  slideNext() {
    this.swiperRef.swiperRef.slideNext(); // Gọi slideNext
  }

  slidePrev() {
    this.swiperRef.swiperRef.slidePrev(); // Gọi slidePrev
  }

  async ngOnInit() {
    this.startAutoSlide(); // Bắt đầu tự động chuyển slide khi khởi tạo
    this.spinner.show();
    this.getTop5BanChay();
    this.getTop5GiamGia();
    this.getTop5SanPhamMoi();
    this.spinner.hide();
  }
  ngOnDestroy() {
    clearInterval(this.intervalId); // Dọn dẹp interval khi component bị hủy
  }
  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.slideNext(); // Gọi slideNext mỗi 2 giây
    }, 4000);
  }

  async getTop5GiamGia() {
    const data = await this.service.getTop5GiamGia().toPromise();
    if (data) {
      const today = new Date();
      data.map((item: any) => {
        // Kiểm tra xem có giảm giá không
        if (item.giamGia && item.giamGia.id) {
          const start = new Date(item.giamGia.ngayBatDau);
          const end = new Date(item.giamGia.ngayKetThuc);
          // Kiểm tra nếu hôm nay nằm trong khoảng giảm giá
          if (today >= start && today <= end) {
            item.isSales = true; // Gán true nếu đang trong thời gian giảm giá
            item.afterSaleHighest =
              item.giaCaoNhat - (item.giaCaoNhat * item.giamGia.mucGiam) / 100;
            item.afterSaleLowst =
              item.giaThapNhat -
              (item.giaThapNhat * item.giamGia.mucGiam) / 100;
          } else {
            item.isSales = false; // Gán false nếu không còn trong thời gian giảm giá
          }
        } else {
          item.isSales = false; // Không có thông tin giảm giá
        }
      });
      this.topsSale = data; // Gán dữ liệu đã cập nhật vào topsSale
    }
    // In ra để kiểm tra
  }
  async getTop5BanChay() {
    const data = await this.service.getTop5BanChay().toPromise();
    if (data) {
      const today = new Date();
      data.map((item: any) => {
        // Kiểm tra xem có giảm giá không
        if (item.giamGia && item.giamGia.id) {
          const start = new Date(item.giamGia.ngayBatDau);
          const end = new Date(item.giamGia.ngayKetThuc);
          // Kiểm tra nếu hôm nay nằm trong khoảng giảm giá
          if (today >= start && today <= end) {
            item.isSales = true; // Gán true nếu đang trong thời gian giảm giá
            item.afterSaleHighest =
              item.giaCaoNhat - (item.giaCaoNhat * item.giamGia.mucGiam) / 100;
            item.afterSaleLowst =
              item.giaThapNhat -
              (item.giaThapNhat * item.giamGia.mucGiam) / 100;
          } else {
            item.isSales = false; // Gán false nếu không còn trong thời gian giảm giá
          }
        } else {
          item.isSales = false; // Không có thông tin giảm giá
        }
      });
      this.topsSell = data; // Gán dữ liệu đã cập nhật vào topsSale
    }
  }
  async getTop5SanPhamMoi() {
    const data = await this.service.getTop5Moi().toPromise();
    if (data) {
      const today = new Date();
      data.map((item: any) => {
        // Kiểm tra xem có giảm giá không
        if (item.giamGia && item.giamGia.id) {
          const start = new Date(item.giamGia.ngayBatDau);
          const end = new Date(item.giamGia.ngayKetThuc);
          // Kiểm tra nếu hôm nay nằm trong khoảng giảm giá
          if (today >= start && today <= end) {
            item.isSales = true; // Gán true nếu đang trong thời gian giảm giá
            item.afterSaleHighest =
              item.giaCaoNhat - (item.giaCaoNhat * item.giamGia.mucGiam) / 100;
            item.afterSaleLowst =
              item.giaThapNhat -
              (item.giaThapNhat * item.giamGia.mucGiam) / 100;
          } else {
            item.isSales = false; // Gán false nếu không còn trong thời gian giảm giá
          }
        } else {
          item.isSales = false; // Không có thông tin giảm giá
        }
      });
      this.topsNew = data; // Gán dữ liệu đã cập nhật vào topsSale
  }
}
}
