import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { KIchCoServiceService } from '../../service/kich-co-service.service copy';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-add-or-detail-kich-co',
  templateUrl: './add-or-detail.component.html',
  styleUrls: ['./add-or-detail.component.scss'],
})
export class AddOrDetailKichCoComponent implements OnInit {
  @Input() dataGet: any;
  dataDetail: any = {};
  @Output() end = new EventEmitter();
  isAdd: boolean = false;
  constructor(private service: KIchCoServiceService,    private errorService: ErrorTsService,) {}

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
