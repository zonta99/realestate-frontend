// src/app/shared/components/not-found/not-found.ts - Refactored with Material Design 3 tokens
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-not-found',
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
            <div class="error-number">404</div>
            <mat-icon class="error-icon">search_off</mat-icon>
            <h1 class="error-title">Page Not Found</h1>
            <p class="error-message">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </div>

          <div class="error-actions">
            <button mat-stroked-button color="primary" routerLink="/dashboard">
              <mat-icon>home</mat-icon>
              Go to Dashboard
            </button>
            <button mat-stroked-button routerLink="/properties">
              <mat-icon>home_work</mat-icon>
              Browse Properties
            </button>
            <button mat-stroked-button routerLink="/customers">
              <mat-icon>people</mat-icon>
              View Customers
            </button>
          </div>

          <mat-divider></mat-divider>

          <div class="help-section">
            <p class="help-text">Need help? Try these popular sections:</p>
            <div class="quick-links">
              <a mat-button routerLink="/profile">
                <mat-icon>person</mat-icon>
                Profile
              </a>
              <a mat-button routerLink="/properties">
                <mat-icon>home</mat-icon>
                Properties
              </a>
              <a mat-button routerLink="/customers">
                <mat-icon>group</mat-icon>
                Customers
              </a>
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
      max-width: 600px;
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

    .error-number {
      font: var(--mat-sys-typescale-display-large);
      color: var(--mat-sys-primary);
      line-height: 1;
      margin-bottom: 16px;
      font-weight: 900;
    }

    .error-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 16px;
    }

    .error-title {
      margin: 0 0 16px 0;
      font: var(--mat-sys-typescale-headline-medium);
      color: var(--mat-sys-on-surface);
      font-weight: 500;
    }

    .error-message {
      margin: 0 0 32px 0;
      font: var(--mat-sys-typescale-body-large);
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;
      max-width: 480px;
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

    .help-text {
      margin: 0 0 16px 0;
      font: var(--mat-sys-typescale-body-medium);
      color: var(--mat-sys-on-surface-variant);
    }

    .quick-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }

    .quick-links a {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--mat-sys-primary);
    }

    .quick-links a:hover {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }

    /* Responsive Design - following Material Design 3 breakpoints */
    @media (min-width: 600px) {
      .error-actions {
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
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

      .error-number {
        font-size: 80px;
      }

      .error-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }

      .error-title {
        font: var(--mat-sys-typescale-headline-small);
      }

      .error-actions button {
        min-width: 100%;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .error-card {
        border-width: 2px;
      }

      .error-number {
        font-weight: 900;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class NotFound {}
