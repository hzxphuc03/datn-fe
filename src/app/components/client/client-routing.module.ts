import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientLazyModule } from './client-lazy.module';
import * as fromPagesComponent from './index';
const routes: Routes = [
  {
    path: '',
    component: fromPagesComponent.HomePageComponent,
  },
  {
    path: 'home',
    component: fromPagesComponent.HomePageComponent,
  },
];
@NgModule({
  imports: [ClientLazyModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
