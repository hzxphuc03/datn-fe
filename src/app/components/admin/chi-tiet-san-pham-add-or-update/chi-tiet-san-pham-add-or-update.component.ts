import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CTSPServiceService } from '../service/sp-ctsp-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GiamGiaServiceService } from '../service/giam-gia-service.service';
import { ThuongHieuServiceService } from '../service/thuong-hieu-service.service';
import { TheLoaiServiceService } from '../service/the-loai-service.service';
import { LoaiCoServiceService } from '../service/loai-co.service.service';
import { VatLieuServiceService } from '../service/vat-lieu-service.service';
import { LoaiDeServiceService } from '../service/loai-de-service.service';
import { UploadImgService } from '../service/upload-img.service';
import { KIchCoServiceService } from '../service/kich-co-service.service copy';
import { MatDialog } from '@angular/material/dialog';
import { CtspMauSacComponent } from '../mau-sac/ctsp-mau-sac/ctsp-mau-sac.component';
import { CtspKichCoComponent } from '../kich-co/ctsp-kich-co/ctsp-kich-co.component';
import { MessageService } from 'primeng/api';
import { ErrorTsService } from 'src/app/shareds/message/error.service';

@Component({
  selector: 'app-chi-tiet-san-pham-add-or-update',
  templateUrl: './chi-tiet-san-pham-add-or-update.component.html',
  styleUrls: ['./chi-tiet-san-pham-add-or-update.component.scss'],
})
export class ChiTietSanPhamAddOrUpdateComponent implements OnInit {
  data: any = {};
  id: string | null = null;
  isAdd: boolean = true;
  // giam gia
  searchQueryGiamGia: any = {
    page: 1,
  };
  giamgGia: any = [];
  totalItemGiamGia: any;
  //
  // thuong hieu
  searchQueryThuongHieu: any = {
    page: 1,
  };
  thuongHieu: any = [];
  totalThuongHieu: any;
  //
  // ttheLoai
  searchQueryTheLoai: any = {
    page: 1,
  };
  theLoai: any = [];
  totalItemTheLoai: any;
  //
  // loai co
  searchQueryLoaiCo: any = {
    page: 1,
  };
  loaiCo: any = [];
  totalItemLoaiCo: any;
  //
  // vat lieu
  searchQueryVatLieu: any = {
    page: 1,
  };
  vatLieu: any = [];
  totalItemVatLieu: any;
  //
  // vat lieu
  searchQueryLoaiDe: any = {
    page: 1,
  };
  loaiDe: any = [];
  totalItemLoaiDe: any;
  //
  // vat lieu
  searchQueryKichCo: any = {
    page: 1,
  };
  kichCo: any = [];
  totalItemKichCo: any;
  //
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CTSPServiceService,
    private serviceGiamGia: GiamGiaServiceService,
    private spinner: NgxSpinnerService,
    private serviceThuongHieu: ThuongHieuServiceService,
    private serviceTheLoai: TheLoaiServiceService,
    private serviceLoaiCo: LoaiCoServiceService,
    private serviceVatLieu: VatLieuServiceService,
    private serviceLoaiDe: LoaiDeServiceService,
    private serviceIMG: UploadImgService,
    private serviceKichCo: KIchCoServiceService,
    private dialog: MatDialog,
    private errorService: ErrorTsService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id && this.id !== 'add') {
        this.isAdd = false;
        this.getAll();
      } else {
        this.isAdd = true;
        this.data = {
          sanPham: {
            id: 0,
            ma: '',
            ten: '',
            moTa: '',
            hinhAnh: '',
            trongLuong: 0,
            beMatSuDung: '',
            congNghe: '',
            kieuDang: '',
            giaThapNhat: 0,
            giaCaoNhat: 0,
            ngayTao: '2024-10-14T09:11:42.24',
            ngaySua: null,
            nguoiTao: 'string',
            trangThai: 1,
            giamGia: {},
            thuongHieu: {},
            theLoai: {},
            loaiCo: {},
            vatLieu: {},
            loaiDe: {},
          },
          sanPhamChiTietList: [],
        };
      }
    });
    this.getAllGiamGia();
    this.getAllThuongHieu();
    this.getAllTheLoai();
    this.getAllLoaiCo();
    this.getAllVatLieu();
    this.getAllLoaiDe();
    this.getAllKickCo();
  }
  async getAll() {
    this.spinner.show();
    const data = await this.service.getByIdSP(this.id).toPromise();
    if (data) {
      this.data = data;
      if (this.data.sanPham.giamGia === null) {
        this.data.sanPham.giamGia = {
          ten: '',
          isOpen: false,
        };
      }
      this.data.sanPhamChiTietList.map((item: any) => {
        if (item.trangThai === 1) {
          item.status = true;
        } else {
          item.status = false;
        }
      });

      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }
  async getAllGiamGia() {
    this.spinner.show();
    const data = await this.serviceGiamGia
      .getAll(this.searchQueryGiamGia)
      .toPromise();
    if (data && data.item) {
      data?.item.map((a: any) => {
        this.giamgGia.push(a);
      });
      this.totalItemGiamGia = data.totalItem;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }
  async getAllKickCo() {
    this.spinner.show();
    const data = await this.serviceKichCo
      .getAll(this.searchQueryKichCo)
      .toPromise();
    if (data && data.item) {
      data?.item.map((a: any) => {
        this.kichCo.push(a);
      });
      this.totalItemKichCo = data.totalItem;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }
  async getAllLoaiDe() {
    this.spinner.show();
    const data = await this.serviceLoaiDe
      .getAll(this.searchQueryLoaiDe)
      .toPromise();
    if (data && data.item) {
      data?.item.map((a: any) => {
        this.loaiDe.push(a);
      });
      this.totalItemLoaiDe = data.totalItem;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }
  async getAllVatLieu() {
    this.spinner.show();
    const data = await this.serviceVatLieu
      .getAll(this.searchQueryVatLieu)
      .toPromise();
    if (data && data.item) {
      data?.item.map((a: any) => {
        this.vatLieu.push(a);
      });
      this.totalItemVatLieu = data.totalItem;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }
  async getAllThuongHieu() {
    this.spinner.show();
    const data = await this.serviceThuongHieu
      .getAll(this.searchQueryThuongHieu)
      .toPromise();
    if (data && data.item) {
      data?.item.map((a: any) => {
        this.thuongHieu.push(a);
      });
      this.totalThuongHieu = data.totalItem;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }
  async getAllTheLoai() {
    this.spinner.show();
    const data = await this.serviceTheLoai
      .getAll(this.searchQueryThuongHieu)
      .toPromise();
    if (data && data.item) {
      data?.item.map((a: any) => {
        this.theLoai.push(a);
      });
      this.totalItemTheLoai = data.totalItem;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }
  async getAllLoaiCo() {
    this.spinner.show();
    const data = await this.serviceLoaiCo
      .getAll(this.searchQueryLoaiCo)
      .toPromise();
    if (data && data.item) {
      data?.item.map((a: any) => {
        this.loaiCo.push(a);
      });
      this.totalItemLoaiCo = data.totalItem;
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
    }
  }
  onScrollGiamGia() {
    const element = document.querySelector('.giam-gia-dropdown') as HTMLElement;
    if (element) {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const offsetHeight = element.offsetHeight;

      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this.giamgGia.length === this.totalItemGiamGia) {
          return;
        } else {
          this.searchQueryGiamGia.page++;
        }
        this.getAllGiamGia();
      }
    }
  }
  onScrollKichCo() {
    const element = document.querySelector('.kich-co-dropdown') as HTMLElement;
    if (element) {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const offsetHeight = element.offsetHeight;

      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this.kichCo.length === this.totalItemKichCo) {
          return;
        } else {
          this.searchQueryKichCo.page++;
        }
        this.getAllKickCo();
      }
    }
  }
  onScrollLoaiDe() {
    const element = document.querySelector('.loai-de-dropdown') as HTMLElement;
    if (element) {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const offsetHeight = element.offsetHeight;

      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this.loaiDe.length === this.totalItemLoaiDe) {
          return;
        } else {
          this.searchQueryLoaiDe.page++;
        }
        this.getAllLoaiDe();
      }
    }
  }
  onScrollVatLieu() {
    const element = document.querySelector('.vat-lieu-dropdown') as HTMLElement;
    if (element) {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const offsetHeight = element.offsetHeight;

      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this.vatLieu.length === this.totalItemVatLieu) {
          return;
        } else {
          this.searchQueryVatLieu.page++;
        }
        this.getAllVatLieu();
      }
    }
  }
  onScrollTheLoai() {
    const element = document.querySelector('.the-loai-dropdown') as HTMLElement;
    if (element) {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const offsetHeight = element.offsetHeight;

      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this.theLoai.length === this.totalItemTheLoai) {
          return;
        } else {
          this.searchQueryTheLoai.page++;
        }
        this.getAllTheLoai();
      }
    }
  }
  onScrollThuongHieu() {
    const element = document.querySelector(
      '.thuong-hieu-dropdown'
    ) as HTMLElement;
    if (element) {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const offsetHeight = element.offsetHeight;

      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this.thuongHieu.length === this.totalThuongHieu) {
          return;
        } else {
          this.searchQueryThuongHieu.page++;
        }
        this.getAllThuongHieu();
      }
    }
  }
  onScrollLoaiCo() {
    const element = document.querySelector('.loai-co-dropdown') as HTMLElement;
    if (element) {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const offsetHeight = element.offsetHeight;

      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this.loaiCo.length === this.totalItemLoaiCo) {
          return;
        } else {
          this.searchQueryLoaiCo.page++;
        }
        this.getAllLoaiCo();
      }
    }
  }
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        const post = await this.serviceIMG.upload(file, 'Images').toPromise();
        if (post) {
          this.data.sanPham.hinhAnh = post.result;
        }
      }
    }
  }
  async onFileCTSPSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        const post = await this.serviceIMG.upload(file, 'Images').toPromise();
        if (post) {
          this.data.sanPhamChiTietList[index].hinhAnh = post.result;
        }
      }
    }
  }
  openIMG(coler: any, index: number) {
    const dialogRef = this.dialog.open(CtspMauSacComponent, {
      data: coler || {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.sanPhamChiTietList[index].mauSac = result;
      }
    });
  }
  openSize(size: any, index: number) {
    const dialogRef = this.dialog.open(CtspKichCoComponent, {
      data: size || {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.sanPhamChiTietList[index].kichCo = result;
      }
    });
  }
  addMoreCTDP() {
    this.data.sanPhamChiTietList.push({
      id: 0,
      ngayTao: new Date(),
      ngaySua: null,
      hinhAnh: '',
      giaNhap: 0,
      giaBan: 0,
      soLuong: 0,
      trangThai: 1,
      sanPham: this.data.sanPham.id,
      mauSac: {},
      kichCo: {},
      isNew: true,
      status: true,
    });
  }
  async addOrEdit() {
    const checkValidate = this.validate();
    if (!checkValidate) {
      return;
    }
    // checkl validaye
    if (this.isAdd) {
      // nếu update đầu tiên update sản phẩm
      // custum lại body
      let body = {
        id: 0,
        ma: '',
        ten: this.data.sanPham.ten,
        moTa: this.data.sanPham.moTa,
        hinhAnh: this.data.sanPham.hinhAnh,
        trongLuong: this.data.sanPham.trongLuong,
        beMatSuDung: this.data.sanPham.beMatSuDung,
        congNghe: this.data.sanPham.congNghe,
        kieuDang: this.data.sanPham.kieuDang,
        ngayTao: this.data.sanPham.ngayTao,
        nguoiTao: this.data.sanPham.nguoiTao,
        trangThai: this.data.sanPham.trangThai,
        idGiamGia: this.data.sanPham.giamGia.id || 0,
        idThuongHieu: this.data.sanPham.thuongHieu.id,
        idTheLoai: this.data.sanPham.theLoai.id,
        idLoaiCo: this.data.sanPham.loaiCo.id,
        idVatLieu: this.data.sanPham.vatLieu.id,
        idLoaiDe: this.data.sanPham.loaiDe.id,
        ngaySua: this.data.sanPham.ngaySua,
      };
      this.spinner.show();
      const sanPhamAdd = await this.service.add(body).toPromise();
      if (sanPhamAdd) {
        this.data.sanPhamChiTietList.map(async (a: any) => {
          let ctspBody = {
            id: a.id,
            ngayTao: a.ngayTao,
            ngaySua: a.ngaySua,
            hinhAnh: a.hinhAnh,
            giaNhap: a.giaNhap,
            giaBan: a.giaBan,
            soLuong: a.soLuong,
            trangThai: a.trangThai,
            sanPham: sanPhamAdd?.id,
            mauSac: a.mauSac.id,
            kichCo: a.kichCo.id,
          };
          if (a.isNew) {
            // thêm mới ctsp
            const dataCTSP = await this.service.addCTSP(ctspBody).toPromise();
            if (dataCTSP) {
            } else {
              this.errorService.displayError('Lỗi', 'error');
              return;
            }
          } else {
            const dataCTSP = await this.service
              .updateCTSP(ctspBody)
              .toPromise();
            if (dataCTSP) {
            } else {
              this.errorService.displayError('Lỗi', 'error');
              return;
            }
          }
        });
      } else {
        this.errorService.displayError('Lỗi', 'error');
        return;
      }
      this.errorService.displayError(
        `${this.isAdd ? 'Thêm Thành Công' : 'Update thành công'}`,
        'success'
      );
      this.spinner.hide();
      this.router.navigate(['/auth/admin/chi-tiet-san-pham']);
    } else {
      // nếu update đầu tiên update sản phẩm
      // custum lại body
      let body = {
        id: this.data.sanPham.id,
        ma: this.data.sanPham.ma,
        ten: this.data.sanPham.ten,
        moTa: this.data.sanPham.moTa,
        hinhAnh: this.data.sanPham.hinhAnh,
        trongLuong: this.data.sanPham.trongLuong,
        beMatSuDung: this.data.sanPham.beMatSuDung,
        congNghe: this.data.sanPham.congNghe,
        kieuDang: this.data.sanPham.kieuDang,
        ngayTao: this.data.sanPham.ngayTao,
        nguoiTao: this.data.sanPham.nguoiTao,
        trangThai: this.data.sanPham.trangThai,
        idGiamGia: this.data.sanPham.giamGia.id || 0,
        idThuongHieu: this.data.sanPham.thuongHieu.id,
        idTheLoai: this.data.sanPham.theLoai.id,
        idLoaiCo: this.data.sanPham.loaiCo.id,
        idVatLieu: this.data.sanPham.vatLieu.id,
        idLoaiDe: this.data.sanPham.loaiDe.id,
        ngaySua: this.data.sanPham.ngaySua,
      };
      this.spinner.show();
      const sanPhamUpdate = await this.service.update(body).toPromise();
      if (sanPhamUpdate) {
        this.data.sanPhamChiTietList.map(async (a: any) => {
          let ctspBody = {
            id: a.id,
            ngayTao: a.ngayTao,
            ngaySua: a.ngaySua,
            hinhAnh: a.hinhAnh,
            giaNhap: a.giaNhap,
            giaBan: a.giaBan,
            soLuong: a.soLuong,
            trangThai: a.status ? 1 : 0,
            sanPham: a.sanPham,
            mauSac: a.mauSac.id,
            kichCo: a.kichCo.id,
          };
          if (a.isNew) {
            // thêm mới ctsp
            const dataCTSP = await this.service.addCTSP(ctspBody).toPromise();
            if (dataCTSP) {
            } else {
              this.errorService.displayError('Lỗi', 'error');
              return;
            }
          } else {
            const dataCTSP = await this.service
              .updateCTSP(ctspBody)
              .toPromise();
            if (dataCTSP) {
              if (a.isChange) {
              }
            } else {
              this.errorService.displayError('Lỗi', 'error');
              return;
            }
          }
        });
      } else {
        this.errorService.displayError('Lỗi', 'error');
        return;
      }
      this.errorService.displayError(
        `${this.isAdd ? 'Thêm Thành Công' : 'Update thành công'}`,
        'success'
      );
      this.spinner.hide();
      this.router.navigate(['/auth/admin/chi-tiet-san-pham']);
    }
  }
  validate() {
    let isDone = true;
    const data = this.data;
    // object
    const dataSP = data.sanPham;
    // mảng
    const dataCT = data.sanPhamChiTietList;
    if (dataSP.ten === '') {
      this.errorService.displayError('Tên sản phẩm không để null', 'error');
      isDone = false;
      return;
    }
    if (dataSP.trongLuong === null) {
      this.errorService.displayError(
        'Vui lòng kiểm tra lại trọng lượng',
        'error'
      );
      isDone = false;
      return;
    }
    if (dataSP.trongLuong < 50 || dataSP.trongLuong > 10000) {
      this.errorService.displayError(
        'Trọng lượng phải trong khoảng từ 50g đến 10000g',
        'error'
      );
      isDone = false;
      return;
    }
    if (dataSP.beMatSuDung === '') {
      this.errorService.displayError(
        'Bề mặt sử dụng không được để trống',
        'error'
      );
      isDone = false;
      return;
    }
    if (dataSP.congNghe === '') {
      this.errorService.displayError('Công nghệ không được để trống', 'error');
      isDone = false;
      return;
    }
    if (dataSP.kieuDang === '') {
      this.errorService.displayError('Kiểu dáng không được để trống', 'error');
      isDone = false;
      return;
    }
    if (!dataSP.thuongHieu.id) {
      this.errorService.displayError(`Vui lòng chọn thương hiệu `, 'error');
      isDone = false;
      return;
    }
    if (!dataSP.theLoai.id) {
      this.errorService.displayError(`Vui lòng chọn thể loại `, 'error');
      isDone = false;
      return;
    }
    if (!dataSP.loaiCo.id) {
      this.errorService.displayError(`Vui lòng chọn loại cổ `, 'error');
      isDone = false;
      return;
    }
    if (!dataSP.vatLieu.id) {
      this.errorService.displayError(`Vui lòng chọn vật liệu `, 'error');
      isDone = false;
      return;
    }
    if (!dataSP.loaiDe.id) {
      this.errorService.displayError(`Vui lòng chọn loại đế `, 'error');
      isDone = false;
      return;
    }
    if (dataCT.length !== 0) {
      dataCT.map((e: any, index: number) => {
        if (e.hinhAnh === '') {
          this.errorService.displayError(
            `Hình ảnh chi tiết tại vị trí ${index + 1} không để trống`,
            'error'
          );
          isDone = false;
          return;
        }
        if (e.giaBan === '') {
          this.errorService.displayError(
            `Giá Bán chi tiết tại vị trí ${index + 1} không để trống`,
            'error'
          );
          isDone = false;
          return;
        }
        if (e.giaNhap === '') {
          this.errorService.displayError(
            `Giá Nhập chi tiết tại vị trí ${index + 1} không để trống`,
            'error'
          );
          isDone = false;
          return;
        }
        if (e.giaNhap === 0 || e.giaBan === 0) {
          this.errorService.displayError(
            `Giá không để 0 chi tiết tại vị trí ${index + 1}`,
            'error'
          );
          isDone = false;
          return;
        }
        if (e.giaNhap < 1000 || e.giaNhap > 1000000) {
          this.errorService.displayError(
            `Giá Nhập chỉ từ 1000 - 1000000 chi tiết tại vị trí ${index + 1}`,
            'error'
          );
          isDone = false;
          return;
        }
        if (e.giaBan < 1000 || e.giaBan > 1000000) {
          this.errorService.displayError(
            `Giá Bán chỉ từ 1000 - 1000000 chi tiết tại vị trí ${index + 1}`,
            'error'
          );
          isDone = false;
          return;
        }
        if (e.giaBan < e.giaNhap) {
          this.errorService.displayError(
            `Giá Bán không nhỏ hơn giá nhập chi tiết tại vị trí ${index + 1}`,
            'error'
          );
          isDone = false;
          return;
        }
        if (e.soLuong === null) {
          this.errorService.displayError(
            `Số lượng không để trống vị trí thứ ${index + 1}`,
            'error'
          );
          isDone = false;
          return;
        }
        if (e.soLuong === 0) {
          this.errorService.displayError(
            `Số lượng không để trống vị trí thứ ${index + 1}`,
            'error'
          );
          isDone = false;
          return;
        }
        if (e.soLuong < 0 || e.soLuong > 1000000) {
          this.errorService.displayError(
            `Số lượng từ khoảng 0 - 1000000 ${index + 1}`,
            'error'
          );
          isDone = false;
          return;
        }
        if (!e.kichCo.id) {
          this.errorService.displayError(
            `Vui lòng chọn kích cỡ chi tiết tại vị trí ${index + 1}`,
            'error'
          );
          isDone = false;
          return;
        }
        if (!e.mauSac.id) {
          this.errorService.displayError(
            `Vui lòng chọn màu sắc chi tiết tại vị trí ${index + 1}`,
            'error'
          );
          isDone = false;
          return;
        }
      });
    } else {
      this.errorService.displayError(
        `Vui lòng thêm ít nhất 1 chi tiết sản phẩm`,
        'error'
      );
      isDone = false;
      return;
    }
    return isDone;
  }
  remove(index: any) {
    this.data.sanPhamChiTietList.splice(index, 1);
  }
}
