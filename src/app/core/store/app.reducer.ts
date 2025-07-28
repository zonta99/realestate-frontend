// app.reducer.ts
import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../auth/store';

export interface AppState {
  auth: AuthState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
};
