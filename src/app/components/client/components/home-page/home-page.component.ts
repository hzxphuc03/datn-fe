import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HomeServoceService } from '../../services/home-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import SwiperCore, {
  A11y,
  Autoplay,
  Mousewheel,
  Navigation,
  Pagination,
  SwiperOptions,
} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FasterDetailComponent } from '../faster-detail/faster-detail.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, AfterViewInit {
  itemCategory = [
    {
      img: 'https://static.vecteezy.com/system/resources/previews/023/871/219/original/jordan-brand-logo-symbol-design-clothes-sportwear-illustration-with-black-background-free-vector.jpg',
      name: 'Jodan',
    },
    {
      img: 'https://tse2.mm.bing.net/th?id=OIP.EU9eW6G8cb7vKHpH7bb2aAHaEK&pid=Api&P=0&h=220',
      name: 'Nike',
    },
    {
      img: 'https://vectorified.com/image/adidas-logo-vector-3.png',
      name: 'Adidas',
    },
    {
      img: 'https://brandlogos.net/wp-content/uploads/2022/03/balenciaga-logo-brandlogos.net_.png',
      name: 'Balenciaga',
    },
    {
      img: 'https://i.ebayimg.com/images/g/t24AAOSwLu1kBlu4/s-l1600.webp',
      name: 'Vans ',
    },
    {
      img: 'https://static.vecteezy.com/system/resources/previews/022/101/105/non_2x/supreme-logo-transparent-free-png.png',
      name: 'Supreme',
    },
    {
      img: 'https://logolook.net/wp-content/uploads/2022/04/Converse-Logo-1977.png',
      name: 'Converse',
    },
    {
      img: 'https://logos-world.net/wp-content/uploads/2020/03/Asics-Emblem.png',
      name: 'Asics',
    },
    {
      img: 'https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo.png',
      name: 'Puma',
    },
    {
      img: 'https://logos-world.net/wp-content/uploads/2020/09/Fila-Symbol.png',
      name: 'Fila',
    },
  ];
  @ViewChild('swiperSlideShow') swiperRef!: SwiperComponent;
  @ViewChild('swiperSlideShowCategory') swiperRefCategory!: SwiperComponent;
  topsNew: any[] = [];
  topsTheLoai : any[] = [];
  topsSale: any[] = [];
  topsSell: any[] = [];
  allTheLoai: any[] = [];
  allSpTheLoai: any[] = [];
  //
  giamGiaSau: any;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  theLoaiParams: any = {};
  isHaveEvent : boolean = false;
  eventData : any;
  private timerSubscription: Subscription = new Subscription();
  //
  get12update: any[] = [];
  //
  private intervalId: any; // Khai báo biến để lưu ID của interval
  private intervalIdAc: any; // Khai báo biến để lưu ID của interval
  public config1: SwiperOptions = {
    autoHeight: true,
    autoplay: true,
    loop: true,
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
  constructor(
    private service: HomeServoceService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngAfterViewInit() {}
  slideNext() {
    this.swiperRef?.swiperRef?.slideNext(); // Gọi slideNext
  }
  slideNextAc() {
    this.swiperRefCategory?.swiperRef?.slideNext(); // Gọi slideNext
  }

  slidePrev() {
    this.swiperRef?.swiperRef?.slidePrev(); // Gọi slidePrev
  }

  async ngOnInit() {
    this.spinner.show();
    this.startAutoSlide(); // Bắt đầu tự động chuyển slide khi khởi tạo
    this.startAutoSlideAc();
    this.getAllTheLoai();
    this.getTop5BanChay();
    this.getTop5GiamGia();
    this.getTop5SanPhamMoi();
    this.getSanPhamSaleSauNhat();
    this.get12SanPhamMoiCapNhat();
    this.getEvent();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
  ngOnDestroy() {
    clearInterval(this.intervalId); // Dọn dẹp interval khi component bị hủy
    clearInterval(this.intervalIdAc); // Dọn dẹp interval khi component bị hủy
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.slideNext(); // Gọi slideNext mỗi 4 giây
    }, 5000);
  }
  startAutoSlideAc() {
    this.intervalIdAc = setInterval(() => {
      this.slideNextAc(); // Gọi slideNext mỗi 1 giây
    }, 2000);
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
  async getTop5SanPhamMoiTheoTheLhoai(id : any) {
    const data = await this.service.getTop5MoiTheoTheLoi(id).toPromise();
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
      this.topsTheLoai = data; // Gán dữ liệu đã cập nhật vào topsSale   
    }
  }
  async getSanPhamSaleSauNhat() {
    const data = await this.service.getTopGiamGiaSau().toPromise();
    if (data) {
      this.giamGiaSau = data;
      this.startCountdown();
    }
  }
  async get12SanPhamMoiCapNhat() {
    const data = await this.service.getTop12UpdateMoiNhat().toPromise();
    if (data) {
      // custum data
      data.map((item: any) => {
        item.status =
          new Date().getTime() - new Date(item.ngayTao).getTime() <
          7 * 24 * 60 * 60 * 1000
            ? 'NEW'
            : item.status;
        const today = new Date().setHours(0, 0, 0, 0);
        item.status =
          today >= new Date(item.giamGia?.ngayBatDau).getTime() &&
          today <= new Date(item.giamGia?.ngayKetThuc).getTime()
            ? 'SALE'
            : item.status;
        item.isSales =
          today >= new Date(item.giamGia?.ngayBatDau).getTime() &&
          today <= new Date(item.giamGia?.ngayKetThuc).getTime()
            ? true
            : false;
      });
      this.get12update = data;
    }
  }

  async getAllTheLoai() {
    const data = await this.service.getAllTheLoai().toPromise();
    if (data) {
      // custum data
      this.allTheLoai = data;
      this.getTop5SanPhamMoiTheoTheLhoai(this.allTheLoai[0].id);
      // this.getTop5SPByTheLoai();
    }
  }

  startCountdown() {
    const endDate = new Date(this.giamGiaSau.giamGia.ngayKetThuc).getTime();

    this.timerSubscription = interval(1000).subscribe(() => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance < 0) {
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.timerSubscription.unsubscribe();
        return;
      }

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    });
  }
  goToDetailSanPham(item: any) {
    this.router.navigate([`/g4/shop/san-pham/${item}`]);
  }
  async getTop5SPByTheLoai() {
    const data = await this.service
      .getTop5TheoTheLoai(this.theLoaiParams)
      .toPromise();
    if (data) {
      // custum data
      this.allSpTheLoai = data;      
    }
  }
  openFasterDialogDetail(id: any) {
    const dialogRef = this.dialog.open(FasterDetailComponent, {
      data: {
        id: id,
      },
    });
  }
  async getEvent(){
    const data = await this.service.getEvent().toPromise();
    if(data.body.errorCode === 400){
      this.isHaveEvent = false;
    }else{
      this.eventData = data.body;
      this.isHaveEvent = true;  
    }
    
  }
  goToSuKien(){
    this.router.navigate(['/g4/shop/su-kien-thang'])
  }
}
