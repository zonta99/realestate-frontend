// src/app/features/users/components/user-list/user-list.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Team Management</h1>
        <button mat-raised-button color="primary">
          <mat-icon>person_add</mat-icon>
          Add User
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <p>User management will be implemented here...</p>
          <p>This component will show:</p>
          <ul>
            <li>Team hierarchy visualization</li>
            <li>User roles and permissions</li>
            <li>Subordinate management</li>
            <li>User status and activity</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .page-header h1 { margin: 0; }
    button { display: flex; align-items: center; gap: 8px; }
  `]
})
export class UserList {}
export { UserList as UserListComponent };
