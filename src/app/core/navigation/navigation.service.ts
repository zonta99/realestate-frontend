// src/app/core/navigation/navigation.service.ts
import { Injectable, inject, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  selectCanCreateProperties,
  selectCanManageCustomers,
  selectCanManageUsers,
  selectIsAuthenticated
} from '../auth/store';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  badge?: number;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private store = inject(Store);

  // Auth selectors as signals
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  readonly canCreateProperties = this.store.selectSignal(selectCanCreateProperties);
  readonly canManageCustomers = this.store.selectSignal(selectCanManageCustomers);
  readonly canManageUsers = this.store.selectSignal(selectCanManageUsers);

  // Badge counts as signals
  private propertiesBadge = signal<number>(0);
  private customersBadge = signal<number>(0);
  private teamBadge = signal<number>(0);

  // Core navigation items
  private readonly baseNavItems: Omit<NavItem, 'badge'>[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
      order: 1
    },
    {
      id: 'properties',
      label: 'Properties',
      route: '/properties',
      icon: 'home_work',
      order: 2
    },
    {
      id: 'customers',
      label: 'Customers',
      route: '/customers',
      icon: 'people',
      order: 3
    },
    {
      id: 'users',
      label: 'Team',
      route: '/users',
      icon: 'group',
      order: 4
    }
  ];

  // Computed visible navigation items with badges
  readonly visibleNavItems = computed(() => {
    if (!this.isAuthenticated()) return [];

    return this.baseNavItems
      .filter(item => this.isItemVisible(item.id))
      .map(item => ({
        ...item,
        badge: this.getBadgeCount(item.id)
      }))
      .sort((a, b) => a.order - b.order);
  });

  // Observable version for components that need it
  readonly visibleNavItems$ = combineLatest([
    this.store.select(selectIsAuthenticated),
    this.store.select(selectCanCreateProperties),
    this.store.select(selectCanManageCustomers),
    this.store.select(selectCanManageUsers)
  ]).pipe(
    map(([isAuth, canCreateProps, canManageCustomers, canManageUsers]) => {
      if (!isAuth) return [];

      return this.baseNavItems
        .filter(item => this.isItemVisibleFromPermissions(
          item.id,
          canCreateProps,
          canManageCustomers,
          canManageUsers
        ))
        .map(item => ({
          ...item,
          badge: this.getBadgeCount(item.id)
        }))
        .sort((a, b) => a.order - b.order);
    })
  );

  private isItemVisible(itemId: string): boolean {
    switch (itemId) {
      case 'dashboard':
        return true;
      case 'properties':
        return this.canCreateProperties();
      case 'customers':
        return this.canManageCustomers();
      case 'users':
        return this.canManageUsers();
      default:
        return false;
    }
  }

  private isItemVisibleFromPermissions(
    itemId: string,
    canCreateProps: boolean,
    canManageCustomers: boolean,
    canManageUsers: boolean
  ): boolean {
    switch (itemId) {
      case 'dashboard':
        return true;
      case 'properties':
        return canCreateProps;
      case 'customers':
        return canManageCustomers;
      case 'users':
        return canManageUsers;
      default:
        return false;
    }
  }

  private getBadgeCount(itemId: string): number | undefined {
    switch (itemId) {
      case 'properties':
        const propCount = this.propertiesBadge();
        return propCount > 0 ? propCount : undefined;
      case 'customers':
        const custCount = this.customersBadge();
        return custCount > 0 ? custCount : undefined;
      case 'users':
        const teamCount = this.teamBadge();
        return teamCount > 0 ? teamCount : undefined;
      default:
        return undefined;
    }
  }

  // Public methods to update badge counts
  updatePropertiesBadge(count: number): void {
    this.propertiesBadge.set(count);
  }

  updateCustomersBadge(count: number): void {
    this.customersBadge.set(count);
  }

  updateTeamBadge(count: number): void {
    this.teamBadge.set(count);
  }

  clearAllBadges(): void {
    this.propertiesBadge.set(0);
    this.customersBadge.set(0);
    this.teamBadge.set(0);
  }
}
