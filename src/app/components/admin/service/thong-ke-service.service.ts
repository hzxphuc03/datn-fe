import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ThongKeServiceService {
  url: string = 'http://localhost:8080/api/thong-ke';
  constructor(private http: HttpClient) {}

  getDoanhSoThangNay(): Observable<any> {
    return this.http.get<any>(`${this.url}/doanh-so`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  getDoanhSoTheoNgay(): Observable<any> {
    return this.http.get<any>(`${this.url}/doanh-thu-thang`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  getTop5SanPham(): Observable<any> {
    return this.http.get<any>(`${this.url}/top-5-san-pham-ban-chay-thang`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  getExcel(): Observable<any> {
    return this.http.get<any>(`${this.url}/xuat-excel`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  
}
