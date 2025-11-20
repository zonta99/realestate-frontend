// src/app/core/store/app.effects.ts
import { AuthEffects } from '../auth/store';
import { PropertyEffects } from '../../features/properties/store/property.effects';
import { CustomerEffects } from '../../features/customers/store';
import { SavedSearchEffects } from '../../features/saved-searches/store';
import { UserEffects } from '../../features/users/store';

export const appEffects = [
  AuthEffects,
  PropertyEffects,
  CustomerEffects,
  SavedSearchEffects,
  UserEffects,
];
