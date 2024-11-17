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

@Component({
  selector: 'app-danh-gia',
  templateUrl: './danh-gia.component.html',
  styleUrls: ['./danh-gia.component.scss']
})
export class DanhGiaComponent implements OnInit {
  visible: boolean = true;
  data : any = {};
  constructor( private route: ActivatedRoute,
    private router: Router,
    private service: CTSPServiceService,
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
    private errorService: ErrorTsService) { }

  ngOnInit(): void {
    this.data.listHinhAnh = [];
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
