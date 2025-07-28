// src/app/core/auth/services/auth-facade.service.ts
import { Injectable, inject, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthError,
  selectAuthLoadingStates,
  selectUserCapabilities,
  selectUserDisplayInfo,
  selectIsTokenExpired
} from '../store';
import { LoginRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {
  private store = inject(Store);

  // Selectors as signals (for use in components)
  readonly currentUser = this.store.selectSignal(selectCurrentUser);
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  readonly authError = this.store.selectSignal(selectAuthError);
  readonly loadingStates = this.store.selectSignal(selectAuthLoadingStates);
  readonly userCapabilities = this.store.selectSignal(selectUserCapabilities);
  readonly userDisplayInfo = this.store.selectSignal(selectUserDisplayInfo);
  readonly isTokenExpired = this.store.selectSignal(selectIsTokenExpired);

  // Computed values
  readonly isLoading = computed(() => this.loadingStates().isAnyLoading);
  readonly canManageUsers = computed(() => this.userCapabilities().canManageUsers);
  readonly canCreateProperties = computed(() => this.userCapabilities().canCreateProperties);
  readonly hasSubordinates = computed(() => this.userCapabilities().hasSubordinates);

  // Observable versions for guards and other services that need them
  readonly isAuthenticated$ = this.store.select(selectIsAuthenticated);
  readonly authError$ = this.store.select(selectAuthError);

  // Actions
  login(credentials: LoginRequest): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  checkStoredAuth(): void {
    this.store.dispatch(AuthActions.checkStoredAuth());
  }

  refreshToken(): void {
    this.store.dispatch(AuthActions.refreshToken());
  }

  loadUserProfile(): void {
    this.store.dispatch(AuthActions.loadUserProfile());
  }

  clearAuthError(): void {
    this.store.dispatch(AuthActions.clearAuthError());
  }

  updateLastActivity(): void {
    this.store.dispatch(AuthActions.updateLastActivity());
  }

  dismissSessionWarning(): void {
    this.store.dispatch(AuthActions.sessionWarningDismissed());
  }
}
