import * as fromPagesComponent from './index';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ThuongHieuComponent } from './thuong-hieu/thuong-hieu.component';
import { TableModule } from 'primeng/table';
@NgModule({
  declarations: [fromPagesComponent.pagesComponents, ThuongHieuComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TableModule,
  ],
  exports: [],
})
export class AdminLazyModule {}
