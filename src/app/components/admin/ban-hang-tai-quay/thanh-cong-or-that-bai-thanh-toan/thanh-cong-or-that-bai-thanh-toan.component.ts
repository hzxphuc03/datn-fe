import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { FormThanhToanComponent } from '../form-thanh-toan/form-thanh-toan.component';
import { HoaDonService } from '../../service/hoa-don.service';

@Component({
  selector: 'app-thanh-cong-or-that-bai-thanh-toan',
  templateUrl: './thanh-cong-or-that-bai-thanh-toan.component.html',
  styleUrls: ['./thanh-cong-or-that-bai-thanh-toan.component.scss']
})
export class ThanhCongOrThatBaiThanhToanComponent implements OnInit {
  data : any;
  constructor(    private spinner: NgxSpinnerService,
    private router: Router,
    private matDialogRef: MatDialogRef<ThanhCongOrThatBaiThanhToanComponent>,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private errorService: ErrorTsService,
    private service : HoaDonService
  ) { }

  ngOnInit(): void {
    this.getHoaDonById();
  }
  async getHoaDonById(){
    if(this.getData.vnpOrderInfo){
      const api = await this.service.getHDbyId(this.getData.vnpOrderInfo).toPromise();
      if (api) {
        if (api?.errorCode) {
          this.errorService.displayError(api.messageError, 'error');
        } else {
         this.data = api.body; 
        }
      }
    }
  }
  close(){
    this.matDialogRef.close('check')
  }
}
