// src/app/features/properties/store/property.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Property,
  PropertyPageResponse,
  PropertyListParams,
  PropertySearchParams,
  PropertySharing,
  SharePropertyRequest,
} from '../models/property.interface';
import { PropertyWithAttributes } from '../services/property.service';

export const PropertyActions = createActionGroup({
  source: 'Property',
  events: {
    // Load Properties
    'Load Properties': props<{ params?: PropertyListParams }>(),
    'Load Properties Success': props<{ response: PropertyPageResponse }>(),
    'Load Properties Failure': props<{ error: any }>(),

    // Load Property by ID
    'Load Property': props<{ id: number }>(),
    'Load Property Success': props<{ property: Property }>(),
    'Load Property Failure': props<{ error: any }>(),

    // Create Property with Attributes (Batch Create)
    'Create Property With Attributes': props<{ propertyData: PropertyWithAttributes }>(),
    'Create Property With Attributes Success': props<{ property: Property }>(),
    'Create Property With Attributes Failure': props<{ error: any }>(),

    // Update Property with Attributes (Batch Update)
    'Update Property With Attributes': props<{ id: number; propertyData: PropertyWithAttributes }>(),
    'Update Property With Attributes Success': props<{ property: Property }>(),
    'Update Property With Attributes Failure': props<{ error: any }>(),

    // Delete Property
    'Delete Property': props<{ id: number }>(),
    'Delete Property Success': props<{ id: number; message: string }>(),
    'Delete Property Failure': props<{ error: any }>(),

    // Search Properties
    'Search Properties': props<{ params: PropertySearchParams }>(),
    'Search Properties Success': props<{ properties: Property[] }>(),
    'Search Properties Failure': props<{ error: any }>(),

    // Property Sharing Management
    'Load Property Sharing': props<{ propertyId: number }>(),
    'Load Property Sharing Success': props<{ propertyId: number; sharing: PropertySharing[] }>(),
    'Load Property Sharing Failure': props<{ error: any }>(),

    'Share Property': props<{ propertyId: number; shareRequest: SharePropertyRequest }>(),
    'Share Property Success': props<{ propertyId: number; message: string }>(),
    'Share Property Failure': props<{ error: any }>(),

    'Unshare Property': props<{ propertyId: number; userId: number }>(),
    'Unshare Property Success': props<{ propertyId: number; userId: number; message: string }>(),
    'Unshare Property Failure': props<{ error: any }>(),

    // UI State Management
    'Set Loading': props<{ loading: boolean }>(),
    'Clear Error': emptyProps(),
    'Clear Selected Property': emptyProps(),
    'Set Current Page': props<{ page: number }>(),
    'Set Page Size': props<{ size: number }>(),
    'Set Filters': props<{ filters: PropertyListParams }>(),
    'Clear Filters': emptyProps(),
    'Reset State': emptyProps()
  }
});
