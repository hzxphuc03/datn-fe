import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GiamGiaServiceService } from '../../service/giam-gia-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-giam-gia-add-or-edit',
  templateUrl: './giam-gia-add-or-edit.component.html',
  styleUrls: ['./giam-gia-add-or-edit.component.scss']
})
export class GiamGiaAddOrEditComponent implements OnInit {
  constructor(
    private matDialogRef: MatDialogRef<GiamGiaAddOrEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private service: GiamGiaServiceService,
    private errorService: ErrorTsService
  ) { 
    if(data){
      if(data.ngayBatDau ){
        data.ngayBatDau = new Date(data.ngayBatDau);
      }
      if(data.ngayKetThuc ){
        data.ngayKetThuc = new Date(data.ngayKetThuc);
      }
    }
  }

  ngOnInit(): void {
  }
  close(){
    this.matDialogRef.close();
  }
  async addOrUpdate() {
    if (this.data.id) {
      const update = await this.service.update(this.data).toPromise();
      if (update) {
        if (update.body.errorCode === 400) {
          this.errorService.displayError(update.body.messageError, 'error');
        }else{
          this.errorService.displayError('Cập nhật thành công', 'success');
          this.matDialogRef.close();
        }
      }
    } else {
     let dataAdd = {
      id: 0,
      ten: this.data.ten,
      ngayTao: "2024-10-13T12:26:45.384096",
      ngaySua: "2024-10-13T12:26:45.384096", // không qun trọng 
      ngayBatDau: this.data.ngayBatDau,// không qun trọng 
      ngayKetThuc: this.data.ngayKetThuc,
      mucGiam: this.data.mucGiam,
      trangThai: 1
      } 
      const add = await this.service.add(dataAdd).toPromise();
      if (add) {
        if (add.body.errorCode === 400) {
          this.errorService.displayError(add.body.messageError, 'error');
        }else{
          this.matDialogRef.close();
        }
      }
    }
  }

}
