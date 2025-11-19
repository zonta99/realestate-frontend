// src/app/features/users/components/user-list/user-list.ts
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserFacadeService } from '../../services/user-facade.service';
import { Role, UserStatus } from '../../../../core/auth/models/user.model';
import { UserResponse } from '../../models/user-api.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h1>Team Management</h1>
        <div class="header-actions">
          <button mat-stroked-button (click)="viewHierarchy()">
            <mat-icon>account_tree</mat-icon>
            Hierarchy
          </button>
          <button mat-raised-button color="primary" (click)="createUser()">
            <mat-icon>person_add</mat-icon>
            Add User
          </button>
        </div>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Filter by Role</mat-label>
              <mat-select [(value)]="selectedRole" (selectionChange)="onRoleFilter()">
                <mat-option [value]="null">All Roles</mat-option>
                <mat-option [value]="Role.ADMIN">Admin</mat-option>
                <mat-option [value]="Role.BROKER">Broker</mat-option>
                <mat-option [value]="Role.AGENT">Agent</mat-option>
                <mat-option [value]="Role.ASSISTANT">Assistant</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading()" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Loading users...</p>
      </div>

      <!-- Users Table -->
      <mat-card *ngIf="!isLoading()" class="table-card">
        <table mat-table [dataSource]="users()" class="users-table">
          <!-- Username Column -->
          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef>Username</th>
            <td mat-cell *matCellDef="let user">
              <div class="user-cell">
                <mat-icon class="user-icon">account_circle</mat-icon>
                <div>
                  <div class="username">{{ user.username }}</div>
                  <div class="email">{{ user.email }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let user">
              {{ user.firstName }} {{ user.lastName }}
            </td>
          </ng-container>

          <!-- Role Column -->
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let user">
              <mat-chip [class]="getRoleClass(user.role)">
                {{ getRoleLabel(user.role) }}
              </mat-chip>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let user">
              <mat-chip [class]="getStatusClass(user.status)">
                <mat-icon>{{ getStatusIcon(user.status) }}</mat-icon>
                {{ user.status }}
              </mat-chip>
            </td>
          </ng-container>

          <!-- Created Date Column -->
          <ng-container matColumnDef="createdDate">
            <th mat-header-cell *matHeaderCellDef>Created</th>
            <td mat-cell *matCellDef="let user">
              {{ user.createdDate | date: 'short' }}
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="User actions">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="viewUser(user.id)">
                  <mat-icon>visibility</mat-icon>
                  <span>View Details</span>
                </button>
                <button mat-menu-item (click)="editUser(user.id)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="viewSubordinates(user.id)">
                  <mat-icon>groups</mat-icon>
                  <span>Subordinates</span>
                </button>
                <mat-divider></mat-divider>
                <button mat-menu-item (click)="deleteUser(user)" class="delete-action">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="user-row"></tr>
        </table>

        <!-- Empty State -->
        <div *ngIf="users().length === 0" class="empty-state">
          <mat-icon>people_outline</mat-icon>
          <h3>No users found</h3>
          <p>Get started by adding your first user</p>
          <button mat-raised-button color="primary" (click)="createUser()">
            <mat-icon>person_add</mat-icon>
            Add User
          </button>
        </div>

        <!-- Pagination -->
        <mat-paginator
          *ngIf="users().length > 0"
          [length]="pagination().totalElements"
          [pageSize]="pagination().pageSize"
          [pageIndex]="pagination().currentPage"
          [pageSizeOptions]="[10, 20, 50, 100]"
          (page)="onPageChange($event)"
          aria-label="Select page">
        </mat-paginator>
      </mat-card>

      <!-- Error State -->
      <mat-card *ngIf="error()" class="error-card">
        <mat-card-content>
          <div class="error-content">
            <mat-icon color="warn">error</mat-icon>
            <div>
              <h3>Error Loading Users</h3>
              <p>{{ error()?.message || 'An unexpected error occurred' }}</p>
              <button mat-raised-button (click)="loadUsers()">Retry</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1400px; margin: 0 auto; }

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

    .filters-card {
      margin-bottom: 16px;
    }

    .filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .filters mat-form-field {
      min-width: 200px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
    }

    .table-card {
      overflow: hidden;
    }

    .users-table {
      width: 100%;
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-icon {
      color: #666;
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .username {
      font-weight: 500;
      color: #333;
    }

    .email {
      font-size: 12px;
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

    .user-row:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }

    .delete-action {
      color: #d32f2f;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #bdbdbd;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #666;
    }

    .empty-state p {
      margin: 0 0 24px 0;
      color: #999;
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

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .header-actions {
        justify-content: stretch;
      }

      .header-actions button {
        flex: 1;
      }
    }
  `]
})
export class UserList implements OnInit {
  private userFacade = inject(UserFacadeService);
  private router = inject(Router);

  // Expose Role enum for template
  Role = Role;

  // Signals from facade
  users = this.userFacade.users;
  pagination = this.userFacade.pagination;
  loading = this.userFacade.loading;
  error = this.userFacade.error;
  isLoading = this.userFacade.isLoading;

  // Table configuration
  displayedColumns = ['username', 'name', 'role', 'status', 'createdDate', 'actions'];
  selectedRole: Role | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    if (this.selectedRole) {
      this.userFacade.loadUsersByRole(this.selectedRole);
    } else {
      this.userFacade.loadUsers({
        page: this.pagination().currentPage,
        size: this.pagination().pageSize
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.userFacade.loadUsers({
      page: event.pageIndex,
      size: event.pageSize
    });
  }

  onRoleFilter(): void {
    this.loadUsers();
  }

  createUser(): void {
    this.router.navigate(['/users/new']);
  }

  viewUser(id: number): void {
    this.router.navigate(['/users/view', id]);
  }

  editUser(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  viewHierarchy(): void {
    this.router.navigate(['/users/hierarchy']);
  }

  viewSubordinates(userId: number): void {
    this.userFacade.loadUserSubordinates(userId);
    this.router.navigate(['/users/view', userId]);
  }

  deleteUser(user: UserResponse): void {
    if (confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
      this.userFacade.deleteUser(user.id);
    }
  }

  getRoleLabel(role: Role): string {
    return role.replace('ROLE_', '');
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

export { UserList as UserListComponent };
