import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GiamGiaServiceService } from 'src/app/components/admin/service/giam-gia-service.service';
import { KIchCoServiceService } from 'src/app/components/admin/service/kich-co-service.service copy';
import { LoaiCoServiceService } from 'src/app/components/admin/service/loai-co.service.service';
import { LoaiDeServiceService } from 'src/app/components/admin/service/loai-de-service.service';
import { TheLoaiServiceService } from 'src/app/components/admin/service/the-loai-service.service';
import { ThuongHieuServiceService } from 'src/app/components/admin/service/thuong-hieu-service.service';
import { UploadImgService } from 'src/app/components/admin/service/upload-img.service';
import { VatLieuServiceService } from 'src/app/components/admin/service/vat-lieu-service.service';
import { TokenService } from 'src/app/services/token.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { DataService } from '../../../services/data.service';
import { HomeServoceService } from '../../../services/home-service.service';

@Component({
  selector: 'app-detail-don-hang-kh',
  templateUrl: './detail-don-hang-kh.component.html',
  styleUrls: ['./detail-don-hang-kh.component.scss'],
})
export class DetailDonHangKhComponent implements OnInit {
  idhd: any;
  data: any = {};
  steps: any[] = [
    { title: 'Hóa đơn chờ sử lý', step: 2, index: 1 },
    { title: 'Hóa đơn đóng gói', step: 4, index: 2 },
    { title: 'Hóa đơn vận chuyển', step: 5, index: 3 },
    { title: 'Hóa đơn hoàn thành', step: 6, index: 4 },
    { title: 'Hóa đơn đã hủy', step: 0, index: 5 },
  ];
  currentStep: number = 0;
  progressWidth1: string = '0%'; // Khởi tạo với chiều rộng là 0%
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: HomeServoceService,
    private serviceGiamGia: GiamGiaServiceService,
    private spinner: NgxSpinnerService,
    private serviceThuongHieu: ThuongHieuServiceService,
    private serviceTheLoai: TheLoaiServiceService,
    private serviceLoaiCo: LoaiCoServiceService,
    private serviceVatLieu: VatLieuServiceService,
    private serviceLoaiDe: LoaiDeServiceService,
    private serviceIMG: UploadImgService,
    private serviceKichCo: KIchCoServiceService,
    private dialog: MatDialog,
    private tokenService: TokenService,
    private errorService: ErrorTsService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.idhd = params['idhd'];
      if (this.idhd) {
        this.getDetailHoaDon();
      }
    });
    // Chạy hiệu ứng khi component được khởi tạo
    this.dataService.data$.subscribe((data: any) => {
     if(this.idhd){
      this.getDetailHoaDon();
     }
    });
  }
  async getDetailHoaDon() {
    const data = await this.service
      .getDetailHoaDonByIdHD(this.idhd)
      .toPromise();
    if (data) {
      this.data = data
       const stepGet =  this.steps.find(step => step.step === data.hoaDon.trangThai);
       this.currentStep = stepGet.index
      this.animateProgress(this.currentStep);
    }
  }
  animateProgress(step: number) {
    const targetWidth = ((step - 1) / 4) * 100; // Tính chiều rộng mục tiêu
    let currentWidth = 0; // Bắt đầu từ 0
    const increment = 0.5; // Tăng dần chiều rộng mỗi lần lặp
    const duration = 400; // Thời gian tổng cộng để hoàn thành (milliseconds)
    const intervalTime = 20; // Thời gian giữa mỗi lần lặp (milliseconds)

    const totalSteps = duration / intervalTime; // Tổng số lần lặp
    const widthIncrement = (targetWidth - currentWidth) / totalSteps; // Tính toán chiều rộng tăng dần mỗi lần lặp

    const interval = setInterval(() => {
        if (currentWidth >= targetWidth) {
            clearInterval(interval); // Dừng khi đạt đến chiều rộng mục tiêu
        } else {
            currentWidth += widthIncrement; // Tăng dần chiều rộng
            this.progressWidth1 = currentWidth + '%'; // Cập nhật chiều rộng
        }
    }, intervalTime); // Thời gian giữa các lần lặp
}

  getProgressWidth(): string {
    return this.progressWidth1; // Trả về chiều rộng hiện tại
  }
  isActive(stepIndex: number): boolean {
    return stepIndex <= this.currentStep; // Trả về true nếu bước nhỏ hơn chỉ số hiện tại
  }
}
