// src/app/features/customers/customers.routes.ts
import { Routes } from '@angular/router';

export const customerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./components/customer-list/customer-list')
        .then(m => m.CustomerListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/customer-form/customer-form')
        .then(m => m.CustomerFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/customer-form/customer-form')
        .then(m => m.CustomerFormComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('./components/customer-detail/customer-detail')
        .then(m => m.CustomerDetailComponent)
  },
  {
    path: ':id/matches',
    loadComponent: () =>
      import('./components/customer-matches/customer-matches')
        .then(m => m.CustomerMatchesComponent)
  }
];
