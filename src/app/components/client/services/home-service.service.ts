import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeServoceService {
  url: string = `${environment.apiUrl}/san_pham`;
  urlTheLoai = `${environment.apiUrl}/the_loai`;
  urlVatLieu = `${environment.apiUrl}/vat_lieu`;
  urlThuongHieu = `${environment.apiUrl}/thuong_hieu`;
  urlLoaiDe = `${environment.apiUrl}/loai_de`;
  urlLoaiCo = `${environment.apiUrl}/loai_co`;
  urlGiamGia = `${environment.apiUrl}/giam_gia`;
  urlGioHang = `${environment.apiUrl}/gio_hang`;
  urlSuKien = `${environment.apiUrl}/su_kien`;
  urlSuKienVoucher = `${environment.apiUrl}/lich_su_su_dung`;
  urlThongBao = `${environment.apiUrl}/thong_bao`;
  urlDanhGia = `${environment.apiUrl}/danh_gia_san_pham`;
  urlHoaDon = `${environment.apiUrl}/hoa_don`;
  urlDoiTra = `${environment.apiUrl}/doi-tra`;
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
  getTop5TheoTheLoai(params: any): Observable<any> {
    return this.http
      .get<any>(`${this.url}/top5-san-pham-theo-the-loai`, { params })
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getAllSearch(params: any): Observable<any> {
    return this.http.get<any>(`${this.url}/get-by-all`, { params }).pipe(
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
  getTop5MoiTheoTheLoi(id: any): Observable<any> {
    return this.http
      .get<any>(`${this.url}/top5-san-pham-theo-the-loai?theLoaiId=${id}`)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getTopGiamGiaSau(): Observable<any> {
    return this.http.get<any>(`${this.url}/giam-gia-sau-nhat`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getTop12UpdateMoiNhat(): Observable<any> {
    return this.http.get<any>(`${this.url}/12-san-pham-update-gan-nhat`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllTheLoai(): Observable<any> {
    return this.http.get<any>(`${this.urlTheLoai}/get-all-the-loai`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllVatLieu(): Observable<any> {
    return this.http.get<any>(`${this.urlVatLieu}/get-all-vat-lieu`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllThuongHieu(): Observable<any> {
    return this.http.get<any>(`${this.urlThuongHieu}/get-all-thuong-hieu`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllLoaiDe(): Observable<any> {
    return this.http.get<any>(`${this.urlLoaiDe}/get-all-loai-de`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllLoaiCo(): Observable<any> {
    return this.http.get<any>(`${this.urlLoaiCo}/get-all-loai-co`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllGiamGia(): Observable<any> {
    return this.http.get<any>(`${this.urlGiamGia}/get-all`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getTimKiem(text: any): Observable<any> {
    return this.http.get<any>(`${this.url}/tim-kiem/${text}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getSoluongGioHang(id: any): Observable<any> {
    return this.http.get<any>(`${this.urlGioHang}/get_so_luong/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getEvent(): Observable<any> {
    return this.http.get<any>(`${this.urlSuKien}/get-su-kien-active`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  getAllVoucherByKh(id: any): Observable<any> {
    return this.http
      .get<any>(
        `${this.urlSuKienVoucher}/voucher-trang-thai-su-dung-by-khach-hang/${id}`
      )
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getNumberThongBao(id: any): Observable<any> {
    return this.http
      .get<any>(`${this.urlThongBao}/get-count-thong-bao/${id}`)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getThongBaoByIDKH(params: any): Observable<any> {
    return this.http
      .get<any>(`${this.urlThongBao}/get-thong-bao`, { params })
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  docTatCaThongBaoTheoIDKH(id: any): Observable<any> {
    return this.http
      .get<any>(`${this.urlThongBao}/set-thong-bao-da-doc/${id}`)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  docThongBaoTheoId(id: any): Observable<any> {
    return this.http
      .get<any>(`${this.urlThongBao}/set-thong-bao-tung-cai/${id}`)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  addVoucherEvent(params: any): Observable<any> {
    return this.http.post<any>(`${this.urlSuKienVoucher}/add`, params).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  addPhieuDoiTra(params: any): Observable<any> {
    return this.http
      .post<any>(`${this.urlDoiTra}/add-pheu-doi-tra`, params)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getPhieuDoiTraByKH(params: any): Observable<any> {
    return this.http
      .get<any>(`${this.urlDoiTra}/get-phieu-doi-tra-by-khach-hang`, { params })
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getPhieuDoiTraById(id: any): Observable<any> {
    return this.http
      .get<any>(`${this.urlDoiTra}/get-detail-phieu-doi-tra/${id}`)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  udpateTrangThaiPhieu(params: any): Observable<any> {
    return this.http
      .put<any>(`${this.urlDoiTra}/cap-nhat-trang-thai-phieu-doi-tra`,params)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  craeteNewHoaDonInPhieu(params: any): Observable<any> {
    return this.http
      .put<any>(`${this.urlDoiTra}/them-dia-chi-vao-phieu-doi-tra`,params)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  udpateThongTinNganHang(params: any): Observable<any> {
    return this.http
      .put<any>(`${this.urlDoiTra}/thong-tin-chuyen-khoan-phieu-doi-tra`,params)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getTatCaSpCHuaDanhGiaByIdKh(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/san-pham-chua-danh-gia/${id}`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
  danhGiaAll(params: any): Observable<any> {
    return this.http
      .post<any>(
        `${this.urlDanhGia}/danh-gia-tat-ca?idKhachHang=${params.idKhachHang}`,
        params
      )
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  danhGiaSinger(params: any): Observable<any> {
    return this.http
      .post<any>(`${this.urlDanhGia}/danh-gia-tung-san-pham`, params)
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getHoaDonByIdKH(params: any): Observable<any> {
    return this.http
      .get<any>(`${this.urlHoaDon}/get-hoa-don-by-khach-hang`, { params })
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getHoaDonByHoanThanhIdKH(params: any): Observable<any> {
    return this.http
      .get<any>(`${this.urlHoaDon}/get-hoa-don-hoan-thanh-by-khach-hang`, { params })
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }
  getDetailHoaDonByIdHD(id: any): Observable<any> {
    return this.http
      .get<any>(
        `${this.urlHoaDon}/get-hoa-don-chi-tiet-cho-view-khach-hang/${id}`
      )
      .pipe(
        (res: any) => {
          return res || null;
        },
        catchError((error: any) => {
          return of(error?.errorJson ? error.errorJson : error.error);
        })
      );
  }

  /**
   * Lấy danh sách sản phẩm có đánh giá
   */
  getSanPhamCoDanhGia(): Observable<any> {
    return this.http.get<any>(`${this.url}/co-danh-gia`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }

  /**
   * Lấy danh sách đánh giá của sản phẩm
   */
  getDanhGiaBySanPham(idSanPham: any): Observable<any> {
    return this.http.get<any>(`${this.url}/san-pham/${idSanPham}/danh-gia`).pipe(
      (res: any) => {
        return res || null;
      },
      catchError((error: any) => {
        return of(error?.errorJson ? error.errorJson : error.error);
      })
    );
  }
}
