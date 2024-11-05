import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeServoceService {
  url: string = 'http://localhost:8080/api/san_pham';
  urlTheLoai = 'http://localhost:8080/api/the_loai';
  urlVatLieu = 'http://localhost:8080/api/vat_lieu';
  urlThuongHieu = 'http://localhost:8080/api/thuong_hieu';
  urlLoaiDe = 'http://localhost:8080/api/loai_de';
  urlLoaiCo = 'http://localhost:8080/api/loai_co';
  urlGiamGia = 'http://localhost:8080/api/giam_gia';
  constructor(private http: HttpClient) {}

  getTop5BanChay(): Observable<any> {
    return this.http.get<any>(`${this.url}/top5-ban-chay`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getTop5TheoTheLoai(params: any): Observable<any> {
    return this.http
      .get<any>(`${this.url}/top5-san-pham-theo-the-loai`, { params })
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getAllSearch(params: any): Observable<any> {
    return this.http.get<any>(`${this.url}/get-by-all`, { params }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getTop5GiamGia(): Observable<any> {
    return this.http.get<any>(`${this.url}/top5-giam-gia`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getTop5Moi(): Observable<any> {
    return this.http.get<any>(`${this.url}/top5-moi`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getTopGiamGiaSau(): Observable<any> {
    return this.http.get<any>(`${this.url}/giam-gia-sau-nhat`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getTop12UpdateMoiNhat(): Observable<any> {
    return this.http.get<any>(`${this.url}/12-san-pham-update-gan-nhat`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllTheLoai(): Observable<any> {
    return this.http.get<any>(`${this.urlTheLoai}/get-all-the-loai`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllVatLieu(): Observable<any> {
    return this.http.get<any>(`${this.urlVatLieu}/get-all-vat-lieu`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllThuongHieu(): Observable<any> {
    return this.http.get<any>(`${this.urlThuongHieu}/get-all-thuong-hieu`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllLoaiDe(): Observable<any> {
    return this.http.get<any>(`${this.urlLoaiDe}/get-all-loai-de`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllLoaiCo(): Observable<any> {
    return this.http.get<any>(`${this.urlLoaiCo}/get-all-loai-co`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllGiamGia(): Observable<any> {
    return this.http.get<any>(`${this.urlGiamGia}/get-all`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
}
