// src/app/features/dashboard/dashboard.ts - Refactored with Material theming
import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AuthFacadeService } from '../../core/auth/services/auth-facade';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Welcome back, {{ userDisplayInfo().fullName }}!</h1>
          <p class="subtitle">Here's what's happening in your real estate business</p>
        </div>
        <div class="header-actions">
          <mat-chip-set class="role-chips">
            <mat-chip [class]="getRoleChipClass()">
              <mat-icon>{{ getRoleIcon() }}</mat-icon>
              {{ getPrimaryRole() }}
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <!-- Quick Stats Grid -->
      <div class="stats-grid">
        <mat-card class="stat-card properties-card" appearance="outlined">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon-container properties">
                <mat-icon class="stat-icon">home</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-number">24</span>
                <span class="stat-label">Active Properties</span>
                <div class="stat-trend positive">
                  <mat-icon>trending_up</mat-icon>
                  <span>+12%</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card customers-card" appearance="outlined">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon-container customers">
                <mat-icon class="stat-icon">people</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-number">12</span>
                <span class="stat-label">Active Customers</span>
                <div class="stat-trend positive">
                  <mat-icon>trending_up</mat-icon>
                  <span>+8%</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card deals-card" appearance="outlined">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon-container deals">
                <mat-icon class="stat-icon">handshake</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-number">8</span>
                <span class="stat-label">Pending Deals</span>
                <div class="stat-trend neutral">
                  <mat-icon>trending_flat</mat-icon>
                  <span>0%</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card revenue-card" appearance="outlined">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon-container revenue">
                <mat-icon class="stat-icon">attach_money</mat-icon>
              </div>
              <div class="stat-details">
                <span class="stat-number">$2.4M</span>
                <span class="stat-label">Monthly Revenue</span>
                <div class="stat-trend positive">
                  <mat-icon>trending_up</mat-icon>
                  <span>+24%</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          @if (canCreateProperties()) {
            <mat-card class="action-card" routerLink="/properties/new" appearance="outlined">
              <mat-card-content>
                <mat-icon>add_home</mat-icon>
                <h3>Add Property</h3>
                <p>List a new property</p>
              </mat-card-content>
            </mat-card>
          }

          @if (canManageCustomers()) {
            <mat-card class="action-card" routerLink="/customers/new" appearance="outlined">
              <mat-card-content>
                <mat-icon>person_add</mat-icon>
                <h3>Add Customer</h3>
                <p>Create new lead</p>
              </mat-card-content>
            </mat-card>
          }

          <mat-card class="action-card" routerLink="/properties" appearance="outlined">
            <mat-card-content>
              <mat-icon>search</mat-icon>
              <h3>Browse Properties</h3>
              <p>View all listings</p>
            </mat-card-content>
          </mat-card>

          @if (canManageUsers()) {
            <mat-card class="action-card" routerLink="/users" appearance="outlined">
              <mat-card-content>
                <mat-icon>group</mat-icon>
                <h3>Manage Team</h3>
                <p>View team members</p>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <mat-card appearance="outlined">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
            <mat-card-subtitle>Your latest updates</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon-container">
                  <mat-icon>home</mat-icon>
                </div>
                <div class="activity-details">
                  <p><strong>New property added:</strong> 123 Main Street</p>
                  <span class="activity-time">2 hours ago</span>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon-container">
                  <mat-icon>person</mat-icon>
                </div>
                <div class="activity-details">
                  <p><strong>Customer inquiry:</strong> John Doe interested in downtown condo</p>
                  <span class="activity-time">4 hours ago</span>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon-container">
                  <mat-icon>handshake</mat-icon>
                </div>
                <div class="activity-details">
                  <p><strong>Deal closed:</strong> 456 Oak Avenue - $650,000</p>
                  <span class="activity-time">1 day ago</span>
                </div>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">View All Activity</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: var(--app-spacing-lg);
      max-width: 1200px;
      margin: 0 auto;
      background-color: var(--mat-sys-background);
      min-height: 100vh;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--app-spacing-xl);
      padding: var(--app-spacing-lg);
      border-radius: var(--app-border-radius);
      background: var(--app-gradient-bg);
      color: var(--mat-sys-on-primary);
    }

    .header-content h1 {
      margin: 0 0 var(--app-spacing-sm) 0;
      font-family: var(--mat-sys-typescale-headline-medium-font-family-name);
      font-size: var(--mat-sys-typescale-headline-medium-font-size);
      line-height: var(--mat-sys-typescale-headline-medium-line-height);
      font-weight: var(--mat-sys-typescale-headline-medium-font-weight);
      color: inherit;
    }

    .subtitle {
      margin: 0;
      font-family: var(--mat-sys-typescale-body-large-font-family-name);
      font-size: var(--mat-sys-typescale-body-large-font-size);
      line-height: var(--mat-sys-typescale-body-large-line-height);
      color: var(--mat-sys-on-primary-container);
      opacity: 0.8;
    }

    .role-chips {
      justify-content: flex-end;
    }

    .role-chips mat-chip {
      background-color: rgba(255, 255, 255, 0.2);
      color: var(--mat-sys-on-primary);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .role-chips mat-chip.admin {
      background-color: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
    }

    .role-chips mat-chip.broker {
      background-color: var(--mat-sys-tertiary-container);
      color: var(--mat-sys-on-tertiary-container);
    }

    .role-chips mat-chip.agent {
      background-color: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--app-spacing-md);
      margin-bottom: var(--app-spacing-xl);
    }

    .stat-card {
      transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      cursor: pointer;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--mat-sys-elevation-2);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: var(--app-spacing-md);
    }

    .stat-icon-container {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .stat-icon-container.properties {
      background-color: var(--mat-sys-primary-container);
    }

    .stat-icon-container.customers {
      background-color: var(--mat-sys-secondary-container);
    }

    .stat-icon-container.deals {
      background-color: var(--mat-sys-tertiary-container);
    }

    .stat-icon-container.revenue {
      background-color: var(--mat-sys-error-container);
    }

    .stat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .stat-icon-container.properties .stat-icon {
      color: var(--mat-sys-on-primary-container);
    }

    .stat-icon-container.customers .stat-icon {
      color: var(--mat-sys-on-secondary-container);
    }

    .stat-icon-container.deals .stat-icon {
      color: var(--mat-sys-on-tertiary-container);
    }

    .stat-icon-container.revenue .stat-icon {
      color: var(--mat-sys-on-error-container);
    }

    .stat-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--app-spacing-xs);
    }

    .stat-number {
      font: var(--mat-sys-headline-small);
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .stat-label {
      font: var(--mat-sys-body-medium);
      color: var(--mat-sys-on-surface-variant);
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: var(--app-spacing-xs);
      font: var(--mat-sys-label-small);
      font-weight: 500;
    }

    .stat-trend.positive {
      color: var(--mat-sys-tertiary);
    }

    .stat-trend.neutral {
      color: var(--mat-sys-on-surface-variant);
    }

    .stat-trend mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .quick-actions {
      margin-bottom: var(--app-spacing-xl);
    }

    .quick-actions h2 {
      margin: 0 0 var(--app-spacing-md) 0;
      font: var(--mat-sys-headline-small);
      color: var(--mat-sys-on-background);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--app-spacing-md);
    }

    .action-card {
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      text-align: center;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--mat-sys-elevation-2);
      background-color: var(--mat-sys-surface-container-high);
    }

    .action-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--mat-sys-primary);
      margin-bottom: var(--app-spacing-sm);
    }

    .action-card h3 {
      margin: 0 0 var(--app-spacing-xs) 0;
      font: var(--mat-sys-title-medium);
      color: var(--mat-sys-on-surface);
    }

    .action-card p {
      margin: 0;
      font: var(--mat-sys-body-medium);
      color: var(--mat-sys-on-surface-variant);
    }

    .recent-activity {
      margin-bottom: var(--app-spacing-xl);
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: var(--app-spacing-md);
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: var(--app-spacing-md);
      padding: var(--app-spacing-md);
      border-radius: var(--app-border-radius);
      background-color: var(--mat-sys-surface-container);
      border: 1px solid var(--mat-sys-outline-variant);
      transition: background-color 0.2s ease;
    }

    .activity-item:hover {
      background-color: var(--mat-sys-surface-container-high);
    }

    .activity-icon-container {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--mat-sys-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-icon-container mat-icon {
      color: var(--mat-sys-on-primary-container);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .activity-details {
      flex: 1;
    }

    .activity-details p {
      margin: 0 0 var(--app-spacing-xs) 0;
      font: var(--mat-sys-body-medium);
      color: var(--mat-sys-on-surface);
    }

    .activity-time {
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: var(--app-spacing-md);
      }

      .dashboard-header {
        flex-direction: column;
        gap: var(--app-spacing-md);
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      .dashboard-header h1 {
        font-family: var(--mat-sys-typescale-headline-small-font-family-name);
        font-size: var(--mat-sys-typescale-headline-small-font-size);
        line-height: var(--mat-sys-typescale-headline-small-line-height);
        font-weight: var(--mat-sys-typescale-headline-small-font-weight);
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .stat-card,
      .action-card,
      .activity-item {
        border-width: 2px;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .stat-card,
      .action-card,
      .activity-item {
        transition: none;
      }
    }
  `]
})
export class Dashboard {
  private authFacade = inject(AuthFacadeService);

  // Auth state
  userDisplayInfo = this.authFacade.userDisplayInfo;
  canCreateProperties = this.authFacade.canCreateProperties;
  canManageCustomers = computed(() => this.authFacade.userCapabilities().canManageCustomers);
  canManageUsers = this.authFacade.canManageUsers;

  // Role information
  isAdmin = this.authFacade.isAdmin;
  isBroker = this.authFacade.isBroker;
  isAgent = this.authFacade.isAgent;
  isAssistant = this.authFacade.isAssistant;

  getRoleChipClass(): string {
    if (this.isAdmin()) return 'admin';
    if (this.isBroker()) return 'broker';
    if (this.isAgent()) return 'agent';
    return 'assistant';
  }

  getRoleIcon(): string {
    if (this.isAdmin()) return 'admin_panel_settings';
    if (this.isBroker()) return 'business';
    if (this.isAgent()) return 'person';
    return 'support_agent';
  }

  getPrimaryRole(): string {
    if (this.isAdmin()) return 'Administrator';
    if (this.isBroker()) return 'Broker';
    if (this.isAgent()) return 'Agent';
    return 'Assistant';
  }
}
