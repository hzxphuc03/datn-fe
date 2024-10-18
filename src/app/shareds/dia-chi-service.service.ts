import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiaChiServiceService {
  urlTinhThanh : string = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province';
  urlQuanHuyen : string = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district';
  urlPhuongXa : string = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id';
  token : string = 'f8ae5d1b-8d5a-11ef-8e53-0a00184fe694';
  constructor(private http: HttpClient) {
   }

  getAllTinhThanh(): Observable<any> {
     const headers = new HttpHeaders({
      'token': this.token // Thêm token vào header
     });
    return this.http.get<any>(`${this.urlTinhThanh}`, { headers }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllQuanHuyen(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'token': this.token, // Thêm token vào header
    });
  
    const body = {
      province_id: id // Dữ liệu gửi trong thân yêu cầu
    };
  
    return this.http.post<any>(`${this.urlQuanHuyen}`, body, { headers }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
}
  getAllPhuongXa(id: any): Observable<any> {
    const headers = new HttpHeaders({
      'token': this.token, // Thêm token vào header
    });
  
    const body = {
      district_id: id // Dữ liệu gửi trong thân yêu cầu
    };
  
    return this.http.post<any>(`${this.urlPhuongXa}`, body, { headers }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
}
}
