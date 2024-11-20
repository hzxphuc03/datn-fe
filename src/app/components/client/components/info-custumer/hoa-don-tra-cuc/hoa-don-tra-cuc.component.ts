import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GiamGiaServiceService } from 'src/app/components/admin/service/giam-gia-service.service';
import { KIchCoServiceService } from 'src/app/components/admin/service/kich-co-service.service copy';
import { LoaiCoServiceService } from 'src/app/components/admin/service/loai-co.service.service';
import { LoaiDeServiceService } from 'src/app/components/admin/service/loai-de-service.service';
import { TheLoaiServiceService } from 'src/app/components/admin/service/the-loai-service.service';
import { ThuongHieuServiceService } from 'src/app/components/admin/service/thuong-hieu-service.service';
import { UploadImgService } from 'src/app/components/admin/service/upload-img.service';
import { VatLieuServiceService } from 'src/app/components/admin/service/vat-lieu-service.service';
import { TokenService } from 'src/app/services/token.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { HomeServoceService } from '../../../services/home-service.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-hoa-don-tra-cuc',
  templateUrl: './hoa-don-tra-cuc.component.html',
  styleUrls: ['./hoa-don-tra-cuc.component.scss'],
})
export class HoaDonTraCucComponent implements OnInit {
  idKhachHang: any;
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData = [];
  idhd: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: HomeServoceService,
    private serviceGiamGia: GiamGiaServiceService,
    private spinner: NgxSpinnerService,
    private serviceThuongHieu: ThuongHieuServiceService,
    private serviceTheLoai: TheLoaiServiceService,
    private serviceLoaiCo: LoaiCoServiceService,
    private serviceVatLieu: VatLieuServiceService,
    private serviceLoaiDe: LoaiDeServiceService,
    private serviceIMG: UploadImgService,
    private serviceKichCo: KIchCoServiceService,
    private dialog: MatDialog,
    private tokenService: TokenService,
    private errorService: ErrorTsService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const isExpired = this.tokenService.isTokenExpired();
    const { decoded } = this.tokenService.getToken();
    const a = this.tokenService.getToken();
    if (a.decoded === null) {
      this.router.navigate(['/g4/shop/login']);
    }
    if (a.decoded.role !== 'KhachHang') {
      this.tokenService.removeToken();
      this.router.navigate(['/g4/shop/login']);
      return;
    }
    if (decoded) {
      if (isExpired) {
        this.errorService.displayError(
          'hết thời gian đăng nhập, vui lòng đăng nhập lại',
          'normal'
        );
        this.tokenService.removeToken();
        this.router.navigate(['/g4/shop/login']);
      }
    } else {
      this.router.navigate(['/g4/shop/login']);
    }
    this.idKhachHang = decoded.user.id;
    this.getListWords('rows');
    this.dataService.data$.subscribe((data: any) => {
      this.getListWords('load');
    });
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
    this.searchQuery.idKhachHang = this.idKhachHang;
    const data = await this.service
      .getHoaDonByIdKH(this.searchQuery)
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
  details(item: any) {
    this.router.navigate([], {
      queryParams: { activeItem: 1, idhd: item.id },
      queryParamsHandling: 'merge', // Giữ lại các tham số khác nếu có
    });
  }
}
