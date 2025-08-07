// src/app/shared/components/navbar/navbar.ts - Refactored with proper structure
import { Component, inject, computed, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutModule } from '@angular/cdk/layout';

import { AuthFacadeService } from '../../../core/auth/services/auth-facade';
import { NavigationService } from '../../../core/navigation/navigation.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatListModule,
    MatRippleModule,
    MatChipsModule,
    MatSidenavModule,
    LayoutModule,
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit, OnDestroy {
  private authFacade = inject(AuthFacadeService);
  private navService = inject(NavigationService);
  private destroy$ = new Subject<void>();

  // Auth state
  userDisplayInfo = this.authFacade.userDisplayInfo;
  hasSubordinates = this.authFacade.hasSubordinates;
  isAdmin = this.authFacade.isAdmin;
  isBroker = this.authFacade.isBroker;
  isAgent = this.authFacade.isAgent;
  isAssistant = this.authFacade.isAssistant;

  // Navigation
  visibleNavItems = this.navService.visibleNavItems;

  // Mobile navigation - first 4 items only
  mobileNavItems = computed(() => {
    const items = this.visibleNavItems();
    return items.slice(0, 4);
  });

  ngOnInit(): void {
    // Material handles responsive behavior automatically
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPrimaryRole(): string {
    if (this.isAdmin()) return 'Administrator';
    if (this.isBroker()) return 'Broker';
    if (this.isAgent()) return 'Agent';
    return 'Assistant';
  }

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

  getSubordinateCount(): number {
    return this.authFacade.userCapabilities().subordinateCount;
  }

  logout(): void {
    this.authFacade.logout();
  }
}
