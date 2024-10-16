import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  url: string = 'http://localhost:8080/api/auth/nhan_vien_login';
  constructor(private http: HttpClient) {}

  login(params: any): Observable<any> {
    return this.http.post<any>(`${this.url}`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
}
