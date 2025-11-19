// app.reducer.ts
import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../auth/store';
import { propertyReducer, PropertyState } from '../../features/properties/store/property.reducer';
import { customerReducer, CustomerState } from '../../features/customers/store/customer.reducer';
import { savedSearchReducer, SavedSearchState } from '../../features/saved-searches/store/saved-search.reducer';

export interface AppState {
  auth: AuthState;
  properties: PropertyState;
  customers: CustomerState;
  savedSearches: SavedSearchState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  properties: propertyReducer,
  customers: customerReducer,
  savedSearches: savedSearchReducer,
};
