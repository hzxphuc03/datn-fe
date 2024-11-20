import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastService } from 'src/app/services/broadcast.service';

@Component({
  selector: 'app-form-thanh-cong-hay-that-bai',
  templateUrl: './form-thanh-cong-hay-that-bai.component.html',
  styleUrls: ['./form-thanh-cong-hay-that-bai.component.scss'],
})
export class FormThanhCongHayThatBaiComponent implements OnInit {
  isThanhCong: boolean = true;
  vnpOrderInfo: any;
  transactionStatus: boolean = false;
  constructor(
    private router: Router,
    private broadcastService: BroadcastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.vnpOrderInfo = params['vnp_OrderInfo'];
      const responseCode = params['vnp_ResponseCode'];
      const transactionStatus = params['vnp_TransactionStatus'];
      // Xác định trạng thái giao dịch
      if (responseCode === '00' && transactionStatus === '00') {
        this.transactionStatus = true; // Giao dịch thành công
      } else {
        this.transactionStatus = false; // Giao dịch thất bại
      }
      if (this.transactionStatus && this.vnpOrderInfo) {
        // thanh toán thành công
        const data = {
          message: this.transactionStatus,
          idhd: this.vnpOrderInfo,
        };
        this.broadcastService.sendData(data);
        this.close();
      } else {
        const data = {
          message: false,
          idhd: null,
        };
        this.broadcastService.sendData(data);
        this.close();
      }
    });
  }
  close() {
    window.close(); // Đóng cửa sổ popup
  }
}
