import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<any>(null); // BehaviorSubject để lưu giá trị hiện tại
  data$ = this.dataSubject.asObservable(); // Observable để các component có thể subscribe

  // Phương thức để cập nhật dữ liệu
  updateData(data: any) {
    this.dataSubject.next(data); // Phát dữ liệu mới
  }

  // Phương thức để lấy dữ liệu hiện tại
  getData() {
    return this.dataSubject.getValue(); // Trả về giá trị hiện tại
  }
}