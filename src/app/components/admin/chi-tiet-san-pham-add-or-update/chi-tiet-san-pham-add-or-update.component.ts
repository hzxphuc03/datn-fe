import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-chi-tiet-san-pham-add-or-update',
  templateUrl: './chi-tiet-san-pham-add-or-update.component.html',
  styleUrls: ['./chi-tiet-san-pham-add-or-update.component.scss'],
})
export class ChiTietSanPhamAddOrUpdateComponent implements OnInit {
  data: any;
  id: string | null = null;
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
    private service: CTSPServiceService,
    private serviceGiamGia: GiamGiaServiceService,
    private spinner: NgxSpinnerService,
    private serviceThuongHieu: ThuongHieuServiceService,
    private serviceTheLoai: TheLoaiServiceService,
    private serviceLoaiCo: LoaiCoServiceService,
    private serviceVatLieu: VatLieuServiceService,
    private serviceLoaiDe: LoaiDeServiceService,
    private serviceIMG: UploadImgService,
    private serviceKichCo: KIchCoServiceService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.getAll();
        this.getAllGiamGia();
        this.getAllThuongHieu();
        this.getAllTheLoai();
        this.getAllLoaiCo();
        this.getAllVatLieu();
        this.getAllLoaiDe();
        this.getAllKickCo();
      }
    });
  }
  async getAll() {
    this.spinner.show();
    const data = await this.service.getByIdSP(this.id).toPromise();
    if (data) {
      this.data = data;
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
}
