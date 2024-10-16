import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'jwtToken'; // Khóa lưu token

  constructor() {}

  // Phương thức để lưu token
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Phương thức để lấy token và giải mã nó
  getToken(): { token: string | null; decoded: any | null } {
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (token) {
      return { token, decoded: this.decodeToken(token) }; // Trả về token và thông tin đã giải mã
    }

    return { token: null, decoded: null }; // Nếu không có token
  }

  // Phương thức để xóa token
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Phương thức để kiểm tra xem token có tồn tại hay không
  isTokenExists(): boolean {
    return !!this.getToken().token; // Trả về true nếu có token
  }

  // Phương thức để giải mã token
  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  isTokenExpired(): boolean {
    const { decoded } = this.getToken();
    if (decoded && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giây
      return decoded.exp < currentTime; // Nếu exp nhỏ hơn thời gian hiện tại, token đã hết hạn
    }
    return true; // Nếu không có token hoặc không có exp, coi như đã hết hạn
  }
}
