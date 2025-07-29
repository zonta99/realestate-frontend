// src/app/core/auth/store/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, Role, UserHelper } from '../models';

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

// UPDATED: User info selectors - now use UserHelper
export const selectUserFullName = createSelector(
  selectCurrentUser,
  (user) => user ? UserHelper.getFullName(user) : ''
);

export const selectUserRoles = createSelector(
  selectCurrentUser,
  (user) => user?.roles || []
);

export const selectUserInitials = createSelector(
  selectCurrentUser,
  (user) => user ? UserHelper.getInitials(user) : ''
);

// NEW: Get display roles (without ROLE_ prefix)
export const selectUserDisplayRoles = createSelector(
  selectCurrentUser,
  (user) => user ? UserHelper.getDisplayRoles(user) : []
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

// UPDATED: Advanced role checks - now use UserHelper
export const selectIsAdmin = createSelector(
  selectCurrentUser,
  (user) => user ? UserHelper.isAdmin(user) : false
);

export const selectIsBroker = createSelector(
  selectCurrentUser,
  (user) => user ? UserHelper.isBroker(user) : false
);

export const selectIsAgent = createSelector(
  selectCurrentUser,
  (user) => user ? UserHelper.isAgent(user) : false
);

export const selectIsAssistant = createSelector(
  selectCurrentUser,
  (user) => user ? UserHelper.isAssistant(user) : false
);

export const selectIsSupervisor = createSelector(
  selectCurrentUser,
  (user) => user ? UserHelper.isSupervisor(user) : false
);

// NEW: User status selector
export const selectIsUserActive = createSelector(
  selectCurrentUser,
  (user) => user ? UserHelper.isActive(user) : false
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

// UPDATED: Complex computed selectors
export const selectUserDisplayInfo = createSelector(
  selectCurrentUser,
  selectUserFullName,
  selectUserInitials,
  selectUserDisplayRoles,
  (user, fullName, initials, displayRoles) => ({
    user,
    fullName,
    initials,
    email: user?.email || '',
    roles: user?.roles || [],
    displayRoles,
    isActive: user ? UserHelper.isActive(user) : false,
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
  selectUserPermissions,
  (canManageUsers, canCreateProperties, canViewAllProperties, canManageCustomers, subordinates, permissions) => ({
    canManageUsers,
    canCreateProperties,
    canViewAllProperties,
    canManageCustomers,
    hasSubordinates: subordinates.length > 0,
    subordinateCount: subordinates.length,
    permissions: permissions,
    permissionResources: permissions.map(p => p.resource),
  })
);

// NEW: Permission checking helpers
export const selectHasPermission = (resource: string, action: string) =>
  createSelector(
    selectUserPermissions,
    (permissions) => {
      const permission = permissions.find(p => p.resource === resource);
      return permission ? permission.actions.includes(action) : false;
    }
  );

export const selectHasAnyPermission = (resource: string, actions: string[]) =>
  createSelector(
    selectUserPermissions,
    (permissions) => {
      const permission = permissions.find(p => p.resource === resource);
      return permission ? actions.some(action => permission.actions.includes(action)) : false;
    }
  );
