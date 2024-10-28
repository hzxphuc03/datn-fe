import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { VoucherService } from '../../service/voucher.service';
import { HoaDonService } from '../../service/hoa-don.service';

@Component({
  selector: 'app-detail-hoa-don-quan-ly',
  templateUrl: './detail-hoa-don-quan-ly.component.html',
  styleUrls: ['./detail-hoa-don-quan-ly.component.scss'],
})
export class DetailHoaDonQuanLyComponent implements OnInit {
  data: any = {};
  id: string | null = null;
  isAdd: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: HoaDonService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private errorService: ErrorTsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.isAdd = false;
        this.detail();
      }
    });
  }
  async detail() {
    this.spinner.show();
    const data = await this.service.getHDbyId(this.id).toPromise();
    if (data) {
      if (data.body.errorCode === 400) {
        this.errorService.displayError(data.body.messageError, 'error');
        this.spinner.hide();
        this.router.navigate(['/auth/admin/quan-ly-hoa-don']);
      } else {
        this.data = data.body;
        this.spinner.hide();
      }
    }
  }
}
