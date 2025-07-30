// src/app/core/auth/guards/auth-guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, filter, take } from 'rxjs/operators';
import { AuthFacadeService } from '../services/auth-facade';

export const authGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  return authFacade.loadingStates$.pipe(
    filter(states => !states.isLoading), // Wait until loading done
    take(1),
    map(() => {
      if (!authFacade.isAuthenticated()) {
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  );
};
