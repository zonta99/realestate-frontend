// src/app/features/users/services/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  UserResponse,
  UserPageResponse,
  CreateUserRequest,
  UpdateUserRequest,
  HierarchyRequest,
  ChangePasswordRequest,
  UserListParams,
  ApiResponse
} from '../models/user-api.model';
import { Role, UserStatus } from '../../../core/auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/users`;

  /**
   * Get all users with pagination
   * Brokers see subordinates, admins see all
   */
  getUsers(params?: UserListParams): Observable<UserPageResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
    }

    return this.http.get<UserPageResponse>(this.baseUrl, { params: httpParams });
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new user (ADMIN only)
   */
  createUser(user: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.baseUrl, user);
  }

  /**
   * Update user (ADMIN or BROKER for subordinates)
   */
  updateUser(id: number, user: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/${id}`, user);
  }

  /**
   * Delete user (ADMIN only)
   */
  deleteUser(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: Role): Observable<UserResponse[]> {
    const params = new HttpParams().set('role', role);
    return this.http.get<UserResponse[]>(`${this.baseUrl}/search`, { params });
  }

  /**
   * Get user's subordinates
   */
  getUserSubordinates(userId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.baseUrl}/${userId}/subordinates`);
  }

  /**
   * Add supervisor relationship
   */
  addSupervisor(userId: number, supervisorId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/${userId}/supervisors/${supervisorId}`, null);
  }

  /**
   * Remove supervisor relationship
   */
  removeSupervisor(userId: number, supervisorId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${userId}/supervisors/${supervisorId}`);
  }

  /**
   * Change user password
   */
  changePassword(userId: number, request: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.baseUrl}/${userId}/password`, request);
  }

  /**
   * Update user status
   */
  updateUserStatus(userId: number, status: UserStatus): Observable<ApiResponse> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<ApiResponse>(`${this.baseUrl}/${userId}/status`, null, { params });
  }
}
