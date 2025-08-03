// src/app/shared/components/not-found/not-found.ts - Refactored with Material UI theming
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
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
            <div class="error-number">404</div>
            <div class="error-icon-container">
              <mat-icon class="error-icon">search_off</mat-icon>
            </div>
            <h1>Page Not Found</h1>
            <p class="error-message">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>

            <div class="error-actions">
              <button mat-raised-button color="primary" routerLink="/dashboard"
                      class="primary-action">
                <mat-icon>home</mat-icon>
                Go to Dashboard
              </button>
              <button mat-outlined-button routerLink="/properties" class="secondary-action">
                <mat-icon>home_work</mat-icon>
                Browse Properties
              </button>
              <button mat-outlined-button routerLink="/customers" class="secondary-action">
                <mat-icon>people</mat-icon>
                View Customers
              </button>
            </div>

            <div class="help-section">
              <p class="help-text">Need help? Try these popular sections:</p>
              <div class="quick-links">
                <a mat-button routerLink="/profile" class="quick-link">
                  <mat-icon>person</mat-icon>
                  Profile
                </a>
                <a mat-button routerLink="/properties" class="quick-link">
                  <mat-icon>home</mat-icon>
                  Properties
                </a>
                <a mat-button routerLink="/customers" class="quick-link">
                  <mat-icon>group</mat-icon>
                  Customers
                </a>
              </div>
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
      background: var(--app-gradient-bg);
    }

    .error-card {
      max-width: 600px;
      width: 100%;
      text-align: center;
      background-color: var(--mat-sys-surface-container);
      border: 1px solid var(--mat-sys-outline-variant);
      box-shadow: var(--mat-sys-level-3);
    }

    .error-content {
      padding: var(--app-spacing-lg);
    }

    .error-number {
      font-family: var(--mat-sys-typescale-display-large-font-family-name);
      font-size: 120px;
      font-weight: 900;
      color: var(--mat-sys-primary);
      line-height: 1;
      margin-bottom: var(--app-spacing-md);
      text-shadow: 0 4px 8px var(--mat-sys-shadow);
    }

    .error-icon-container {
      margin-bottom: var(--app-spacing-md);
    }

    .error-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
      color: var(--mat-sys-on-surface-variant);
    }

    h1 {
      margin: 0 0 var(--app-spacing-md) 0;
      font-family: var(--mat-sys-typescale-headline-medium-font-family-name);
      font-size: var(--mat-sys-typescale-headline-medium-font-size);
      font-weight: var(--mat-sys-typescale-headline-medium-font-weight);
      color: var(--mat-sys-on-surface);
    }

    .error-message {
      margin: 0 0 var(--app-spacing-xl) 0;
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;
      font-family: var(--mat-sys-typescale-body-large-font-family-name);
      font-size: var(--mat-sys-typescale-body-large-font-size);
      max-width: 480px;
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
      margin: 0 0 var(--app-spacing-md) 0;
      color: var(--mat-sys-on-surface-variant);
      font-family: var(--mat-sys-typescale-body-medium-font-family-name);
      font-size: var(--mat-sys-typescale-body-medium-font-size);
    }

    .quick-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--app-spacing-sm);
    }

    .quick-link {
      display: flex;
      align-items: center;
      gap: var(--app-spacing-xs);
      font-family: var(--mat-sys-typescale-label-medium-font-family-name);
      font-size: var(--mat-sys-typescale-label-medium-font-size);
      color: var(--mat-sys-primary);
      border-radius: var(--app-border-radius);
    }

    .quick-link:hover {
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }

    /* Responsive Design */
    @media (min-width: 480px) {
      .error-actions {
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
      }

      .primary-action,
      .secondary-action {
        min-width: auto;
        flex: 0 1 auto;
      }
    }

    @media (max-width: 480px) {
      .error-container {
        padding: var(--app-spacing-md);
      }

      .error-number {
        font-size: 80px;
      }

      .error-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }

      h1 {
        font-size: var(--mat-sys-typescale-headline-small-font-size);
      }

      .error-content {
        padding: var(--app-spacing-md);
      }

      .primary-action {
        min-width: 100%;
      }

      .secondary-action {
        min-width: 100%;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .error-card {
        border-width: 2px;
      }
    }
  `]
})
export class NotFound {}
