import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client;
  private socket: any;

  constructor() {
    // Tạo kết nối SockJS
    this.socket = new SockJS(environment.wsUrl);
    this.stompClient = Stomp.over(this.socket);
  }

  // Phương thức getter để truy cập stompClient
  getStompClient() {
    return this.stompClient;
  }

  // Kết nối và lắng nghe thông báo từ backend
  connect() {
    return new Promise((resolve, reject) => {
      this.stompClient.activate();

      // Lắng nghe khi kết nối thành công
      this.stompClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);
        resolve(frame);

        // Lắng nghe thông báo từ backend qua topic /topic/notifications
        this.stompClient.subscribe('/topic/notifications', (message) => {
          // Bạn có thể xử lý thông báo tại đây hoặc chuyển dữ liệu về Component
        });
      };

      // Lắng nghe khi có lỗi kết nối
      this.stompClient.onStompError = (error) => {
        console.log('Error: ' + error);
        reject(error);
      };
    });
  }

  // Đóng kết nối WebSocket
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('Disconnected');
    }
  }
}
