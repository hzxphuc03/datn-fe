import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MauSacServiceService } from '../../service/mau-sac-service.service';

@Component({
  selector: 'app-mau-sac-add-or-edit',
  templateUrl: './mau-sac-add-or-edit.component.html',
  styleUrls: ['./mau-sac-add-or-edit.component.scss']
})
export class MauSacAddOrEditComponent implements OnInit {
  @Input() dataGet: any;
  dataDetail: any = {}; 
  @Output() end = new EventEmitter();
  isAdd: boolean = false;
  constructor(private service: MauSacServiceService) {}

  ngOnInit(): void {
    if (this.dataGet.id) {
      this.isAdd = false;
      this.dataDetail = this.dataGet;
    } else {
      this.isAdd = true;
      this.dataDetail.ten = '';
    }
  }

  endAction() {
    this.end.emit('close');
  }
  noneClick(event: any) {
    event.stopPropagation();
  }
  async addOrUpdate() {
    if (this.dataGet.id) {
      const update = await this.service.update(this.dataDetail).toPromise();
      if (update) {
      }
    } else {
     let  data = {
        id: 0,
        ten: this.dataDetail.ten,
        maMau: this.dataDetail.maMau,
        ngayTao: "2024-10-12T14:12:06.754Z",
        ngaySua: "2024-10-12T14:12:06.754Z",
        trangThai: 1
      } 
      const add = await this.service.add(data).toPromise();
      if (add) {
      }
    }
    this.end.emit('add-or-update');
  }
}
