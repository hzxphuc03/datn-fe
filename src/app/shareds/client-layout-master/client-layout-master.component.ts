import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { AutoServiceService } from '../auto-service.service';
import { ErrorTsService } from '../message/error.service';
import { HomeServoceService } from 'src/app/components/client/services/home-service.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { DataService } from 'src/app/components/client/services/data.service';

@Component({
  selector: 'app-client-layout-master',
  templateUrl: './client-layout-master.component.html',
  styleUrls: ['./client-layout-master.component.scss'],
})
export class ClientLayoutMasterComponent implements OnInit {
  isLoginKhachHang: boolean = true;
  isOpenSearch: boolean = false;
  searchControl = new FormControl();
  searchResults: any[] = []; // Biến để lưu kết quả tìm kiếm
  isOpenUser : boolean = false;
  idKhachHang : any;
  countGioHang : any = 0;
  receivedData: string = '';
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private errorService: ErrorTsService,
    private autoVoucher: AutoServiceService,
    private service: HomeServoceService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.receivedData = this.dataService.getData();
    // Lắng nghe các thay đổi từ service
    this.dataService.data$.subscribe(data => {
      this.receivedData = data; // Cập nhật dữ liệu khi có thay đổi
      this.getGioHang();
    });
    const { decoded } = this.tokenService.getToken();
    if (!decoded) {
      this.router.navigate(['/g4/shop/login']);
    }
    this.idKhachHang = decoded.user.id;
    this.getGioHang();
    this.checkToken();
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
  }
  checkToken() {
    const isExpired = this.tokenService.isTokenExpired();
    const { decoded } = this.tokenService.getToken();
    if (decoded) {
      if (isExpired) {
        this.errorService.displayError(
          'hết thời gian đăng nhập, vui lòng đăng nhập lại',
          'normal'
        );
        this.tokenService.removeToken();
        this.isLoginKhachHang = false;
      }
    } else {
      this.isLoginKhachHang = false;
    }
  }
  goDetail(id: any) {
    this.isOpenSearch = false;
    this.router.navigate([`/g4/shop/san-pham/${id}`]);
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const searchInput = document.getElementById('search-input');
    const openUserActive = document.getElementById('open-user-active');
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
    if (
      openUserActive &&
      !openUserActive.contains(event.target as Node)
    ) {
      this.isOpenUser = false; // Đóng hộp tìm kiếm
    }

  }
  async getGioHang(){
    const data = await this.service.getSoluongGioHang(this.idKhachHang).toPromise();
    if(data){
      this.countGioHang = data;
      console.log(data);
      
    }
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
  logOut(){
    this.tokenService.removeToken();
    this.errorService.displayError('Đăng xuất thành công', 'normal');
    this.router.navigate(['/g4/shop/login']);
  }
}
