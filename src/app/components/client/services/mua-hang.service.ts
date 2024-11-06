import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MuaHangService {
  urlGh: string = 'http://localhost:8080/api/gio_hang_chi_tiet';
  constructor(private http: HttpClient) {}
  themSanPhamVaoGioHang(params: any): Observable<any> {
    return this.http.post<any>(`${this.urlGh}/add`, params).pipe(
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
}
