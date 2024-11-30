import { from } from 'rxjs';
import { AdminHomePageComponent } from './admin-home-page/admin-home-page.component';
import { ChiTietSanPhamDetailBanHangComponent } from './ban-hang-tai-quay/chi-tiet-san-pham-detail-ban-hang/chi-tiet-san-pham-detail-ban-hang.component';
import { ChiTietSanPhamBanHangComponent } from './ban-hang-tai-quay/chi-tiet-san-pham/chi-tiet-san-pham.component';
import { FormBanHangTaiQuayComponent } from './ban-hang-tai-quay/form-ban-hang-tai-quay/form-ban-hang-tai-quay.component';
import { FormThanhToanComponent } from './ban-hang-tai-quay/form-thanh-toan/form-thanh-toan.component';
import { KhachHangPopupComponent } from './ban-hang-tai-quay/khach-hang-popup/khach-hang-popup.component';
import { ThanhCongOrThatBaiThanhToanComponent } from './ban-hang-tai-quay/thanh-cong-or-that-bai-thanh-toan/thanh-cong-or-that-bai-thanh-toan.component';
import { ThongTinNhanHangComponent } from './ban-hang-tai-quay/thong-tin-nhan-hang/thong-tin-nhan-hang.component';
import { VoucherHoaDonComponent } from './ban-hang-tai-quay/voucher-hoa-don/voucher-hoa-don.component';
import { ChiTietSanPhamAddOrUpdateComponent } from './chi-tiet-san-pham-add-or-update/chi-tiet-san-pham-add-or-update.component';
import { ChiTietSanPhamComponent } from './chi-tiet-san-pham/chi-tiet-san-pham.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { EventComponent } from './events/event/event.component';
import { GiamGiaAddOrEditComponent } from './giam-gia/giam-gia-add-or-edit/giam-gia-add-or-edit.component';
import { GiamGiaComponent } from './giam-gia/giam-gia.component';
import { AddDiaChiComponent } from './khach-hang/add-dia-chi/add-dia-chi.component';
import { KhachHangAddOrEditComponent } from './khach-hang/khach-hang-add-or-edit/khach-hang-add-or-edit.component';
import { KhachHangComponent } from './khach-hang/khach-hang/khach-hang.component';
import { ThemNhanhKhachHangComponent } from './khach-hang/them-nhanh-khach-hang/them-nhanh-khach-hang.component';
import { AddOrDetailKichCoComponent } from './kich-co/add-or-detail/add-or-detail.component';
import { CtspKichCoComponent } from './kich-co/ctsp-kich-co/ctsp-kich-co.component';
import { KichCoComponent } from './kich-co/the_loai.component';
import { AddOrEditLoaiCoComponent } from './loai-co/add-or-edit/add-or-edit.component';
import { LoaiCoComponent } from './loai-co/loai-co.component';
import { AddOrEditLoaiDeComponent } from './loai-de/add-or-edit-loai-de/add-or-edit-loai-de.component';
import { LoaiDeComponent } from './loai-de/loai-de.component';
import { LoginComponent } from './login/login.component';
import { CtspMauSacComponent } from './mau-sac/ctsp-mau-sac/ctsp-mau-sac.component';
import { MauSacAddOrEditComponent } from './mau-sac/mau-sac-add-or-edit/mau-sac-add-or-edit.component';
import { MauSacComponent } from './mau-sac/mau-sac.component';
import { ChucVuAddOrEditComponent } from './nhan-viens/chuc-vu/chuc-vu-add-or-edit/chuc-vu-add-or-edit.component';
import { ChucVuComponent } from './nhan-viens/chuc-vu/chuc-vu.component';
import { NhanVienAddOrEditComponent } from './nhan-viens/nhan-vien-add-or-edit/nhan-vien-add-or-edit.component';
import { NhanVienComponent } from './nhan-viens/nhan-vien/nhan-vien.component';
import { DetailHoaDonQuanLyComponent } from './quan-ly-hoa-don-all/detail-hoa-don-quan-ly/detail-hoa-don-quan-ly.component';
import { QuanLyHoaDonComponent } from './quan-ly-hoa-don-all/quan-ly-hoa-don/quan-ly-hoa-don.component';
import { AddOrDetailTheLoaiComponent } from './the-loai/add-or-detail/add-or-detail.component';
import { TheLoaiComponent } from './the-loai/the_loai.component';
import { AddOrDetailComponent } from './thuong-hieu/add-or-detail/add-or-detail.component';
import { ThuongHieuComponent } from './thuong-hieu/thuong-hieu.component';
import { AddOrEditVatLieuComponent } from './vat-lieu/add-or-edit-vat-lieu/add-or-edit-vat-lieu.component';
import { VatLieuComponent } from './vat-lieu/vat-lieu.component';
import { VoucherAddOrEditComponent } from './vouchers/voucher-add-or-edit/voucher-add-or-edit.component';
import { VoucherComponent } from './vouchers/voucher/voucher.component';
import { AddOrEditEventComponent } from './events/add-or-edit-event/add-or-edit-event.component';
import { QuanLyPhieuDoiTraComponent } from './quan-ly-phieu-doi-tra/quan-ly-phieu-doi-tra.component';
import { DetailPhieuDoiTraComponent } from './detail-phieu-doi-tra/detail-phieu-doi-tra.component';

export const pagesComponents: any[] = [
  AdminHomePageComponent,
  ThuongHieuComponent,
  AddOrDetailComponent,
  TheLoaiComponent,
  AddOrDetailTheLoaiComponent,
  KichCoComponent,
  AddOrDetailKichCoComponent,
  ChiTietSanPhamComponent,
  AddOrEditLoaiCoComponent,
  LoaiCoComponent,
  AddOrEditLoaiDeComponent,
  LoaiDeComponent,
  AddOrEditVatLieuComponent,
  VatLieuComponent,
  MauSacComponent,
  MauSacAddOrEditComponent,
  GiamGiaAddOrEditComponent,
  GiamGiaComponent,
  ChiTietSanPhamAddOrUpdateComponent,
  CtspMauSacComponent,
  CtspKichCoComponent,
  LoginComponent,
  ChucVuComponent,
  NhanVienAddOrEditComponent,
  NhanVienComponent,
  ChucVuAddOrEditComponent,
  KhachHangAddOrEditComponent,
  KhachHangComponent,
  VoucherComponent,
  VoucherAddOrEditComponent,
  FormBanHangTaiQuayComponent,
  KhachHangPopupComponent,
  ThemNhanhKhachHangComponent,
  ThongTinNhanHangComponent,
  ChiTietSanPhamComponent,
  ChiTietSanPhamBanHangComponent,
  ChiTietSanPhamDetailBanHangComponent,
  DialogConfirmComponent,
  AddDiaChiComponent,
  VoucherHoaDonComponent,
  FormThanhToanComponent,
  ThanhCongOrThatBaiThanhToanComponent,
  QuanLyHoaDonComponent,
  DetailHoaDonQuanLyComponent,
  EventComponent,
  AddOrEditEventComponent,
  QuanLyPhieuDoiTraComponent,
  DetailPhieuDoiTraComponent
];
export * from './admin-home-page/admin-home-page.component';
export * from './thuong-hieu/thuong-hieu.component';
export * from './thuong-hieu/add-or-detail/add-or-detail.component';
export * from './the-loai/the_loai.component';
export * from './the-loai/add-or-detail/add-or-detail.component';
export * from './kich-co/the_loai.component';
export * from './kich-co/add-or-detail/add-or-detail.component';
export * from './chi-tiet-san-pham/chi-tiet-san-pham.component';
export * from './loai-co/add-or-edit/add-or-edit.component';
export * from './loai-co/loai-co.component';
export * from './loai-de/add-or-edit-loai-de/add-or-edit-loai-de.component';
export * from './loai-de/loai-de.component';
export * from './vat-lieu/add-or-edit-vat-lieu/add-or-edit-vat-lieu.component';
export * from './vat-lieu/vat-lieu.component';
export * from './mau-sac/mau-sac.component';
export * from './mau-sac/mau-sac-add-or-edit/mau-sac-add-or-edit.component';
export * from './giam-gia/giam-gia.component';
export * from './giam-gia/giam-gia-add-or-edit/giam-gia-add-or-edit.component';
export * from './chi-tiet-san-pham-add-or-update/chi-tiet-san-pham-add-or-update.component';
export * from './mau-sac/ctsp-mau-sac/ctsp-mau-sac.component';
export * from './kich-co/ctsp-kich-co/ctsp-kich-co.component';
export * from './login/login.component';
export * from './nhan-viens/chuc-vu/chuc-vu.component';
export * from './nhan-viens/nhan-vien-add-or-edit/nhan-vien-add-or-edit.component';
export * from './nhan-viens/nhan-vien/nhan-vien.component';
export * from './nhan-viens/chuc-vu/chuc-vu-add-or-edit/chuc-vu-add-or-edit.component';
export * from './khach-hang/khach-hang-add-or-edit/khach-hang-add-or-edit.component';
export * from './khach-hang/khach-hang/khach-hang.component';
export * from './vouchers/voucher/voucher.component';
export * from './vouchers/voucher-add-or-edit/voucher-add-or-edit.component';
export * from './ban-hang-tai-quay/form-ban-hang-tai-quay/form-ban-hang-tai-quay.component';
export * from './ban-hang-tai-quay/khach-hang-popup/khach-hang-popup.component';
export * from './khach-hang/them-nhanh-khach-hang/them-nhanh-khach-hang.component';
export * from './ban-hang-tai-quay/thong-tin-nhan-hang/thong-tin-nhan-hang.component';
export * from './ban-hang-tai-quay/chi-tiet-san-pham/chi-tiet-san-pham.component';
export * from './ban-hang-tai-quay/chi-tiet-san-pham-detail-ban-hang/chi-tiet-san-pham-detail-ban-hang.component';
export * from './dialog-confirm/dialog-confirm.component';
export * from './khach-hang/add-dia-chi/add-dia-chi.component';
export * from './ban-hang-tai-quay/voucher-hoa-don/voucher-hoa-don.component';
export * from './ban-hang-tai-quay/form-thanh-toan/form-thanh-toan.component';
export * from './ban-hang-tai-quay/thanh-cong-or-that-bai-thanh-toan/thanh-cong-or-that-bai-thanh-toan.component';
export * from './quan-ly-hoa-don-all/quan-ly-hoa-don/quan-ly-hoa-don.component';
export * from './quan-ly-hoa-don-all/detail-hoa-don-quan-ly/detail-hoa-don-quan-ly.component';
export * from './events/event/event.component';
export * from './events/add-or-edit-event/add-or-edit-event.component';
export * from './quan-ly-phieu-doi-tra/quan-ly-phieu-doi-tra.component';
export * from './detail-phieu-doi-tra/detail-phieu-doi-tra.component';
