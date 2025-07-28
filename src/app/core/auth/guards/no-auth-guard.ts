// src/app/core/auth/guards/no-auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthFacadeService } from '../services/auth-facade';

export const noAuthGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  return authFacade.isAuthenticated$.pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    })
  );
};
