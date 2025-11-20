// src/app/features/users/components/user-form/user-form.ts
import { Component, ChangeDetectionStrategy, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserFacadeService } from '../../services/user-facade.service';
import { Role, UserStatus } from '../../../../core/auth/models';
import { CreateUserRequest, UpdateUserRequest } from '../../models/user-api.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h1>{{ isEditMode ? 'Edit User' : 'Create User' }}</h1>
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back to List
        </button>
      </div>

      <!-- Loading Spinner -->
      @if ((loading() || isLoading()) && isEditMode) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Loading user data...</p>
        </div>
      }

      <!-- Form -->
      @if (!loading() || !isEditMode) {
        <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <!-- Username -->
              <mat-form-field appearance="outline" [class.full-width]="!isEditMode">
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" placeholder="Enter username" [readonly]="isEditMode">
                <mat-icon matPrefix>person</mat-icon>
                @if (!isEditMode) {
                  <mat-hint>Username cannot be changed after creation</mat-hint>
                }
                @if (userForm.get('username')?.hasError('required')) {
                  <mat-error>Username is required</mat-error>
                }
                @if (userForm.get('username')?.hasError('minlength')) {
                  <mat-error>Username must be at least 3 characters</mat-error>
                }
                @if (userForm.get('username')?.hasError('maxlength')) {
                  <mat-error>Username must be at most 20 characters</mat-error>
                }
              </mat-form-field>

              <!-- Password (Create Only) -->
              @if (!isEditMode) {
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Password</mat-label>
                  <input matInput type="password" formControlName="password" placeholder="Enter password">
                  <mat-icon matPrefix>lock</mat-icon>
                  <mat-hint>At least 8 characters</mat-hint>
                  @if (userForm.get('password')?.hasError('required')) {
                    <mat-error>Password is required</mat-error>
                  }
                  @if (userForm.get('password')?.hasError('minlength')) {
                    <mat-error>Password must be at least 8 characters</mat-error>
                  }
                </mat-form-field>
              }

              <!-- Email -->
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="user@example.com">
                <mat-icon matPrefix>email</mat-icon>
                @if (userForm.get('email')?.hasError('required')) {
                  <mat-error>Email is required</mat-error>
                }
                @if (userForm.get('email')?.hasError('email')) {
                  <mat-error>Please enter a valid email</mat-error>
                }
              </mat-form-field>

              <!-- First Name -->
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" placeholder="Enter first name">
                <mat-icon matPrefix>badge</mat-icon>
              </mat-form-field>

              <!-- Last Name -->
              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" placeholder="Enter last name">
                <mat-icon matPrefix>badge</mat-icon>
              </mat-form-field>

              <!-- Role -->
              <mat-form-field appearance="outline">
                <mat-label>Role</mat-label>
                <mat-select formControlName="role">
                  <mat-option [value]="Role.ADMIN">Admin</mat-option>
                  <mat-option [value]="Role.BROKER">Broker</mat-option>
                  <mat-option [value]="Role.AGENT">Agent</mat-option>
                  <mat-option [value]="Role.ASSISTANT">Assistant</mat-option>
                </mat-select>
                <mat-icon matPrefix>admin_panel_settings</mat-icon>
                @if (userForm.get('role')?.hasError('required')) {
                  <mat-error>Role is required</mat-error>
                }
              </mat-form-field>

              <!-- Status (Edit Only) -->
              @if (isEditMode) {
                <mat-form-field appearance="outline">
                  <mat-label>Status</mat-label>
                  <mat-select formControlName="status">
                    <mat-option [value]="UserStatus.ACTIVE">Active</mat-option>
                    <mat-option [value]="UserStatus.INACTIVE">Inactive</mat-option>
                  </mat-select>
                  <mat-icon matPrefix>toggle_on</mat-icon>
                  @if (userForm.get('status')?.hasError('required')) {
                    <mat-error>Status is required</mat-error>
                  }
                </mat-form-field>
              }
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" mat-stroked-button (click)="goBack()" [disabled]="isLoading()">
                Cancel
              </button>
              <button type="submit" mat-raised-button color="primary" [disabled]="userForm.invalid || isLoading()">
                @if (isLoading()) {
                  <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
                }
                @if (!isLoading()) {
                  <span>{{ isEditMode ? 'Update User' : 'Create User' }}</span>
                }
              </button>
            </div>
          </form>

          <!-- Error Display -->
          @if (error()) {
            <div class="error-message">
              <mat-icon>error</mat-icon>
              <span>{{ error()?.message || 'An error occurred' }}</span>
            </div>
          }
        </mat-card-content>
        </mat-card>
      }

      <!-- Help Card -->
      <mat-card class="help-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>info</mat-icon>
          <mat-card-title>Role Permissions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <ul>
            <li><strong>Admin:</strong> Full system access, manages property attributes</li>
            <li><strong>Broker:</strong> Manages agents, views all properties</li>
            <li><strong>Agent:</strong> Manages properties and customers</li>
            <li><strong>Assistant:</strong> Read-only access to assigned resources</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 900px; margin: 0 auto; }

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

    .form-card {
      margin-bottom: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    mat-form-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .form-actions button {
      min-width: 120px;
      position: relative;
    }

    .button-spinner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      margin-top: 16px;
      background-color: #ffebee;
      border-radius: 4px;
      color: #c62828;
    }

    .error-message mat-icon {
      color: #c62828;
    }

    .help-card {
      background-color: #e3f2fd;
    }

    .help-card mat-icon {
      color: #1976d2;
    }

    .help-card ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }

    .help-card li {
      margin-bottom: 8px;
      color: #424242;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  private userFacade = inject(UserFacadeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Expose enums for template
  Role = Role;
  UserStatus = UserStatus;

  // Signals from facade
  selectedUser = this.userFacade.selectedUser;
  creating = this.userFacade.creating;
  updating = this.userFacade.updating;
  loading = this.userFacade.loading;
  error = this.userFacade.error;

  isLoading = this.userFacade.isLoading;
  isEditMode = false;
  userId: number | null = null;

  // User form
  userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    email: ['', [Validators.required, Validators.email]],
    firstName: [''],
    lastName: [''],
    role: [Role.AGENT as Role, [Validators.required]],
    status: [UserStatus.ACTIVE as UserStatus, [Validators.required]]
  });

  constructor() {
    // Effect to populate form when user is loaded
    effect(() => {
      const user = this.selectedUser();
      if (user && this.isEditMode) {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status
        });
      }
    });

    // Effect to handle successful creation/update
    effect(() => {
      const user = this.selectedUser();
      if (user && !this.loading() && !this.error()) {
        // Navigate back to list after successful operation
        setTimeout(() => this.goBack(), 500);
      }
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.userId = +id;
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        this.userFacade.loadUser(this.userId);
      } else {
        this.isEditMode = false;
        this.userForm.get('status')?.clearValidators();
        this.userForm.get('status')?.updateValueAndValidity();
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    if (this.isEditMode && this.userId) {
      const updateData: UpdateUserRequest = {
        firstName: this.userForm.value.firstName ?? undefined,
        lastName: this.userForm.value.lastName ?? undefined,
        email: this.userForm.value.email!,
        role: this.userForm.value.role!,
        status: this.userForm.value.status!
      };
      this.userFacade.updateUser(this.userId, updateData);
    } else {
      const createData: CreateUserRequest = {
        username: this.userForm.value.username!,
        password: this.userForm.value.password!,
        email: this.userForm.value.email!,
        firstName: this.userForm.value.firstName ?? undefined,
        lastName: this.userForm.value.lastName ?? undefined,
        role: this.userForm.value.role!
      };
      this.userFacade.createUser(createData);
    }
  }

  goBack(): void {
    this.router.navigate(['/users/list']);
  }
}

export { UserForm as UserFormComponent };
