// src/app/core/store/app.effects.ts
import { AuthEffects } from '../auth/store';
import { PropertyEffects } from '../../features/properties/store/property.effects';
import { CustomerEffects } from '../../features/customers/store/customer.effects';
import { SavedSearchEffects } from '../../features/saved-searches/store/saved-search.effects';

export const appEffects = [
  AuthEffects,
  PropertyEffects,
  CustomerEffects,
  SavedSearchEffects,
];
