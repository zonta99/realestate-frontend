// src/app/core/navigation/navigation.service.ts - Enhanced version
import { Injectable, inject, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  selectCanCreateProperties,
  selectCanManageCustomers,
  selectCanManageUsers,
  selectIsAuthenticated,
  selectCurrentUser
} from '../auth/store';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  badge?: number;
  order: number;
  // NEW: Additional properties for flexibility
  tooltip?: string;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
  className?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'error'; // NEW: Badge variant for styling
  permissionCheck?: () => boolean; // NEW: Function to check permissions dynamically
}

// NEW: Type for badge updates
export interface BadgeUpdate {
  itemId: string;
  count: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

// NEW: Permission check function type
type PermissionChecker = () => boolean;

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
  readonly currentUser = this.store.selectSignal(selectCurrentUser);

  // ENHANCED: Badge system with variants
  private badgeMap = signal(new Map<string, { count: number; variant?: string }>());

  // ENHANCED: Dynamic navigation items (can be extended at runtime)
  private dynamicNavItems = signal<Omit<NavItem, 'badge'>[]>([]);

  // Core navigation items with permission checkers
  private readonly baseNavItems: Array<Omit<NavItem, 'badge'> & {
    permissionCheck: PermissionChecker;
    tooltip: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
      order: 1,
      tooltip: 'View dashboard overview',
      permissionCheck: () => this.isAuthenticated()
    },
    {
      id: 'properties',
      label: 'Properties',
      route: '/properties',
      icon: 'home_work',
      order: 2,
      tooltip: 'Manage property listings',
      permissionCheck: () => this.canCreateProperties()
    },
    {
      id: 'customers',
      label: 'Customers',
      route: '/customers',
      icon: 'people',
      order: 3,
      tooltip: 'Manage customer relationships',
      permissionCheck: () => this.canManageCustomers()
    },
    {
      id: 'users',
      label: 'Team',
      route: '/users',
      icon: 'group',
      order: 4,
      tooltip: 'Manage team members',
      permissionCheck: () => this.canManageUsers()
    }
  ];

  // ENHANCED: Computed visible navigation items with badges and dynamic items
  readonly visibleNavItems = computed(() => {
    if (!this.isAuthenticated()) return [];

    const allItems = [...this.baseNavItems, ...this.dynamicNavItems()];
    const badges = this.badgeMap();

    return allItems
      .filter(item => this.isItemVisible(item))
      .map(item => ({
        ...item,
        badge: badges.get(item.id)?.count || undefined,
        badgeVariant: badges.get(item.id)?.variant
      }))
      .sort((a, b) => a.order - b.order);
  });

  // Observable version (kept for backward compatibility)
  readonly visibleNavItems$ = combineLatest([
    this.store.select(selectIsAuthenticated),
    this.store.select(selectCanCreateProperties),
    this.store.select(selectCanManageCustomers),
    this.store.select(selectCanManageUsers)
  ]).pipe(
    map(([isAuth, canCreateProps, canManageCustomers, canManageUsers]) => {
      if (!isAuth) return [];

      const allItems = [...this.baseNavItems, ...this.dynamicNavItems()];
      const badges = this.badgeMap();

      return allItems
        .filter(item => this.isItemVisibleFromPermissions(
          item,
          canCreateProps,
          canManageCustomers,
          canManageUsers
        ))
        .map(item => ({
          ...item,
          badge: badges.get(item.id)?.count || undefined,
          badgeVariant: badges.get(item.id)?.variant
        }))
        .sort((a, b) => a.order - b.order);
    })
  );

  // ENHANCED: More flexible visibility check
  private isItemVisible(item: Omit<NavItem, 'badge'> & { permissionCheck?: PermissionChecker }): boolean {
    // Check if item is disabled
    if (item.disabled) return false;

    // Use permission checker if available
    if (item.permissionCheck) {
      return item.permissionCheck();
    }

    // Fallback to old logic for backward compatibility
    return this.isItemVisibleById(item.id);
  }

  private isItemVisibleById(itemId: string): boolean {
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
    item: any,
    canCreateProps: boolean,
    canManageCustomers: boolean,
    canManageUsers: boolean
  ): boolean {
    if (item.disabled) return false;

    switch (item.id) {
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

  // ENHANCED: More flexible badge management
  updateBadge(update: BadgeUpdate): void {
    const current = this.badgeMap();
    const newMap = new Map(current);

    if (update.count > 0) {
      newMap.set(update.itemId, {
        count: update.count,
        variant: update.variant || 'default'
      });
    } else {
      newMap.delete(update.itemId);
    }

    this.badgeMap.set(newMap);
  }

  // ENHANCED: Batch badge updates
  updateBadges(updates: BadgeUpdate[]): void {
    const current = this.badgeMap();
    const newMap = new Map(current);

    updates.forEach(update => {
      if (update.count > 0) {
        newMap.set(update.itemId, {
          count: update.count,
          variant: update.variant || 'default'
        });
      } else {
        newMap.delete(update.itemId);
      }
    });

    this.badgeMap.set(newMap);
  }

  // NEW: Add dynamic navigation item
  addNavigationItem(item: Omit<NavItem, 'badge'>): void {
    const current = this.dynamicNavItems();
    const existingIndex = current.findIndex(nav => nav.id === item.id);

    if (existingIndex >= 0) {
      // Update existing item
      const newItems = [...current];
      newItems[existingIndex] = item;
      this.dynamicNavItems.set(newItems);
    } else {
      // Add new item
      this.dynamicNavItems.set([...current, item]);
    }
  }

  // NEW: Remove dynamic navigation item
  removeNavigationItem(id: string): void {
    const current = this.dynamicNavItems();
    const filtered = current.filter(item => item.id !== id);
    this.dynamicNavItems.set(filtered);

    // Also remove any badges for this item
    const badges = this.badgeMap();
    const newBadges = new Map(badges);
    newBadges.delete(id);
    this.badgeMap.set(newBadges);
  }

  // NEW: Temporarily disable/enable navigation item
  toggleNavigationItem(id: string, disabled: boolean): void {
    // Update base items
    const baseItem = this.baseNavItems.find(item => item.id === id);
    if (baseItem) {
      (baseItem as any).disabled = disabled;
    }

    // Update dynamic items
    const current = this.dynamicNavItems();
    const itemIndex = current.findIndex(item => item.id === id);
    if (itemIndex >= 0) {
      const newItems = [...current];
      newItems[itemIndex] = { ...newItems[itemIndex], disabled };
      this.dynamicNavItems.set(newItems);
    }
  }

  // Backward compatibility methods (keeping your original API)
  updatePropertiesBadge(count: number): void {
    this.updateBadge({ itemId: 'properties', count });
  }

  updateCustomersBadge(count: number): void {
    this.updateBadge({ itemId: 'customers', count });
  }

  updateTeamBadge(count: number): void {
    this.updateBadge({ itemId: 'users', count });
  }

  clearAllBadges(): void {
    this.badgeMap.set(new Map());
  }

  // NEW: Get badge info for a specific item
  getBadgeInfo(itemId: string): { count: number; variant?: string } | undefined {
    return this.badgeMap().get(itemId);
  }

  // NEW: Get navigation item by ID
  getNavigationItem(id: string): NavItem | undefined {
    const allItems = [...this.baseNavItems, ...this.dynamicNavItems()];
    const item = allItems.find(nav => nav.id === id);
    if (!item) return undefined;

    const badges = this.badgeMap();
    return {
      ...item,
      badge: badges.get(id)?.count,
      badgeVariant: badges.get(id)?.variant as any
    };
  }

  // NEW: Get all navigation items (for debugging/admin)
  getAllNavigationItems(): NavItem[] {
    const allItems = [...this.baseNavItems, ...this.dynamicNavItems()];
    const badges = this.badgeMap();

    return allItems.map(item => ({
      ...item,
      badge: badges.get(item.id)?.count,
      badgeVariant: badges.get(item.id)?.variant as any
    }));
  }

  // NEW: Check if user can access a route
  canAccessRoute(route: string): boolean {
    const item = this.getAllNavigationItems().find(nav => nav.route === route);
    return item ? this.isItemVisible(item) : true; // Allow access to routes not in nav
  }

  // NEW: Get navigation stats
  getNavigationStats(): {
    totalItems: number;
    visibleItems: number;
    totalBadges: number;
    badgeCount: number;
  } {
    const allItems = this.getAllNavigationItems();
    const visibleItems = this.visibleNavItems();
    const badges = this.badgeMap();
    const totalBadgeCount = Array.from(badges.values())
      .reduce((sum, badge) => sum + badge.count, 0);

    return {
      totalItems: allItems.length,
      visibleItems: visibleItems.length,
      totalBadges: badges.size,
      badgeCount: totalBadgeCount
    };
  }
}
