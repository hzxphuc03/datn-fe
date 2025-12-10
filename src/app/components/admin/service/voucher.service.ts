import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  url: string = `${environment.apiUrl}/voucher`;
  urlVoucherHoaDon: string = `${environment.apiUrl}/voucher_hoa_don`;
  urlVoucherHoaDonCT: string = `${environment.apiUrl}/hoa_don`;
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
  getById(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/get-by-id/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getVoucherByIdHoaDon(id: any): Observable<any> {
    return this.http.get<any>(`${this.urlVoucherHoaDon}/get-by-id/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  addVoucherToHoaDon(params: any): Observable<any> {
    return this.http
      .put<any>(`${this.urlVoucherHoaDonCT}/add-voucher`, params)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  deleteVoucherToHoaDon(params: any): Observable<any> {
    return this.http
      .post<any>(`${this.urlVoucherHoaDonCT}/delete-voucher`, params)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getVoucherActive(params: any): Observable<any> {
    return this.http
      .get<any>(`${this.url}/get-voucher-active`, { params })
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  update(params: any): Observable<any> {
    return this.http.put<any>(`${this.url}/update`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  add(params: any): Observable<any> {
    return this.http.post<any>(`${this.url}/add`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  udpateStatus(id: number, status: number): Observable<any> {
    const params = new HttpParams().set('status', status.toString());
    return this.http
      .put<any>(`${this.url}/update-trang-thai/${id}`, null, { params })
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }

  /**
   * Lấy voucher hóa đơn
   */
  getVoucherHoaDon(params: any): Observable<any> {
    return this.http.get<any>(`${this.url}/Voucher-Hoa-Don`, { params }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  /**
   * Lấy voucher ship
   */
  getVoucherShip(params: any): Observable<any> {
    return this.http.get<any>(`${this.url}/Voucher-Ship`, { params }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  /**
   * Lấy phiếu giảm giá sự kiện
   */
  getPhieuGiamGiaSuKien(params: any): Observable<any> {
    return this.http.get<any>(`${this.url}/get-phieu-giam-gia-su-kien`, { params }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  /**
   * Thêm voucher sự kiện
   */
  addVoucherSuKien(params: { idSuKien: number; vouchers: any[] }): Observable<any> {
    return this.http.post<any>(`${this.url}/add-voucher-su-kien`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  /**
   * Cập nhật trạng thái voucher tự động (scheduled job)
   */
  updateTrangThaiAuto(): Observable<any> {
    return this.http.put<any>(`${this.url}/update-trangthai-auto`, {}).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
}
