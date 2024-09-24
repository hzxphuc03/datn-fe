import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterLayoutAdminComponent } from './shareds/master-layout-admin/master-layout-admin.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
