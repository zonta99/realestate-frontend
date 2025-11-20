// src/app/features/users/models/user-api.model.ts
import { Role, UserStatus } from '../../../core/auth/models/user.model';

// API Request DTOs
export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  role: Role;
  status: UserStatus;
}

export interface HierarchyRequest {
  supervisorId: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// API Response DTOs
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  createdDate: string;
  updatedDate: string;
}

export interface UserPageResponse {
  content: UserResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface UserListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}
