import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterLayoutAdminComponent } from './shareds/master-layout-admin/master-layout-admin.component';
import { LoginComponent } from './components/admin';
import { ClientLayoutMasterComponent } from './shareds/client-layout-master/client-layout-master.component';

const routes: Routes = [
  {
    path: 'auth',
    component: MasterLayoutAdminComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./components/admin/admin-routing.module').then(
            (m) => m.HomeRoutingModule
          ),
      },
    ],
  },
  {
    path: 'g4',
    component: ClientLayoutMasterComponent,
    children: [
      {
        path: 'shop',
        loadChildren: () =>
          import('./components/client/client-routing.module').then(
            (m) => m.ClientRoutingModule
          ),
      },
    ],
  },
  {
    path: 'auth/shop/login',
    component: LoginComponent,
  },
  {
    path: '', // Route cho trang chủ
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
