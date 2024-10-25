import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { VoucherService } from '../../service/voucher.service';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-voucher-hoa-don',
  templateUrl: './voucher-hoa-don.component.html',
  styleUrls: ['./voucher-hoa-don.component.scss'],
})
export class VoucherHoaDonComponent implements OnInit {
  searchQueryVoucherHoaDon: any = {};
  searchQueryVoucherVanChuyen: any = {};
  listVoucherHoaDonPageNumber: any;
  listVoucherVanChuyenPageNumber: any;
  listDataVoucherHoaDon: any[] = [];
  listDataVoucherVanChuyen: any[] = [];
  allVoucherHoaDon: any[] = [];
  constructor(
    private matDialogRef: MatDialogRef<VoucherHoaDonComponent>,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private errorService: ErrorTsService,
    private voucherService: VoucherService
  ) {
    this.searchQueryVoucherHoaDon.giaTriGiamToiThieu = getData.price;
    this.searchQueryVoucherHoaDon.pageSize = 10;
    this.searchQueryVoucherHoaDon.theLoai = 0;
    this.searchQueryVoucherVanChuyen.giaTriGiamToiThieu = getData.price;
    this.searchQueryVoucherVanChuyen.pageSize = 10;
    this.searchQueryVoucherVanChuyen.theLoai = 1;
  }

  async ngOnInit(): Promise<void> {
    await this.getListVoucherHoaDon('rows');
    await this.getListVoucherVanChuyen('rows');
    await this.getAllVoucherByIdHD();
  }
  async getListVoucherHoaDon(type: string, action?: string): Promise<void> {
    // this.spinner.show();
    if (type && type === 'rows') {
      this.searchQueryVoucherHoaDon.page = 1;
    }
    if (action) {
      if (action === 'prev' && Number(this.searchQueryVoucherHoaDon.page) > 1) {
        this.searchQueryVoucherHoaDon.page =
          Number(this.searchQueryVoucherHoaDon.page) - 1;
      }
      if (
        action === 'next' &&
        Number(this.searchQueryVoucherHoaDon.page) + 1 <=
          this.listVoucherHoaDonPageNumber.length
      ) {
        this.searchQueryVoucherHoaDon.page =
          Number(this.searchQueryVoucherHoaDon.page) + 1;
      }
    } else {
      this.searchQueryVoucherHoaDon.page = this.searchQueryVoucherHoaDon.page;
    }
    Object.keys(this.searchQueryVoucherHoaDon).forEach((key) => {
      if (
        this.searchQueryVoucherHoaDon[key] === null ||
        this.searchQueryVoucherHoaDon[key] === ''
      ) {
        delete this.searchQueryVoucherHoaDon[key];
      }
    });
    this.spinner.show();
    const data = await this.voucherService
      .getVoucherHoaDon(this.searchQueryVoucherHoaDon)
      .toPromise();
    if (data) {
      this.getTotalPage(data);
      this.listDataVoucherHoaDon = data.item;
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
    this.listVoucherHoaDonPageNumber = [];
    for (let i = 1; i <= totalPage; i++) {
      this.listVoucherHoaDonPageNumber.push(i);
    }
    return totalPage;
  }
  async getListVoucherVanChuyen(type: string, action?: string): Promise<void> {
    // this.spinner.show();
    if (type && type === 'rows') {
      this.searchQueryVoucherVanChuyen.page = 1;
    }
    if (action) {
      if (
        action === 'prev' &&
        Number(this.searchQueryVoucherVanChuyen.page) > 1
      ) {
        this.searchQueryVoucherVanChuyen.page =
          Number(this.searchQueryVoucherVanChuyen.page) - 1;
      }
      if (
        action === 'next' &&
        Number(this.searchQueryVoucherVanChuyen.page) + 1 <=
          this.listVoucherVanChuyenPageNumber.length
      ) {
        this.searchQueryVoucherVanChuyen.page =
          Number(this.searchQueryVoucherVanChuyen.page) + 1;
      }
    } else {
      this.searchQueryVoucherVanChuyen.page =
        this.searchQueryVoucherVanChuyen.page;
    }
    Object.keys(this.searchQueryVoucherVanChuyen).forEach((key) => {
      if (
        this.searchQueryVoucherVanChuyen[key] === null ||
        this.searchQueryVoucherVanChuyen[key] === ''
      ) {
        delete this.searchQueryVoucherVanChuyen[key];
      }
    });
    this.spinner.show();
    const data = await this.voucherService
      .getVoucherHoaDon(this.searchQueryVoucherVanChuyen)
      .toPromise();
    if (data) {
      this.getTotalPageVanChuyen(data);
      this.listDataVoucherVanChuyen = data.item;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }

    //   gọi api
  }
  getTotalPageVanChuyen(data: any): number {
    let totalPage = 0;
    if (Number(data.totalItem) < Number(data.pageSize)) {
      totalPage = 1;
    } else {
      totalPage = Math.floor(Number(data.totalItem) / Number(data.pageSize));
      if (Number(data.totalItem) % Number(data.pageSize) > 0) {
        totalPage = totalPage + 1;
      }
    }
    this.listVoucherVanChuyenPageNumber = [];
    for (let i = 1; i <= totalPage; i++) {
      this.listVoucherVanChuyenPageNumber.push(i);
    }
    return totalPage;
  }
  close() {
    this.matDialogRef.close();
  }
  async getAllVoucherByIdHD() {
    const data = await this.voucherService
      .getVoucherByIdHoaDon(this.getData.data.id)
      .toPromise();
    if (data) {
      this.allVoucherHoaDon = data;
      const today = new Date();
      this.allVoucherHoaDon.forEach((voucher) => {
        const startDate = new Date(voucher.ngayBatDau);
        const endDate = new Date(voucher.ngayKetThuc);

        // Kiểm tra xem ngày hôm nay có nằm ngoài khoảng thời gian không
        voucher.isEnd = today < startDate || today > endDate;
      });
    }
    console.log(this.allVoucherHoaDon);
  }
  async useThisVoucher(item: any) {
    // Kiểm tra voucher trùng lặp theo ID
    const index = this.allVoucherHoaDon?.findIndex(
      (data: any) => data.id === item.id
    );
    if (index !== -1) {
      // Nếu voucher đã tồn tại, thông báo và return
      this.errorService.displayError('Voucher đang được sử dụng', 'normal');
      console.log(this.allVoucherHoaDon);
      return;
    }
    // Tìm voucher theo thể loại
    const typeIndex = this.allVoucherHoaDon?.findIndex(
      (data: any) => data.theLoai === item.theLoai
    );
    if (typeIndex !== -1) {
      // Nếu có voucher cùng thể loại, thay thế nó
      this.allVoucherHoaDon[typeIndex] = item;
      this.errorService.displayError('Cập nhật voucher thành công', 'normal');
      console.log(this.allVoucherHoaDon);
      return;
    }
    // Nếu không có voucher cùng thể loại, thêm voucher mới vào danh sách
    this.allVoucherHoaDon?.push(item);
    this.errorService.displayError('Voucher mới đã được thêm', 'normal');
    console.log(this.allVoucherHoaDon);
  }

  async submit() {
    const requests = this.allVoucherHoaDon.map((item: any) => {
      const param = {
        idHoaDon: this.getData.data.id,
        idVoucher: item.id,
      };
      return this.voucherService.addVoucherToHoaDon(param).pipe(
        catchError((error) => {
          this.errorService.displayError(error.message, 'error');
          return of(null); // Trả về null để không làm gián đoạn các yêu cầu khác
        })
      );
    });
    // Chờ tất cả các yêu cầu hoàn thành
    forkJoin(requests).subscribe((results) => {
      let hasError = false;

      results.forEach((data) => {
        if (data && data.errorCode) {
          this.errorService.displayError(data.messageError, 'error');
          hasError = true; // Đánh dấu có lỗi
        } else if (data) {
          this.errorService.displayError(
            'Cập nhật voucher thành công',
            'success'
          );
        }
      });

      // Chỉ đóng dialog nếu không có lỗi
      if (!hasError) {
        this.matDialogRef.close('check');
      }
    });
  }
}
