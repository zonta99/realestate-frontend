// src/app/features/users/store/user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { UserResponse, UserPageResponse } from '../models/user-api.model';

export interface UserState {
  users: UserResponse[];
  selectedUser: UserResponse | null;
  subordinates: UserResponse[];
  pagination: {
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  };
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: any;
}

export const initialState: UserState = {
  users: [],
  selectedUser: null,
  subordinates: [],
  pagination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20
  },
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null
};

export const userReducer = createReducer(
  initialState,

  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.loadUsersSuccess, (state, { response }) => ({
    ...state,
    users: response.content,
    pagination: {
      totalPages: response.totalPages,
      totalElements: response.totalElements,
      currentPage: response.number,
      pageSize: response.size
    },
    loading: false,
    error: null
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load User by ID
  on(UserActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: false,
    error: null
  })),
  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create User
  on(UserActions.createUser, (state) => ({
    ...state,
    creating: true,
    error: null
  })),
  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    creating: false,
    error: null
  })),
  on(UserActions.createUserFailure, (state, { error }) => ({
    ...state,
    creating: false,
    error
  })),

  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    updating: true,
    error: null
  })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser,
    updating: false,
    error: null
  })),
  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    updating: false,
    error
  })),

  // Delete User
  on(UserActions.deleteUser, (state) => ({
    ...state,
    deleting: true,
    error: null
  })),
  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter(u => u.id !== id),
    selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
    deleting: false,
    error: null
  })),
  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error
  })),

  // Load Users by Role
  on(UserActions.loadUsersByRole, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.loadUsersByRoleSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null
  })),
  on(UserActions.loadUsersByRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load User Subordinates
  on(UserActions.loadUserSubordinates, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.loadUserSubordinatesSuccess, (state, { subordinates }) => ({
    ...state,
    subordinates,
    loading: false,
    error: null
  })),
  on(UserActions.loadUserSubordinatesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Add Supervisor
  on(UserActions.addSupervisor, (state) => ({
    ...state,
    updating: true,
    error: null
  })),
  on(UserActions.addSupervisorSuccess, (state) => ({
    ...state,
    updating: false,
    error: null
  })),
  on(UserActions.addSupervisorFailure, (state, { error }) => ({
    ...state,
    updating: false,
    error
  })),

  // Remove Supervisor
  on(UserActions.removeSupervisor, (state) => ({
    ...state,
    updating: true,
    error: null
  })),
  on(UserActions.removeSupervisorSuccess, (state) => ({
    ...state,
    updating: false,
    error: null
  })),
  on(UserActions.removeSupervisorFailure, (state, { error }) => ({
    ...state,
    updating: false,
    error
  })),

  // UI State
  on(UserActions.clearSelectedUser, (state) => ({
    ...state,
    selectedUser: null
  })),
  on(UserActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
