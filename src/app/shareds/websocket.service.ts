import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client;
  private socket: any;

  constructor() {
    // Tạo kết nối SockJS
    this.socket = new SockJS('http://localhost:8080/ws'); // URL WebSocket backend của bạn
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
          console.log('Received message: ', message.body);

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
