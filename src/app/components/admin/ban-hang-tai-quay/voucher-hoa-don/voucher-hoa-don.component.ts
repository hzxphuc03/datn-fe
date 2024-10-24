import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-voucher-hoa-don',
  templateUrl: './voucher-hoa-don.component.html',
  styleUrls: ['./voucher-hoa-don.component.scss'],
})
export class VoucherHoaDonComponent implements OnInit {
  constructor(
    private matDialogRef: MatDialogRef<VoucherHoaDonComponent>,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private errorService: ErrorTsService
  ) {}

  ngOnInit(): void {}
  close(){
    this.matDialogRef.close();
  }
}
