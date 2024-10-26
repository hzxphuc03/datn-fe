import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HoaDonService {
  url: string = 'http://localhost:8080/api/hoa_don';
  urlCT: string = 'http://localhost:8080/api/hoa_don_chi_tiet';
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
  updateAfterOnlinePayment(id: any): Observable<any> {
    return this.http.put<any>(`${this.url}/update-trang-thai-thanh_toan-online/${id}`,{}).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllCt(params: any): Observable<any> {
    return this.http.get<any>(`${this.urlCT}`, { params }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  ThemNhanhHoaDon(idNhanVien: number): Observable<any> {
    const url = `${this.url}/add-nhanh?idNhanVien=${idNhanVien}`;
    return this.http.post<any>(url, {}).pipe(
      map((res: any) => res || null),
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  updateTrangThaiGiaoHang(params: any): Observable<any> {
    return this.http.put<any>(`${this.url}/update-trang-thai-giao-hang`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  updateSoLuong(params: any): Observable<any> {
    return this.http.post<any>(`${this.urlCT}/add-so-luong`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  update(params: any): Observable<any> {
    return this.http.put<any>(`${this.url}/update/`, params).pipe(
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
  hdctAdd(params: any): Observable<any> {
    return this.http.post<any>(`${this.urlCT}/add`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  deleteSPFromCTSP(id: any): Observable<any> {
    return this.http.delete<any>(`${this.urlCT}/delete/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  addKhachHangToHD(params: any): Observable<any> {
    return this.http.put<any>(`${this.url}/add-khach-hang`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  updateDiaChi(params: any): Observable<any> {
    return this.http.put<any>(`${this.url}/add-dia-chi`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  updatePhuongThucThanhToan(params: any): Observable<any> {
    return this.http.put<any>(`${this.url}/add-phuong-thuc-thanh-toan`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  thanhToanHoaDOn(params: any): Observable<any> {
    return this.http.put<any>(`${this.url}/thanh-toan-tai-quay`, params).pipe(
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
}
