import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HomeServoceService } from '../../services/home-service.service';
import { DatePipe } from '@angular/common';
import { Observable, Subscription, interval, map, takeWhile } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss'],
})
export class EventPageComponent implements OnInit, OnDestroy {
  isHaveEvent: boolean = true;
  eventData: any = {};
  thoiGianSuKien: any = {};
  tuNgaySuDung: Date | null = null;
  denNgaySuDung: Date | null = null;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null = null;
  listVoucher: any[] = [];
  private countdownSubscription: Subscription = new Subscription();
  constructor(
    private service: HomeServoceService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private tokenService: TokenService,
    private dialog: MatDialog,
    private errorService: ErrorTsService,
  ) {}

  ngOnInit(): void {
    this.checkToken();
    this.spinner.show();
    this.getEvent();
    this.getAllVoucherToKhachHang();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  async getEvent() {
    const data = await this.service.getEvent().toPromise();
    if (data.body.errorCode === 400) {
      this.isHaveEvent = false;
      this.router.navigate(['/g4/shop']);
    } else {
      this.eventData = data.body;
      const thangHoatDong = this.eventData.thangHoatDong;
      const currentMonth = 11; // tháng 3
      const formattedThangHoatDong = this.formatThangHoatDong(
        thangHoatDong,
        currentMonth
      );
      this.thoiGianSuKien = formattedThangHoatDong;
      // ngày hết hạn và ngày bắt đầu
      const today: Date = new Date();
      const daysToAdd: number = this.eventData.thoiGianHetHanPhieu;
      const expirationDate: Date = new Date(today);
      expirationDate.setDate(today.getDate() + daysToAdd);
      this.denNgaySuDung = expirationDate;
      this.tuNgaySuDung = new Date(today);
      //
      const endDate = this.parseDate(this.thoiGianSuKien.endDate); // Chuyển đổi chuỗi thành Date
      this.startCountdown(endDate);
      // this.startCountdown(new Date(this.thoiGianSuKien.endDate));
      this.isHaveEvent = true;
    }
  }

  async getAllVoucherToKhachHang() {
    const { decoded } = this.tokenService.getToken();
    const data = await this.service
      .getAllVoucherByKh(decoded?.["user"].id)
      .toPromise();
    if (data && data.body) {
      this.listVoucher = data.body;
    }
  }
  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day, 23, 59, 59); // Tháng trong JavaScript bắt đầu từ 0
  }
  checkToken() {
    const isExpired = this.tokenService.isTokenExpired();
    const { decoded } = this.tokenService.getToken();
    const currentUrl = this.router.url;
    if (decoded) {
      if (isExpired || decoded.role !== 'KHACH_HANG') {
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

  formatThangHoatDong(
    thangHoatDong: string,
    currentMonth: number
  ): { startDate: string; endDate: string } {
    const months = thangHoatDong.split(',').map((month) => parseInt(month, 10));
    const datePipe = new DatePipe('en-US');

    let result: { startDate: string; endDate: string } = {
      startDate: '',
      endDate: '',
    };

    let startMonth: number | null = null;
    let endMonth: number | null = null;

    for (let i = 0; i < months.length; i++) {
      const month = months[i];

      if (startMonth === null) {
        startMonth = month;
      }

      if (i === months.length - 1 || months[i + 1] !== month + 1) {
        endMonth = month;

        const startDate = new Date(new Date().getFullYear(), startMonth - 1, 1);
        const endDate = new Date(new Date().getFullYear(), endMonth!, 0);

        if (
          startMonth! <= currentMonth &&
          (endMonth! >= currentMonth || endMonth === null)
        ) {
          result = {
            startDate: datePipe.transform(startDate, 'd/M/yyyy')!,
            endDate: datePipe.transform(endDate, 'd/M/yyyy')!,
          };
        }

        startMonth = null;
        endMonth = null;
      }
    }

    return result;
  }
  startCountdown(endDate: Date) {
    this.countdownSubscription = interval(1000)
      .pipe(
        map(() => {
          const now = new Date();
          const difference = endDate.getTime() - now.getTime();

          if (difference <= 0) {
            return null; // Thời gian đã hết
          }

          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          return { days, hours, minutes, seconds };
        }),
        takeWhile((value) => value !== null) // Ngừng khi thời gian đã hết
      )
      .subscribe((value) => {
        this.countdown = value;
      });
  }
  async addToVoucherKhachHang(id : any) {
    const { decoded } = this.tokenService.getToken();
    const param = {
      chiPhieuGiamGiaSuKien: id,
      khachHang: decoded?.["user"].id,
    };
    const data = await this.service.addVoucherEvent(param).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
        this.getAllVoucherToKhachHang();
        this.spinner.hide();
      }else{
        this.errorService.displayError('Lưu phiếu thành công', 'success');
        this.getAllVoucherToKhachHang();
        this.spinner.hide();
      }
    }
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}
