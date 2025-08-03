
// ================================================================
// UNAUTHORIZED COMPONENT
// ================================================================

// src/app/shared/components/unauthorized/unauthorized.ts - Refactored with Material UI theming
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="error-container">
      <mat-card class="error-card" appearance="outlined">
        <mat-card-content>
          <div class="error-content">
            <div class="error-icon-container">
              <mat-icon class="error-icon">block</mat-icon>
            </div>
            <h1>Access Denied</h1>
            <div class="error-code">403 - Unauthorized</div>
            <p class="error-message">
              You don't have permission to access this resource.
              Please contact your administrator if you believe this is an error.
            </p>

            <div class="error-actions">
              <button mat-raised-button color="primary" routerLink="/dashboard"
                      class="primary-action">
                <mat-icon>home</mat-icon>
                Go to Dashboard
              </button>
              <button mat-outlined-button routerLink="/profile" class="secondary-action">
                <mat-icon>person</mat-icon>
                View Profile
              </button>
            </div>

            <div class="help-section">
              <p class="help-text">
                <mat-icon class="help-icon">info</mat-icon>
                If you need access to this resource, please contact your system administrator.
              </p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: var(--app-spacing-lg);
      background: linear-gradient(135deg,
      var(--mat-sys-surface-container) 0%,
      var(--mat-sys-surface-container-high) 100%);
    }

    .error-card {
      max-width: 500px;
      width: 100%;
      text-align: center;
      background-color: var(--mat-sys-surface-container);
      border: 1px solid var(--mat-sys-outline-variant);
      box-shadow: var(--mat-sys-level-3);
    }

    .error-content {
      padding: var(--app-spacing-xl);
    }

    .error-icon-container {
      margin-bottom: var(--app-spacing-lg);
    }

    .error-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: var(--mat-sys-error);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    h1 {
      margin: 0 0 var(--app-spacing-sm) 0;
      font-family: var(--mat-sys-typescale-headline-medium-font-family-name);
      font-size: var(--mat-sys-typescale-headline-medium-font-size);
      font-weight: var(--mat-sys-typescale-headline-medium-font-weight);
      color: var(--mat-sys-on-surface);
    }

    .error-code {
      margin: 0 0 var(--app-spacing-md) 0;
      font-family: var(--mat-sys-typescale-title-medium-font-family-name);
      font-size: var(--mat-sys-typescale-title-medium-font-size);
      font-weight: var(--mat-sys-typescale-title-medium-font-weight);
      color: var(--mat-sys-error);
      background-color: var(--mat-sys-error-container);
      padding: var(--app-spacing-xs) var(--app-spacing-md);
      border-radius: var(--app-border-radius);
      display: inline-block;
    }

    .error-message {
      margin: 0 0 var(--app-spacing-xl) 0;
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;
      font-family: var(--mat-sys-typescale-body-large-font-family-name);
      font-size: var(--mat-sys-typescale-body-large-font-size);
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .error-actions {
      display: flex;
      flex-direction: column;
      gap: var(--app-spacing-md);
      align-items: center;
      margin-bottom: var(--app-spacing-xl);
    }

    .primary-action {
      min-width: 200px;
      height: 48px;
      border-radius: var(--app-border-radius);
    }

    .secondary-action {
      min-width: 180px;
      height: 40px;
      border-radius: var(--app-border-radius);
      border-color: var(--mat-sys-outline);
      color: var(--mat-sys-on-surface);
    }

    .secondary-action:hover {
      background-color: var(--mat-sys-surface-container-high);
      border-color: var(--mat-sys-primary);
    }

    .primary-action,
    .secondary-action {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--app-spacing-sm);
      font-family: var(--mat-sys-typescale-label-large-font-family-name);
    }

    .help-section {
      border-top: 1px solid var(--mat-sys-outline-variant);
      padding-top: var(--app-spacing-lg);
      margin-top: var(--app-spacing-lg);
    }

    .help-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--app-spacing-sm);
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font-family: var(--mat-sys-typescale-body-medium-font-family-name);
      font-size: var(--mat-sys-typescale-body-medium-font-size);
      background-color: var(--mat-sys-surface-variant);
      padding: var(--app-spacing-md);
      border-radius: var(--app-border-radius);
    }

    .help-icon {
      color: var(--mat-sys-primary);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Responsive Design */
    @media (min-width: 480px) {
      .error-actions {
        flex-direction: row;
        justify-content: center;
      }

      .primary-action,
      .secondary-action {
        min-width: auto;
      }
    }

    @media (max-width: 480px) {
      .error-container {
        padding: var(--app-spacing-md);
      }

      .error-content {
        padding: var(--app-spacing-lg);
      }

      .error-icon {
        font-size: 60px;
        width: 60px;
        height: 60px;
      }

      h1 {
        font-size: var(--mat-sys-typescale-headline-small-font-size);
      }

      .primary-action,
      .secondary-action {
        min-width: 100%;
      }

      .help-text {
        flex-direction: column;
        text-align: center;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .error-card {
        border-width: 2px;
      }

      .error-code {
        border: 2px solid var(--mat-sys-error);
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .error-icon {
        animation: none;
      }
    }
  `]
})
export class Unauthorized {}
