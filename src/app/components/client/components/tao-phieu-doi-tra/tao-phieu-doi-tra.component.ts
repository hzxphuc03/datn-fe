import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
import { DataService } from '../../services/data.service';
import { HomeServoceService } from '../../services/home-service.service';

@Component({
  selector: 'app-tao-phieu-doi-tra',
  templateUrl: './tao-phieu-doi-tra.component.html',
  styleUrls: ['./tao-phieu-doi-tra.component.scss'],
})
export class TaoPhieuDoiTraComponent implements OnInit {
  step: number = 1;
  idKhachHang: any;
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData = [];
  idhd: string | null = null;
  queryParams: any = {};
  listChiTietSanPham: any[] = [];
  display: boolean = false;
  optionValue: any[] = [
    { title: 'Hoàn tiền', value: 1 },
    { title: 'Đổi trả', value: 2 },
  ];
  constructor(
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
    private dataService: DataService,
    private matDialogRef: MatDialogRef<TaoPhieuDoiTraComponent>
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
    this.queryParams.listChiTietSanPham = [];
    this.queryParams.hinhAnhList = [];
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
  createPhieu(item: any) {
    this.queryParams.idHdDoi = item.id;
    this.queryParams.listChiTietSanPham = [];
    this.step++;
    this.getDetailHoaDon();
  }
  async getDetailHoaDon() {
    const data = await this.service
      .getDetailHoaDonByIdHD(this.queryParams.idHdDoi)
      .toPromise();
    if (data) {
      this.listChiTietSanPham = data.hoaDonChiTietList;
    }
  }
  addSpToPhieu(item: any) {
    item.maxSoluong = item.soLuong;
    item.soLuong = 1;
    const existingItem = this.queryParams.listChiTietSanPham.find(
      (sp: any) => sp.id === item.id
    );
    if (existingItem) {
      return;
    } else {
      // Nếu chưa tồn tại, thêm sản phẩm mới với số lượng ban đầu
      this.queryParams.listChiTietSanPham.push(item);
    }
  }
  removeSpFromPhieu(index: any) {
    this.queryParams.listChiTietSanPham.splice(index, 1);
  }
  toBuoc3() {
    if (this.queryParams.listChiTietSanPham.length === 0) {
      this.errorService.displayError(
        'Vui lòng chọn sản phẩm để tiếp tục',
        'normal'
      );
      return;
    }
    this.step++;
  }
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files).slice(0, 5); // Giới hạn 5 tệp
      for (const file of files) {
        const post = await this.serviceIMG.upload(file, 'Files').toPromise();
        if (post) {
          // Kiểm tra nếu kết quả có đuôi là .mp4
          const fileExtension = post.result.split('.').pop()?.toLowerCase();
          if (fileExtension === 'mp4') {
            this.queryParams.hinhAnhList.push({
              type: 'video',
              url: post.result,
            });
          } else {
            this.queryParams.hinhAnhList.push({
              type: 'image',
              url: post.result,
            });
          }
        }
      }
    }
  }
  async taoPhieu() {
    if (this.queryParams.listChiTietSanPham.length === 0) {
      this.errorService.displayError('Vui lòng chọn sản phẩm', 'error');
      return;
    }
    if (this.queryParams.hinhAnhList.length === 0) {
      this.errorService.displayError('Hình ảnh , video đang để trống', 'error');
      return;
    }
    if (this.queryParams.lyDoDoiTra === '') {
      this.errorService.displayError(
        'Lý do đổi trả không được để trống',
        'error'
      );
      return;
    }
    let params = {
      idHoaDon: this.queryParams.idHdDoi,
      sanPhamDoiTraList: [] as any[],
      hinhAnhList: [] as string[],
      lyDoDoiTra: '',
      theLoai: 0,
    };
    this.queryParams.hinhAnhList.map((item: any) => {
      if (item.url) {
        const data = item.url;
        params.hinhAnhList.push(data);
      }
    });
    this.queryParams.listChiTietSanPham.map((item: any) => {
      if (item.soLuong > 0) {
        params.sanPhamDoiTraList.push({
          idHoaDonChiTiet: item.id,
          soLuong: item.soLuong,
        });
      }
    });
    params.lyDoDoiTra = this.queryParams.lyDoDoiTra;
    params.theLoai = this.queryParams.theLoai;
    this.spinner.show();
    const data = await this.service.addPhieuDoiTra(params).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
        this.spinner.hide();
      } else {
        this.matDialogRef.close('check');
        this.spinner.hide();
      }
    }
  }
}
