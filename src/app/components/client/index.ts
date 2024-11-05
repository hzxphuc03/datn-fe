import { ClinetCardOnlineComponent } from './components/clinet-card-online/clinet-card-online.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { FasterDetailComponent } from './components/faster-detail/faster-detail.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginClientComponent } from './components/login-client/login-client.component';
import { SanPhamAllSearchComponent } from './components/san-pham-all-search/san-pham-all-search.component';

export const pagesComponents: any[] = [
  HomePageComponent,
  SanPhamAllSearchComponent,
  LoginClientComponent,
  DetailProductComponent,
  FasterDetailComponent,
  ClinetCardOnlineComponent,
];

export * from './components/home-page/home-page.component';
export * from './components/san-pham-all-search/san-pham-all-search.component';
export * from './components/login-client/login-client.component';
export * from './components/detail-product/detail-product.component';
export * from './components/faster-detail/faster-detail.component';
export * from './components/clinet-card-online/clinet-card-online.component';
