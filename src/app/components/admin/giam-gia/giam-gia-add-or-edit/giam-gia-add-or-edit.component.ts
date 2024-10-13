import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GiamGiaServiceService } from '../../service/giam-gia-service.service';

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
        this.matDialogRef.close();
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
        this.matDialogRef.close();
      }
    }
  }

}
