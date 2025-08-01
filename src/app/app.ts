// src/app/app.ts - Updated with Material theming
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthFacadeService } from './core/auth/services/auth-facade';
import { LoadingComponent } from './shared/components/loading/loading';
import {Navbar} from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, CommonModule, LoadingComponent, Navbar],
  template: `
    <div class="app-container">
      @if (isLoading()) {
        <app-loading
          type="spinner"
          size="medium"
          message="Loading application..."
          [fullscreen]="true">
        </app-loading>
      } @else {
        <app-navbar />
        <main class="main-content">
        <router-outlet />
        </main>
      }
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: var(--mat-sys-background);
      color: var(--mat-sys-on-background);
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* Ensure proper theming for the entire app */
    :host {
      display: block;
      min-height: 100vh;
    }

    /* Global scrollbar theming using M3 colors */
    :host ::ng-deep {
      /* Webkit scrollbars */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: var(--mat-sys-surface-variant);
      }

      ::-webkit-scrollbar-thumb {
        background: var(--mat-sys-outline);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: var(--mat-sys-outline-variant);
      }

      /* Focus outlines using M3 colors */
      *:focus-visible {
        outline: 2px solid var(--mat-sys-primary);
        outline-offset: 2px;
        border-radius: var(--app-border-radius);
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: more) {
      .app-container {
        border: 1px solid var(--mat-sys-outline);
      }
    }

    /* Print styles */
    @media print {
      .app-container {
        background: white !important;
        color: black !important;
      }
    }
  `]
})
export class App implements OnInit {
  private authFacade = inject(AuthFacadeService);

  // Check if app is loading (during auth check)
  isLoading = this.authFacade.isLoading;

  ngOnInit(): void {
    // Check for stored authentication on app start
    this.authFacade.checkStoredAuth();

    // Initialize theme
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Apply initial theme based on stored preference or system
    const storedTheme = localStorage.getItem('app-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (storedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    // If no preference or 'auto', let CSS handle it with media queries
  }
}
