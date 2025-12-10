import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class MuaHangService {
  urlGh: string = `${environment.apiUrl}/gio_hang_chi_tiet`;
  urlGhKH: string = `${environment.apiUrl}/gio_hang`;
  urlKhVoucher = `${environment.apiUrl}/voucher_khach_hang`
  constructor(private http: HttpClient, private dataService: DataService) { }
  themSanPhamVaoGioHang(params: any): Observable<any> {
    return this.http.post<any>(`${this.urlGh}/add`, params).pipe(
      tap((res: any) => {
        console.log('🔔 Service: Cart updated, broadcasting...');
        this.dataService.updateData('cart_updated');
      }),
      catchError((error: any) => {
        console.error('❌ Service error:', error);
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  capNhatSoLuongGioHang(params: any): Observable<any> {
    return this.http.post<any>(`${this.urlGh}/add-so-luong`, params).pipe(
      tap((res: any) => {
        this.dataService.updateData('quantity_updated');
      }),
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  DeleteAll(idkh: any): Observable<any> {
    return this.http.delete<any>(`${this.urlGh}/delete-All/${idkh}`).pipe(
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  DeleteChose(idghct: any): Observable<any> {
    return this.http.delete<any>(`${this.urlGh}/delete-by-id/${idghct}`).pipe(
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getVoucherKhachHang(idKhachHang: any): Observable<any> {
    return this.http.get<any>(`${this.urlKhVoucher}/get-by-id/${idKhachHang}`).pipe(
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getGoHangByIdKH(id: any): Observable<any> {
    return this.http.get<any>(`${this.urlGh}/${id}`).pipe(
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  thanhToan3(params: any): Observable<any> {
    return this.http.put<any>(`${this.urlGhKH}/thanh-toan-khi-giao-hang`, params).pipe(
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  thanhToan2(params: any): Observable<any> {
    return this.http.put<any>(`${this.urlGhKH}/thanh-toan-online`, params).pipe(
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  thanhToan2End(params: any): Observable<any> {
    return this.http.put<any>(`${this.urlGhKH}/thanh-toan-thanh-cong`, params).pipe(
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  /**
   * Cập nhật giỏ hàng
   */
  updateGioHang(params: { idKhachHang: number; chiTiet: Array<{ idSanPhamChiTiet: number; soLuong: number }> }): Observable<any> {
    return this.http.put<any>(`${this.urlGhKH}/update`, params).pipe(
      tap((res: any) => {
        this.dataService.updateData('cart_updated');
      }),
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  /**
   * Thêm địa chỉ vào giỏ hàng
   */
  addDiaChiToGioHang(params: { idGioHang: number; idDiaChi: number }): Observable<any> {
    return this.http.put<any>(`${this.urlGhKH}/add-dia-chi`, params).pipe(
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  /**
   * Thêm voucher vào giỏ hàng
   */
  addVoucherToGioHang(params: { idGioHang: number; idVoucher: number }): Observable<any> {
    return this.http.put<any>(`${this.urlGhKH}/add-voucher`, params).pipe(
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  /**
   * Thêm phương thức thanh toán vào giỏ hàng
   */
  addPhuongThucThanhToanToGioHang(params: { idGioHang: number; idPhuongThucThanhToan: number }): Observable<any> {
    return this.http.put<any>(`${this.urlGhKH}/add-phuong-thuc-thanh-toan`, params).pipe(
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
}
