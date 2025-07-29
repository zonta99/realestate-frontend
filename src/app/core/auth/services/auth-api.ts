// src/app/core/auth/services/auth-api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  User,
  Permission,
  AuthTokens,
  RefreshTokenResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/auth`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }

  // UPDATED: Now uses Authorization header (matches backend expectation)
  refreshToken(accessToken: string): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(
      `${this.apiUrl}/refresh`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    ).pipe(
      map(response => ({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: new Date(response.expiresAt)
      }))
    );
  }

  // UPDATED: Changed from /profile to /user (matches new backend)
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`);
  }

  // NEW: Get user permissions from backend
  getUserPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissions`);
  }

  // NEW: Get subordinates from backend
  getSubordinates(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/subordinates`);
  }

  // Keep your existing profile management methods
  updateProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, user);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }
}
