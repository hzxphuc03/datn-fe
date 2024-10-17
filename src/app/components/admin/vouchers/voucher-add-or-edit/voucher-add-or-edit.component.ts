import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherService } from '../../service/voucher.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-voucher-add-or-edit',
  templateUrl: './voucher-add-or-edit.component.html',
  styleUrls: ['./voucher-add-or-edit.component.scss'],
})
export class VoucherAddOrEditComponent implements OnInit {
  data: any = {};
  id: string | null = null;
  isAdd: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: VoucherService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private errorService: ErrorTsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id && this.id !== 'add') {
        this.isAdd = false;
        this.getAll();
      }
    });
  }
  getAll() {
    // thiếu đầu get by id
  }
}
