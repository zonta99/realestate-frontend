// src/app/core/auth/store/auth.effects.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, timer } from 'rxjs';
import {
  map,
  exhaustMap,
  catchError,
  tap,
  switchMap,
  filter,
  withLatestFrom,
  mergeMap
} from 'rxjs/operators';

import { AuthActions } from './auth.actions';
import { AuthService } from '../services/auth-api';
import { TokenStorageService } from '../services/token-storage';
import { selectAuthTokens, selectIsTokenExpiringSoon } from './auth.selectors';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private router = inject(Router);
  private authService = inject(AuthService);
  private tokenStorage = inject(TokenStorageService);

  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message || 'Login failed' }))
          )
        )
      )
    )
  );

  // Login Success Effect - Store token and redirect
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ response }) => {
        // Store tokens
        this.tokenStorage.setTokens({
          accessToken: response.token,
          expiresAt: new Date(Date.now() + response.expiresIn * 1000),
        });

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      }),
      mergeMap(() => [
        // Load additional data after successful login
        AuthActions.loadPermissions(),
        AuthActions.loadSubordinates(),
      ])
    )
  );

  // Auto Login Effect - Check stored token on app start
  checkStoredAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkStoredAuth),
      switchMap(() => {
        const storedTokens = this.tokenStorage.getTokens();

        if (!storedTokens || new Date() >= storedTokens.expiresAt) {
          this.tokenStorage.clearTokens();
          return of(AuthActions.autoLoginFailure());
        }

        return this.authService.getCurrentUser().pipe(
          map((user) =>
            AuthActions.autoLoginSuccess({
              user,
              tokens: storedTokens
            })
          ),
          catchError(() => {
            this.tokenStorage.clearTokens();
            return of(AuthActions.autoLoginFailure());
          })
        );
      })
    )
  );

  // Auto Login Success Effect
  autoLoginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLoginSuccess),
      mergeMap(() => [
        AuthActions.loadPermissions(),
        AuthActions.loadSubordinates(),
      ])
    )
  );

  // Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((error) =>
            of(AuthActions.logoutFailure({ error: error.message || 'Logout failed' }))
          )
        )
      )
    )
  );

  // Logout Success Effect - Clear storage and redirect
  logoutSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess, AuthActions.sessionExpired),
        tap(() => {
          this.tokenStorage.clearTokens();
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  // UPDATED: Token Refresh Effect - now uses accessToken parameter
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      withLatestFrom(this.store.select(selectAuthTokens)),
      exhaustMap(([, tokens]) => {
        if (!tokens?.accessToken) {
          return of(AuthActions.refreshTokenFailure({ error: 'No token available' }));
        }

        return this.authService.refreshToken(tokens.accessToken).pipe(
          map((newTokens) => AuthActions.refreshTokenSuccess({ tokens: newTokens })),
          catchError((error) =>
            of(AuthActions.refreshTokenFailure({
              error: error.message || 'Token refresh failed'
            }))
          )
        );
      })
    )
  );

  // Token Refresh Success Effect - Update storage
  refreshTokenSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenSuccess),
        tap(({ tokens }) => {
          this.tokenStorage.setTokens(tokens);
        })
      ),
    { dispatch: false }
  );

  // Auto Token Refresh Effect - Refresh token when expiring soon
  autoRefreshToken$ = createEffect(() =>
    timer(0, 60000).pipe( // Check every minute
      withLatestFrom(
        this.store.select(selectIsTokenExpiringSoon),
        this.store.select(selectAuthTokens)
      ),
      filter(([, isExpiringSoon, tokens]) =>
        isExpiringSoon && !!tokens?.accessToken
      ),
      map(() => AuthActions.refreshToken())
    )
  );

  // Load Permissions Effect
  loadPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadPermissions),
      exhaustMap(() =>
        this.authService.getUserPermissions().pipe(
          map((permissions) =>
            AuthActions.loadPermissionsSuccess({ permissions })
          ),
          catchError((error) =>
            of(AuthActions.loadPermissionsFailure({
              error: error.message || 'Failed to load permissions'
            }))
          )
        )
      )
    )
  );

  // Load Subordinates Effect
  loadSubordinates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadSubordinates),
      exhaustMap(() =>
        this.authService.getSubordinates().pipe(
          map((subordinates) =>
            AuthActions.loadSubordinatesSuccess({ subordinates })
          ),
          catchError((error) =>
            of(AuthActions.loadSubordinatesFailure({
              error: error.message || 'Failed to load subordinates'
            }))
          )
        )
      )
    )
  );

  // Session Activity Tracking Effect
  trackUserActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.loginSuccess,
        AuthActions.autoLoginSuccess,
        AuthActions.refreshTokenSuccess,
        // Add other user actions that should update activity
      ),
      map(() => AuthActions.updateLastActivity())
    )
  );

  // Session Warning Effect - Show warning before session expires
  sessionWarning$ = createEffect(() =>
    timer(0, 30000).pipe( // Check every 30 seconds
      withLatestFrom(this.store.select(selectAuthTokens)),
      filter(([, tokens]) => {
        if (!tokens?.expiresAt) return false;
        const warningTime = new Date(tokens.expiresAt.getTime() - 5 * 60 * 1000); // 5 minutes before expiry
        return new Date() >= warningTime && new Date() < tokens.expiresAt;
      }),
      map(() => AuthActions.sessionWarningShown())
    )
  );

  // Handle Auth Errors Effect - Redirect on auth failure
  handleAuthErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.refreshTokenFailure,
        AuthActions.loadUserProfileFailure
      ),
      filter(({ error }) =>
        error.includes('unauthorized') ||
        error.includes('forbidden') ||
        error.includes('token')
      ),
      map(() => AuthActions.sessionExpired())
    )
  );
}
