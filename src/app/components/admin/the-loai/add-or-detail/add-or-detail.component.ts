import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TheLoaiServiceService } from '../../service/the-loai-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-add-or-detail-the-loai',
  templateUrl: './add-or-detail.component.html',
  styleUrls: ['./add-or-detail.component.scss'],
})
export class AddOrDetailTheLoaiComponent implements OnInit {
  @Input() dataGet: any;
  dataDetail: any = {};
  @Output() end = new EventEmitter();
  isAdd: boolean = false;
  constructor(private service: TheLoaiServiceService, private errorService: ErrorTsService) {}

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
          this.end.emit('add-or-update');
        }
      }
    } else {
      const add = await this.service.add(this.dataDetail.ten).toPromise();
      if (add) {
        if (add.body.errorCode === 400) {
          this.errorService.displayError(add.body.messageError, 'error');
        }else{
          this.end.emit('add-or-update');
        }
      }
    }
    
  }
}
