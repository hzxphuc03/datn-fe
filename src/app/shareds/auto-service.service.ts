import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AutoServiceService {
  url: string = `${environment.apiUrl}/voucher/update-trangthai-auto`;
  constructor(private http: HttpClient) {}

  autoVoucher(): Observable<any> {
    return this.http.put<any>(`${this.url}`, {}).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
}
