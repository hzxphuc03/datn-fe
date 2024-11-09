import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { VoucherService } from '../../service/voucher.service';
import { HoaDonService } from '../../service/hoa-don.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-detail-hoa-don-quan-ly',
  templateUrl: './detail-hoa-don-quan-ly.component.html',
  styleUrls: ['./detail-hoa-don-quan-ly.component.scss'],
})
export class DetailHoaDonQuanLyComponent implements OnInit {
  data: any = {};
  id: string | null = null;
  isAdd: boolean = true;
  currentStep: number = 1; // Bước hiện tại
  intervalId: any;
  idNhanVien: any;
  isShowAction: boolean = false;
  visible: boolean = false;
  isOkeDialog: boolean = false;
  isHistory: boolean = false;
  titleChangeToZero: string = '';
  listLichSuThaoTac: any[] = [];
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listIndexActiveStatus: any[] = [
    { index: 2, title: 'Hóa đơn chờ xử lý' },
    { index: 3, title: 'Hóa đơn đã nhận' },
    { index: 4, title: 'Đóng gói hóa đơn' },
    { index: 5, title: 'Hóa đơn đang vận chuyển' },
    { index: 6, title: 'Hóa đơn hoàn thành)' },
    { index: 0, title: 'Hóa đơn đã hủy' },
  ];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: HoaDonService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private errorService: ErrorTsService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.isAdd = false;
        this.detail();
        this.searchQuery.idHoaDon = this.id;
        this.getAllHistory('rows');
      }
    });
  }
  async detail() {
    this.spinner.show();
    const data = await this.service.getHDbyId(this.id).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
        this.spinner.hide();
        this.router.navigate(['/auth/admin/quan-ly-hoa-don']);
      } else {
        this.data = data.body;
        if (this.data.trangThai !== 0 && this.data.trangThai !== 1) {
          this.isShowAction = true;
        }
        this.startIncrement(this.data.trangThai);
        this.spinner.hide();
      }
    }
  }
  startIncrement(numberOfIncrements: number) {
    this.currentStep = 0; // Đặt lại chỉ số
    // Dừng interval trước đó nếu có
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      if (this.currentStep < numberOfIncrements) {
        this.currentStep++;
      } else {
        clearInterval(this.intervalId); // Dừng khi đạt đến số yêu cầu
      }
    }, 100); // Tăng mỗi 100ms
  }
  async nextStep() {
    const { decoded } = this.tokenService.getToken();
    if (decoded && decoded?.user.id) {
      this.idNhanVien = decoded?.user.id;
    }
    const response = await this.service
      .nextStepHoaDonStatus({
        idNhanVien: this.idNhanVien,
        idHoaDon: this.data.id,
      })
      .toPromise();
    if (response) {
      if (response.errorCode) {
        // Xử lý lỗi đăng nhập
        this.errorService.displayError('Lỗi vui lòng thử lại', 'error');
        // Hiển thị thông báo lỗi cho người dùng nếu cần
      } else {
        // Xử lý đăng nhập thành công
        this.errorService.displayError('Cập nhật thành công', 'success');
        this.detail();
      }
    }
  }
  showDialog() {
    this.visible = true;
  }
  async cancelBill() {
    if (
      this.titleChangeToZero === '' ||
      this.titleChangeToZero === null ||
      this.titleChangeToZero === undefined
    ) {
      this.errorService.displayError(
        'Vui lòng điền lý do hủy hóa đơn',
        'error'
      );
      return;
    }
    this.visible = false;
    const { decoded } = this.tokenService.getToken();
    if (decoded && decoded?.user.id) {
      this.idNhanVien = decoded?.user.id;
    }
    const response = await this.service
      .huyHoaDon({
        idNhanVien: this.idNhanVien,
        idHoaDon: this.data.id,
        ghiChu: this.titleChangeToZero,
      })
      .toPromise();
    if (response) {
      if (response.errorCode) {
        // Xử lý lỗi đăng nhập
        this.errorService.displayError('Lỗi vui lòng thử lại', 'error');
        this.titleChangeToZero = '';
        // Hiển thị thông báo lỗi cho người dùng nếu cần
      } else {
        // Xử lý đăng nhập thành công
        this.errorService.displayError('Cập nhật thành công', 'success');
        this.isShowAction = false;
        this.detail();
        this.titleChangeToZero = '';
      }
    }
  }
  isOkeNextStep() {
    this.nextStep();
    this.isOkeDialog = false;
  }
  async getAllHistory(type: string, action?: string): Promise<void> {
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
    const data = await this.service.getAllTTHD(this.searchQuery).toPromise();
    if (data) {
      this.getTotalPage(data);
      this.listLichSuThaoTac = data.item;
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
}
