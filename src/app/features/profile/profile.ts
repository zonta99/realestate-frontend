// src/app/features/profile/profile.ts
import { Component, inject, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, AbstractControlOptions } from '@angular/forms';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

import { AuthFacadeService } from '../../core/auth/services/auth-facade';

// Custom validators
const passwordStrengthValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;

  const hasNumber = /[0-9]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasSpecial = /[#?!@$%^&*-]/.test(value);
  const valid = hasNumber && hasUpper && hasLower && hasSpecial;

  if (!valid) {
    return { passwordStrength: { hasNumber, hasUpper, hasLower, hasSpecial } };
  }
  return null;
};

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
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatRippleModule,
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacadeService);
  private snackBar = inject(MatSnackBar);

  // Loading states
  profileSaving = signal(false);
  passwordSaving = signal(false);

  // Password visibility signals
  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  // Auth state
  currentUser = this.authFacade.currentUser;
  userDisplayInfo = this.authFacade.userDisplayInfo;
  isLoading = this.authFacade.isLoading;
  hasSubordinates = this.authFacade.hasSubordinates;
  subordinateCount = computed(() => this.authFacade.userCapabilities().subordinateCount);

  // Role check signals
  isAdmin = this.authFacade.isAdmin;
  isBroker = this.authFacade.isBroker;
  isAgent = this.authFacade.isAgent;
  isAssistant = this.authFacade.isAssistant;

  // Original form values for change detection
  private originalProfileValues = signal<any>(null);

  // Custom password match validator
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // Profile form with enhanced validation
  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]]
  });

  // Password form with enhanced validation
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: [this.passwordMatchValidator] } as AbstractControlOptions);

  // Form field getters
  firstNameField = computed(() => this.profileForm.get('firstName'));
  lastNameField = computed(() => this.profileForm.get('lastName'));
  emailField = computed(() => this.profileForm.get('email'));
  usernameField = computed(() => this.profileForm.get('username'));
  currentPasswordField = computed(() => this.passwordForm.get('currentPassword'));
  newPasswordField = computed(() => this.passwordForm.get('newPassword'));
  confirmPasswordField = computed(() => this.passwordForm.get('confirmPassword'));

  // Password strength calculation
  passwordStrength = computed(() => {
    const password = this.newPasswordField()?.value || '';
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[#?!@$%^&*-]/.test(password)) strength++;

    return Math.min(strength, 4);
  });

  // Check if profile form has changes
  hasProfileChanges = computed(() => {
    const original = this.originalProfileValues();
    const current = this.profileForm.value;

    if (!original) return false;

    return Object.keys(current).some(key => original[key] !== current[key]);
  });

  constructor() {
    // Initialize form with current user data
    effect(() => {
      const user = this.currentUser();
      if (user) {
        const formValues = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          username: user.username || ''
        };

        this.profileForm.patchValue(formValues);
        this.originalProfileValues.set({ ...formValues });
      }
    });
  }

  // Password visibility toggles
  toggleCurrentPasswordVisibility(): void {
    this.hideCurrentPassword.update(value => !value);
  }

  toggleNewPasswordVisibility(): void {
    this.hideNewPassword.update(value => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(value => !value);
  }

  // Role-based methods
  getRoleClass(): string {
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

  getRoleDisplayName(): string {
    if (this.isAdmin()) return 'Administrator';
    if (this.isBroker()) return 'Broker';
    if (this.isAgent()) return 'Agent';
    return 'Assistant';
  }

  // Password strength text
  getPasswordStrengthText(): string {
    const strength = this.passwordStrength();
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[strength] || 'Very Weak';
  }

  // Form submission methods
  async onSaveProfile(): Promise<void> {
    if (this.profileForm.valid && !this.profileSaving()) {
      this.profileSaving.set(true);

      try {
        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

        // Update original values after successful save
        this.originalProfileValues.set({ ...this.profileForm.value });

        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      } catch (error) {
        this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      } finally {
        this.profileSaving.set(false);
      }
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  async onChangePassword(): Promise<void> {
    if (this.passwordForm.valid && !this.passwordSaving()) {
      this.passwordSaving.set(true);

      try {
        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

        this.snackBar.open('Password changed successfully!', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        this.resetPasswordForm();
      } catch (error) {
        this.snackBar.open('Failed to change password. Please try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      } finally {
        this.passwordSaving.set(false);
      }
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  // Form reset methods
  resetProfileForm(): void {
    const original = this.originalProfileValues();
    if (original) {
      this.profileForm.patchValue(original);
      this.profileForm.markAsUntouched();
    }
  }

  resetPasswordForm(): void {
    this.passwordForm.reset();
    this.passwordForm.markAsUntouched();
    this.hideCurrentPassword.set(true);
    this.hideNewPassword.set(true);
    this.hideConfirmPassword.set(true);
  }
}
