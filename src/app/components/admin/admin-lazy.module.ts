import * as fromPagesComponent from './index';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ThuongHieuComponent } from './thuong-hieu/thuong-hieu.component';
import { TableModule } from 'primeng/table';
import { AddOrDetailComponent } from './thuong-hieu/add-or-detail/add-or-detail.component';
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
  ],
  exports: [],
  entryComponents: [AddOrDetailComponent],
})
export class AdminLazyModule {}
