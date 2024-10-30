import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HomeServoceService } from '../../services/home-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  topsNew: any[] = [];
  topsSale: any[] = [];
  topsSell: any[] = [];

  constructor(
    private service: HomeServoceService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.getTop5BanChay();
    this.getTop5GiamGia();
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
      this.topsSell = data;
    }
  }
  getTop5SanPhamMoi() {}
}
