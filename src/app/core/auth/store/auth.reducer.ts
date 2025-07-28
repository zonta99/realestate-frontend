// src/app/core/auth/store/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { initialAuthState, Role } from '../models';
import { AuthActions } from './auth.actions';



export const authReducer = createReducer(
  initialAuthState,

  // Login Flow
  on(AuthActions.login, (state) => ({
    ...state,
    isLoggingIn: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    currentUser: response.user,
    isAuthenticated: true,
    tokens: {
      accessToken: response.token,
      expiresAt: new Date(Date.now() + response.expiresIn * 1000),
    },
    isLoggingIn: false,
    error: null,
    lastActivity: new Date(),
    ...calculateRolePermissions(response.user.roles),
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoggingIn: false,
    error,
    isAuthenticated: false,
    currentUser: null,
    tokens: null,
  })),

  // Logout Flow
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoggingOut: true,
    error: null,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialAuthState,
  })),

  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...initialAuthState,
    error,
  })),

  // Auto Login
  on(AuthActions.checkStoredAuth, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.autoLoginSuccess, (state, { user, tokens }) => ({
    ...state,
    currentUser: user,
    isAuthenticated: true,
    tokens,
    isLoading: false,
    lastActivity: new Date(),
    ...calculateRolePermissions(user.roles),
  })),

  on(AuthActions.autoLoginFailure, (state) => ({
    ...state,
    isLoading: false,
    isAuthenticated: false,
  })),

  // Token Management
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isRefreshingToken: true,
  })),

  on(AuthActions.refreshTokenSuccess, (state, { tokens }) => ({
    ...state,
    tokens,
    isRefreshingToken: false,
    lastActivity: new Date(),
  })),

  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...initialAuthState,
    error,
  })),

  // User Profile
  on(AuthActions.loadUserProfile, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.loadUserProfileSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    isLoading: false,
    ...calculateRolePermissions(user.roles),
  })),

  on(AuthActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Permissions & Hierarchy
  on(AuthActions.loadPermissionsSuccess, (state, { permissions }) => ({
    ...state,
    permissions,
  })),

  on(AuthActions.loadSubordinatesSuccess, (state, { subordinates }) => ({
    ...state,
    subordinates,
  })),

  // Session Management
  on(AuthActions.updateLastActivity, (state) => ({
    ...state,
    lastActivity: new Date(),
    sessionWarningShown: false,
  })),

  on(AuthActions.sessionWarningShown, (state) => ({
    ...state,
    sessionWarningShown: true,
  })),

  on(AuthActions.sessionWarningDismissed, (state) => ({
    ...state,
    sessionWarningShown: false,
  })),

  on(AuthActions.sessionExpired, () => ({
    ...initialAuthState,
    error: 'Your session has expired. Please log in again.',
  })),

  // Error Handling
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null,
  })),

  on(AuthActions.setAuthError, (state, { error }) => ({
    ...state,
    error,
  })),

  // Reset State
  on(AuthActions.resetAuthState, () => initialAuthState),
);

// Helper function to calculate role-based permissions
function calculateRolePermissions(roles: Role[]) {
  if (!roles || roles.length === 0) {
    return {
      canManageUsers: false,
      canCreateProperties: false,
      canViewAllProperties: false,
      canManageCustomers: false,
    };
  }

  // Start with no permissions and combine permissions from all roles
  let permissions = {
    canManageUsers: false,
    canCreateProperties: false,
    canViewAllProperties: false,
    canManageCustomers: false,
  };

  roles.forEach(role => {
    const rolePermissions = getSingleRolePermissions(role);
    permissions.canManageUsers = permissions.canManageUsers || rolePermissions.canManageUsers;
    permissions.canCreateProperties = permissions.canCreateProperties || rolePermissions.canCreateProperties;
    permissions.canViewAllProperties = permissions.canViewAllProperties || rolePermissions.canViewAllProperties;
    permissions.canManageCustomers = permissions.canManageCustomers || rolePermissions.canManageCustomers;
  });

  return permissions;
}

// Helper function to get permissions for a single role
function getSingleRolePermissions(role: Role) {
  switch (role) {
    case Role.ADMIN:
      return {
        canManageUsers: true,
        canCreateProperties: true,
        canViewAllProperties: true,
        canManageCustomers: true,
      };
    case Role.BROKER:
      return {
        canManageUsers: true,
        canCreateProperties: true,
        canViewAllProperties: true,
        canManageCustomers: true,
      };
    case Role.AGENT:
      return {
        canManageUsers: false,
        canCreateProperties: true,
        canViewAllProperties: false,
        canManageCustomers: true,
      };
    case Role.ASSISTANT:
      return {
        canManageUsers: false,
        canCreateProperties: false,
        canViewAllProperties: false,
        canManageCustomers: false,
      };
    default:
      return {
        canManageUsers: false,
        canCreateProperties: false,
        canViewAllProperties: false,
        canManageCustomers: false,
      };
  }
}
