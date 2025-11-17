import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GiamGiaServiceService } from 'src/app/components/admin/service/giam-gia-service.service';
import { KIchCoServiceService } from 'src/app/components/admin/service/kich-co-service.service copy';
import { LoaiCoServiceService } from 'src/app/components/admin/service/loai-co.service.service';
import { LoaiDeServiceService } from 'src/app/components/admin/service/loai-de-service.service';
import { CTSPServiceService } from 'src/app/components/admin/service/sp-ctsp-service.service';
import { TheLoaiServiceService } from 'src/app/components/admin/service/the-loai-service.service';
import { ThuongHieuServiceService } from 'src/app/components/admin/service/thuong-hieu-service.service';
import { UploadImgService } from 'src/app/components/admin/service/upload-img.service';
import { VatLieuServiceService } from 'src/app/components/admin/service/vat-lieu-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { HomeServoceService } from '../../../services/home-service.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-danh-gia',
  templateUrl: './danh-gia.component.html',
  styleUrls: ['./danh-gia.component.scss']
})
export class DanhGiaComponent implements OnInit {
  visible: boolean = false;
  visibleAll: boolean = false;
  data : any = {};
  danhGias : any[] = [];
  idKhachHang: any;
  constructor( private route: ActivatedRoute,
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
    private errorService: ErrorTsService) { }

  ngOnInit(): void {
    const isExpired = this.tokenService.isTokenExpired();
    const { decoded } = this.tokenService.getToken();
    const a = this.tokenService.getToken();
    if (a.decoded === null) {
      this.router.navigate(['/g4/shop/login']);
    }
    if (a.decoded?.role !== 'KHACH_HANG') {
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
    this.idKhachHang = decoded?.["user"].id;
    this.data.listHinhAnh = [];
    this.data.idKhachHang = this.idKhachHang as Number ;
    this.getAllDanhGia();
  }

  async getAllDanhGia(){
    const data = await this.service.getTatCaSpCHuaDanhGiaByIdKh(this.idKhachHang).toPromise();
    if(data){
      this.danhGias = data;
    }
  }
  async danhGiaAll(){
    this.data.idSanPham = 0;
    const data = await this.service.danhGiaAll(this.data).toPromise();
    if(data){
      this.errorService.displayError('Đánh giá tất cả thành công', 'sussces');
        this.visibleAll = false;
        this.data = {};
        this.getAllDanhGia();
        this.spinner.hide();
    }
    // danhGiaAll
  }
  async danhGiaDon(){
    const data = await this.service.danhGiaSinger(this.data).toPromise();
    if(data){
      this.errorService.displayError('Đánh giá tất cả thành công', 'sussces');
        this.visible = false;
        this.data = {};
        this.getAllDanhGia();
        this.spinner.hide();
    }
    // danhGiaAll
  }

  showDialog() {
      this.visible = true;
  }
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files).slice(0, 5); // Limit to 5 files
      for (const file of files) {
        const post = await this.serviceIMG.upload(file, 'Images').toPromise();
        if (post) {
          this.data.listHinhAnh.push(post.result);
        }
      }
    }
  }
}
