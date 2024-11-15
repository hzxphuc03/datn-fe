import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  url: string = 'http://localhost:8080/api/khach_hang';
  constructor(private http: HttpClient, private dataService: DataService) {}

  getUserByIdKh(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  udpate(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
}
