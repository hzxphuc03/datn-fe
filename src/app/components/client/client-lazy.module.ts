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
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { RatingModule } from 'primeng/rating';
import { ImageModule } from 'primeng/image';
import { EditorModule } from 'primeng/editor';
import {MatStepperModule} from '@angular/material/stepper';
import { ArticleComponent } from './components/article/article.component';
@NgModule({
  declarations: [fromPagesComponent.pagesComponents, ArticleComponent],
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
    TooltipModule,
    RatingModule,
    ImageModule,
    EditorModule,
    MatStepperModule
  ],
  exports: [fromPagesComponent.SanPhamAllSearchComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClientLazyModule {}
