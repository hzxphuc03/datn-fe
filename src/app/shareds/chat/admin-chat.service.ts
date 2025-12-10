import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminChatService {
  url : string = `${environment.apiUrl}/nhan-tin`;
  urlDoanChat : string = `${environment.apiUrl}/doan-chat`;
  urlHopThoai : string = `${environment.apiUrl}/hop-thoai`;
  constructor(private http: HttpClient) { }

  getAllBoxNhanVien(id : any): Observable<any> {
    return this.http.get<any>(`${this.url}/get-hop-thoai-by-nhan-vien/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllMess(params : any): Observable<any> {
    return this.http.get<any>(`${this.urlDoanChat}/get-doan-chat-by-hop-thoai`,{params}).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  checkHopThoaiByNhannVien(params : any): Observable<any> {
    return this.http.get<any>(`${this.urlHopThoai}/check-hop-thoai-nhan-vien`,{params}).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  addHopThoaiByNhannVien(params : any): Observable<any> {
    return this.http.post<any>(`${this.urlHopThoai}/add-hop-thoai-nhan-vien`,params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllNhanVien(): Observable<any> {
    return this.http.get<any>(`${this.url}/get-all-nhan-vien`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  guiTinNhan(params : any): Observable<any> {
    return this.http.post<any>(`${this.urlDoanChat}/add-doan-chat`,params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  
}
