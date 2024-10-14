import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import * as fromPagesComponent from './index';
import { AdminLazyModule } from './admin-lazy.module';
import { ChatComponent } from 'src/app/shareds/chat/chat-admin/chat.component';

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
    path: 'chat',
    component: ChatComponent,
  },
];

@NgModule({
  imports: [AdminLazyModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
