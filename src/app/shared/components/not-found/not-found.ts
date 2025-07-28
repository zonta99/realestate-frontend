// src/app/shared/components/not-found/not-found.ts
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
      <mat-card class="error-card">
        <mat-card-content>
          <div class="error-content">
            <div class="error-number">404</div>
            <mat-icon class="error-icon">search_off</mat-icon>
            <h1>Page Not Found</h1>
            <p class="error-message">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
            <div class="error-actions">
              <button mat-raised-button color="primary" routerLink="/dashboard">
                <mat-icon>home</mat-icon>
                Go to Dashboard
              </button>
              <button mat-button routerLink="/properties">
                <mat-icon>home_work</mat-icon>
                Browse Properties
              </button>
              <button mat-button routerLink="/customers">
                <mat-icon>people</mat-icon>
                View Customers
              </button>
            </div>

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
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .error-card {
      max-width: 600px;
      width: 100%;
      text-align: center;
    }

    .error-content {
      padding: 20px;
    }

    .error-number {
      font-size: 120px;
      font-weight: 900;
      color: #667eea;
      line-height: 1;
      margin-bottom: 16px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }

    .error-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
      color: #666;
      margin-bottom: 16px;
    }

    h1 {
      margin: 0 0 16px 0;
      font-size: 28px;
      font-weight: 400;
      color: #333;
    }

    .error-message {
      margin: 0 0 32px 0;
      color: #666;
      line-height: 1.5;
      font-size: 16px;
    }

    .error-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
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

    .help-section {
      border-top: 1px solid #e0e0e0;
      padding-top: 24px;
      margin-top: 24px;
    }

    .help-text {
      margin: 0 0 16px 0;
      color: #666;
      font-size: 14px;
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
      gap: 4px;
      font-size: 14px;
    }

    @media (min-width: 480px) {
      .error-actions {
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
      }

      .error-actions button {
        min-width: auto;
        flex: 0 1 auto;
      }
    }

    @media (max-width: 480px) {
      .error-number {
        font-size: 80px;
      }

      .error-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }

      h1 {
        font-size: 24px;
      }

      .error-content {
        padding: 16px;
      }
    }
  `]
})
export class NotFound {
}
