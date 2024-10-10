import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VatLieuServiceService } from '../../service/vat-lieu-service.service';

@Component({
  selector: 'app-add-or-edit-vat-lieu',
  templateUrl: './add-or-edit-vat-lieu.component.html',
  styleUrls: ['./add-or-edit-vat-lieu.component.scss']
})
export class AddOrEditVatLieuComponent implements OnInit {
  @Input() dataGet: any;
  dataDetail: any = {};
  @Output() end = new EventEmitter();
  isAdd: boolean = false;
  constructor(private service: VatLieuServiceService) {}

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
