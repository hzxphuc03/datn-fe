import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientLazyModule } from './client-lazy.module';
import * as fromPagesComponent from './index';
import { ChatClintComponent } from 'src/app/shareds/chat/chat-clinet/chat.component';
const routes: Routes = [
  {
    path: '',
    component: fromPagesComponent.HomePageComponent,
  },
  {
    path: 'home',
    component: fromPagesComponent.HomePageComponent,
  },
  {
    path: 'san-pham',
    component: fromPagesComponent.SanPhamAllSearchComponent,
  },
  {
    path: 'gio-hang',
    component: fromPagesComponent.ClinetCardOnlineComponent,
  },
  {
    path: 'phieu-giam-gia',
    component: fromPagesComponent.VoucherKhachHangComponent,
  },
  {
    path: 'san-pham/:id',
    component: fromPagesComponent.DetailProductComponent,
  },
  {
    path: 'khach-hang',
    component: fromPagesComponent.AllContentInfoComponent,
  },
  {
    path: 'gioi-thieu',
    component: fromPagesComponent.GtComponent,
  },
  {
    path:'bai-viet',
    component: fromPagesComponent.ArticleComponent,
  },
  {
    path: 'lien-he',
    component: fromPagesComponent.ContactUsComponent,
  },
  {
    path: 'su-kien-thang',
    component: fromPagesComponent.EventPageComponent,
  },
  {
    path: 'doan-chat',
    component: ChatClintComponent,
  },
];
@NgModule({
  imports: [ClientLazyModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
