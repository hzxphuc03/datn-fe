import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaiCoServiceService } from '../../service/loai-co.service.service';

@Component({
  selector: 'app-add-or-edit-loai-co',
  templateUrl: './add-or-edit.component.html',
  styleUrls: ['./add-or-edit.component.scss']
})
export class AddOrEditLoaiCoComponent implements OnInit {
  @Input() dataGet: any;
  dataDetail: any = {};
  @Output() end = new EventEmitter();
  isAdd: boolean = false;
  constructor(private service: LoaiCoServiceService) {}

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
      const add = await this.service.add(this.dataDetail.ten).toPromise();
      if (add) {
      }
    }
    this.end.emit('add-or-update');
  }
}
