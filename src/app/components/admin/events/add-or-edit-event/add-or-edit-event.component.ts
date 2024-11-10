import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../service/event.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-or-edit-event',
  templateUrl: './add-or-edit-event.component.html',
  styleUrls: ['./add-or-edit-event.component.scss'],
})
export class AddOrEditEventComponent implements OnInit {
  data: any = {};
  id: any;
  isAdd: boolean = true;
  visible: boolean = false;
  visible2: boolean = false;
  searchQuery: any = {};
  thangSuKien: any = [];
  listData: any = [];
  listPageNumber: any;
  paramPhieuGiamGia: any = {};
  listVoucherToEvent: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: EventService,
    private errorService: ErrorTsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.isAdd = false;
        this.getDetail();
      } else {
        this.isAdd = true;
        this.getThangSuKien();
      }
    });
    this.getListWords('rows');
  }
  async getDetail() {
    // get detail
    // get all-content
    const data = await this.service.getDetailEvent(this.id).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
        this.spinner.hide();
        this.router.navigate(['/auth/admin/event']);
      } else {
        await this.getThangSuKien();
        this.data = data.body;
        this.data.thangHoatDong = this.data.thangHoatDong
          .split(',') // Tách chuỗi tại dấu phẩy
          .map(Number) // Chuyển đổi từng phần tử thành số nguyên
          .filter((num: any) => !isNaN(num)); // Lọc ra các giá trị hợp lệ

        this.thangSuKien = this.thangSuKien.map((item: any) => {
          if (this.data.thangHoatDong.includes(item.thang)) {
            return { ...item, check: false, isCheck: true }; // Cập nhật check thành true nếu thang có trong result1
          }
          return item; // Giữ nguyên item nếu không có sự thay đổi
        });
      }
    }
    const data2 = await this.service
      .getAllvoucherByIdEvent(this.id)
      .toPromise();
    if (data2) {
      this.listVoucherToEvent = data2 as any[];
    }
  }
  async getThangSuKien() {
    const data = await this.service.getAllThang().toPromise();
    if (data) {
      this.thangSuKien = data;
    }
  }
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }
  async add() {
    if (
      this.isEmpty(this.data.tenSuKien) ||
      this.isEmpty(this.data.donViPhieuGiamGia) ||
      this.isEmpty(this.data.thoiGianHetHanPhieu) ||
      this.isEmpty(this.data.moTa) ||
      this.listVoucherToEvent.length < 1
    ) {
      this.errorService.displayError(
        'Vui lòng không để trống bất kỳ trường nào',
        'error'
      );
      return;
    }
    const param = {
      tenSuKien: this.data.tenSuKien,
      thangHoatDong: [] as any[],
      donViPhieuGiamGia: this.data.donViPhieuGiamGia,
      thoiGianHetHanPhieu: this.data.thoiGianHetHanPhieu,
      moTa: this.data.moTa,
    };
    this.thangSuKien.map((event: any) => {
      if (event.isCheck) {
        param.thangHoatDong.push(event.thang);
      }
    });
    this.spinner.show();
    const data = await this.service.addEvent(param).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
        this.spinner.hide();
      } else {
        this.spinner.hide();
        if (data.body) {
          if (this.listVoucherToEvent.length > 0) {
            const requests = this.listVoucherToEvent
              .filter((item: any) => item.isNew) // Lọc chỉ các voucher mới
              .map((item: any) => {
                return this.service.addVoucherToSuKien({
                  suKien: data.body.id,
                  voucher: item.id,
                });
              });
            // Sử dụng forkJoin để chờ tất cả các yêu cầu hoàn thành
            forkJoin(requests).subscribe({
              next: (results) => {
                // Tất cả các yêu cầu thành công
                this.errorService.displayError(
                  'Thêm sự kiện thành công',
                  'success'
                );
                this.router.navigate(['/auth/admin/event']);
              },
              error: (error) => {
                // Xử lý lỗi nếu có
                this.errorService.displayError(
                  'Có lỗi xảy ra khi thêm sự kiện',
                  'error'
                );
                console.error(error);
              },
            });
          } else {
            this.errorService.displayError(
              'Thêm sự kiện thành công',
              'sussces'
            );
            this.router.navigate(['/auth/admin/event']);
          }
        }
      }
    }
  }
  async update() {
    if (
      this.isEmpty(this.data.tenSuKien) ||
      this.isEmpty(this.data.donViPhieuGiamGia) ||
      this.isEmpty(this.data.thoiGianHetHanPhieu) ||
      this.isEmpty(this.data.moTa) ||
      this.listVoucherToEvent.length < 1
    ) {
      this.errorService.displayError(
        'Vui lòng không để trống bất kỳ trường nào',
        'error'
      );
      return;
    }
    const param = {
      id: this.id,
      tenSuKien: this.data.tenSuKien,
      thangHoatDong: [] as any[],
      donViPhieuGiamGia: this.data.donViPhieuGiamGia,
      thoiGianHetHanPhieu: this.data.thoiGianHetHanPhieu,
      moTa: this.data.moTa,
    };
    this.thangSuKien.map((event: any) => {
      if (event.isCheck) {
        param.thangHoatDong.push(event.thang);
      }
    });
    this.spinner.show();
    const data = await this.service.udpateEvent(param).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
        this.spinner.hide();
      } else {
        this.spinner.hide();
        if (data.body) {
          if (this.listVoucherToEvent.length > 0) {
            const hasNewItems = this.listVoucherToEvent.some(
              (item) => item.isNew
            );
            if (!hasNewItems) {
              this.errorService.displayError('Cập nhật thành công', 'sussces');
              this.router.navigate(['/auth/admin/event']);
            }
            const requests = this.listVoucherToEvent
              .filter((item: any) => item.isNew) // Lọc chỉ các voucher mới
              .map((item: any) => {
                return this.service.addVoucherToSuKien({
                  suKien: this.id,
                  voucher: item.id,
                });
              });
            // Sử dụng forkJoin để chờ tất cả các yêu cầu hoàn thành
            forkJoin(requests).subscribe({
              next: (results) => {
                // Tất cả các yêu cầu thành công
                this.errorService.displayError(
                  'Cập nhật thành công',
                  'success'
                );
                this.router.navigate(['/auth/admin/event']);
              },
              error: (error) => {
                // Xử lý lỗi nếu có
                this.errorService.displayError(
                  'Có lỗi xảy ra khi thêm sự kiện',
                  'error'
                );
                console.error(error);
              },
            });
          } else {
            this.errorService.displayError('Cập nhật thành công', 'sussces');
            this.router.navigate(['/auth/admin/event']);
          }
        }
      }
    }
  }
  async getListWords(type: string, action?: string): Promise<void> {
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
    const data = await this.service
      .getVoucherEvent(this.searchQuery)
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
  async addMoreVoucher() {
    const data = await this.service
      .addVoucherSuKien(this.paramPhieuGiamGia)
      .toPromise();
    if (data) {
      // if (data.body.errorCode === 400) {
      //   this.errorService.displayError(data.body.messageError, 'error');
      //   this.spinner.hide();
      // } else {
      //   this.spinner.hide();
      //   this.paramPhieuGiamGia = {};
      //   this.errorService.displayError('Thêm phiếu giảm giá thành công', 'sussces');
      //   this.getListWords('rows');
      //   this.visible2 = false;
      // }
      this.spinner.hide();
      this.paramPhieuGiamGia = {};
      this.errorService.displayError(
        'Thêm phiếu giảm giá thành công',
        'sussces'
      );
      this.getListWords('rows');
      this.visible2 = false;
    }
  }
  addVoucherToSuKien(item: any) {
    // nếu đang là hàm add thì
    if (!this.listVoucherToEvent.some((voucher) => voucher.id === item.id)) {
      item.isNew = true;
      this.listVoucherToEvent.push(item);
      console.log(this.listVoucherToEvent);
    } else {
      this.errorService.displayError(
        'Voucher đã tồn tại trong sự kiện',
        'error'
      );
    }
  }
}
