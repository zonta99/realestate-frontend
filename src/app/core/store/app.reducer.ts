// app.reducer.ts
import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../auth/store';
import { propertyReducer, PropertyState } from '../../features/properties/store/property.reducer';
import { customerReducer, CustomerState } from '../../features/customers/store/customer.reducer';

export interface AppState {
  auth: AuthState;
  properties: PropertyState;
  customers: CustomerState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  properties: propertyReducer,
  customers: customerReducer,
};
