// src/app/core/store/app.effects.ts
import { AuthEffects } from '../auth/store';
import { PropertyEffects } from '../../features/properties/store/property.effects';

export const appEffects = [
  AuthEffects,
  PropertyEffects,
];
