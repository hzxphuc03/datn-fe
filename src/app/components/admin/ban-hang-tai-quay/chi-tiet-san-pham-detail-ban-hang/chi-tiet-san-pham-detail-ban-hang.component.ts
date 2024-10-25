import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorTsService } from 'src/app/shareds/message/error.service';
import { CTSPServiceService } from '../../service/sp-ctsp-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperOptions } from 'swiper';
import { HoaDonService } from '../../service/hoa-don.service';

interface Size {
  size: string; // Hoặc 'any' nếu bạn không chắc chắn về kiểu
  id: number;
  idSP: any;
  soLuong: any;
  giaBan: any;
  hinhAnh: any;
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
  [x: string]: any;
  getData: any;
  coler: Color[] = [];
  indexActiveColer: number = 1;
  indexActiveSize: number = 1;
  listImg: string[] = [];
  autoPlay: SwiperOptions = {
    autoplay: {
      delay: 1000,
    },
  };
  isGiamGia: boolean = false;
  phanTramGiam: number = 0;
  openAdd: boolean = false;
  soLuongWantToAdd: number = 0;
  fromMoneny: number = 0;
  toMoneny: number = 0;
  constructor(
    private matDialogRef: MatDialogRef<ChiTietSanPhamDetailBanHangComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorService: ErrorTsService,
    private service: CTSPServiceService,
    private spinner: NgxSpinnerService,
    private serverHD: HoaDonService
  ) {
    this.getAll(data.idSanPham);
  }
  ngOnInit(): void {}
  async getAll(id: any) {
    this.spinner.show();
    const data = await this.service.getByIdSP(id).toPromise();
    if (data) {
      this.getData = data;
      this.checkVoucher();
      this.custumData();
      this.imgs();
      this.spinner.hide();
    }
  }
  checkVoucher() {
    if (this.getData && this.getData.sanPham.giamGia) {
      const today = new Date(); // Ngày hiện tại
      const ngayBatDau = new Date(this.getData?.sanPham.giamGia.ngayBatDau);
      const ngayKetThuc = new Date(this.getData?.sanPham.giamGia.ngayKetThuc);
      if (today >= ngayBatDau && today <= ngayKetThuc) {
        this.isGiamGia = true;
        this.phanTramGiam = this.getData?.sanPham.giamGia.mucGiam;
        this.fromMoneny =
          this.getData?.sanPham.giaThapNhat -
          (this.getData?.sanPham.giaThapNhat * this.phanTramGiam) / 100;

        this.toMoneny =
          this.getData?.sanPham.giaCaoNhat -
          (this.getData?.sanPham.giaCaoNhat * this.phanTramGiam) / 100;
      }
    }
  }
  imgs() {
    this.listImg.push(this.getData?.sanPham?.hinhAnh);
    if (this.getData && this.getData.sanPhamChiTietList) {
      this.getData.sanPhamChiTietList.map((item: any) => {
        this.listImg.push(item.hinhAnh);
      });
    }
  }
  custumData() {
    if (this.getData && this.getData.sanPhamChiTietList) {
      this.getData.sanPhamChiTietList.map((item: any) => {
        // Kiểm tra xem màu đã tồn tại trong mảng
        if (!this.coler.some((a: Color) => a.coler === item?.mauSac.maMau)) {
          const coler: Color = {
            coler: item?.mauSac.maMau,
            id: item?.mauSac.id,
            listSize: [], // Khởi tạo mảng listSize rỗng
          };

          // Thêm kích thước vào listSize
          coler.listSize.push({
            size: item.kichCo.ten, // Giả định ten là string
            id: item.kichCo.id, // Giả định id là number
            idSP: item.id,
            soLuong: item.soLuong,
            giaBan: item.giaBan,
            hinhAnh: item.hinhAnh,
          });

          this.coler.push(coler); // Thêm đối tượng vào mảng
        } else {
          // Nếu màu đã tồn tại, thêm kích thước vào listSize của màu đó
          const existingColor = this.coler.find(
            (a: Color) => a.coler === item?.mauSac.maMau
          );
          if (existingColor) {
            existingColor.listSize.push({
              size: item.kichCo.ten,
              id: item.kichCo.id,
              idSP: item.id,
              soLuong: item.soLuong,
              giaBan: item.giaBan,
              hinhAnh: item.hinhAnh,
            });
          }
        }
      });
    }
    console.log(this.coler);
  }
  async addSPToGHCT() {
    const body = {
      id: 0,
      soLuong: Number(this.soLuongWantToAdd),
      trangThai: 1,
      idHoaDon: this.data.idHoaDon,
      idSanPhamChiTiet:
        this.coler[this.indexActiveColer - 1].listSize[this.indexActiveSize - 1]
          ?.idSP,
    };
    const data = await this.serverHD.hdctAdd(body).toPromise();
    if (data) {
      if (data?.errorCode) {
        this.errorService.displayError(data.messageError, 'error');
      } else {
        this.errorService.displayError('Thêm sản phẩm thàng công', 'sussces');
        this.matDialogRef.close('close');
      }
    }
  }
}
