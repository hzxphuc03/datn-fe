import * as fromPagesComponent from './index';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  declarations: [fromPagesComponent.pagesComponents],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule],
  exports: [],
})
export class AdminLazyModule {}
