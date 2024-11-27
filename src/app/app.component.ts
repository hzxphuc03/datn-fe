import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorTsService } from './shareds/message/error.service';
import { Subscription } from 'rxjs';
import { TokenService } from './services/token.service';
import { NavigationEnd, Router } from '@angular/router';
import { AutoServiceService } from './shareds/auto-service.service';
import { io } from 'socket.io-client';
import { ChatService } from './shareds/chat/chat.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  errorMessage: any | null = null; // Đảm bảo kiểu dữ liệu cho phép null
  private errorSubscription?: Subscription;
  private socket: any;
  public clients: any[] = []; // Danh sách khách hàng
  title = 'datn_fe';
  constructor(
    private errorService: ErrorTsService,
    private tokenService: TokenService,
    private router: Router,
    private autoVoucher: AutoServiceService,
    private chatService : ChatService
  ) {}

  ngOnInit(): void {
    const { decoded } = this.tokenService.getToken();
    // Gửi thông tin khách hàng khi kết nối 
    const customer = decoded.user; // Thay thế bằng thông tin thực tế
    this.chatService.registerCustomer(customer);
    // thêm người dùng vào list 
    this.errorSubscription = this.errorService
      .getErrorObservable()
      .subscribe((message) => { 
        this.errorMessage = message;
      });
    this.auto();
  }
  async auto() {
    const voucherAuto = await this.autoVoucher.autoVoucher().toPromise();
  }

  ngOnDestroy(): void {
    this.errorSubscription?.unsubscribe();
  }
}
