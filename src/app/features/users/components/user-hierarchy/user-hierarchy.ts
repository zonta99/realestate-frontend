// src/app/features/users/components/user-hierarchy/user-hierarchy.ts
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserFacadeService } from '../../services/user-facade.service';
import { Role } from '../../../../core/auth/models/user.model';

@Component({
  selector: 'app-user-hierarchy',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatExpansionModule
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h1>Team Hierarchy</h1>
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back to List
        </button>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Loading organizational structure...</p>
        </div>
      }

      <!-- Hierarchy View -->
      @if (!loading()) {
        <div class="hierarchy-content">
        <mat-card class="info-card">
          <mat-card-content>
            <p class="info-text">
              <mat-icon>info</mat-icon>
              View your organization structure by role. Click on any user to see their details.
            </p>
          </mat-card-content>
        </mat-card>

        <!-- Role Groups -->
        <mat-accordion multi>
          <!-- Admins -->
          <mat-expansion-panel [expanded]="true">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon class="role-icon admin-icon">admin_panel_settings</mat-icon>
                Administrators ({{ getUsersByRole(Role.ADMIN).length }})
              </mat-panel-title>
            </mat-expansion-panel-header>
            @if (getUsersByRole(Role.ADMIN).length > 0) {
              <mat-list>
                @for (user of getUsersByRole(Role.ADMIN); track user.id) {
                  <mat-list-item (click)="viewUser(user.id)" class="clickable-item">
                    <mat-icon matListItemIcon>person</mat-icon>
                    <div matListItemTitle>{{ user.firstName }} {{ user.lastName }}</div>
                    <div matListItemLine>{{ user.email }} • {{ user.username }}</div>
                  </mat-list-item>
                }
              </mat-list>
            } @else {
              <div class="empty-role">
                No administrators found
              </div>
            }
          </mat-expansion-panel>

          <!-- Brokers -->
          <mat-expansion-panel [expanded]="true">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon class="role-icon broker-icon">business_center</mat-icon>
                Brokers ({{ getUsersByRole(Role.BROKER).length }})
              </mat-panel-title>
            </mat-expansion-panel-header>
            @if (getUsersByRole(Role.BROKER).length > 0) {
              <mat-list>
                @for (user of getUsersByRole(Role.BROKER); track user.id) {
                  <mat-list-item (click)="viewUser(user.id)" class="clickable-item">
                    <mat-icon matListItemIcon>person</mat-icon>
                    <div matListItemTitle>{{ user.firstName }} {{ user.lastName }}</div>
                    <div matListItemLine>{{ user.email }} • {{ user.username }}</div>
                  </mat-list-item>
                }
              </mat-list>
            } @else {
              <div class="empty-role">
                No brokers found
              </div>
            }
          </mat-expansion-panel>

          <!-- Agents -->
          <mat-expansion-panel [expanded]="true">
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon class="role-icon agent-icon">real_estate_agent</mat-icon>
                Agents ({{ getUsersByRole(Role.AGENT).length }})
              </mat-panel-title>
            </mat-expansion-panel-header>
            @if (getUsersByRole(Role.AGENT).length > 0) {
              <mat-list>
                @for (user of getUsersByRole(Role.AGENT); track user.id) {
                  <mat-list-item (click)="viewUser(user.id)" class="clickable-item">
                    <mat-icon matListItemIcon>person</mat-icon>
                    <div matListItemTitle>{{ user.firstName }} {{ user.lastName }}</div>
                    <div matListItemLine>{{ user.email }} • {{ user.username }}</div>
                  </mat-list-item>
                }
              </mat-list>
            } @else {
              <div class="empty-role">
                No agents found
              </div>
            }
          </mat-expansion-panel>

          <!-- Assistants -->
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon class="role-icon assistant-icon">support_agent</mat-icon>
                Assistants ({{ getUsersByRole(Role.ASSISTANT).length }})
              </mat-panel-title>
            </mat-expansion-panel-header>
            @if (getUsersByRole(Role.ASSISTANT).length > 0) {
              <mat-list>
                @for (user of getUsersByRole(Role.ASSISTANT); track user.id) {
                  <mat-list-item (click)="viewUser(user.id)" class="clickable-item">
                    <mat-icon matListItemIcon>person</mat-icon>
                    <div matListItemTitle>{{ user.firstName }} {{ user.lastName }}</div>
                    <div matListItemLine>{{ user.email }} • {{ user.username }}</div>
                  </mat-list-item>
                }
              </mat-list>
            } @else {
              <div class="empty-role">
                No assistants found
              </div>
            }
          </mat-expansion-panel>
        </mat-accordion>

        <!-- Total Count -->
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon>groups</mat-icon>
              <div>
                <h3>Total Team Members</h3>
                <p class="count">{{ users().length }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1000px; margin: 0 auto; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h1 { margin: 0; font-size: 28px; font-weight: 500; }

    .page-header button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
    }

    .hierarchy-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-card {
      background-color: #e3f2fd;
    }

    .info-text {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #1565c0;
    }

    .info-text mat-icon {
      color: #1976d2;
    }

    mat-expansion-panel {
      margin-bottom: 8px;
    }

    mat-panel-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }

    .role-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .admin-icon { color: #1565c0; }
    .broker-icon { color: #6a1b9a; }
    .agent-icon { color: #2e7d32; }
    .assistant-icon { color: #e65100; }

    .clickable-item {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .clickable-item:hover {
      background-color: #f5f5f5;
    }

    .empty-role {
      padding: 24px;
      text-align: center;
      color: #999;
      font-style: italic;
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .summary-content {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 8px;
    }

    .summary-content mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      opacity: 0.9;
    }

    .summary-content h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 400;
      opacity: 0.9;
    }

    .count {
      margin: 0;
      font-size: 36px;
      font-weight: 700;
    }
  `]
})
export class UserHierarchy implements OnInit {
  private userFacade = inject(UserFacadeService);
  private router = inject(Router);

  users = this.userFacade.users;
  loading = this.userFacade.loading;

  // Expose Role enum
  Role = Role;

  ngOnInit(): void {
    this.userFacade.loadUsers({ page: 0, size: 1000 }); // Load all users for hierarchy view
  }

  getUsersByRole(role: Role) {
    return this.users().filter(user => user.role === role);
  }

  viewUser(id: number): void {
    this.router.navigate(['/users/view', id]);
  }

  goBack(): void {
    this.router.navigate(['/users/list']);
  }
}

export { UserHierarchy as UserHierarchyComponent };
