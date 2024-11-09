import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  private channel: BroadcastChannel;
  private dataSubject = new BehaviorSubject<any>(null); // Khởi tạo BehaviorSubject
  data$ = this.dataSubject.asObservable(); // Đặt tên cho observable

  constructor() {
    this.channel = new BroadcastChannel('my_custom_channel'); // Tạo kênh

    // Lắng nghe thông điệp từ kênh
    this.channel.onmessage = (event) => {
      this.dataSubject.next(event.data); // Cập nhật dữ liệu cho các subscribers
    };
  }

  sendData(data: any) {
    this.channel.postMessage(data); // Gửi dữ liệu đến kênh
  }
}