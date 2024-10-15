import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorTsService } from './shareds/message/error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  errorMessage: any | null = null; // Đảm bảo kiểu dữ liệu cho phép null
  private errorSubscription?: Subscription;

  title = 'datn_fe';
  constructor(private errorService: ErrorTsService) {}

  ngOnInit(): void {
    this.errorSubscription = this.errorService
      .getErrorObservable()
      .subscribe((message) => {
        this.errorMessage = message;
      });
  }

  ngOnDestroy(): void {
    this.errorSubscription?.unsubscribe();
  }
}
