// src/app/core/auth/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectUserRoles, selectIsAuthenticated } from '../store';
import { Role } from '../models';

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

        const userRoles = store.selectSignal(selectUserRoles)();

        if (!userRoles || userRoles.length === 0 || !userRoles.some(role => allowedRoles.includes(role))) {
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
