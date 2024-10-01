import { AdminHomePageComponent } from './admin-home-page/admin-home-page.component';
import { AddOrEditCtspComponent } from './chi-tiet-san-pham/add-or-edit-ctsp/add-or-edit-ctsp.component';
import { ChiTietSanPhamComponent } from './chi-tiet-san-pham/chi-tiet-san-pham.component';
import { AddOrDetailKichCoComponent } from './kich-co/add-or-detail/add-or-detail.component';
import { KichCoComponent } from './kich-co/the_loai.component';
import { AddOrDetailTheLoaiComponent } from './the-loai/add-or-detail/add-or-detail.component';
import { TheLoaiComponent } from './the-loai/the_loai.component';
import { AddOrDetailComponent } from './thuong-hieu/add-or-detail/add-or-detail.component';
import { ThuongHieuComponent } from './thuong-hieu/thuong-hieu.component';

export const pagesComponents: any[] = [
  AdminHomePageComponent,
  ThuongHieuComponent,
  AddOrDetailComponent,
  TheLoaiComponent,
  AddOrDetailTheLoaiComponent,
  KichCoComponent,
  AddOrDetailKichCoComponent,
  ChiTietSanPhamComponent,
  AddOrEditCtspComponent,
];
export * from './admin-home-page/admin-home-page.component';
export * from './thuong-hieu/thuong-hieu.component';
export * from './thuong-hieu/add-or-detail/add-or-detail.component';
export * from './the-loai/the_loai.component';
export * from './the-loai/add-or-detail/add-or-detail.component';
export * from './kich-co/the_loai.component';
export * from './kich-co/add-or-detail/add-or-detail.component';
export * from './chi-tiet-san-pham/chi-tiet-san-pham.component';
export * from './chi-tiet-san-pham/add-or-edit-ctsp/add-or-edit-ctsp.component';
