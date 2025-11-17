import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { TokenService, UserInfo } from './token.service';

export interface UserProfile {
  id: number;
  ma: string;
  hoTen: string;
  hinhAnh?: string;
  ngaySinh?: string;
  soDienThoai?: string;
  gioiTinh?: number;
  email?: string;
  taiKhoan?: string;
  trangThai?: number;
  chucVu?: any; // For employees
  role?: string;
}

export interface UpdateProfileRequest {
  id: number;
  hoTen?: string;
  hinhAnh?: string;
  ngaySinh?: string;
  gioiTinh?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_BASE_URL = 'http://localhost:8080/api';
  
  // User profile observable
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    // Initialize user profile from token
    this.initializeUserProfile();
  }

  /**
   * Initialize user profile from stored token
   */
  private initializeUserProfile(): void {
    const userInfo = this.tokenService.getUserInfo();
    if (userInfo) {
      // Convert UserInfo to UserProfile format
      const profile: UserProfile = {
        id: parseInt(userInfo.id || '0'),
        ma: userInfo.username || '',
        hoTen: userInfo.fullName || userInfo.username || '',
        email: userInfo.email,
        taiKhoan: userInfo.username,
        role: userInfo.role
      };
      this.userProfileSubject.next(profile);
    }
  }

  /**
   * Get current user profile
   */
  getCurrentUserProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  /**
   * Fetch user profile from server (Customer)
   */
  getCustomerProfile(id: number): Observable<UserProfile> {
    return this.http.get<any>(`${this.API_BASE_URL}/khach_hang/${id}`).pipe(
      map(response => this.mapToUserProfile(response)),
      tap(profile => this.userProfileSubject.next(profile))
    );
  }

  /**
   * Fetch user profile from server (Employee)
   */
  getEmployeeProfile(id: number): Observable<UserProfile> {
    return this.http.get<any>(`${this.API_BASE_URL}/nhan_vien/get-by-id/${id}`).pipe(
      map(response => this.mapToUserProfile(response)),
      tap(profile => this.userProfileSubject.next(profile))
    );
  }

  /**
   * Update customer profile
   */
  updateCustomerProfile(profileData: UpdateProfileRequest): Observable<any> {
    return this.http.put(`${this.API_BASE_URL}/khach_hang/update-khach-hang`, profileData).pipe(
      tap(() => {
        // Refresh profile after update
        this.refreshUserProfile();
      })
    );
  }

  /**
   * Update employee profile
   */
  updateEmployeeProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.API_BASE_URL}/nhan_vien/update`, profileData).pipe(
      tap(() => {
        // Refresh profile after update
        this.refreshUserProfile();
      })
    );
  }

  /**
   * Update customer phone number
   */
  updateCustomerPhone(phoneData: { id: number; soDienThoai: string }): Observable<any> {
    return this.http.put(`${this.API_BASE_URL}/khach_hang/cap-nhat-so-dien-thoai`, phoneData);
  }

  /**
   * Update customer email
   */
  updateCustomerEmail(emailData: { id: number; email: string }): Observable<any> {
    return this.http.put(`${this.API_BASE_URL}/khach_hang/cap-nhat-email`, emailData);
  }

  /**
   * Send OTP for email verification
   */
  sendEmailOTP(emailData: { id: number; email: string }): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/khach_hang/gui-ma-otp`, emailData);
  }

  /**
   * Change password (if endpoint exists)
   */
  changePassword(passwordData: ChangePasswordRequest): Observable<any> {
    // Note: This endpoint might not exist in your API spec
    // You may need to implement this on the backend
    return this.http.put(`${this.API_BASE_URL}/auth/change-password`, passwordData);
  }

  /**
   * Upload profile image
   */
  uploadProfileImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Note: You may need to implement file upload endpoint
    return this.http.post<any>(`${this.API_BASE_URL}/upload/profile-image`, formData).pipe(
      map(response => response.imageUrl || response.url)
    );
  }

  /**
   * Get user addresses (for customers)
   */
  getUserAddresses(customerId: number, page: number = 0, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/dia_chi/get-by-idkh`, {
      params: {
        idKhachHang: customerId.toString(),
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Add new address
   */
  addAddress(addressData: any): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/dia_chi/add`, addressData);
  }

  /**
   * Update address
   */
  updateAddress(addressData: any): Observable<any> {
    return this.http.put(`${this.API_BASE_URL}/dia_chi/update`, addressData);
  }

  /**
   * Set default address
   */
  setDefaultAddress(addressId: number): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/dia_chi/set-mac-dinh/${addressId}`);
  }

  /**
   * Get user orders (for customers)
   */
  getUserOrders(customerId: number, page: number = 0, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/hoa_don/get-hoa-don-by-khach-hang`, {
      params: {
        idKhachHang: customerId.toString(),
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get user notifications
   */
  getUserNotifications(customerId: number, page: number = 0, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/thong_bao/get-thong-bao`, {
      params: {
        idKhachHang: customerId.toString(),
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Mark notifications as read
   */
  markNotificationsAsRead(customerId: number): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/thong_bao/set-thong-bao-da-doc/${customerId}`);
  }

  /**
   * Refresh user profile from server
   */
  refreshUserProfile(): void {
    const currentProfile = this.getCurrentUserProfile();
    if (currentProfile) {
      const userRole = this.tokenService.getUserRole();
      if (userRole === 'CUSTOMER') {
        this.getCustomerProfile(currentProfile.id).subscribe();
      } else {
        this.getEmployeeProfile(currentProfile.id).subscribe();
      }
    }
  }

  /**
   * Map API response to UserProfile
   */
  private mapToUserProfile(response: any): UserProfile {
    return {
      id: response.id,
      ma: response.ma,
      hoTen: response.hoTen || response.hoten,
      hinhAnh: response.hinhAnh,
      ngaySinh: response.ngaySinh,
      soDienThoai: response.soDienThoai,
      gioiTinh: response.gioiTinh,
      email: response.email,
      taiKhoan: response.taiKhoan,
      trangThai: response.trangThai,
      chucVu: response.chucVu,
      role: response.role || this.tokenService.getUserRole()
    };
  }

  /**
   * Clear user profile data
   */
  clearUserProfile(): void {
    this.userProfileSubject.next(null);
  }
}