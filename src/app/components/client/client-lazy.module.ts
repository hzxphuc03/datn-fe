import * as fromPagesComponent from './index';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SwiperModule } from 'swiper/angular';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ClinetCardOnlineComponent } from './components/clinet-card-online/clinet-card-online.component';
import { AccordionModule } from 'primeng/accordion';
import { DiaChiKhachHangComponent } from './components/dia-chi-khach-hang/dia-chi-khach-hang.component';
@NgModule({
  declarations: [fromPagesComponent.pagesComponents],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TableModule,
    MatDialogModule,
    ToastModule,
    InputSwitchModule,
    InputTextModule,
    CalendarModule,
    RadioButtonModule,
    SwiperModule,
    AutoCompleteModule,
    InputNumberModule,
    InputTextareaModule,
    TabViewModule,
    ButtonModule,
    DialogModule,
    AccordionModule,
  ],
  exports: [fromPagesComponent.SanPhamAllSearchComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClientLazyModule {}
