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
import { DataService } from '../../../services/data.service';
import { HomeServoceService } from '../../../services/home-service.service';

@Component({
  selector: 'app-detail-don-hang-kh',
  templateUrl: './detail-don-hang-kh.component.html',
  styleUrls: ['./detail-don-hang-kh.component.scss'],
})
export class DetailDonHangKhComponent implements OnInit {
  idhd: any;
  data: any = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.queryParams.subscribe((params) => {
      this.idhd = params['idhd'];
      if (this.idhd) {
        this.getDetailHoaDon();
      }
    });
  }
  async getDetailHoaDon() {
    const data = await this.service
      .getDetailHoaDonByIdHD(this.idhd)
      .toPromise();
    if (data) {
      this.data = data;
      console.log(this.data);
    }
  }
}
