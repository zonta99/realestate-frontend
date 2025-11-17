// src/app/features/customers/store/customer.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Customer,
  CustomerPageResponse,
  CustomerListParams,
  CustomerSearchCriteria,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CreateSearchCriteriaRequest
} from '../models/customer.interface';

export const CustomerActions = createActionGroup({
  source: 'Customer',
  events: {
    // Load Customers
    'Load Customers': props<{ params?: CustomerListParams }>(),
    'Load Customers Success': props<{ response: CustomerPageResponse }>(),
    'Load Customers Failure': props<{ error: any }>(),

    // Load Customer by ID
    'Load Customer': props<{ id: number }>(),
    'Load Customer Success': props<{ customer: Customer }>(),
    'Load Customer Failure': props<{ error: any }>(),

    // Create Customer
    'Create Customer': props<{ customer: CreateCustomerRequest }>(),
    'Create Customer Success': props<{ customer: Customer }>(),
    'Create Customer Failure': props<{ error: any }>(),

    // Update Customer
    'Update Customer': props<{ id: number; customer: UpdateCustomerRequest }>(),
    'Update Customer Success': props<{ customer: Customer }>(),
    'Update Customer Failure': props<{ error: any }>(),

    // Delete Customer
    'Delete Customer': props<{ id: number }>(),
    'Delete Customer Success': props<{ id: number; message: string }>(),
    'Delete Customer Failure': props<{ error: any }>(),

    // Search Criteria Management
    'Load Search Criteria': props<{ customerId: number }>(),
    'Load Search Criteria Success': props<{ customerId: number; criteria: CustomerSearchCriteria[] }>(),
    'Load Search Criteria Failure': props<{ error: any }>(),

    'Create Search Criteria': props<{ customerId: number; criteria: CreateSearchCriteriaRequest }>(),
    'Create Search Criteria Success': props<{ customerId: number; criteria: CustomerSearchCriteria }>(),
    'Create Search Criteria Failure': props<{ error: any }>(),

    // Property Matches
    'Load Property Matches': props<{ customerId: number }>(),
    'Load Property Matches Success': props<{ customerId: number; matches: any[] }>(),
    'Load Property Matches Failure': props<{ error: any }>(),

    // UI State Management
    'Set Loading': props<{ loading: boolean }>(),
    'Clear Error': emptyProps(),
    'Clear Selected Customer': emptyProps(),
    'Set Current Page': props<{ page: number }>(),
    'Set Page Size': props<{ size: number }>(),
    'Set Filters': props<{ filters: CustomerListParams }>(),
    'Clear Filters': emptyProps(),
    'Reset State': emptyProps()
  }
});
