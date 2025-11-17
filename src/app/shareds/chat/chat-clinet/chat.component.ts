import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../chat.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadImgService } from 'src/app/components/admin/service/upload-img.service';
import { TokenService } from 'src/app/services/token.service';
import { ErrorTsService } from '../../message/error.service';
import { AdminChatService } from '../admin-chat.service';
import { ClientChatService } from '../client-chat.servi';

@Component({
  selector: 'app-client-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatClintComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('uploadFileInput', { static: false }) uploadFileInput:
    | ElementRef
    | undefined;
  // bước 2 showing những tin nhắn có id người dùng hiện tại và group by với id
  // bước 3 khi click vào show 10 tin nhắn gần nhất lên và scroll lên sẽ load thêm 10 tin nhắn nữa
  // bước 4 quản lý việc gửi tin nhắn người gửi , người nhận , thời gian , đã đọc chưa (có hoặc không)
  newMessage = '';
  messageList: any[] = [];
  listChatBox: any[] = [];
  public clients: any[] = []; // Danh sách client
  idNhanVien: any = '';
  activeTab: number = 1;
  queryParams: any = {};
  totalItem: number = 0;
  userChat: any = {
    activeChat: false,
    idBoxActive: 0,
    imgUserChat: '',
    userChat: {
      id: 0,
      img: '',
      ten: '',
      hoatDong: false,
    },
  };
  typeChat: string = 'Text';
  idTinNhanVuaXOng: any = 0;
  isInitialLoad: boolean = true;
  listAnhDuocChon: any[] = [];
  isRecoding: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  public audioUrl: SafeUrl | null = null; // Thay đổi kiểu dữ liệu sang SafeUrl
  //
  listUserChatBox: any[] = [];
  isCheckScroll: boolean = true;
  userUseChat: any = {};
  constructor(
    private chatService: ChatService,
    private server: ClientChatService,
    private tokenService: TokenService,
    private errorService: ErrorTsService,
    private renderer: Renderer2,
    private serviceIMG: UploadImgService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.isInitialLoad = false;
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    const { decoded } = this.tokenService.getToken();
    this.userUseChat = decoded?.["user"];
    this.getAllChatBox();
    this.chatService.getNewMessage().subscribe((message: any) => {
      this.getAllChatBox();
      if (this.isInitialLoad) {
        return;
      }
      if (message.hopThoaiKhachHang.id !== this.userChat.idBoxActive) {
        return;
      }
      if (message) {
        if (this.idTinNhanVuaXOng === message.id) {
          return;
        }
        if (message.huongGui === 'nv-kh') {
          // khách hàng là người nhận
          if (!this.userUseChat.chucVu) {
            // khách hàng
            if (
              this.userUseChat.id === message.khachHang.id &&
              !this.messageList.some(
                (existingMessage) => existingMessage.id === message.id
              )
            ) {
              this.messageList.push(message);
              this.changeDetector.detectChanges();
            }
          }
          // nếu hướng gửi là từ nhân viên cho khách hàng mà là khách hàng nào
        }
        if (message.huongGui === 'kh-nv') {
          // Nhân viên là người nhận
          if (this.userUseChat.chucVu) {
            // khách hàng
            if (
              this.userUseChat.id === message.nhanVien.id &&
              !this.messageList.some(
                (existingMessage) => existingMessage.id === message.id
              )
            ) {
              this.messageList.push(message);
              this.changeDetector.detectChanges();
            }
          }
          // nếu hướng gửi là từ nhân viên cho khách hàng mà là khách hàng nào
        }
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    });
    //
    this.chatService.getClients().subscribe((clients) => {
      if (decoded?.["user"].chucVu === null) {
        // gọi list nhân viên by id
        const nhanVien = clients.filter((item) => item.chucVu !== null);
        this.clients = nhanVien; // Cập nhật danh sách client với những thằng có chức vụ
      } else {
        // gọi list khách hàng by nhân viên
        const khachHang = clients.filter((item) => item.chucVu === null);
        this.clients = khachHang; // Cập nhật danh sách client với những thằng có chức vụ
      }
      this.checkOnline();
    });
    this.queryParams.page = 1;
    this.queryParams.pageSize = 15;
    if (decoded && decoded?.["user"]?.id) {
      if (decoded?.["user"].chucVu === null) {
        this.getAllNhanVien();
      } else {
        // gọi list khách hàng by nhân viên
        this.getAllKhachHang();
      }
    }
  }
  startRecording() {
    this.typeChat = 'Voice';
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob); // Tạo URL blob
          await this.convertRecordFileToText(audioBlob); // Gọi phương thức với blob
          this.audioChunks = [];
        };
      })
      .catch((err) => console.error('Error accessing microphone: ', err));
  }
  async convertRecordFileToText(blob: Blob) {
    const formData = new FormData();
    let audioFile = new File([blob], 'submitFile.mp3');
    formData.append('file', audioFile);
    this.spinner.show();

    this.spinner.show();
    try {
      const response: any = await this.serviceIMG
        .upload(audioFile, 'VIDEOS')
        .toPromise();
      if (response) {
        this.audioUrl = response.result;
        this.changeDetector.detectChanges();
        this.spinner.hide();
      }
    } catch (error) {
      console.error('Upload failed', error);
      this.spinner.hide();
    }
  }
  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }
  async getAllChatBox() {
    const { decoded } = this.tokenService.getToken();
    if (decoded && decoded?.["user"]?.id) {
      this.idNhanVien = decoded?.["user"]?.id;
    }
    if (!decoded?.["user"].chucVu) {
      const data = await this.server
        .getAllBoxNhanVienByKhachHang(decoded?.["user"]?.id)
        .toPromise();
      if (data) {
        this.listChatBox = data.map((item: any) => ({
          ...item,
          thoiGianNhanCuoi: item.hopThoaiKhachHang.thoiGianNhanCuoi
            ? this.getTimeAgo(item.hopThoaiKhachHang.thoiGianNhanCuoi)
            : '',
        }));
        this.checkOnline();
      } else {
        this.listChatBox = [];
      }
    } else {
      const data = await this.server
        .getAllBoxKhachHangByNhanVien(decoded?.["user"]?.id)
        .toPromise();
      if (data) {
        this.listChatBox = data.map((item: any) => ({
          ...item,
          thoiGianNhanCuoi: item.hopThoaiKhachHang.thoiGianNhanCuoi
            ? this.getTimeAgo(item.hopThoaiKhachHang.thoiGianNhanCuoi)
            : '',
        }));
        this.checkOnline();
      } else {
        this.listChatBox = [];
      }
    }
  }
  getTimeAgo(thoiGianNhanCuoi: string): string {
    const now = new Date();
    const then = new Date(thoiGianNhanCuoi);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    let interval = seconds / 31536000; // năm
    if (interval >= 1) {
      return Math.floor(interval) + ' năm trước';
    }
    interval = seconds / 2592000; // tháng
    if (interval >= 1) {
      return Math.floor(interval) + ' tháng trước';
    }
    interval = seconds / 86400; // ngày
    if (interval >= 1) {
      return Math.floor(interval) + ' ngày trước';
    }
    interval = seconds / 3600; // giờ
    if (interval >= 1) {
      return Math.floor(interval) + ' giờ trước';
    }
    interval = seconds / 60; // phút
    if (interval >= 1) {
      return Math.floor(interval) + ' phút trước';
    }
    return 'Vừa xong';
  }
  checkOnline() {
    // Lặp qua listChatBox và kiểm tra trạng thái online
    this.listChatBox.forEach((chatBox) => {
      // Kiểm tra xem id của chatBox có trong clients hay không
      if (chatBox.hopThoaiKhachHang.nhanVien.id !== this.userUseChat.id) {
        chatBox.isOnline = this.clients.some(
          (client: any) => client.id === chatBox.hopThoaiKhachHang.nhanVien.id
        );
      }
      if (chatBox.hopThoaiKhachHang.khachHang.id !== this.userUseChat.id) {
        chatBox.isOnline = this.clients.some(
          (client: any) => client.id === chatBox.hopThoaiKhachHang.khachHang.id
        );
      }
    });
    this.userChat.userChat.hoatDong = this.clients.some(
      (item: any) => item.id === this.userChat.userChat.id
    );
    this.listUserChatBox.forEach((nhanVien) => {
      nhanVien.isOnline = this.clients.some(
        (client) => client.id === nhanVien.id
      );
    });
  }
  activeBox(id: any) {
    if (id === this.userChat.idBoxActive) {
      return;
    }
    this.listChatBox.map((item) => {
      if (item.hopThoaiKhachHang.id === id) {
        if (this.userUseChat.chucVu) {
          // neu no la nhan vien
          this.userChat.userChat = {
            id: item.hopThoaiKhachHang.khachHang.id,
            img: item.hopThoaiKhachHang.khachHang.hinhAnh,
            ten: item.hopThoaiKhachHang.khachHang.hoTen,
            hoatDong: item.isOnline,
          };
        } else {
          // neu la khach hang
          this.userChat.userChat = {
            id: item.hopThoaiKhachHang.nhanVien.id,
            img: item.hopThoaiKhachHang.nhanVien.hinhAnh,
            ten: item.hopThoaiKhachHang.nhanVien.hoTen,
            hoatDong: item.isOnline,
          };
        }
      }
    });
    this.queryParams.page = 1;
    this.userChat.idBoxActive = id;
    this.queryParams.idHopThoai = this.userChat.idBoxActive;
    this.getAllChatByIdBox();
    this.userChat.activeChat = true;
    this.isCheckScroll = false;
    setTimeout(() => {
      this.isCheckScroll = true;
    }, 300);
  }
  async getAllChatByIdBox() {
    this.messageList = [];
    const data = await this.server.getAllMessKH(this.queryParams).toPromise();
    if (data) {
      data.item.map((item: any) => {
        this.messageList.unshift(item);
      });
      this.totalItem = data.totalItem;
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
  }
  async sendMessage() {
    if (!this.newMessage) {
      return;
    }
    if (this.userChat.idBoxActive === 0) {
      // tạo mới box
      let params = {};
      if (this.userUseChat.chucVu) {
        // nếu là bên của nhân viên
        params = {
          idKhachHang: this.userChat.userChat.id, // id của thằng đang active box
          idNhanVien: this.userUseChat.id, // id của thằng hiện tại
        };
      }
      if (!this.userUseChat.chucVu) {
        // nếu là bên của nhân viên
        params = {
          idKhachHang: this.userUseChat.id, // id của thằng đang active box
          idNhanVien: this.userChat.userChat.id, // id của thằng hiện tại
        };
      }
      const data = await this.server
        .addHopThoaiNhanVienKhachHang(params)
        .toPromise();
      if (data.body) {
        this.userChat.idBoxActive = data.body.id;
      }
    }
    const params = {
      theLoai: 'Text',
      hinhAnhList: [],
      voice: '',
      tinNhan: this.newMessage,
      idKhachHang: '',
      idNhanVien: '',
      idHopThoaiKhachHang: this.userChat.idBoxActive,
      huongGui: this.userUseChat.chucVu ? 'nv-kh' : 'kh-nv',
    };
    if (this.userUseChat.chucVu) {
      // nếu là bên của nhân viên
      params.idKhachHang = this.userChat.userChat.id;
      params.idNhanVien = this.userUseChat.id;
    }
    if (!this.userUseChat.chucVu) {
      // nếu là bên của nhân viên
      params.idKhachHang = this.userUseChat.id;
      params.idNhanVien = this.userChat.userChat.id;
    }
    if (this.userChat.idBoxActive === 0) {
      return;
    }
    const data = await this.server.guiTinNhanKh(params).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
      } else {
        this.messageList.push(data.body);
        const messageToSend = {
          ...data.body, // Spread the existing properties
        };
        this.chatService.sendMessage(messageToSend);
        this.getAllChatBox();
        this.newMessage = '';
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    }
  }
  async sendImg() {
    if (this.listAnhDuocChon.length === 0) {
      return;
    }
    if (this.userChat.idBoxActive === 0) {
      // tạo mới box
      let params = {};
      if (this.userUseChat.chucVu) {
        // nếu là bên của nhân viên
        params = {
          idKhachHang: this.userChat.userChat.id, // id của thằng đang active box
          idNhanVien: this.userUseChat.id, // id của thằng hiện tại
        };
      }
      if (!this.userUseChat.chucVu) {
        // nếu là bên của nhân viên
        params = {
          idKhachHang: this.userUseChat.id, // id của thằng đang active box
          idNhanVien: this.userChat.userChat.id, // id của thằng hiện tại
        };
      }
      const data = await this.server
        .addHopThoaiNhanVienKhachHang(params)
        .toPromise();
      if (data.body) {
        this.userChat.idBoxActive = data.body.id;
      }
    }
    const params = {
      theLoai: 'IMG',
      hinhAnhList: this.listAnhDuocChon,
      voice: '',
      tinNhan: '',
      idKhachHang: '',
      idNhanVien: '',
      idHopThoaiKhachHang: this.userChat.idBoxActive,
      huongGui: this.userUseChat.chucVu ? 'nv-kh' : 'kh-nv',
    };
    if (this.userUseChat.chucVu) {
      // nếu là bên của nhân viên
      params.idKhachHang = this.userChat.userChat.id;
      params.idNhanVien = this.userUseChat.id;
    }
    if (!this.userUseChat.chucVu) {
      // nếu là bên của nhân viên
      params.idKhachHang = this.userUseChat.id;
      params.idNhanVien = this.userChat.userChat.id;
    }
    if (this.userChat.idBoxActive === 0) {
      return;
    }
    const data = await this.server.guiTinNhanKh(params).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
      } else {
        const hinhAnh = data.body.hinhAnh.split(',');
        data.body.hinhAnhList = hinhAnh;
        this.messageList.push(data.body);
        const messageToSend = {
          ...data.body, // Spread the existing properties
          idNguoiNhan: this.userChat.userChat.id, // Add the new property;
          role: 'nv-nv', // Add the new property;
        };
        this.chatService.sendMessage(messageToSend);
        this.getAllChatBox();
        this.newMessage = '';
        this.listAnhDuocChon = [];
        this.clearFileInput();
        this.typeChat = 'Text';
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    }
  }
  async sendVoice() {
    if (this.userChat.idBoxActive === 0) {
      // tạo mới box
      let params = {};
      if (this.userUseChat.chucVu) {
        // nếu là bên của nhân viên
        params = {
          idKhachHang: this.userChat.userChat.id, // id của thằng đang active box
          idNhanVien: this.userUseChat.id, // id của thằng hiện tại
        };
      }
      if (!this.userUseChat.chucVu) {
        // nếu là bên của nhân viên
        params = {
          idKhachHang: this.userUseChat.id, // id của thằng đang active box
          idNhanVien: this.userChat.userChat.id, // id của thằng hiện tại
        };
      }
      const data = await this.server
        .addHopThoaiNhanVienKhachHang(params)
        .toPromise();
      if (data.body) {
        this.userChat.idBoxActive = data.body.id;
      }
    }
    const params = {
      theLoai: 'Voice',
      hinhAnhList: [],
      voice: this.audioUrl,
      tinNhan: '',
      idKhachHang: '',
      idNhanVien: '',
      idHopThoaiKhachHang: this.userChat.idBoxActive,
      huongGui: this.userUseChat.chucVu ? 'nv-kh' : 'kh-nv',
    };
    if (this.userUseChat.chucVu) {
      // nếu là bên của nhân viên
      params.idKhachHang = this.userChat.userChat.id;
      params.idNhanVien = this.userUseChat.id;
    }
    if (!this.userUseChat.chucVu) {
      // nếu là bên của nhân viên
      params.idKhachHang = this.userUseChat.id;
      params.idNhanVien = this.userChat.userChat.id;
    }
    if (this.userChat.idBoxActive === 0) {
      return;
    }
    const data = await this.server.guiTinNhanKh(params).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
      } else {
        const hinhAnh = data.body.hinhAnh.split(',');
        data.body.hinhAnhList = hinhAnh;
        this.messageList.push(data.body);
        const messageToSend = {
          ...data.body, // Spread the existing properties
          idNguoiNhan: this.userChat.userChat.id, // Add the new property;
          role: 'nv-nv', // Add the new property;
        };
        this.chatService.sendMessage(messageToSend);
        this.getAllChatBox();
        this.newMessage = '';
        this.listAnhDuocChon = [];
        this.clearFileInput();
        this.typeChat = 'Text';
        this.changeDetector.detectChanges();
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    }
  }
  scrollToBottom(): void {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;
  }
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files).slice(0, 5); // Limit to 5 files
      for (const file of files) {
        const post = await this.serviceIMG.upload(file, 'Images').toPromise();
        if (post) {
          this.listAnhDuocChon.push(post.result);
        }
      }
    }
    this.typeChat = 'IMG';
  }
  deleteImage(index: number): void {
    this.listAnhDuocChon.splice(index, 1);
    if (this.listAnhDuocChon.length === 0) {
      this.typeChat = 'Text';
    }
  }
  clearFileInput(): void {
    if (this.uploadFileInput) {
      this.uploadFileInput.nativeElement.value = '';
    }
  }
  async getAllNhanVien() {
    const data = await this.server.getAllNhanVien().toPromise();
    if (data) {
      this.listUserChatBox = data;
    }
  }
  async getAllKhachHang() {
    const data = await this.server.getAllKhachHang().toPromise();
    if (data) {
      this.listUserChatBox = data;
    }
  }
  async boxChat(user: any) {
    if (user.id === this.idNhanVien) {
      return;
    }
    // check xem có giữa 2 người đã có tin nhắn hay chưa
    this.userChat.activeChat = true;
    this.isCheckScroll = false;
    setTimeout(() => {
      this.isCheckScroll = true;
    }, 300);
    this.userChat.idBoxActive = 0;
    this.userChat.imgUserChat = user.hinhAnh;
    this.userChat.userChat = {
      id: user.id,
      img: user.hinhAnh,
      ten: user.hoTen,
      hoatDong: user.isOnline,
    };
    let params = {};
    if (this.userUseChat.chucVu) {
      // nếu là bên của nhân viên
      params = {
        idKhachHang: this.userChat.userChat.id, // id của thằng đang active box
        idNhanVien: this.userUseChat.id, // id của thằng hiện tại
      };
    }
    if (!this.userUseChat.chucVu) {
      // nếu là bên của nhân viên
      params = {
        idKhachHang: this.userUseChat.id, // id của thằng đang active box
        idNhanVien: this.userChat.userChat.id, // id của thằng hiện tại
      };
    }
    const data = await this.server.checkHopThoaiByKhachHang(params).toPromise();
    if (data.body) {
      // nếu có box thì mở box đó lên
      this.userChat.idBoxActive = data.body.id;
    }
    if (this.userChat.idBoxActive > 0) {
      this.queryParams.idHopThoai = this.userChat.idBoxActive;
      this.getAllChatByIdBox();
    }
    if (this.userChat.idBoxActive === 0) {
      this.messageList = [];
    }
  }
  async onScroll(event: Event): Promise<void> {
    const element = event.target as HTMLElement;
    if (!this.isCheckScroll) {
      return;
    }
    // Kiểm tra xem đã cuộn đến đầu chưa
    if (element.scrollTop === 0) {
      if (this.messageList.length === this.totalItem) {
        return;
      }
      this.queryParams.page = this.queryParams.page + 1;
      const data = await this.server.getAllMessKH(this.queryParams).toPromise();
      if (data) {
        data.item.map((item: any) => {
          this.messageList.unshift(item);
        });
        this.totalItem = data.totalItem;
      }
    }
  }
}
