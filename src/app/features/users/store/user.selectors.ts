// src/app/features/users/store/user.selectors.ts
import { createSelector } from '@ngrx/store';
import { AppState } from '../../../core/store/app.reducer';
import { UserState } from './user.reducer';

// Feature selector
export const selectUserState = (state: AppState) => state.users;

// User list selectors
export const selectAllUsers = createSelector(
  selectUserState,
  (state: UserState) => state.users
);

export const selectSelectedUser = createSelector(
  selectUserState,
  (state: UserState) => state.selectedUser
);

export const selectUserSubordinates = createSelector(
  selectUserState,
  (state: UserState) => state.subordinates
);

// Pagination selectors
export const selectUserPagination = createSelector(
  selectUserState,
  (state: UserState) => state.pagination
);

export const selectTotalUsers = createSelector(
  selectUserPagination,
  (pagination) => pagination.totalElements
);

export const selectCurrentPage = createSelector(
  selectUserPagination,
  (pagination) => pagination.currentPage
);

export const selectTotalPages = createSelector(
  selectUserPagination,
  (pagination) => pagination.totalPages
);

// Loading state selectors
export const selectUsersLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectUsersCreating = createSelector(
  selectUserState,
  (state: UserState) => state.creating
);

export const selectUsersUpdating = createSelector(
  selectUserState,
  (state: UserState) => state.updating
);

export const selectUsersDeleting = createSelector(
  selectUserState,
  (state: UserState) => state.deleting
);

export const selectUsersError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

// Derived selectors
export const selectUserById = (id: number) => createSelector(
  selectAllUsers,
  (users) => users.find(user => user.id === id)
);

export const selectHasUsers = createSelector(
  selectAllUsers,
  (users) => users.length > 0
);

export const selectIsUserLoading = createSelector(
  selectUsersLoading,
  selectUsersCreating,
  selectUsersUpdating,
  selectUsersDeleting,
  (loading, creating, updating, deleting) => loading || creating || updating || deleting
);
