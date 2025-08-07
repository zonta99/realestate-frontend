// src/app/features/dashboard/dashboard.ts - Refactored with proper structure
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
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
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
