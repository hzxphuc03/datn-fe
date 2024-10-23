import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiaChiServiceService {
  urlTinhThanh: string =
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province';
  urlQuanHuyen: string =
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district';
  urlPhuongXa: string =
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id';
  shipOrderPhuong: string =
    'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
  token: string = 'f8ae5d1b-8d5a-11ef-8e53-0a00184fe694';
  // thông tin hiện tại của shop
  shop_id: string = '195078';
  from_ward_code: string = '1A0320';
  from_district_id: number = 201;
  //
  constructor(private http: HttpClient) {}

  getAllTinhThanh(): Observable<any> {
    const headers = new HttpHeaders({
      token: this.token, // Thêm token vào header
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
      token: this.token, // Thêm token vào header
    });

    const body = {
      province_id: id, // Dữ liệu gửi trong thân yêu cầu
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
      token: this.token, // Thêm token vào header
    });

    const body = {
      district_id: id, // Dữ liệu gửi trong thân yêu cầu
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
  getOder(param: any): Observable<any> {
    const headers = new HttpHeaders({
      token: this.token, // Thêm token vào header
      ShopId: this.shop_id,
    });

    return this.http
      .post<any>(`${this.shipOrderPhuong}`, param, { headers })
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
}
