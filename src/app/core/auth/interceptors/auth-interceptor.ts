// src/app/core/auth/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TokenStorageService } from '../services/token-storage';
import { AuthFacadeService } from '../services/auth-facade';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const authFacade = inject(AuthFacadeService);

  // Get the access token
  const token = tokenStorage.getAccessToken();

  // Clone the request and add the authorization header if token exists
  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized responses
      if (error.status === 401) {
        // Clear invalid token and redirect to login
        tokenStorage.clearTokens();
        authFacade.logout();
      }

      // Handle 403 Forbidden responses
      if (error.status === 403) {
        // User doesn't have permission for this resource
        console.warn('Access forbidden:', error.url);
      }

      return throwError(() => error);
    })
  );
};
