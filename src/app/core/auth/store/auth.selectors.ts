// src/app/core/auth/store/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, Role } from '../models';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Basic selectors
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.currentUser
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectAuthTokens = createSelector(
  selectAuthState,
  (state) => state.tokens
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

// Loading state selectors
export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

export const selectIsLoggingIn = createSelector(
  selectAuthState,
  (state) => state.isLoggingIn
);

export const selectIsLoggingOut = createSelector(
  selectAuthState,
  (state) => state.isLoggingOut
);

export const selectIsRefreshingToken = createSelector(
  selectAuthState,
  (state) => state.isRefreshingToken
);

// User info selectors
export const selectUserFullName = createSelector(
  selectCurrentUser,
  (user) => user ? `${user.firstName} ${user.lastName}` : ''
);

export const selectUserRoles = createSelector(
  selectCurrentUser,
  (user) => user?.roles || []
);

export const selectUserInitials = createSelector(
  selectCurrentUser,
  (user) => user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : ''
);

// Permission selectors
export const selectUserPermissions = createSelector(
  selectAuthState,
  (state) => state.permissions
);

export const selectSubordinates = createSelector(
  selectAuthState,
  (state) => state.subordinates
);

// Role-based permission selectors
export const selectCanManageUsers = createSelector(
  selectAuthState,
  (state) => state.canManageUsers
);

export const selectCanCreateProperties = createSelector(
  selectAuthState,
  (state) => state.canCreateProperties
);

export const selectCanViewAllProperties = createSelector(
  selectAuthState,
  (state) => state.canViewAllProperties
);

export const selectCanManageCustomers = createSelector(
  selectAuthState,
  (state) => state.canManageCustomers
);

// Advanced role checks
export const selectIsAdmin = createSelector(
  selectUserRoles,
  (roles) => roles.includes(Role.ADMIN)
);

export const selectIsBroker = createSelector(
  selectUserRoles,
  (roles) => roles.includes(Role.BROKER)
);

export const selectIsAgent = createSelector(
  selectUserRoles,
  (roles) => roles.includes(Role.AGENT)
);

export const selectIsAssistant = createSelector(
  selectUserRoles,
  (roles) => roles.includes(Role.ASSISTANT)
);

export const selectIsSupervisor = createSelector(
  selectUserRoles,
  (roles) => roles.includes(Role.ADMIN) || roles.includes(Role.BROKER)
);

// Session management selectors
export const selectLastActivity = createSelector(
  selectAuthState,
  (state) => state.lastActivity
);

export const selectSessionWarningShown = createSelector(
  selectAuthState,
  (state) => state.sessionWarningShown
);

export const selectIsTokenExpired = createSelector(
  selectAuthTokens,
  (tokens) => {
    if (!tokens?.expiresAt) return true;
    return new Date() >= tokens.expiresAt;
  }
);

export const selectIsTokenExpiringSoon = createSelector(
  selectAuthTokens,
  (tokens) => {
    if (!tokens?.expiresAt) return false;
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return fiveMinutesFromNow >= tokens.expiresAt;
  }
);

// Complex computed selectors
export const selectUserDisplayInfo = createSelector(
  selectCurrentUser,
  selectUserFullName,
  selectUserInitials,
  selectUserRoles,
  (user, fullName, initials, roles) => ({
    user,
    fullName,
    initials,
    email: user?.email || '',
    roles: roles,
  })
);

export const selectAuthLoadingStates = createSelector(
  selectIsLoading,
  selectIsLoggingIn,
  selectIsLoggingOut,
  selectIsRefreshingToken,
  (isLoading, isLoggingIn, isLoggingOut, isRefreshingToken) => ({
    isLoading,
    isLoggingIn,
    isLoggingOut,
    isRefreshingToken,
    isAnyLoading: isLoading || isLoggingIn || isLoggingOut || isRefreshingToken,
  })
);

export const selectUserCapabilities = createSelector(
  selectCanManageUsers,
  selectCanCreateProperties,
  selectCanViewAllProperties,
  selectCanManageCustomers,
  selectSubordinates,
  (canManageUsers, canCreateProperties, canViewAllProperties, canManageCustomers, subordinates) => ({
    canManageUsers,
    canCreateProperties,
    canViewAllProperties,
    canManageCustomers,
    hasSubordinates: subordinates.length > 0,
    subordinateCount: subordinates.length,
  })
);
