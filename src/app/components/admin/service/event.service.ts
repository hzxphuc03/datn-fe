import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  url: string = `${environment.apiUrl}/su_kien`;
  urlVoucher: string = `${environment.apiUrl}/voucher`;
  urlVoucherEvent: string = `${environment.apiUrl}/chi_phieu_giam_gia_su_kien`;
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
  getAllThang(): Observable<any> {
    return this.http.post<any>(`${this.url}/get-thang-active`,{}).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  addEvent(params : any){
    return this.http.post<any>(`${this.url}/add`,params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  udpateEvent(params : any){
    return this.http.put<any>(`${this.url}/update`,params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getVoucherEvent(params : any){
    return this.http.get<any>(`${this.urlVoucher}/get-phieu-giam-gia-su-kien`, { params }).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getDetailEvent(id : any){
    return this.http.get<any>(`${this.url}/get-detail-su-kien/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllvoucherByIdEvent(id : any){
    return this.http.get<any>(`${this.urlVoucherEvent}/get-detail/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  addVoucherSuKien(params : any){
    return this.http.post<any>(`${this.urlVoucher}/add-voucher-su-kien`,  params ).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  addVoucherToSuKien(params : any){
    return this.http.post<any>(`${this.urlVoucherEvent}/add`,  params ).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
}
