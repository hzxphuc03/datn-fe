import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorTsService {
  private errorSubject = new Subject<any | null>(); // Cho phép null
  private hideErrorTimeout: any; // Biến để lưu ID của timeout
  // success
  // error
  displayError(message: string, type: string) {
    // Nếu đã có timeout, xóa nó trước khi tạo mới
    if (this.hideErrorTimeout) {
      clearTimeout(this.hideErrorTimeout);
    }

    this.errorSubject.next({ message: message, type: type });

    // Tự động ẩn thông báo sau 3 giây
    this.hideErrorTimeout = setTimeout(() => {
      this.errorSubject.next(null); // Phát giá trị null để ẩn thông báo
      this.hideErrorTimeout = null; // Đặt lại timeout sau khi ẩn
    }, 3000);
  }

  getErrorObservable() {
    return this.errorSubject.asObservable();
  }
}
