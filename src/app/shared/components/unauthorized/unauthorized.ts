// src/app/shared/components/unauthorized/unauthorized.ts - Refactored with Material Design 3 tokens
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-unauthorized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <div class="error-container">
      <mat-card class="error-card" appearance="outlined">
        <mat-card-content class="error-content">
          <div class="error-header">
            <mat-icon class="error-icon">block</mat-icon>
            <h1 class="error-title">Access Denied</h1>
            <div class="error-code">403 - Unauthorized</div>
            <p class="error-message">
              You don't have permission to access this resource.
              Please contact your administrator if you believe this is an error.
            </p>
          </div>

          <div class="error-actions">
            <button mat-raised-button color="primary" routerLink="/dashboard">
              <mat-icon>home</mat-icon>
              Go to Dashboard
            </button>
            <button mat-stroked-button routerLink="/profile">
              <mat-icon>person</mat-icon>
              View Profile
            </button>
          </div>

          <mat-divider></mat-divider>

          <div class="help-section">
            <div class="help-content">
              <mat-icon class="help-icon">info</mat-icon>
              <p class="help-text">
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
      padding: 24px;
      background: var(--mat-sys-surface-container-lowest);
    }

    .error-card {
      max-width: 500px;
      width: 100%;
      text-align: center;
      background: var(--mat-sys-surface-container);
      border-color: var(--mat-sys-outline-variant);
    }

    .error-content {
      padding: 32px 24px;
    }

    .error-header {
      margin-bottom: 32px;
    }

    .error-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: var(--mat-sys-error);
      margin-bottom: 16px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .error-title {
      margin: 0 0 8px 0;
      font: var(--mat-sys-typescale-headline-medium);
      color: var(--mat-sys-on-surface);
      font-weight: 500;
    }

    .error-code {
      margin: 0 0 16px 0;
      font: var(--mat-sys-typescale-title-medium);
      color: var(--mat-sys-on-error-container);
      background: var(--mat-sys-error-container);
      padding: 8px 16px;
      border-radius: 16px;
      display: inline-block;
      font-weight: 500;
    }

    .error-message {
      margin: 0 0 32px 0;
      font: var(--mat-sys-typescale-body-large);
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .error-actions {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      margin-bottom: 32px;
    }

    .error-actions button {
      min-width: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    mat-divider {
      margin: 24px 0;
    }

    .help-section {
      padding-top: 24px;
    }

    .help-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--mat-sys-surface-variant);
      padding: 16px;
      border-radius: 12px;
      text-align: left;
    }

    .help-icon {
      color: var(--mat-sys-primary);
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .help-text {
      margin: 0;
      font: var(--mat-sys-typescale-body-medium);
      color: var(--mat-sys-on-surface-variant);
    }

    /* Responsive Design - following Material Design 3 breakpoints */
    @media (min-width: 600px) {
      .error-actions {
        flex-direction: row;
        justify-content: center;
      }

      .error-actions button {
        min-width: auto;
        flex: 0 1 auto;
      }

      .error-container {
        padding: 32px;
      }

      .error-content {
        padding: 40px 32px;
      }
    }

    @media (max-width: 599px) {
      .error-container {
        padding: 16px;
      }

      .error-content {
        padding: 24px 16px;
      }

      .error-icon {
        font-size: 60px;
        width: 60px;
        height: 60px;
      }

      .error-title {
        font: var(--mat-sys-typescale-headline-small);
      }

      .error-actions button {
        min-width: 100%;
      }

      .help-content {
        flex-direction: column;
        text-align: center;
        align-items: center;
        gap: 8px;
      }

      .help-icon {
        margin-top: 0;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .error-card {
        border-width: 2px;
      }

      .error-code {
        border: 2px solid var(--mat-sys-error);
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .error-icon {
        animation: none;
      }
    }
  `]
})
export class Unauthorized {}
