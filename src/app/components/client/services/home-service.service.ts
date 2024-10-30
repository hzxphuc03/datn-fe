import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeServoceService {
  url: string = 'http://localhost:8080/api/san_pham';
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
}
