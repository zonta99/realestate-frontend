// src/app/features/dashboard/components/dashboard/dashboard.ts
import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {AuthFacadeService} from '../../core/auth/services/auth-facade';



@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header">
        <h1>Welcome back, {{ userDisplayInfo().fullName }}!</h1>
        <p class="subtitle">Here's what's happening in your real estate business</p>
      </div>

      <!-- Quick Stats Grid -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon properties">home</mat-icon>
              <div class="stat-details">
                <h2>24</h2>
                <p>Active Properties</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon customers">people</mat-icon>
              <div class="stat-details">
                <h2>12</h2>
                <p>Active Customers</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon deals">handshake</mat-icon>
              <div class="stat-details">
                <h2>8</h2>
                <p>Pending Deals</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon revenue">attach_money</mat-icon>
              <div class="stat-details">
                <h2>$2.4M</h2>
                <p>Monthly Revenue</p>
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
            <mat-card class="action-card" routerLink="/properties/new">
              <mat-card-content>
                <mat-icon>add_home</mat-icon>
                <h3>Add Property</h3>
                <p>List a new property</p>
              </mat-card-content>
            </mat-card>
          }

          @if (canManageCustomers()) {
            <mat-card class="action-card" routerLink="/customers/new">
              <mat-card-content>
                <mat-icon>person_add</mat-icon>
                <h3>Add Customer</h3>
                <p>Create new lead</p>
              </mat-card-content>
            </mat-card>
          }

          <mat-card class="action-card" routerLink="/properties">
            <mat-card-content>
              <mat-icon>search</mat-icon>
              <h3>Browse Properties</h3>
              <p>View all listings</p>
            </mat-card-content>
          </mat-card>

          @if (canManageUsers()) {
            <mat-card class="action-card" routerLink="/users">
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
        <mat-card>
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
            <mat-card-subtitle>Your latest updates</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item">
                <mat-icon>home</mat-icon>
                <div class="activity-details">
                  <p><strong>New property added:</strong> 123 Main Street</p>
                  <span class="activity-time">2 hours ago</span>
                </div>
              </div>
              <div class="activity-item">
                <mat-icon>person</mat-icon>
                <div class="activity-details">
                  <p><strong>Customer inquiry:</strong> John Doe interested in downtown condo</p>
                  <span class="activity-time">4 hours ago</span>
                </div>
              </div>
              <div class="activity-item">
                <mat-icon>handshake</mat-icon>
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
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 400;
      color: #333;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      transition: transform 0.2s ease-in-out;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.12);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      padding: 12px;
      color: white;
    }

    .stat-icon.properties {
      background-color: #4CAF50;
    }

    .stat-icon.customers {
      background-color: #2196F3;
    }

    .stat-icon.deals {
      background-color: #FF9800;
    }

    .stat-icon.revenue {
      background-color: #9C27B0;
    }

    .stat-details h2 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 500;
    }

    .stat-details p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .quick-actions {
      margin-bottom: 32px;
    }

    .quick-actions h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 500;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-card {
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      text-align: center;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.12);
    }

    .action-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
      margin-bottom: 8px;
    }

    .action-card h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 500;
    }

    .action-card p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .recent-activity {
      margin-bottom: 32px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      background-color: #f5f5f5;
    }

    .activity-item mat-icon {
      color: #667eea;
      margin-top: 2px;
    }

    .activity-details {
      flex: 1;
    }

    .activity-details p {
      margin: 0 0 4px 0;
      font-size: 14px;
    }

    .activity-time {
      font-size: 12px;
      color: #999;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .dashboard-header h1 {
        font-size: 24px;
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
}
