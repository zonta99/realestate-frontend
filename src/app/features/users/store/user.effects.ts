// src/app/features/users/store/user.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { UserActions } from './user.actions';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);

  // Load Users
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(({ params }) =>
        this.userService.getUsers(params).pipe(
          map(response => UserActions.loadUsersSuccess({ response })),
          catchError(error => of(UserActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  // Load User by ID
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({ id }) =>
        this.userService.getUserById(id).pipe(
          map(user => UserActions.loadUserSuccess({ user })),
          catchError(error => of(UserActions.loadUserFailure({ error })))
        )
      )
    )
  );

  // Create User
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      switchMap(({ user }) =>
        this.userService.createUser(user).pipe(
          map(user => UserActions.createUserSuccess({ user })),
          catchError(error => of(UserActions.createUserFailure({ error })))
        )
      )
    )
  );

  // Update User
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap(({ id, user }) =>
        this.userService.updateUser(id, user).pipe(
          map(user => UserActions.updateUserSuccess({ user })),
          catchError(error => of(UserActions.updateUserFailure({ error })))
        )
      )
    )
  );

  // Delete User
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      switchMap(({ id }) =>
        this.userService.deleteUser(id).pipe(
          map(response => UserActions.deleteUserSuccess({ id, message: response.message })),
          catchError(error => of(UserActions.deleteUserFailure({ error })))
        )
      )
    )
  );

  // Load Users by Role
  loadUsersByRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsersByRole),
      switchMap(({ role }) =>
        this.userService.getUsersByRole(role).pipe(
          map(users => UserActions.loadUsersByRoleSuccess({ users })),
          catchError(error => of(UserActions.loadUsersByRoleFailure({ error })))
        )
      )
    )
  );

  // Load User Subordinates
  loadUserSubordinates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserSubordinates),
      switchMap(({ userId }) =>
        this.userService.getUserSubordinates(userId).pipe(
          map(subordinates => UserActions.loadUserSubordinatesSuccess({ subordinates })),
          catchError(error => of(UserActions.loadUserSubordinatesFailure({ error })))
        )
      )
    )
  );

  // Add Supervisor
  addSupervisor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addSupervisor),
      switchMap(({ userId, supervisorId }) =>
        this.userService.addSupervisor(userId, supervisorId).pipe(
          map(response => UserActions.addSupervisorSuccess({ message: response.message })),
          catchError(error => of(UserActions.addSupervisorFailure({ error })))
        )
      )
    )
  );

  // Remove Supervisor
  removeSupervisor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.removeSupervisor),
      switchMap(({ userId, supervisorId }) =>
        this.userService.removeSupervisor(userId, supervisorId).pipe(
          map(response => UserActions.removeSupervisorSuccess({ message: response.message })),
          catchError(error => of(UserActions.removeSupervisorFailure({ error })))
        )
      )
    )
  );
}
