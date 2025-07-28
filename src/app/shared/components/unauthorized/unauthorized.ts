// src/app/shared/components/unauthorized/unauthorized.ts
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
      <mat-card class="error-card">
        <mat-card-content>
          <div class="error-content">
            <mat-icon class="error-icon">block</mat-icon>
            <h1>Access Denied</h1>
            <h2>403 - Unauthorized</h2>
            <p class="error-message">
              You don't have permission to access this resource.
              Please contact your administrator if you believe this is an error.
            </p>
            <div class="error-actions">
              <button mat-raised-button color="primary" routerLink="/dashboard">
                <mat-icon>home</mat-icon>
                Go to Dashboard
              </button>
              <button mat-button routerLink="/profile">
                <mat-icon>person</mat-icon>
                View Profile
              </button>
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
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .error-card {
      max-width: 500px;
      width: 100%;
      text-align: center;
    }

    .error-content {
      padding: 20px;
    }

    .error-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #f44336;
      margin-bottom: 16px;
    }

    h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 400;
      color: #333;
    }

    h2 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 300;
      color: #666;
    }

    .error-message {
      margin: 0 0 24px 0;
      color: #666;
      line-height: 1.5;
    }

    .error-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }

    .error-actions button {
      min-width: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    @media (min-width: 480px) {
      .error-actions {
        flex-direction: row;
        justify-content: center;
      }

      .error-actions button {
        min-width: auto;
      }
    }
  `]
})
export class Unauthorized {
}
