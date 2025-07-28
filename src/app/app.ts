import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthFacadeService } from './core/auth/services/auth-facade';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-container">
      @if (isLoading()) {
        <div class="app-loading">
          <div class="loading-spinner"></div>
          <p>Loading application...</p>
        </div>
      } @else {
        <router-outlet />
      }
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #fafafa;
    }

    .app-loading {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      gap: 16px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e0e0e0;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .app-loading p {
      color: #666;
      margin: 0;
      font-size: 16px;
    }
  `]
})
export class AppComponent implements OnInit {
  private authFacade = inject(AuthFacadeService);

  // Check if app is loading (during auth check)
  isLoading = this.authFacade.isLoading;

  ngOnInit(): void {
    // Check for stored authentication on app start
    this.authFacade.checkStoredAuth();
  }
}
