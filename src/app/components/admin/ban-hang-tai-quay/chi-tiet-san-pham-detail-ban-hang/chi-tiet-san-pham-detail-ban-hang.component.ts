import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { CTSPServiceService } from '../../service/sp-ctsp-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-chi-tiet-san-pham-detail-ban-hang',
  templateUrl: './chi-tiet-san-pham-detail-ban-hang.component.html',
  styleUrls: ['./chi-tiet-san-pham-detail-ban-hang.component.scss'],
})
export class ChiTietSanPhamDetailBanHangComponent implements OnInit {
  getData : any;
  constructor(
    private matDialogRef: MatDialogRef<ChiTietSanPhamDetailBanHangComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorService: ErrorTsService,
    private service: CTSPServiceService,
    private spinner: NgxSpinnerService,
  ) {
    this.getAll(data.idSanPham);
  }
  ngOnInit(): void {}
  async getAll(id : any) {
    this.spinner.show();
    const data = await this.service.getByIdSP(id).toPromise();
    if (data) {
      this.getData = data;
      this.spinner.hide();
    }
  }
}
