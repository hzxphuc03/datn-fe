import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class MuaHangService {
  urlGh: string = 'http://localhost:8080/api/gio_hang_chi_tiet';
  urlGhKH: string = 'http://localhost:8080/api/gio_hang';
  urlKhVoucher ='http://localhost:8080/api/voucher_khach_hang'
  constructor(private http: HttpClient,private dataService: DataService) {}
  themSanPhamVaoGioHang(params: any): Observable<any> {
    return this.http.post<any>(`${this.urlGh}/add`, params).pipe(
      (res: any) => {
        this.dataService.updateData('this.value');
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  DeleteAll(idkh: any): Observable<any> {
    return this.http.delete<any>(`${this.urlGh}/delete-All/${idkh}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  DeleteChose(idghct: any): Observable<any> {
    return this.http.delete<any>(`${this.urlGh}/delete-by-id/${idghct}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getVoucherKhachHang(idKhachHang : any): Observable<any> {
    return this.http.get<any>(`${this.urlKhVoucher}/get-by-id/${idKhachHang }`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getGoHangByIdKH(id: any): Observable<any> {
    return this.http.get<any>(`${this.urlGh}/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  thanhToan3(params : any): Observable<any> {
    return this.http.put<any>(`${this.urlGhKH}/thanh-toan-khi-giao-hang`,params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  thanhToan2(params : any): Observable<any> {
    return this.http.put<any>(`${this.urlGhKH}/thanh-toan-online`,params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  thanhToan2End(params : any): Observable<any> {
    return this.http.put<any>(`${this.urlGhKH}/thanh-toan-thanh-cong`,params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
}
