// src/app/core/auth/models/auth.model.ts
import {User} from './user.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number; // seconds
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
}

export interface Permission {
  resource: string;
  actions: string[];
}
