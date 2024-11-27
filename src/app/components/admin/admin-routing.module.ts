import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import * as fromPagesComponent from './index';
import { AdminLazyModule } from './admin-lazy.module';
import { ChatComponent } from 'src/app/shareds/chat/chat-admin/chat.component';
import { ChatClintComponent } from 'src/app/shareds/chat/chat-clinet/chat.component';

const routes: Routes = [
  {
    path: 'home',
    component: fromPagesComponent.AdminHomePageComponent,
  },
  {
    path: 'thuong-hieu',
    component: fromPagesComponent.ThuongHieuComponent,
  },
  {
    path: 'the-loai',
    component: fromPagesComponent.TheLoaiComponent,
  },
  {
    path: 'chi-tiet-san-pham',
    component: fromPagesComponent.ChiTietSanPhamComponent,
  },
  {
    path: 'chi-tiet-san-pham/:id',
    component: fromPagesComponent.ChiTietSanPhamAddOrUpdateComponent,
  },
  {
    path: 'chi-tiet-san-pham/add',
    component: fromPagesComponent.ChiTietSanPhamAddOrUpdateComponent,
  },
  {
    path: 'kich-co',
    component: fromPagesComponent.KichCoComponent,
  },
  {
    path: 'loai-co',
    component: fromPagesComponent.LoaiCoComponent,
  },
  {
    path: 'loai-de',
    component: fromPagesComponent.LoaiDeComponent,
  },
  {
    path: 'vat-lieu',
    component: fromPagesComponent.VatLieuComponent,
  },
  {
    path: 'mau-sac',
    component: fromPagesComponent.MauSacComponent,
  },
  {
    path: 'giam-gia',
    component: fromPagesComponent.GiamGiaComponent,
  },
  {
    path: 'nhan-vien',
    component: fromPagesComponent.NhanVienComponent,
  },
  {
    path: 'chuc-vu',
    component: fromPagesComponent.ChucVuComponent,
  },
  {
    path: 'nhan-vien/:id',
    component: fromPagesComponent.NhanVienAddOrEditComponent,
  },
  {
    path: 'nhan-vien-add',
    component: fromPagesComponent.NhanVienAddOrEditComponent,
  },
  {
    path: 'khach-hang',
    component: fromPagesComponent.KhachHangComponent,
  },
  {
    path: 'khach-hang/:id',
    component: fromPagesComponent.KhachHangAddOrEditComponent,
  },
  {
    path: 'khach-hang-add',
    component: fromPagesComponent.KhachHangAddOrEditComponent,
  },
  {
    path: 'voucher',
    component: fromPagesComponent.VoucherComponent,
  },
  {
    path: 'voucher/:id',
    component: fromPagesComponent.VoucherAddOrEditComponent,
  },
  {
    path: 'voucher-add',
    component: fromPagesComponent.VoucherAddOrEditComponent,
  },
  {
    path: 'ban-hang-tai-quay',
    component: fromPagesComponent.FormBanHangTaiQuayComponent,
  },
  {
    path: 'quan-ly-hoa-don',
    component: fromPagesComponent.QuanLyHoaDonComponent,
  },
  {
    path: 'quan-ly-hoa-don/:id',
    component: fromPagesComponent.DetailHoaDonQuanLyComponent,
  },
  {
    path: 'event',
    component: fromPagesComponent.EventComponent,
  },
  {
    path: 'event-add',
    component: fromPagesComponent.AddOrEditEventComponent,
  },
  {
    path: 'event/:id',
    component: fromPagesComponent.AddOrEditEventComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'chat-client',
    component: ChatClintComponent,
  },
];

@NgModule({
  imports: [AdminLazyModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
