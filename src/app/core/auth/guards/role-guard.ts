// src/app/core/auth/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectIsAuthenticated } from '../store';
import { Role, UserHelper } from '../models';

export const createRoleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectIsAuthenticated).pipe(
      take(1),
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          router.navigate(['/auth/login']);
          return false;
        }

        // Get current user and check roles using UserHelper
        const currentUser = store.selectSignal(selectCurrentUser)();

        if (!currentUser) {
          router.navigate(['/auth/login']);
          return false;
        }

        // Check if user has any of the allowed roles using UserHelper
        const hasAllowedRole = allowedRoles.some(role =>
          UserHelper.hasRole(currentUser, role)
        );

        if (!hasAllowedRole) {
          router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      })
    );
  };
};

// Alternative approach using observables instead of signals
export const createRoleGuardObservable = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectCurrentUser).pipe(
      take(1),
      map((currentUser) => {
        if (!currentUser) {
          router.navigate(['/auth/login']);
          return false;
        }

        // Check if user has any of the allowed roles using UserHelper
        const hasAllowedRole = allowedRoles.some(role =>
          UserHelper.hasRole(currentUser, role)
        );

        if (!hasAllowedRole) {
          router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      })
    );
  };
};

// Predefined role guards
export const adminGuard = createRoleGuard([Role.ADMIN]);
export const brokerGuard = createRoleGuard([Role.ADMIN, Role.BROKER]);
export const agentGuard = createRoleGuard([Role.ADMIN, Role.BROKER, Role.AGENT]);

// Specific business logic guards for your real estate CRM
export const canManageUsersGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectCurrentUser).pipe(
    take(1),
    map((user) => {
      if (!user) {
        router.navigate(['/auth/login']);
        return false;
      }

      const canManage = UserHelper.isAdmin(user) || UserHelper.isBroker(user);
      if (!canManage) {
        router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    })
  );
};

export const canManagePropertiesGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectCurrentUser).pipe(
    take(1),
    map((user) => {
      if (!user) {
        router.navigate(['/auth/login']);
        return false;
      }

      // Everyone except assistants can manage properties
      const canManage = !UserHelper.isAssistant(user);
      if (!canManage) {
        router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    })
  );
};
