import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { AutoServiceService } from '../auto-service.service';
import { ErrorTsService } from '../message/error.service';
import { HomeServoceService } from 'src/app/components/client/services/home-service.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { DataService } from 'src/app/components/client/services/data.service';
import { ChatService } from '../chat/chat.service';
import { WebsocketService } from '../websocket.service';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';

@Component({
  selector: 'app-client-layout-master',
  templateUrl: './client-layout-master.component.html',
  styleUrls: ['./client-layout-master.component.scss'],
})
export class ClientLayoutMasterComponent implements OnInit, OnDestroy {
  isLoginKhachHang: boolean = true;
  isOpenSearch: boolean = false;
  searchControl = new FormControl();
  searchResults: any[] = []; // Biến để lưu kết quả tìm kiếm
  isOpenUser: boolean = false;
  isOpenUserNoti: boolean = false;
  idKhachHang: any;
  countGioHang: any = 0;
  countThongBao: any = 0;
  receivedData: string = '';
  //
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData: any[] = [];
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private errorService: ErrorTsService,
    private autoVoucher: AutoServiceService,
    private service: HomeServoceService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private websocketService: WebsocketService,
    private spinner: NgxSpinnerService
  ) {}
  notifications: string[] = []; // Mảng chứa các thông báo

  ngOnInit(): void {
    const { decoded } = this.tokenService.getToken();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEndEvent = event as NavigationEnd; // Type assertion
        // console.log('URL changed to:', navigationEndEvent.url);
        // Thực hiện hành động khi URL thay đổi
      });

    this.idKhachHang = decoded?.user?.id;
    this.searchQuery.idKhachHang = this.idKhachHang;
    if (this.idKhachHang) {
      this.isLoginKhachHang = true;
    } else {
      this.isLoginKhachHang = false;
    }
    this.getAllNoti();
    this.receivedData = this.dataService.getData();

    // Lắng nghe các thay đổi từ service
    this.dataService.data$.subscribe((data: any) => {
      this.receivedData = data; // Cập nhật dữ liệu khi có thay đổi
      this.searchQuery.page = 1;
      this.getGioHang(decoded?.user?.id);
    });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(200), // Đợi 200ms sau khi người dùng ngừng nhập
        distinctUntilChanged(), // Chỉ tiếp tục nếu giá trị đã thay đổi
        switchMap((query) => {
          if (query) {
            this.isOpenSearch = true;
          } else {
            this.isOpenSearch = false;
          }
          return this.service.getTimKiem(query);
        }) // Gọi API
      )
      .subscribe(
        (results) => {
          this.searchResults = results; // Cập nhật kết quả tìm kiếm// Kiểm tra kết quả trong console
        },
        (error) => {
          console.error('Error fetching search results:', error); // Xử lý lỗi
        }
      );
    // Kết nối WebSocket và lắng nghe thông báo
    this.websocketService
      .connect()
      .then(() => {
        console.log('WebSocket connection established');
      })
      .catch((error) => {
        console.error('Error establishing WebSocket connection', error);
      });

    // Lắng nghe thông báo từ WebSocket qua getter
    this.websocketService.getStompClient().onConnect = (frame) => {
      this.websocketService
        .getStompClient()
        .subscribe('/topic/notifications', (message) => {
          this.notifications.push(message.body);
          if (this.idKhachHang + '' === message.body) {
            this.dataService.updateData('');
            this.getAllNoti();
          }
        });
    };
  }
  goDetail(id: any) {
    this.isOpenSearch = false;
    this.router.navigate([`/g4/shop/san-pham/${id}`]);
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const searchInput = document.getElementById('search-input');
    const openUserActive = document.getElementById('open-user-active');
    const openUserActiveNoti = document.getElementById('open-user-active-noti');
    const optionsSearch = document.querySelector('.optionsSearch');

    // Kiểm tra nếu nhấp ra ngoài input và danh sách kết quả
    if (
      searchInput &&
      !searchInput.contains(event.target as Node) &&
      optionsSearch &&
      !optionsSearch.contains(event.target as Node)
    ) {
      this.isOpenSearch = false; // Đóng hộp tìm kiếm
    }
    if (openUserActive && !openUserActive.contains(event.target as Node)) {
      this.isOpenUser = false; // Đóng hộp tìm kiếm
    }
    if (
      openUserActiveNoti &&
      !openUserActiveNoti.contains(event.target as Node)
    ) {
      this.isOpenUserNoti = false; // Đóng hộp tìm kiếm
    }
  }
  async getGioHang(id: any) {
    const data = await this.service.getSoluongGioHang(id).toPromise();
    // if (data) {
    this.countGioHang = data;
    // }
  }
  getAllNoti() {
    // lấy số lượng noti
    // lấy những thông báo noti
    this.searchQuery.pageSize = 10;
    this.getListWords('rows');
    this.getThongBao();
  }
  async getListWords(type: string, action?: string): Promise<void> {
    // this.spinner.show();
    if (type && type === 'rows') {
      this.searchQuery.page = 1;
    }
    if (action) {
      if (action === 'prev' && Number(this.searchQuery.page) > 1) {
        this.searchQuery.page = Number(this.searchQuery.page) - 1;
      }
      if (
        action === 'next' &&
        Number(this.searchQuery.page) + 1 <= this.listPageNumber.length
      ) {
        this.searchQuery.page = Number(this.searchQuery.page) + 1;
      }
    } else {
      this.searchQuery.page = this.searchQuery.page;
    }
    Object.keys(this.searchQuery).forEach((key) => {
      if (this.searchQuery[key] === null || this.searchQuery[key] === '') {
        delete this.searchQuery[key];
      }
    });
    this.spinner.show();
    const data = await this.service
      .getThongBaoByIDKH(this.searchQuery)
      .toPromise();
    if (data) {
      this.getTotalPage(data);
      this.listData = data.item;
      if (this.listData.length) {
        this.listData?.map((item: any) => {
          if (item.trangThai === 1) {
            item.status = true;
          } else {
            item.status = false;
          }
        });
      }

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
    this.listPageNumber = [];
    for (let i = 1; i <= totalPage; i++) {
      this.listPageNumber.push(i);
    }
    return totalPage;
  }
  async getThongBao() {
    const data = await this.service
      .getNumberThongBao(this.idKhachHang)
      .toPromise();
    // if(data){
    this.countThongBao = data;
    // }
  }
  logIn() {
    this.router.navigate(['/g4/shop/login']);
  }
  home() {
    this.router.navigate(['/g4/shop']);
  }
  gioHang() {
    this.router.navigate(['/g4/shop/gio-hang']);
  }
  sanPham() {
    this.router.navigate(['/g4/shop/san-pham']);
  }
  goVoucher() {
    this.router.navigate(['/g4/shop/phieu-giam-gia']);
  }
  goDiaChi() {
    this.router.navigate(['/g4/shop/dia-chi']);
  }
  goToInfo() {
    this.router.navigate(['/g4/shop/khach-hang']);
  }
  goToGioiThieu() {
    this.router.navigate(['/g4/shop/gioi-thieu']);
  }
  goToLienHe() {
    this.router.navigate(['/g4/shop/lien-he']);
  }
  logOut() {
    this.tokenService.removeToken();
    this.errorService.displayError('Đăng xuất thành công', 'normal');
    this.router.navigate(['/g4/shop/login']);
  }
  async goToMessUrl(item: any) {
    const data = await this.service.docThongBaoTheoId(item.id).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
      }
    }
    this.getAllNoti();
    this.router.navigate([item.url.split('?')[0]], {
      queryParams: { activeItem: item.url.split('?')[1]?.split('=')[1] },
    });
    this.isOpenUserNoti = false;
  }
  async readAll() {
    const data = await this.service
      .docTatCaThongBaoTheoIDKH(this.idKhachHang)
      .toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
      } else {
        this.getAllNoti();
        this.errorService.displayError(`Đọc tất cả thành công`, 'success');
      }
    }
  }
  ngOnDestroy(): void {
    // Đảm bảo đóng kết nối khi component bị hủy
    this.websocketService.disconnect();
  }
}
