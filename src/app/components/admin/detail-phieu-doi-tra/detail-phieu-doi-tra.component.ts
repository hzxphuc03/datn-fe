import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenService } from 'src/app/services/token.service';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { AddDiaChiComponent } from '../../client';
import { DataService } from '../../client/services/data.service';
import { HomeServoceService } from '../../client/services/home-service.service';
import { KhachHangServiceService } from '../service/khach-hang-service.service';
import { DoiTraService } from '../service/doi-tra.service';
import { UploadImgService } from '../service/upload-img.service';

@Component({
  selector: 'app-detail-phieu-doi-tra',
  templateUrl: './detail-phieu-doi-tra.component.html',
  styleUrls: ['./detail-phieu-doi-tra.component.scss']
})
export class DetailPhieuDoiTraComponent implements OnInit {
  idPhieu: any = null;
  data: any;
  params : any = {}
  visible: boolean = false;
  visible1: boolean = false;
  visible2: boolean = false;
  visible3: boolean = false;
  visible4: boolean = false;
  visible5: boolean = false;
  listTinhThanh: any[] = [];
  isCheckUrl : boolean = false;
  //
  listQuanHuyen: any[] = [];
  //
  listQuanXa: any[] = [];
  //
  ghiChu: any;
  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData: any;
  visibaleNoteHuy : boolean = false;
  hinhAnhList : any[] = [];
  note : any = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: HomeServoceService,
    private spinner: NgxSpinnerService,
    private serviceLocation: DiaChiServiceService,
    private tokenService: TokenService,
    private serviceDiaChi: KhachHangServiceService,
    private dialog: MatDialog,
    private errorService: ErrorTsService,
    private dataService: DataService,
    private doiTraService : DoiTraService,
    private serviceIMG: UploadImgService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idPhieu = params.get('id');
    });
    const { decoded } = this.tokenService.getToken();
    this.searchQuery.idNhanVien = decoded.user.id;
    this.getAllDetailPhieu();
    
    this.dataService.data$.subscribe((data: any) => {
      this.getAllDetailPhieu();
    });
  }
  getAllDetailPhieu() {
    this.spinner.show();
    this.service.getPhieuDoiTraById(this.idPhieu).subscribe((res) => {
      this.spinner.hide();
      this.data = res;
      this.hinhAnhList = [];
    });
  }
  isVideo(url: string): boolean {
    // Kiểm tra nếu URL kết thúc bằng ".mp4" hoặc các định dạng video khác
    return url.endsWith('.mp4');
  }
  showDialog() {
    this.visible = true;
}
  async nextStep(){
  const params = {
    idKhachHang :null,
    trangThai : this.data.phieuDoiTra.trangThai + 1,
    idPhieuDoiTra : this.data.phieuDoiTra.id,
    idNhanVien : this.searchQuery.idNhanVien
  }
  this.spinner.show();
  const data = await this.service.udpateTrangThaiPhieu(params).toPromise();
  if (data) {
    if (data?.errorCode) {
      this.errorService.displayError(data.messageError, 'error');
      this.spinner.hide();
    } else {
      if (data.body) {
        // Chuyển hướng đến link cụ thể trong tab hiện tại
        this.getAllDetailPhieu();
        this.spinner.hide();
      }
    }
  }
  
}
  async huyPhieu(){
  // tạo note mới
  const params = {
    idNhanVien : this.searchQuery.idNhanVien,
    idPhieuDoiTra : this.data.phieuDoiTra.id,
    ghiChu : this.note
  }
  const note  = await this.doiTraService.noteByNhanVien(params).toPromise();
  if (note) {
    if (note?.errorCode) {
      this.errorService.displayError(note.messageError, 'error');
      this.spinner.hide();
    } else {
      if (note.body) {
        // Chuyển hướng đến link cụ thể trong tab hiện tại
        // sau khi note xong cập nhật trang thái
        const { decoded } = this.tokenService.getToken();
        params.ghiChu = `Nhân viên :${decoded.user.hoTen} đã hủy phiếu này , thắc mắc vui lòng liên hệ của hàng`;
        const update = await this.doiTraService.nhanVienHuyPhieuDoiTra(params).toPromise();
        if(update){
          if (update?.errorCode) {
            this.errorService.displayError(update.messageError, 'error');
            this.spinner.hide();
          } else {
            if (update.body) {
              this.visibaleNoteHuy = false;
              this.errorService.displayError('Hủy phiếu thành công','error');
              this.getAllDetailPhieu();

            }
          }
        }
      }
    }
  }
  // hủy hóa đơn
  // load lại form
}
  async xacNhanPhieu(){
  // tạo note mới
  const params = {
    idNhanVien : this.searchQuery.idNhanVien,
    idPhieuDoiTra : this.data.phieuDoiTra.id,
  }
  const update = await this.doiTraService.nhanVienXacNhanPhieuDoiTra(params).toPromise();
  if(update){
    if (update?.errorCode) {
      this.errorService.displayError(update.messageError, 'error');
      this.spinner.hide();
    } else {
      if (update.body) {
        this.visibaleNoteHuy = false;
        this.errorService.displayError('Xác nhận phiếu thành công','normal');
        this.getAllDetailPhieu();

      }
    }
  }
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
          this.hinhAnhList.push({
            type: 'video',
            url: post.result,
          });
        } else {
          this.hinhAnhList.push({
            type: 'image',
            url: post.result,
          });
        }
      }
    }
  }
}
  async nextStepKiemTra(){
    if(this.hinhAnhList.length === 0){
      this.errorService.displayError('Vui lòng thêm ảnh !!!', 'error');
      return;
    }
  const params = {
    idNhanVien : this.searchQuery.idNhanVien,
    idPhieuDoiTra : this.data.phieuDoiTra.id,
    hinhAnhList : [] as any[]
  }
  this.hinhAnhList.map((item :any) =>{
    params.hinhAnhList.push(item.url);
  })
  const data = await this.doiTraService.kiemTraAnhVideoNhanVien(params).toPromise();
  if(data){
    if (data?.errorCode) {
      this.errorService.displayError(data.messageError, 'error');
      this.spinner.hide();
    } else {
      if (data.body) {
        this.nextStep();
        this.errorService.displayError('Xác nhận phiếu thành công','normal');
        this.getAllDetailPhieu();

      }
    }
  }
}

  async nhanTientaiQuay(){
    if(this.hinhAnhList.length === 0){
      this.errorService.displayError('Vui lòng thêm ảnh !!!', 'error');
      return;
    }
    const params2 = {
      idNhanVien : this.searchQuery.idNhanVien,
      idPhieuDoiTra : this.data.phieuDoiTra.id,
      hinhAnhList : [] as any[]
    }
    this.hinhAnhList.map((item :any) =>{
      params2.hinhAnhList.push(item.url);
    })
    const data = await this.doiTraService.kiemTraAnhVideoBanhChungNhanVien(params2).toPromise();
    if(data){
      if (data?.errorCode) {
        this.errorService.displayError(data.messageError, 'error');
        this.spinner.hide();
      } else {
        const params = {
          idNhanVien : this.searchQuery.idNhanVien,
          idPhieuDoiTra : this.data.phieuDoiTra.id,
          ghiChu : this.note
        }
        const { decoded } = this.tokenService.getToken();
        params.ghiChu = `Nhân viên :${decoded.user.hoTen} đã xác nhận khách hàng nhạn tiền mặt tại quầy`;
        const note  = await this.doiTraService.noteByNhanVien(params).toPromise();
        if (note) {
          if (note?.errorCode) {
            this.errorService.displayError(note.messageError, 'error');
            this.spinner.hide();
          } else {
            if (note.body) {
              this.errorService.displayError('Khách hàng nhận tiền thành công', 'normal');
            }
          }
        }
        this.nextStep();
      }
    }

  // tạo note mới
}
  async addAnhThanhToan(){
  if(this.hinhAnhList.length === 0){
    this.errorService.displayError('Vui lòng thêm ảnh !!!', 'error');
    return;
  }
  const params2 = {
    idNhanVien : this.searchQuery.idNhanVien,
    idPhieuDoiTra : this.data.phieuDoiTra.id,
    hinhAnhList : [] as any[]
  }
  this.hinhAnhList.map((item :any) =>{
    params2.hinhAnhList.push(item.url);
  })
  const data = await this.doiTraService.kiemTraAnhVideoBanhChungNhanVien(params2).toPromise();
  if(data){
    if (data?.errorCode) {
      this.errorService.displayError(data.messageError, 'error');
      this.spinner.hide();
    } else {
      const params = {
        idNhanVien : this.searchQuery.idNhanVien,
        idPhieuDoiTra : this.data.phieuDoiTra.id,
        ghiChu : this.note
      }
      const { decoded } = this.tokenService.getToken();
      params.ghiChu = `Nhân viên :${decoded.user.hoTen} đã xác nhận khách hàng nhạn tiền mặt tại quầy`;
      const note  = await this.doiTraService.noteByNhanVien(params).toPromise();
      if (note) {
        if (note?.errorCode) {
          this.errorService.displayError(note.messageError, 'error');
          this.spinner.hide();
        } else {
          if (note.body) {
            this.errorService.displayError('Đẩy ảnh thanh toán lên thành công', 'normal');
          }
        }
      }
    }
  }
}
goto() {
  this.isCheckUrl = true;
  this.router.navigate([`/auth/admin/quan-ly-hoa-don/${this.data.phieuDoiTra.hoaDonMoi.id}`]);
}


}
