// src/app/app.ts - Refactored with proper structure
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { AuthFacadeService } from './core/auth/services/auth-facade';
import { LoadingComponent } from './shared/components';
import { Navbar } from './shared/components';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, CommonModule, LayoutModule, LoadingComponent, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private authFacade = inject(AuthFacadeService);

  // Check if the app is loading (during auth check)
  isLoading = this.authFacade.isLoading;
  // Check if the user is authenticated
  isAuthenticated = this.authFacade.isAuthenticated;

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
  }
}
