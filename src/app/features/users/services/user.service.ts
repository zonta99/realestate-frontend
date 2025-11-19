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
  UserListParams,
  ApiResponse
} from '../models/user-api.model';
import { Role } from '../../../core/auth/models/user.model';

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
    return this.http.get<UserResponse[]>(`${this.baseUrl}/roles/${role}`);
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
    const request: HierarchyRequest = { supervisorId };
    return this.http.post<ApiResponse>(`${this.baseUrl}/${userId}/hierarchy`, request);
  }

  /**
   * Remove supervisor relationship
   */
  removeSupervisor(userId: number, supervisorId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${userId}/hierarchy/${supervisorId}`);
  }
}
