import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { FormThanhToanComponent } from '../form-thanh-toan/form-thanh-toan.component';

@Component({
  selector: 'app-thanh-cong-or-that-bai-thanh-toan',
  templateUrl: './thanh-cong-or-that-bai-thanh-toan.component.html',
  styleUrls: ['./thanh-cong-or-that-bai-thanh-toan.component.scss']
})
export class ThanhCongOrThatBaiThanhToanComponent implements OnInit {

  constructor(    private spinner: NgxSpinnerService,
    private router: Router,
    private matDialogRef: MatDialogRef<ThanhCongOrThatBaiThanhToanComponent>,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private errorService: ErrorTsService) { }

  ngOnInit(): void {
  }
  close(){
    this.matDialogRef.close('check')
  }
}
