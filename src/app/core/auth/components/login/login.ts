// src/app/features/auth/components/login/login.ts
import { Component, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


import { LoginRequest } from '../../models';
import {AuthFacadeService} from '../../services/auth-facade';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>
            <div class="logo-section">
              <mat-icon class="logo-icon">home</mat-icon>
              <span>Real Estate CRM</span>
            </div>
          </mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <!-- Username Field -->
            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input
                matInput
                formControlName="username"
                placeholder="Enter your username"
                autocomplete="username"
              >
              <mat-icon matSuffix>person</mat-icon>
              @if (usernameField()?.invalid && usernameField()?.touched) {
                <mat-error>
                  @if (usernameField()?.errors?.['required']) {
                    Username is required
                  }
                </mat-error>
              }
            </mat-form-field>

            <!-- Password Field -->
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
                placeholder="Enter your password"
                autocomplete="current-password"
              >
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="togglePasswordVisibility()"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hidePassword()"
              >
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (passwordField()?.invalid && passwordField()?.touched) {
                <mat-error>
                  @if (passwordField()?.errors?.['required']) {
                    Password is required
                  }
                  @if (passwordField()?.errors?.['minlength']) {
                    Password must be at least 6 characters
                  }
                </mat-error>
              }
            </mat-form-field>

            <!-- Submit Button -->
            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="login-button"
              [disabled]="loginForm.invalid || isLogging()"
            >
              @if (isLogging()) {
                <mat-spinner diameter="20"></mat-spinner>
                <span>Signing in...</span>
              } @else {
                <span>Sign In</span>
              }
            </button>
          </form>

          <!-- Error Display -->
          @if (authError()) {
            <div class="error-message">
              <mat-icon>error</mat-icon>
              <span>{{ authError() }}</span>
            </div>
          }
        </mat-card-content>

        <mat-card-actions>
          <div class="card-actions">
            <button mat-button color="accent">
              Forgot Password?
            </button>
          </div>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-icon {
      font-size: 28px;
      color: #667eea;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .login-button {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      margin-top: 16px;
      padding: 12px;
      background-color: #ffebee;
      border-radius: 4px;
      border-left: 4px solid #f44336;
    }

    .card-actions {
      display: flex;
      justify-content: center;
      padding-top: 16px;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 24px;
    }

    mat-card-title {
      font-size: 24px;
      font-weight: 500;
    }

    mat-card-subtitle {
      margin-top: 8px;
      color: #666;
    }
  `]
})
export class Login {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacadeService);
  private snackBar = inject(MatSnackBar);
// Signals for reactive state
  hidePassword = signal(true);

  // Auth state from facade
  isLogging = computed(() => this.authFacade.loadingStates().isLoggingIn);
  authError = this.authFacade.authError;
  isAuthenticated = this.authFacade.isAuthenticated;

  // Form setup
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Form field getters as computed signals
  usernameField = computed(() => this.loginForm.get('username'));
  passwordField = computed(() => this.loginForm.get('password'));

  constructor() {
    // Clear any existing auth errors when component loads
    this.authFacade.clearAuthError();

    // React to authentication success using effect
    effect(() => {
      const authenticated = this.isAuthenticated();
      if (authenticated) {
        this.snackBar.open('Welcome back!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }
    });

    // React to auth errors using effect
    effect(() => {
      const error = this.authError();
      if (error) {
        this.snackBar.open(error, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLogging()) {
      const credentials: LoginRequest = {
        username: this.loginForm.value.username.trim(),
        password: this.loginForm.value.password
      };

      this.authFacade.login(credentials);
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }
}

// Export with old naming convention for route compatibility
export { Login as LoginComponent };
