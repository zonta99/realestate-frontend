// src/app/core/store/app.state.ts
import {AuthState} from '../auth/models';

export interface AppState {
  auth: AuthState;
  // Future feature states will be added here
  // users: UserState;
  // properties: PropertyState;
  // customers: CustomerState;
}
