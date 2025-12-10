import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root' // Đảm bảo service này được cung cấp ở root
})
export class ChatService {
  public message$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public notification$: BehaviorSubject<string> = new BehaviorSubject<string>(''); // Thêm BehaviorSubject cho thông báo
  public clients$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]); // Thay đổi kiểu cho danh sách client để lưu đối tượng khách hàng

  private socket = io(environment.socketUrl);

  constructor() {
    this.listenForClients(); // Lắng nghe danh sách client khi khởi tạo
  }

  public sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  public sendNotification(notification: any) {
    console.log('sendNotification: ', notification);
    this.socket.emit('notification', notification); // Gửi thông báo
  }

  public registerCustomer(customer: any) {
    console.log('Registering customer: ', customer);
    this.socket.emit('register', customer); // Gửi thông tin khách hàng đến server
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) => {
      this.message$.next(message);
    });
    return this.message$.asObservable();
  };

  public getNewNotification = () => {
    this.socket.on('notification', (notification) => {
      console.log('notification: ', notification);
      this.notification$.next(notification); // Nhận thông báo
    });
    return this.notification$.asObservable();
  };

  private listenForClients() {
    this.socket.on('clients', (clients: any[]) => {
      console.log('Current clients:', clients); // Hiển thị danh sách client trong console
      this.clients$.next(clients); // Cập nhật danh sách client
    });
  }

  public getClients() {
    return this.clients$.asObservable(); // Trả về Observable cho danh sách client
  }
}