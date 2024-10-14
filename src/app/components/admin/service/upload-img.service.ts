import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadImgService {
  url =
    'https://fsel-gateway-testing-api.fsel.edu.vn/storage-gateway/v1.1/file';
  constructor(private http: HttpClient) {}

  upload(file: any, type: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post<any>(`${this.url}/${type}`, formData, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(
        catchError((httpError: any) => {
          return throwError(httpError);
        })
      );
  }
}
