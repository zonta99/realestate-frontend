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
    path: 'new',
    loadComponent: () =>
      import('./components/property-form/property-form')
        .then(m => m.PropertyFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/property-form/property-form')
        .then(m => m.PropertyFormComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('./components/property-detail/property-detail')
        .then(m => m.PropertyDetailComponent)
  }
];
