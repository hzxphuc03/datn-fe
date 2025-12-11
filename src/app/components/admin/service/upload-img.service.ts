import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class UploadImgService {
  private apiUrl = 'https://ba-datn-1.onrender.com/api/storage-gateway';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  upload(file: any, type: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    // Get token from TokenService
    const { token } = this.tokenService.getToken();

    // Create headers with Authorization, but DO NOT set Content-Type
    // Angular will automatically set multipart/form-data with boundary
    let headers = new HttpHeaders();
    if (token && !this.tokenService.isTokenExpired()) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .post<any>(`${this.apiUrl}/upload`, formData, {
        headers: headers,
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
