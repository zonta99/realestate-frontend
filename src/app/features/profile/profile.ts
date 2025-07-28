// src/app/features/profile/profile.ts
import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {AuthFacadeService} from '../../core/auth/services/auth-facade';
import {Role} from '../../core/auth/models';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <!-- Profile Overview Card -->
      <mat-card class="profile-overview">
        <mat-card-header>
          <div class="profile-avatar">
            <div class="avatar-circle">
              {{ userDisplayInfo().initials }}
            </div>
          </div>
          <mat-card-title>{{ userDisplayInfo().fullName }}</mat-card-title>
          <mat-card-subtitle>{{ userDisplayInfo().email }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="role-info">
            <mat-chip-set>
              <mat-chip [class]="getRoleClass(currentUser()?.roles || [])">
                <mat-icon>{{ getRoleIcon(currentUser()?.roles || []) }}</mat-icon>
                {{ getRoleDisplayName(currentUser()?.roles || []) }}
              </mat-chip>
            </mat-chip-set>
          </div>
          @if (hasSubordinates()) {
            <div class="team-info">
              <mat-icon>group</mat-icon>
              <span>Managing {{ subordinateCount() }} team members</span>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <!-- Edit Profile Form -->
      <mat-card class="profile-form">
        <mat-card-header>
          <mat-card-title>Personal Information</mat-card-title>
          <mat-card-subtitle>Update your personal details</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" placeholder="Enter first name">
                @if (firstNameField()?.invalid && firstNameField()?.touched) {
                  <mat-error>First name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" placeholder="Enter last name">
                @if (lastNameField()?.invalid && lastNameField()?.touched) {
                  <mat-error>Last name is required</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter email">
              <mat-icon matSuffix>email</mat-icon>
              @if (emailField()?.invalid && emailField()?.touched) {
                <mat-error>
                  @if (emailField()?.errors?.['required']) {
                    Email is required
                  }
                  @if (emailField()?.errors?.['email']) {
                    Please enter a valid email
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" placeholder="Enter username">
              <mat-icon matSuffix>person</mat-icon>
              @if (usernameField()?.invalid && usernameField()?.touched) {
                <mat-error>Username is required</mat-error>
              }
            </mat-form-field>

            @if (isLoading()) {
              <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            }

            <div class="form-actions">
              <button
                mat-button
                type="button"
                (click)="resetForm()"
                [disabled]="isLoading()"
              >
                Reset
              </button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="profileForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <mat-icon>sync</mat-icon>
                  Saving...
                } @else {
                  Save Changes
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Change Password Card -->
      <mat-card class="password-form">
        <mat-card-header>
          <mat-card-title>Change Password</mat-card-title>
          <mat-card-subtitle>Update your account password</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()">
            <mat-form-field appearance="outline">
              <mat-label>Current Password</mat-label>
              <input
                matInput
                [type]="hideCurrentPassword() ? 'password' : 'text'"
                formControlName="currentPassword"
                placeholder="Enter current password"
              >
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="toggleCurrentPasswordVisibility()"
              >
                <mat-icon>{{ hideCurrentPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (currentPasswordField()?.invalid && currentPasswordField()?.touched) {
                <mat-error>Current password is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>New Password</mat-label>
              <input
                matInput
                [type]="hideNewPassword() ? 'password' : 'text'"
                formControlName="newPassword"
                placeholder="Enter new password"
              >
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="toggleNewPasswordVisibility()"
              >
                <mat-icon>{{ hideNewPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (newPasswordField()?.invalid && newPasswordField()?.touched) {
                <mat-error>
                  @if (newPasswordField()?.errors?.['required']) {
                    New password is required
                  }
                  @if (newPasswordField()?.errors?.['minlength']) {
                    Password must be at least 6 characters
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirm New Password</mat-label>
              <input
                matInput
                [type]="hideConfirmPassword() ? 'password' : 'text'"
                formControlName="confirmPassword"
                placeholder="Confirm new password"
              >
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="toggleConfirmPasswordVisibility()"
              >
                <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (confirmPasswordField()?.invalid && confirmPasswordField()?.touched) {
                <mat-error>
                  @if (confirmPasswordField()?.errors?.['required']) {
                    Please confirm your password
                  }
                  @if (passwordForm.hasError('passwordMismatch')) {
                    Passwords do not match
                  }
                </mat-error>
              }
            </mat-form-field>

            <div class="form-actions">
              <button
                mat-button
                type="button"
                (click)="resetPasswordForm()"
                [disabled]="isLoading()"
              >
                Reset
              </button>
              <button
                mat-raised-button
                color="accent"
                type="submit"
                [disabled]="passwordForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <mat-icon>sync</mat-icon>
                  Changing...
                } @else {
                  Change Password
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-header {
      margin-bottom: 32px;
      text-align: center;
    }

    .profile-header h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 400;
    }

    .profile-header p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }

    .profile-overview {
      margin-bottom: 24px;
    }

    .profile-overview mat-card-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .profile-avatar {
      margin-right: 16px;
    }

    .avatar-circle {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: 500;
    }

    .role-info {
      margin: 16px 0;
    }

    .role-info mat-chip {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .role-info mat-chip.admin {
      background-color: #f44336;
      color: white;
    }

    .role-info mat-chip.broker {
      background-color: #ff9800;
      color: white;
    }

    .role-info mat-chip.agent {
      background-color: #4caf50;
      color: white;
    }

    .role-info mat-chip.assistant {
      background-color: #2196f3;
      color: white;
    }

    .team-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      margin-top: 8px;
    }

    .profile-form,
    .password-form {
      margin-bottom: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 16px;
      }

      .form-row {
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
export class Profile {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacadeService);
  private snackBar = inject(MatSnackBar);

  // Role hierarchy (highest to lowest)
  private readonly roleHierarchy = [
    Role.ADMIN,
    Role.BROKER,
    Role.AGENT,
    Role.ASSISTANT
  ];

  // Signals for password visibility
  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  // Auth state
  currentUser = this.authFacade.currentUser;
  userDisplayInfo = this.authFacade.userDisplayInfo;
  isLoading = this.authFacade.isLoading;
  hasSubordinates = this.authFacade.hasSubordinates;
  subordinateCount = computed(() => this.authFacade.userCapabilities().subordinateCount);

  // Profile form
  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]]
  });

  // Password form
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  // Form field getters
  firstNameField = computed(() => this.profileForm.get('firstName'));
  lastNameField = computed(() => this.profileForm.get('lastName'));
  emailField = computed(() => this.profileForm.get('email'));
  usernameField = computed(() => this.profileForm.get('username'));
  currentPasswordField = computed(() => this.passwordForm.get('currentPassword'));
  newPasswordField = computed(() => this.passwordForm.get('newPassword'));
  confirmPasswordField = computed(() => this.passwordForm.get('confirmPassword'));

  constructor() {
    // Initialize form with current user data
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      });
    }
  }

  /**
   * Gets the highest role from an array of roles based on hierarchy
   */
  private getHighestRole(roles: Role[]): Role {
    if (!roles || roles.length === 0) {
      return Role.ASSISTANT; // Default to lowest role
    }

    // Find the role with the highest priority (lowest index in hierarchy)
    for (const hierarchyRole of this.roleHierarchy) {
      if (roles.includes(hierarchyRole)) {
        return hierarchyRole;
      }
    }

    // If no matching role found, return the first role or default
    return roles[0] || Role.ASSISTANT;
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  toggleCurrentPasswordVisibility(): void {
    this.hideCurrentPassword.update(value => !value);
  }

  toggleNewPasswordVisibility(): void {
    this.hideNewPassword.update(value => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(value => !value);
  }

  getRoleClass(roles: Role[]): string {
    const highestRole = this.getHighestRole(roles);
    return highestRole.replace('ROLE_', '').toLowerCase();
  }

  getRoleIcon(roles: Role[]): string {
    const highestRole = this.getHighestRole(roles);
    switch (highestRole) {
      case Role.ADMIN: return 'admin_panel_settings';
      case Role.BROKER: return 'business';
      case Role.AGENT: return 'person';
      case Role.ASSISTANT: return 'support_agent';
      default: return 'person';
    }
  }

  getRoleDisplayName(roles: Role[]): string {
    const highestRole = this.getHighestRole(roles);
    switch (highestRole) {
      case Role.ADMIN: return 'Administrator';
      case Role.BROKER: return 'Broker';
      case Role.AGENT: return 'Agent';
      case Role.ASSISTANT: return 'Assistant';
      default: return 'User';
    }
  }

  onSaveProfile(): void {
    if (this.profileForm.valid && !this.isLoading()) {
      // TODO: Implement profile update
      this.snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid && !this.isLoading()) {
      // TODO: Implement password change
      this.snackBar.open('Password changed successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      this.resetPasswordForm();
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      });
    }
    this.profileForm.markAsUntouched();
  }

  resetPasswordForm(): void {
    this.passwordForm.reset();
    this.passwordForm.markAsUntouched();
  }
}
