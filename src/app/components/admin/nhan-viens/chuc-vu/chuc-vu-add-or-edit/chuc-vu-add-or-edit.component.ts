import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChucVuServiceService } from '../../../service/chuc-vu-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-chuc-vu-add-or-edit',
  templateUrl: './chuc-vu-add-or-edit.component.html',
  styleUrls: ['./chuc-vu-add-or-edit.component.scss'],
})
export class ChucVuAddOrEditComponent implements OnInit {
  @Input() dataGet: any;
  dataDetail: any = {};
  @Output() end = new EventEmitter();
  isAdd: boolean = false;
  constructor(private service: ChucVuServiceService, private errorService: ErrorTsService) {}

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
        if (update.body.errorCode === 400) {
          this.errorService.displayError(update.body.messageError, 'error');
        }else{
          this.errorService.displayError('Thành công', 'normal');
          this.end.emit('add-or-update');
        }
      }
    } else {
      const add = await this.service.add(this.dataDetail.ten).toPromise();
      if (add) {
        if (add.body.errorCode === 400) {
          this.errorService.displayError(add.body.messageError, 'error');
        }else{
          this.errorService.displayError('Thành công', 'normal');
          this.end.emit('add-or-update');
        }
      }
    }
    
  }
}
