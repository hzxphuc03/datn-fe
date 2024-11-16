import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KhachHangServiceService {
  url: string = 'http://localhost:8080/api/khach_hang';
  urlDiaChi: string = 'http://localhost:8080/api/dia_chi';
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
  getDiaChiByKH(params: any): Observable<any> {
    return this.http.get<any>(`${this.urlDiaChi}/get-by-idkh`, { params }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  addDiaChi(params: any): Observable<any> {
    return this.http.post<any>(`${this.urlDiaChi}/add`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getbyId(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/get-by-id/${id}`).pipe(
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
  updateDiaChiMacDinh(id: any): Observable<any> {
    return this.http.get<any>(`${this.urlDiaChi}/set-mac-dinh/${id}`,).pipe(
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
