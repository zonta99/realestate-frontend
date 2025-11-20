// src/app/features/users/components/user-detail/user-detail.ts
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { UserFacadeService } from '../../services/user-facade.service';
import { Role, UserStatus } from '../../../../core/auth/models';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h1>User Details</h1>
        <div class="header-actions">
          <button mat-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back to List
          </button>
          @if (selectedUser()) {
            <button mat-raised-button color="primary" (click)="editUser()">
              <mat-icon>edit</mat-icon>
              Edit User
            </button>
          }
        </div>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Loading user details...</p>
        </div>
      }

      <!-- User Details -->
      @if (!loading() && selectedUser()) {
        <div class="content-grid">
        <!-- Basic Info Card -->
        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar>account_circle</mat-icon>
            <mat-card-title>Basic Information</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>person</mat-icon>
                <div matListItemTitle>Username</div>
                <div matListItemLine>{{ selectedUser()?.username }}</div>
              </mat-list-item>
              <mat-divider></mat-divider>
              <mat-list-item>
                <mat-icon matListItemIcon>email</mat-icon>
                <div matListItemTitle>Email</div>
                <div matListItemLine>{{ selectedUser()?.email }}</div>
              </mat-list-item>
              <mat-divider></mat-divider>
              <mat-list-item>
                <mat-icon matListItemIcon>badge</mat-icon>
                <div matListItemTitle>Full Name</div>
                <div matListItemLine>{{ selectedUser()?.firstName }} {{ selectedUser()?.lastName }}</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- Role & Status Card -->
        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar>admin_panel_settings</mat-icon>
            <mat-card-title>Role & Status</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-row">
              <span class="label">Role:</span>
              <mat-chip [class]="getRoleClass(selectedUser()?.role!)">
                {{ getRoleLabel(selectedUser()?.role!) }}
              </mat-chip>
            </div>
            <div class="info-row">
              <span class="label">Status:</span>
              <mat-chip [class]="getStatusClass(selectedUser()?.status!)">
                <mat-icon>{{ getStatusIcon(selectedUser()?.status!) }}</mat-icon>
                {{ selectedUser()?.status }}
              </mat-chip>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Timestamps Card -->
        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar>schedule</mat-icon>
            <mat-card-title>Account Timeline</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>add_circle</mat-icon>
                <div matListItemTitle>Created</div>
                <div matListItemLine>{{ selectedUser()?.createdDate | date: 'medium' }}</div>
              </mat-list-item>
              <mat-divider></mat-divider>
              <mat-list-item>
                <mat-icon matListItemIcon>update</mat-icon>
                <div matListItemTitle>Last Updated</div>
                <div matListItemLine>{{ selectedUser()?.updatedDate | date: 'medium' }}</div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <!-- Subordinates Card -->
        <mat-card class="full-width">
          <mat-card-header>
            <mat-icon mat-card-avatar>groups</mat-icon>
            <mat-card-title>Subordinates ({{ subordinates().length }})</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (subordinates().length > 0) {
              <mat-list>
                @for (sub of subordinates(); track sub.id) {
                  <mat-list-item>
                    <mat-icon matListItemIcon>person</mat-icon>
                    <div matListItemTitle>{{ sub.firstName }} {{ sub.lastName }}</div>
                    <div matListItemLine>{{ sub.email }} • {{ getRoleLabel(sub.role) }}</div>
                  </mat-list-item>
                }
              </mat-list>
            } @else {
              <div class="empty-message">
                <mat-icon>people_outline</mat-icon>
                <p>This user has no subordinates</p>
              </div>
            }
          </mat-card-content>
        </mat-card>
        </div>
      }

      <!-- Error State -->
      @if (error()) {
        <mat-card class="error-card">
        <mat-card-content>
          <div class="error-content">
            <mat-icon color="warn">error</mat-icon>
            <div>
              <h3>Error Loading User</h3>
              <p>{{ error()?.message || 'An unexpected error occurred' }}</p>
              <button mat-raised-button (click)="goBack()">Back to List</button>
            </div>
          </div>
        </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1200px; margin: 0 auto; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h1 { margin: 0; font-size: 28px; font-weight: 500; }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .header-actions button {
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

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
    }

    .info-row:not(:last-child) {
      border-bottom: 1px solid #e0e0e0;
    }

    .label {
      font-weight: 500;
      color: #666;
    }

    mat-chip {
      font-size: 12px;
      min-height: 24px;
      padding: 4px 8px;
    }

    .role-admin { background-color: #e3f2fd !important; color: #1565c0; }
    .role-broker { background-color: #f3e5f5 !important; color: #6a1b9a; }
    .role-agent { background-color: #e8f5e9 !important; color: #2e7d32; }
    .role-assistant { background-color: #fff3e0 !important; color: #e65100; }

    .status-active { background-color: #e8f5e9 !important; color: #2e7d32; }
    .status-inactive { background-color: #ffebee !important; color: #c62828; }

    .status-active mat-icon, .status-inactive mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    .empty-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px;
      text-align: center;
      color: #999;
    }

    .empty-message mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
    }

    .error-card {
      background-color: #ffebee;
    }

    .error-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .error-content mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .error-content h3 {
      margin: 0 0 8px 0;
    }

    .error-content p {
      margin: 0 0 16px 0;
    }
  `]
})
export class UserDetail implements OnInit {
  private userFacade = inject(UserFacadeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  selectedUser = this.userFacade.selectedUser;
  subordinates = this.userFacade.subordinates;
  loading = this.userFacade.loading;
  error = this.userFacade.error;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.userFacade.loadUser(id);
        this.userFacade.loadUserSubordinates(id);
      }
    });
  }

  editUser(): void {
    const user = this.selectedUser();
    if (user) {
      this.router.navigate(['/users/edit', user.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/users/list']);
  }

  getRoleLabel(role: Role): string {
    return role?.replace('ROLE_', '') || '';
  }

  getRoleClass(role: Role): string {
    const roleMap: Record<Role, string> = {
      [Role.ADMIN]: 'role-admin',
      [Role.BROKER]: 'role-broker',
      [Role.AGENT]: 'role-agent',
      [Role.ASSISTANT]: 'role-assistant'
    };
    return roleMap[role] || '';
  }

  getStatusClass(status: UserStatus): string {
    return status === UserStatus.ACTIVE ? 'status-active' : 'status-inactive';
  }

  getStatusIcon(status: UserStatus): string {
    return status === UserStatus.ACTIVE ? 'check_circle' : 'cancel';
  }
}

export { UserDetail as UserDetailComponent };
