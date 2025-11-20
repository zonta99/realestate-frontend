// src/app/features/users/store/user.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  UserResponse,
  UserPageResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserListParams
} from '../models/user-api.model';
import { Role } from '../../../core/auth/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    // Load Users (Paginated)
    'Load Users': props<{ params?: UserListParams }>(),
    'Load Users Success': props<{ response: UserPageResponse }>(),
    'Load Users Failure': props<{ error: any }>(),

    // Load User by ID
    'Load User': props<{ id: number }>(),
    'Load User Success': props<{ user: UserResponse }>(),
    'Load User Failure': props<{ error: any }>(),

    // Create User
    'Create User': props<{ user: CreateUserRequest }>(),
    'Create User Success': props<{ user: UserResponse }>(),
    'Create User Failure': props<{ error: any }>(),

    // Update User
    'Update User': props<{ id: number; user: UpdateUserRequest }>(),
    'Update User Success': props<{ user: UserResponse }>(),
    'Update User Failure': props<{ error: any }>(),

    // Delete User
    'Delete User': props<{ id: number }>(),
    'Delete User Success': props<{ id: number; message: string }>(),
    'Delete User Failure': props<{ error: any }>(),

    // Get Users by Role
    'Load Users By Role': props<{ role: Role }>(),
    'Load Users By Role Success': props<{ users: UserResponse[] }>(),
    'Load Users By Role Failure': props<{ error: any }>(),

    // Get User Subordinates
    'Load User Subordinates': props<{ userId: number }>(),
    'Load User Subordinates Success': props<{ subordinates: UserResponse[] }>(),
    'Load User Subordinates Failure': props<{ error: any }>(),

    // Add Supervisor
    'Add Supervisor': props<{ userId: number; supervisorId: number }>(),
    'Add Supervisor Success': props<{ message: string }>(),
    'Add Supervisor Failure': props<{ error: any }>(),

    // Remove Supervisor
    'Remove Supervisor': props<{ userId: number; supervisorId: number }>(),
    'Remove Supervisor Success': props<{ message: string }>(),
    'Remove Supervisor Failure': props<{ error: any }>(),

    // UI State Management
    'Clear Selected User': emptyProps(),
    'Clear Error': emptyProps()
  }
});
