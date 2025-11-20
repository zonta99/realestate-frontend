// src/app/features/users/services/user-facade.service.ts
import { Injectable, inject, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from '../store/user.actions';
import {
  selectAllUsers,
  selectSelectedUser,
  selectUserSubordinates,
  selectUserPagination,
  selectUsersLoading,
  selectUsersCreating,
  selectUsersUpdating,
  selectUsersDeleting,
  selectUsersError,
  selectIsUserLoading,
  selectHasUsers,
  selectUserById
} from '../store/user.selectors';
import { CreateUserRequest, UpdateUserRequest, UserListParams } from '../models/user-api.model';
import { Role } from '../../../core/auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserFacadeService {
  private store = inject(Store);

  // Selectors as signals (for use in components)
  readonly users = this.store.selectSignal(selectAllUsers);
  readonly selectedUser = this.store.selectSignal(selectSelectedUser);
  readonly subordinates = this.store.selectSignal(selectUserSubordinates);
  readonly pagination = this.store.selectSignal(selectUserPagination);
  readonly loading = this.store.selectSignal(selectUsersLoading);
  readonly creating = this.store.selectSignal(selectUsersCreating);
  readonly updating = this.store.selectSignal(selectUsersUpdating);
  readonly deleting = this.store.selectSignal(selectUsersDeleting);
  readonly error = this.store.selectSignal(selectUsersError);

  // Computed values
  readonly isLoading = this.store.selectSignal(selectIsUserLoading);
  readonly hasUsers = this.store.selectSignal(selectHasUsers);

  // Observable versions for services/guards
  readonly users$ = this.store.select(selectAllUsers);
  readonly selectedUser$ = this.store.select(selectSelectedUser);
  readonly subordinates$ = this.store.select(selectUserSubordinates);
  readonly loading$ = this.store.select(selectUsersLoading);
  readonly error$ = this.store.select(selectUsersError);

  // Load users (paginated)
  loadUsers(params?: UserListParams): void {
    this.store.dispatch(UserActions.loadUsers({ params }));
  }

  // Load user by ID
  loadUser(id: number): void {
    this.store.dispatch(UserActions.loadUser({ id }));
  }

  // Create user
  createUser(user: CreateUserRequest): void {
    this.store.dispatch(UserActions.createUser({ user }));
  }

  // Update user
  updateUser(id: number, user: UpdateUserRequest): void {
    this.store.dispatch(UserActions.updateUser({ id, user }));
  }

  // Delete user
  deleteUser(id: number): void {
    this.store.dispatch(UserActions.deleteUser({ id }));
  }

  // Load users by role
  loadUsersByRole(role: Role): void {
    this.store.dispatch(UserActions.loadUsersByRole({ role }));
  }

  // Load user subordinates
  loadUserSubordinates(userId: number): void {
    this.store.dispatch(UserActions.loadUserSubordinates({ userId }));
  }

  // Add supervisor relationship
  addSupervisor(userId: number, supervisorId: number): void {
    this.store.dispatch(UserActions.addSupervisor({ userId, supervisorId }));
  }

  // Remove supervisor relationship
  removeSupervisor(userId: number, supervisorId: number): void {
    this.store.dispatch(UserActions.removeSupervisor({ userId, supervisorId }));
  }

  // UI actions
  clearSelectedUser(): void {
    this.store.dispatch(UserActions.clearSelectedUser());
  }

  clearError(): void {
    this.store.dispatch(UserActions.clearError());
  }

  // Utility method to get user by ID as signal
  getUserById(id: number) {
    return this.store.selectSignal(selectUserById(id));
  }
}
