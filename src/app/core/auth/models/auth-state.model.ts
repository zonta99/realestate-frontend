// src/app/core/auth/models/auth-state.model.ts
import { User } from './user.model';
import { AuthTokens, Permission } from './auth.model';

export interface AuthState {
  // User session
  currentUser: User | null;
  isAuthenticated: boolean;
  tokens: AuthTokens | null;

  // Loading states
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isRefreshingToken: boolean;

  // Error handling
  error: string | null;

  // Permissions & hierarchy
  permissions: Permission[];
  subordinates: User[];

  // Role-based capability flags
  canManageUsers: boolean;
  canCreateProperties: boolean;
  canViewAllProperties: boolean;
  canManageCustomers: boolean;

  // Session management
  lastActivity: Date | null;
  sessionWarningShown: boolean;
}

export const initialAuthState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  tokens: null,
  isLoading: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isRefreshingToken: false,
  error: null,
  permissions: [],
  subordinates: [],
  canManageUsers: false,
  canCreateProperties: false,
  canViewAllProperties: false,
  canManageCustomers: false,
  lastActivity: null,
  sessionWarningShown: false,
};
