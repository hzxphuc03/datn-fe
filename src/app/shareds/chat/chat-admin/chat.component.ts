import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  // đăng nhập sẽ có thông tin người dùng hiện tại
  // bước 2 showing những tin nhắn có id người dùng hiện tại và group by với id
  // bước 3 khi click vào show 10 tin nhắn gần nhất lên và scroll lên sẽ load thêm 10 tin nhắn nữa
  // bước 4 quản lý việc gửi tin nhắn người gửi , người nhận , thời gian , đã đọc chưa (có hoặc không)
  newMessage = '';
  messageList: string[] = [];
  listChatBox: any[] = [];
  public clients: string[] = []; // Danh sách client
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getNewMessage().subscribe((message: string) => {
      // kiểm tra người nhận có phải là mình không để load lại tin nhắn oke
      console.log(message);
      this.messageList.push(message);
    });
    this.chatService.getNewNotification().subscribe((notification: string) => {
      // kiểm tra người nhận có phải là mình không để load lại tin nhắn oke
      console.log(notification);
      
      // this.messageList.push(notification);
    });
    this.chatService.getClients().subscribe((clients) => {
      this.clients = clients; // Cập nhật danh sách client
      console.log(this.clients);
      
    });
  }
  sendMessage() {
    this.chatService.sendNotification(this.newMessage);
    this.newMessage = '';
  }
}
