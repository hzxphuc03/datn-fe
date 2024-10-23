import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhuongThucThanhToanService {
  url: string = 'http://localhost:8080/api/phuong_thuc_thanh_toan';
  constructor(private http: HttpClient) {}

  getAll(params: any): Observable<any> {
    return this.http.get<any>(`${this.url}`, { params }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
}
