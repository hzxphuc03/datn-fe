import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root' // Đảm bảo service này được cung cấp ở root
})
export class ChatService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  public notification$: BehaviorSubject<string> = new BehaviorSubject(''); // Thêm BehaviorSubject cho thông báo
  private socket = io('http://localhost:3200');

  constructor() {}

  public sendMessage(message: any) {
    console.log('sendMessage: ', message);
    this.socket.emit('message', message);
  }

  public sendNotification(notification: any) {
    console.log('sendNotification: ', notification);
    this.socket.emit('notification', notification); // Gửi thông báo
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
}