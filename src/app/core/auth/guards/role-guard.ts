// src/app/core/auth/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectUserRole, selectIsAuthenticated } from '../store';
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

        const userRole = store.selectSignal(selectUserRole)();

        if (!userRole || !allowedRoles.includes(userRole)) {
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
