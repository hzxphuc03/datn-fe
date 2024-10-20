import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { CTSPServiceService } from '../../service/sp-ctsp-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface Size {
  size: string; // Hoặc 'any' nếu bạn không chắc chắn về kiểu
  id: number;
  idSP : any,
  soLuong : any
}

interface Color {
  coler: string;
  id: number;
  listSize: Size[]; // Mảng chứa các kích thước
}

@Component({
  selector: 'app-chi-tiet-san-pham-detail-ban-hang',
  templateUrl: './chi-tiet-san-pham-detail-ban-hang.component.html',
  styleUrls: ['./chi-tiet-san-pham-detail-ban-hang.component.scss'],
})
export class ChiTietSanPhamDetailBanHangComponent implements OnInit {
  getData : any;
  coler: Color[] = [];
  constructor(
    private matDialogRef: MatDialogRef<ChiTietSanPhamDetailBanHangComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorService: ErrorTsService,
    private service: CTSPServiceService,
    private spinner: NgxSpinnerService,
  ) {
    this.getAll(data.idSanPham);
    console.log(data.idHoaDon);
    
    
  }
  ngOnInit(): void {}
  async getAll(id : any) {
    this.spinner.show();
    const data = await this.service.getByIdSP(id).toPromise();
    if (data) {
      this.getData = data;
      this.custumData();
      console.log(this.coler);
      this.spinner.hide();
    }
  }
  custumData(){
    if (this.getData && this.getData.sanPhamChiTietList) {
      this.getData.sanPhamChiTietList.map((item: any) => {
        // Kiểm tra xem màu đã tồn tại trong mảng
        if (!this.coler.some((a: Color) => a.coler === item?.mauSac.maMau)) {
          const coler: Color = {
            coler: item?.mauSac.maMau,
            id: item?.mauSac.id,
            listSize: [] // Khởi tạo mảng listSize rỗng
          };
          
          // Thêm kích thước vào listSize
          coler.listSize.push({
            size: item.kichCo.ten, // Giả định ten là string
            id: item.kichCo.id, // Giả định id là number
            idSP : item.id,
            soLuong : item.soLuong
          });

          this.coler.push(coler); // Thêm đối tượng vào mảng
        } else {
          // Nếu màu đã tồn tại, thêm kích thước vào listSize của màu đó
          const existingColor = this.coler.find((a: Color) => a.coler === item?.mauSac.maMau);
          if (existingColor) {
            existingColor.listSize.push({
              size: item.kichCo.ten,
              id: item.kichCo.id,
              idSP : item.id,
              soLuong : item.soLuong
            });
          }
        }
      });
    }
  
  }
}
