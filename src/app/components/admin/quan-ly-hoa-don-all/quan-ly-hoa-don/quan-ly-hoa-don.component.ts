import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenService } from 'src/app/services/token.service';
import { DiaChiServiceService } from 'src/app/shareds/dia-chi-service.service';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { HoaDonService } from '../../service/hoa-don.service';

@Component({
  selector: 'app-quan-ly-hoa-don',
  templateUrl: './quan-ly-hoa-don.component.html',
  styleUrls: ['./quan-ly-hoa-don.component.scss']
})
export class QuanLyHoaDonComponent implements OnInit {
  activeIndex : number = 1;
  selectedBill : any;
  listIndexActiveStatus :any[] = [
    {index : 0 , title : 'Hóa đơn đã hủy'},
    {index : 1 , title : 'Hóa đơn khởi tạo'},
    {index : 2 , title : 'Hóa đơn chờ sử lý'},
    {index : 3 , title : 'Hóa đơn đã nhận'},
    {index : 4 , title : 'Đóng gói hóa đơn'},
    {index : 5 , title : 'Hóa đơn vận chuyển'},
    {index : 6 , title : 'Hóa đơn nhận(hoàn thành)'},
  ]
 itemSelected : any[] = [];
 isCheckAll : boolean = false;
  constructor(
    private dialog: MatDialog,
    private errorService: ErrorTsService,
    private service: HoaDonService,
    private spinner: NgxSpinnerService,
    private tokenService: TokenService,
    private diaChiService: DiaChiServiceService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  searchQuery: any = {};
  listPageNumber: number[] = [];
  listData = [];
  openDialog: boolean = false;
  dataDialog: any;
  haveItemCheck : boolean = false
  loadingItemUpdateStatus : any = {
    isShow : false,
    itemIndex : 0,
    totalItem : 0
  }
  idNhanVien : any ;
  ngOnInit(): void {
    const { decoded } = this.tokenService.getToken();
    if (decoded && decoded?.user.id) {
      this.idNhanVien = decoded?.user.id;
    }
    this.getListWords('rows');
  }

  changeStatusIndex(index : any){
    this.activeIndex = index;
    this.searchQuery.status = this.activeIndex;
    this.listData = [];
    this.isCheckAll = false;
    this.haveItemCheck = false;
    this.getListWords('rows');
  }

  async getListWords(type: string, action?: string): Promise<void> {
    // this.spinner.show();
    if (type && type === 'rows') {
      this.searchQuery.page = 1;
    }
    if (action) {
      if (action === 'prev' && Number(this.searchQuery.page) > 1) {
        this.searchQuery.page = Number(this.searchQuery.page) - 1;
      }
      if (
        action === 'next' &&
        Number(this.searchQuery.page) + 1 <= this.listPageNumber.length
      ) {
        this.searchQuery.page = Number(this.searchQuery.page) + 1;
      }
    } else {
      this.searchQuery.page = this.searchQuery.page;
    }
    Object.keys(this.searchQuery).forEach((key) => {
      if (this.searchQuery[key] === null || this.searchQuery[key] === '') {
        delete this.searchQuery[key];
      }
    });
    this.spinner.show();
    const data = await this.service.getAllQLHD(this.searchQuery).toPromise();
    if (data) {
      this.getTotalPage(data);
      this.listData = data.item;
      if (this.listData.length) {
        this.listData?.map((item: any) => {
          if (item.trangThai === 1) {
            item.status = true;
          } else {
            item.status = false;
          }
        });
      }

      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }

    //   gọi api
  }
  getTotalPage(data: any): number {
    let totalPage = 0;
    if (Number(data.totalItem) < Number(data.pageSize)) {
      totalPage = 1;
    } else {
      totalPage = Math.floor(Number(data.totalItem) / Number(data.pageSize));
      if (Number(data.totalItem) % Number(data.pageSize) > 0) {
        totalPage = totalPage + 1;
      }
    }
    this.listPageNumber = [];
    for (let i = 1; i <= totalPage; i++) {
      this.listPageNumber.push(i);
    }
    return totalPage;
  }
  filter() {
    this.getListWords('rows');
  }
  details(item: any) {

  }
  getAction(event: any) {
    this.openDialog = false;
    this.getListWords('page');
    this.dataDialog = {};
  }
  add() {
  
  }
  noneClick(event: any) {
    event.stopPropagation();
  }
  async changeStatus(item: any) {
    const data = await this.service
      .udpateStatus(item.id, item.status ? 1 : 0)
      .toPromise();
    if (data) {
      this.getListWords('page');
    }
  }
  onProductSelect(event : any){
    this.itemSelected = event;
    
  }
  checkAll(){
    this.listData.map((item : any) =>{
      item.check = this.isCheckAll;
    })
    this.isHaveItemChecked();
  }
  itemCheck(){
    this.isCheckAll = this.areAllChecked();
    this.isHaveItemChecked();
  }
  areAllChecked(): boolean {
    return this.listData.every((item : any) => item.check);
  }
  isHaveItemChecked() {
    this.haveItemCheck =  this.listData.some((product : any) => product.check);
  }
  getCheckedItems(): any[] {
    // hàm lấy những thằng  check bằng true
    return this.listData.filter((product : any) => product.check);
  }
  async nextStep(){
    const allItem = this.getCheckedItems();
    if(allItem.length > 0){
      this.loadingItemUpdateStatus.isShow = true;
      this.loadingItemUpdateStatus.totalItem = allItem.length;
      // itemIndex : 0,
      // totalItem : 0
      for (const item of allItem) {
        try {
          // Gọi API và đợi kết quả
          this.loadingItemUpdateStatus.itemIndex++;
          await this.service.nextStepHoaDonStatus(
            {
              idNhanVien: this.idNhanVien,
              idHoaDon:  item.id
            }
          ).toPromise();
        } catch (error) {
        }
        
        // Đợi 200ms trước khi chuyển sang item tiếp theo
        await this.delay(1000);
      }
    }
    this.loadingItemUpdateStatus.isShow = false;
    this.loadingItemUpdateStatus.totalItem = 0;
    this.loadingItemUpdateStatus.itemIndex = 0;
    this.getListWords('rows');
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
