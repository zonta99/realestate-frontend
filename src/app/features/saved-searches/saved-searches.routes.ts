// src/app/features/saved-searches/saved-searches.routes.ts

import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards';

export const savedSearchRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/saved-search-list/saved-search-list')
            .then(m => m.SavedSearchListComponent)
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./components/saved-search-form/saved-search-form')
            .then(m => m.SavedSearchFormComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./components/saved-search-form/saved-search-form')
            .then(m => m.SavedSearchFormComponent)
      },
      {
        path: ':id/results',
        loadComponent: () =>
          import('./components/search-results/search-results')
            .then(m => m.SearchResultsComponent)
      }
    ]
  }
];
