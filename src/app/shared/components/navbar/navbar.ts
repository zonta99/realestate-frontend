// src/app/shared/components/navbar/navbar.ts
import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';

import { AuthFacadeService } from '../../../core/auth/services/auth-facade';
import { NavigationService } from '../../../core/navigation/navigation.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatListModule,
    MatRippleModule,
  ],
  template: `
    <!-- Mobile Bottom Navigation -->
    @if (isMobile()) {
      <!-- Top Bar for Mobile -->
      <mat-toolbar class="mobile-top-bar">
        <div class="brand-section">
          <mat-icon class="brand-icon">home</mat-icon>
          <span class="brand-text">CRM</span>
        </div>

        <div class="spacer"></div>

        <button mat-icon-button [matBadge]="3" matBadgeColor="accent" class="notification-btn">
          <mat-icon>notifications</mat-icon>
        </button>

        <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-btn">
          <div class="user-avatar mobile">{{ userDisplayInfo().initials }}</div>
        </button>
      </mat-toolbar>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        @for (item of visibleNavItems(); track item.id) {
          <button
            mat-button
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="bottom-nav-item"
            matRipple
          >
            <mat-icon [matBadge]="item.badge" [matBadgeHidden]="!item.badge" matBadgeSize="small">
              {{ item.icon }}
            </mat-icon>
            <span class="nav-label">{{ item.label }}</span>
          </button>
        }
      </nav>
    }

    <!-- Desktop Navigation -->
    @if (!isMobile()) {
      <mat-toolbar class="desktop-toolbar">
        <div class="brand-section" routerLink="/dashboard">
          <mat-icon class="brand-icon">home</mat-icon>
          <span class="brand-text">Real Estate CRM</span>
        </div>

        <nav class="desktop-nav">
          @for (item of visibleNavItems(); track item.id) {
            <button
              mat-button
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              class="nav-button"
            >
              <mat-icon [matBadge]="item.badge" [matBadgeHidden]="!item.badge">
                {{ item.icon }}
              </mat-icon>
              <span>{{ item.label }}</span>
            </button>
          }
        </nav>

        <div class="spacer"></div>

        <button mat-icon-button [matBadge]="3" matBadgeColor="accent">
          <mat-icon>notifications</mat-icon>
        </button>

        <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
          <div class="user-avatar">{{ userDisplayInfo().initials }}</div>
          <div class="user-info">
            <span class="user-name">{{ userDisplayInfo().fullName }}</span>
            <span class="user-role">{{ getPrimaryRole() }}</span>
          </div>
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
      </mat-toolbar>
    }

    <!-- User Menu (Shared) -->
    <mat-menu #userMenu="matMenu" class="user-menu">
      <div class="user-menu-header">
        <div class="user-avatar large">{{ userDisplayInfo().initials }}</div>
        <div class="user-details">
          <div class="user-name">{{ userDisplayInfo().fullName }}</div>
          <div class="user-email">{{ userDisplayInfo().email }}</div>
          <span class="role-badge">{{ getPrimaryRole() }}</span>
        </div>
      </div>

      <mat-divider></mat-divider>

      <button mat-menu-item routerLink="/profile">
        <mat-icon>person</mat-icon>
        <span>Profile</span>
      </button>

      @if (hasSubordinates()) {
        <button mat-menu-item routerLink="/users/hierarchy">
          <mat-icon>account_tree</mat-icon>
          <span>My Team</span>
        </button>
      }

      <button mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>

      <mat-divider></mat-divider>

      <button mat-menu-item (click)="logout()" class="logout-button">
        <mat-icon>logout</mat-icon>
        <span>Sign Out</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    /* Mobile Styles */
    .mobile-top-bar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      height: 56px;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .brand-icon {
      font-size: 24px;
      color: white;
    }

    .brand-text {
      font-size: 18px;
      font-weight: 500;
      color: white;
    }

    .spacer {
      flex: 1;
    }

    .notification-btn,
    .user-btn {
      color: white;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 14px;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .user-avatar.mobile {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }

    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-around;
      padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
      z-index: 1000;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
    }

    .bottom-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      border-radius: 12px;
      color: #666;
      min-height: 56px;
      flex: 1;
      max-width: 80px;
      transition: all 0.2s ease;
    }

    .bottom-nav-item:hover {
      background-color: rgba(102, 126, 234, 0.08);
      color: #667eea;
    }

    .bottom-nav-item.active {
      color: #667eea;
      background-color: rgba(102, 126, 234, 0.12);
    }

    .bottom-nav-item mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .nav-label {
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 100%;
    }

    /* Desktop Styles */
    .desktop-toolbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 32px;
    }

    .nav-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      color: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .nav-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-button.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .user-menu-button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 12px;
      color: white;
      border-radius: 8px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .user-role {
      font-size: 12px;
      opacity: 0.8;
    }

    /* User Menu Styles */
    .user-menu {
      min-width: 280px;
    }

    .user-menu-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background-color: #f8f9fa;
    }

    .user-avatar.large {
      width: 48px;
      height: 48px;
      font-size: 18px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
    }

    .user-details {
      flex: 1;
    }

    .user-details .user-name {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .user-email {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .role-badge {
      background-color: #667eea;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .logout-button {
      color: #f44336;
    }

    /* Responsive breakpoints */
    @media (max-width: 767px) {
      /* Add bottom padding to prevent content hiding behind bottom nav */
      :host {
        padding-bottom: 80px;
      }
    }

    @media (max-width: 480px) {
      .bottom-nav-item {
        padding: 6px 8px;
        max-width: 70px;
      }

      .nav-label {
        font-size: 11px;
      }

      .bottom-nav-item mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }
    }

    /* Touch improvements */
    .bottom-nav-item {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    /* Badge positioning for mobile */
    .bottom-nav-item .mat-badge-content {
      top: 6px;
      right: 8px;
    }
  `]
})
export class Navbar {
  private authFacade = inject(AuthFacadeService);
  private navService = inject(NavigationService);
  private breakpointObserver = inject(BreakpointObserver);

  // Auth state
  userDisplayInfo = this.authFacade.userDisplayInfo;
  hasSubordinates = this.authFacade.hasSubordinates;
  isAdmin = this.authFacade.isAdmin;
  isBroker = this.authFacade.isBroker;
  isAgent = this.authFacade.isAgent;

  // Navigation
  visibleNavItems = this.navService.visibleNavItems;

  // Responsive
  isMobile = computed(() =>
    this.breakpointObserver.isMatched([Breakpoints.XSmall, Breakpoints.Small])
  );

  getPrimaryRole(): string {
    if (this.isAdmin()) return 'Admin';
    if (this.isBroker()) return 'Broker';
    if (this.isAgent()) return 'Agent';
    return 'Assistant';
  }

  logout(): void {
    this.authFacade.logout();
  }
}
