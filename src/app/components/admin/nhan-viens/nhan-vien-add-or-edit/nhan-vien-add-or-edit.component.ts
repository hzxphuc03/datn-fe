import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NhanVienServiceService } from '../../service/nhan-vien-service.service';
import { ChucVuServiceService } from '../../service/chuc-vu-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-nhan-vien-add-or-edit',
  templateUrl: './nhan-vien-add-or-edit.component.html',
  styleUrls: ['./nhan-vien-add-or-edit.component.scss'],
})
export class NhanVienAddOrEditComponent implements OnInit {
  id: string | null = null;
  isAdd: boolean = false;
  data: any;
  //
  searchQueryChucVu: any = {
    page: 1,
  };
  chucVu: any = [];
  totalItemChucVu: any;
  //
  constructor(
    private route: ActivatedRoute,
    private service: NhanVienServiceService,
    private serviceCV: ChucVuServiceService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.isAdd = false;
        this.getDetail();
      } else {
        this.isAdd = true;
      }
    });
    this.getAllChucVu();
  }
  async getDetail() {
    this.spinner.show();
    const data = await this.service.getById(this.id).toPromise();
    if (data) {
      this.data = data;
      this.spinner.hide();
    }
  }
  async getAllChucVu() {
    this.spinner.show();
    const data = await this.serviceCV
      .getAll(this.searchQueryChucVu)
      .toPromise();
    if (data && data.item) {
      data?.item.map((a: any) => {
        this.chucVu.push(a);
      });
      this.chucVu = data.totalItem;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }
  onScrollChucVu() {
    const element = document.querySelector('.chuc-vu-dropdown') as HTMLElement;
    if (element) {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const offsetHeight = element.offsetHeight;

      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this.chucVu.length === this.totalItemChucVu) {
          return;
        } else {
          this.searchQueryChucVu.page++;
        }
        this.getAllChucVu();
      }
    }
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Kiểm tra xem click có xảy ra bên trong phần tử có class 'drop-down' hay không
    const isDropDownClick = target.closest('.drop-down') !== null;
    if (!isDropDownClick) {
      this.data.chucVu.isOpen = false;
    }
  }
  addOrEdit() {}
}
