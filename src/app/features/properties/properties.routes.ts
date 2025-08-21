// src/app/features/properties/properties.routes.ts
import { Routes } from '@angular/router';

export const propertyRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./components/property-list/property-list')
        .then(m => m.PropertyListComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/property-wizard/property-wizard')
        .then(m => m.PropertyWizardComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./components/property-wizard/property-wizard')
        .then(m => m.PropertyWizardComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/property-detail/property-detail')
        .then(m => m.PropertyDetailComponent)
  }
];
