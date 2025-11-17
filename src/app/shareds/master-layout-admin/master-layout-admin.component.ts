import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { ErrorTsService } from '../message/error.service';
import { Subscription } from 'rxjs';
import { AutoServiceService } from '../auto-service.service';
import { ChatService } from '../chat/chat.service';
import { WebsocketService } from '../websocket.service';
import { DataService } from 'src/app/components/client/services/data.service';

@Component({
  selector: 'app-master-layout-admin',
  templateUrl: './master-layout-admin.component.html',
  styleUrls: ['./master-layout-admin.component.scss'],
})
export class MasterLayoutAdminComponent implements OnInit, OnDestroy {
  isOpen: boolean = true;
  errorMessage: any | null = null; // Đảm bảo kiểu dữ liệu cho phép null
  private errorSubscription?: Subscription;
  role : any = ''
  actionNavItems: any[] = [
    { icon: 'bx bx-home-circle', name: 'Trang chủ', url: '/auth/admin/home' },
    {
      icon: 'bx bx-home-circle',
      name: 'Sản phẩm',
      url: '',
      type: 'drop',
      role : 'All',
      item: [
        {
          icon: 'bx bx-cube',
          name: 'Sản phẩm',
          url: '/auth/admin/chi-tiet-san-pham',
        },
        {
          icon: 'bx bx-cube',
          name: 'Thương hiệu',
          url: '/auth/admin/thuong-hieu',
        },
        { icon: 'bx bx-cube', name: 'Thể loại', url: '/auth/admin/the-loai' },
        { icon: 'bx bx-cube', name: 'Kích cỡ', url: '/auth/admin/kich-co' },
        { icon: 'bx bx-cube', name: 'Loại cổ', url: '/auth/admin/loai-co' },
        { icon: 'bx bx-cube', name: 'Loại đế', url: '/auth/admin/loai-de' },
        { icon: 'bx bx-cube', name: 'Vật liệu', url: '/auth/admin/vat-lieu' },
        { icon: 'bx bx-cube', name: 'Màu Sắc', url: '/auth/admin/mau-sac' },
        { icon: 'bx bx-cube', name: 'Giảm giá', url: '/auth/admin/giam-gia',role:"Admin" },
      ],
    },
    {
      icon: 'bx bx-home-circle',
      name: 'Nhân viên',
      role : 'Admin',
      url: '',
      type: 'drop',
      item: [
        { icon: 'bx bx-cube', name: 'Chức vụ', url: '/auth/admin/chuc-vu' },
        { icon: 'bx bx-cube', name: 'Nhân Viên', url: '/auth/admin/nhan-vien' },
      ],
    },
    {
      icon: 'bx bx-home-circle',
      name: 'Khách hàng',
      url: '/auth/admin/khach-hang',
      role : 'Admin',
    },
    {
      icon: 'bx bx-cube',
      name: 'Phiếu giảm giá',
      url: '/auth/admin/voucher',
      role : 'Admin',
    },
    {
      icon: 'bx bx-cube',
      name: 'Bán hàng',
      role : 'All',
      url: '/auth/admin/ban-hang-tai-quay',
    },
    {
      icon: 'bx bx-cube',
      name: 'Hóa đơn',
      role : 'All',
      url: '/auth/admin/quan-ly-hoa-don',
    },
    {
      icon: 'bx bx-cube',
      name: 'Sự kiện',
      url: '/auth/admin/event',
      role : 'Admin',
    },
    {
      icon: 'bx bx-cube',
      name: 'Đổi trả & hoàn tiền',
      url: '/auth/admin/doi-tra',
      role : 'All',
    },
    {
      icon: 'bx bx-cube',
      name: 'Thống kê',
      url: '/auth/admin/thong-ke',
      role : 'Admin',
    },
  ];
  idTinNhanVuaXOng: any = 0;
  nhanVien : any;
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private errorService: ErrorTsService,
    private autoVoucher: AutoServiceService,
    private chatService: ChatService,
    private websocketService: WebsocketService,
    private dataService: DataService,
  ) {
    // Don't check token in constructor - wait for ngOnInit
  }

  ngOnInit(): void {
    const { decoded } = this.tokenService.getToken();
    
    // Check token once on init
    this.checkToken();
    
    this.chatService.getNewMessage().subscribe((message: any) => {
      if (message) {
        if (message.huongGui === 'kh-nv') {
          if (message.nhanVien.id === decoded?.['user']?.id) {
            this.errorService.displayError(
              `Bạn có tin nhắn mới từ khách hàng tên ${message.khachHang.hoTen}`,
              'normal'
            );
            const audio = new Audio(
              'https://s3-sgn10.fptcloud.com/fsel/Files/livechat129007_2763_1732457163133.mp3'
            );
            audio.play().catch((error) => {
              console.error('Error playing audio:', error);
            });
          }
        }
      }
      if (message) {
        if (this.idTinNhanVuaXOng === message.id) {
          return;
        }
        if (
          message.idNguoiNhan === decoded?.['user']?.id &&
          message.role === 'nv-nv'
        ) {
          this.idTinNhanVuaXOng = message.id;
          this.errorService.displayError(
            `Bạn có tin nhắn mới từ ${message.nguoiGui.hoTen}`,
            'normal'
          );
          const audio = new Audio(
            'https://s3-sgn10.fptcloud.com/fsel/Files/livechat129007_2763_1732457163133.mp3'
          );
          audio.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        }
      }
    });
    
    // Only check token on route changes, not every navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkToken();
      }
    });
    
    this.errorSubscription = this.errorService
      .getErrorObservable()
      .subscribe((message) => {
        this.errorMessage = message;
      });

    this.websocketService
      .connect()
      .then(() => {
        console.log('WebSocket connection established');
      })
      .catch((error) => {
        console.error('Error establishing WebSocket connection', error);
      });
      
    this.websocketService.getStompClient().onConnect = (frame) => {
      this.websocketService
        .getStompClient()
        .subscribe('/topic/notifications', (message) => {
          console.log(message);
          this.dataService.updateData('');
        });
    };
  }
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    // Don't check token on every click - too expensive
  }
  checkToken() {
    const isExpired = this.tokenService.isTokenExpired();
    const { decoded } = this.tokenService.getToken();
    
    // Skip check if on login page
    if (this.router.url.includes('/login')) {
      return;
    }
    
    console.log('🔍 Admin - Token decoded:', decoded);
    console.log('🔍 Admin - Role:', decoded?.role);
    
    if (decoded === null) {
      console.log('❌ Token decoded is null');
      this.router.navigate(['/auth/shop/login']);
      return;
    }
    
    // Check role - support multiple formats
    const userRole = decoded?.role || decoded?.['user']?.role;
    const isAdmin = userRole === 'Admin' || 
                    userRole === 'ADMIN' || 
                    userRole === 'admin';
    const isNhanVien = userRole === 'NhanVien' || 
                       userRole === 'NHAN_VIEN' || 
                       userRole === 'nhan_vien' ||
                       userRole === 'NV';
    const hasAdminAuthority = decoded?.authorities?.includes('ROLE_ADMIN') || 
                              decoded?.authorities?.includes('ROLE_NHAN_VIEN');
    
    if (!isAdmin && !isNhanVien && !hasAdminAuthority) {
      console.log('❌ Not admin/staff role:', userRole, 'authorities:', decoded?.authorities);
      this.tokenService.removeToken();
      this.router.navigate(['/auth/shop/login']);
      return;
    }
    
    console.log('✅ Role check passed:', userRole);
    this.role = userRole;
    
    if (isExpired) {
      this.errorService.displayError(
        'hết thời gian đăng nhập, vui lòng đăng nhập lại',
        'normal'
      );
      this.tokenService.removeToken();
      this.router.navigate(['/auth/shop/login']);
      return;
    }
    
    this.nhanVien = decoded?.['user'];
    this.auto();
  }
  async auto() {
    const voucherAuto = await this.autoVoucher.autoVoucher().toPromise();
  }
  openSlide() {
    if (this.isOpen) {
      this.actionNavItems.map((a) => {
        a.open = false;
      });
    }
    this.isOpen = !this.isOpen;
  }
  logOut() {
    this.tokenService.removeToken();
    this.errorService.displayError('Đăng xuất thành công', 'normal');
    this.router.navigate(['/auth/shop/login']);
  }
  ngOnDestroy(): void {
    this.errorSubscription?.unsubscribe();
  }
}
