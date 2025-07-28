// src/app/features/users/users.routes.ts
import { Routes } from '@angular/router';
import { brokerGuard } from '../../core/auth/guards';

export const userRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    canActivate: [brokerGuard], // Only brokers and admins can manage users
    loadComponent: () =>
      import('./components/user-list/user-list')
        .then(m => m.UserListComponent)
  },
  {
    path: 'new',
    canActivate: [brokerGuard],
    loadComponent: () =>
      import('./components/user-form/user-form')
        .then(m => m.UserFormComponent)
  },
  {
    path: 'edit/:id',
    canActivate: [brokerGuard],
    loadComponent: () =>
      import('./components/user-form/user-form')
        .then(m => m.UserFormComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('./components/user-detail/user-detail')
        .then(m => m.UserDetailComponent)
  },
  {
    path: 'hierarchy',
    canActivate: [brokerGuard],
    loadComponent: () =>
      import('./components/user-hierarchy/user-hierarchy')
        .then(m => m.UserHierarchyComponent)
  }
];
