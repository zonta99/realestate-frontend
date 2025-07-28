// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard, noAuthGuard, agentGuard } from './core/auth/guards';

export const routes: Routes = [
  // Redirect root to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Auth routes (accessible only when NOT authenticated)
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./core/auth/components/login/login')
            .then(m => m.LoginComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Protected routes (require authentication)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  // Properties module (agents and above)
  {
    path: 'properties',
    canActivate: [authGuard, agentGuard],
    loadChildren: () =>
      import('./features/properties/properties.routes')
        .then(m => m.propertyRoutes)
  },

  // Customers module (agents and above)
  {
    path: 'customers',
    canActivate: [authGuard, agentGuard],
    loadChildren: () =>
      import('./features/customers/customers.routes')
        .then(m => m.customerRoutes)
  },

  // Users module (brokers and admins only)
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/users/users.routes')
        .then(m => m.userRoutes)
  },

  // Profile management
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile')
        .then(m => m.Profile)
  },

  // Error pages
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/components/unauthorized/unauthorized')
        .then(m => m.Unauthorized)
  },

  // 404 fallback
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found')
        .then(m => m.NotFound)
  }
];
