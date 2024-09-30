import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import * as fromPagesComponent from './index';
import { AdminLazyModule } from './admin-lazy.module';
import { ChatComponent } from 'src/app/shareds/chat/chat/chat.component';

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
    path: 'kich-co',
    component: fromPagesComponent.KichCoComponent,
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
