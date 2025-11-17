import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DecodedToken {
  sub?: string; // Subject (username)
  username?: string;
  email?: string;
  role?: string;
  userId?: number; // User ID from backend token
  authorities?: string[];
  exp?: number; // Expiration time (seconds)
  iat?: number; // Issued at (seconds)
  [key: string]: any;
}

export interface UserInfo {
  id?: string | number;
  username?: string;
  email?: string;
  role?: string;
  authorities?: string[];
  fullName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'jwtToken';
  private readonly USER_KEY = 'userInfo';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  // Observable for authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isTokenExists() && !this.isTokenExpired());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Observable for user info
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(this.getUserInfo());
  public userInfo$ = this.userInfoSubject.asObservable();

  constructor() {
    // Check token validity on service initialization
    this.checkTokenValidity();
  }

  /**
   * Save JWT token and user info
   */
  setToken(token: string, userInfo?: any, refreshToken?: string): void {
    try {
      if (!token) {
        console.error('❌ Cannot set token: token is null or undefined');
        return;
      }

      console.log('💾 Setting token in TokenService...', {
        tokenLength: token?.length,
        hasUserInfo: !!userInfo,
        hasRefreshToken: !!refreshToken,
        tokenPreview: token.substring(0, 30) + '...'
      });

      // Lưu token trực tiếp vào localStorage
      localStorage.setItem(this.TOKEN_KEY, token);
      // Compat: Lưu thêm vào các key cũ nếu code legacy có dùng
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('accessToken', token);
      } catch { }

      // Verify ngay sau khi save
      const immediatelyAfterSave = localStorage.getItem(this.TOKEN_KEY);
      if (!immediatelyAfterSave) {
        console.error('❌ CRITICAL: Token not found immediately after saving!');
        throw new Error('Failed to save token to localStorage');
      }
      console.log('✅ Token saved and verified in localStorage');

      // Save refresh token if provided
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }

      // Decode token to extract user info
      const decoded = this.decodeToken(token);
      console.log('🔓 Decoded token:', decoded);

      if (decoded) {
        // CRITICAL: Extract user ID from multiple possible locations
        let userId: string | number | null = null;

        // Priority order for user ID extraction:
        // 1. From userInfo response (most reliable)
        if (userInfo?.id) {
          userId = userInfo.id;
        }
        // 2. From decoded token - try multiple field names
        else if (decoded.userId) {
          userId = decoded.userId;
        }
        else if (decoded['user']?.['id']) {
          userId = decoded['user']['id'];
        }
        else if (decoded['id']) {
          userId = decoded['id'];
        }
        else if (decoded.sub && !isNaN(Number(decoded.sub))) {
          userId = Number(decoded.sub);
        }

        console.log('🔍 User ID extraction:', {
          fromUserInfo: userInfo?.id,
          fromDecodedUserId: decoded.userId,
          fromDecodedUser: decoded['user']?.['id'],
          fromDecodedId: decoded['id'],
          fromDecodedSub: decoded.sub,
          finalUserId: userId
        });

        if (!userId) {
          console.error('❌ CRITICAL: Cannot extract user ID from token or response!');
          console.error('Decoded token:', decoded);
          console.error('UserInfo response:', userInfo);
        }

        const user: UserInfo = {
          id: userId || undefined,
          username: decoded.username || decoded.sub || userInfo?.taiKhoan,
          email: decoded.email || userInfo?.email,
          role: decoded.role || decoded.authorities?.[0] || userInfo?.role,
          authorities: decoded.authorities || [],
          fullName: userInfo?.hoTen || userInfo?.fullName || decoded['fullName']
        };

        console.log('👤 User info to save:', user);

        if (!user.id) {
          console.error('❌ CRITICAL: No user ID! Will cause "khách hàng không tồn tại" error!');

          // Last resort: try to find ID in userInfo response
          if (userInfo && typeof userInfo === 'object') {
            console.log('🔍 Searching for ID in userInfo...');
            console.log('🔍 UserInfo keys:', Object.keys(userInfo));

            const possibleId = userInfo.id ||
              userInfo.userId ||
              userInfo.khachHangId ||
              userInfo.idKhachHang;

            if (possibleId) {
              console.log('✅ Found ID:', possibleId);
              user.id = possibleId;
            } else {
              console.error('❌ FAILED: Cannot find user ID anywhere!');
              console.error('Full userInfo:', JSON.stringify(userInfo, null, 2));
            }
          }
        }

        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.userInfoSubject.next(user);

        console.log('✅ Saved user:', { id: user.id, username: user.username, hasId: !!user.id });
      }

      // Verify token was saved
      const savedToken = localStorage.getItem(this.TOKEN_KEY);
      console.log('✅ Token saved successfully:', savedToken ? 'YES' : 'NO');
      console.log('✅ Token check:', {
        exists: this.isTokenExists(),
        expired: this.isTokenExpired(),
        authenticated: this.isAuthenticated(),
        storageKeys: {
          jwtToken: !!localStorage.getItem('jwtToken'),
          token: !!localStorage.getItem('token'),
          accessToken: !!localStorage.getItem('accessToken'),
          refreshToken: !!localStorage.getItem('refreshToken'),
          userInfo: !!localStorage.getItem('userInfo')
        }
      });

      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      console.error('Error saving token:', error);
      this.clearAuthData();
    }
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Set refresh token
   */
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Get token and decoded information
   */
  getToken(): { token: string | null; decoded: DecodedToken | null } {
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (token && !this.isTokenExpired()) {
      return { token, decoded: this.decodeToken(token) };
    }

    return { token: null, decoded: null };
  }

  /**
   * Get raw token string
   */
  getRawToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get user information
   * FALLBACK: If userInfo not in localStorage, decode from token
   */
  getUserInfo(): UserInfo | null {
    try {
      // Try to get from localStorage first
      const userStr = localStorage.getItem(this.USER_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }

      // FALLBACK: Decode from token if userInfo not found
      console.warn('⚠️ UserInfo not in localStorage, decoding from token...');
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (token) {
        const decoded = this.decodeToken(token);
        if (decoded) {
          const userInfo: UserInfo = {
            id: decoded.userId || decoded['user']?.['id'] || decoded['id'] || decoded.sub,
            username: decoded.username || decoded.sub,
            email: decoded.email,
            role: decoded.role || decoded.authorities?.[0],
            authorities: decoded.authorities || [],
            fullName: decoded['fullName']
          };

          // Save to localStorage for next time
          localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
          console.log('✅ Reconstructed userInfo from token:', userInfo);

          return userInfo;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }

  /**
   * Get user role
   */
  getUserRole(): string | null {
    const user = this.getUserInfo();
    return user?.role || null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    // Normalize role names (remove ROLE_ prefix if present)
    const normalizedRole = role.replace(/^ROLE_/, '');
    const normalizedUserRole = userRole.replace(/^ROLE_/, '');

    return normalizedUserRole === normalizedRole;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    // Normalize user role (remove ROLE_ prefix if present)
    const normalizedUserRole = userRole.replace(/^ROLE_/, '');

    return roles.some(role => {
      const normalizedRole = role.replace(/^ROLE_/, '');
      return normalizedUserRole === normalizedRole;
    });
  }

  /**
   * Check if user has specific authority
   */
  hasAuthority(authority: string): boolean {
    const user = this.getUserInfo();
    return user?.authorities?.includes(authority) || false;
  }

  /**
   * Remove token and user data
   */
  removeToken(): void {
    this.clearAuthData();
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.userInfoSubject.next(null);
  }

  /**
   * Check if token exists
   */
  isTokenExists(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isTokenExists() && !this.isTokenExpired();
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      console.log('⚠️ No token found in localStorage');
      return true;
    }

    try {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.exp) {
        // exp is in seconds, Date.now() is in milliseconds
        const currentTime = Math.floor(Date.now() / 1000);
        const isExpired = decoded.exp < currentTime;

        if (isExpired) {
          console.log('⏰ Token is expired');
          // Don't clear token here - let interceptor handle refresh
          // Only update authentication state
          this.isAuthenticatedSubject.next(false);
        }

        return isExpired;
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
      // Don't clear data on decode error, might be temporary issue
      return true;
    }

    return true;
  }

  /**
   * Check if refresh token is expired
   */
  isRefreshTokenExpired(): boolean {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return true;

    try {
      const decoded = this.decodeToken(refreshToken);
      if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
      }
    } catch (error) {
      console.error('Error checking refresh token expiration:', error);
    }

    return true;
  }

  /**
   * Get token expiration time
   */
  getTokenExpirationTime(): Date | null {
    const { decoded } = this.getToken();
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  }

  /**
   * Get time until token expires (in minutes)
   */
  getTimeUntilExpiration(): number | null {
    const expirationTime = this.getTokenExpirationTime();
    if (expirationTime) {
      const now = new Date();
      const timeDiff = expirationTime.getTime() - now.getTime();
      return Math.floor(timeDiff / (1000 * 60)); // Convert to minutes
    }
    return null;
  }

  /**
   * Check token validity and update authentication state
   */
  private checkTokenValidity(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return;
    }

    const isValid = !this.isTokenExpired();
    this.isAuthenticatedSubject.next(isValid);

    // Don't clear data here - let interceptor handle expired tokens
    // Only update state
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
  }
}
