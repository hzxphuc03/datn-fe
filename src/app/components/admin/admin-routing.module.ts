import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import * as fromPagesComponent from './index';
import { AdminLazyModule } from './admin-lazy.module';

const routes: Routes = [
  {
    path: 'home',
    component: fromPagesComponent.AdminHomePageComponent,
  },
];

@NgModule({
  imports: [AdminLazyModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
