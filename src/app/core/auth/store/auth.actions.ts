// src/app/core/auth/store/auth.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginRequest, LoginResponse, User, Permission } from '../models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Login Flow
    'Login': props<{ credentials: LoginRequest }>(),
    'Login Success': props<{ response: LoginResponse }>(),
    'Login Failure': props<{ error: string }>(),

    // Logout Flow
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: string }>(),

    // Auto Login (from stored token)
    'Check Stored Auth': emptyProps(),
    'Auto Login Success': props<{ user: User; tokens: any }>(),
    'Auto Login Failure': emptyProps(),

    // Token Management
    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{ tokens: any }>(),
    'Refresh Token Failure': props<{ error: string }>(),

    // User Profile
    'Load User Profile': emptyProps(),
    'Load User Profile Success': props<{ user: User }>(),
    'Load User Profile Failure': props<{ error: string }>(),

    // Permissions & Hierarchy
    'Load Permissions': emptyProps(),
    'Load Permissions Success': props<{ permissions: Permission[] }>(),
    'Load Permissions Failure': props<{ error: string }>(),

    'Load Subordinates': emptyProps(),
    'Load Subordinates Success': props<{ subordinates: User[] }>(),
    'Load Subordinates Failure': props<{ error: string }>(),

    // Session Management
    'Update Last Activity': emptyProps(),
    'Session Warning Shown': emptyProps(),
    'Session Warning Dismissed': emptyProps(),
    'Session Expired': emptyProps(),

    // Error Handling
    'Clear Auth Error': emptyProps(),
    'Set Auth Error': props<{ error: string }>(),

    // Reset State
    'Reset Auth State': emptyProps(),
  }
});
