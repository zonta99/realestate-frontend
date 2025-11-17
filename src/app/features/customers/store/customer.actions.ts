// src/app/features/customers/store/customer.actions.ts

import { createAction, props } from '@ngrx/store';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerSearchCriteria,
  CustomerMatchesResponse
} from '../models';

// Load customers (paginated)
export const loadCustomers = createAction(
  '[Customer] Load Customers',
  props<{ page?: number; size?: number; status?: string }>()
);

export const loadCustomersSuccess = createAction(
  '[Customer] Load Customers Success',
  props<{ customers: Customer[]; totalElements: number; totalPages: number }>()
);

export const loadCustomersFailure = createAction(
  '[Customer] Load Customers Failure',
  props<{ error: string }>()
);

// Load single customer
export const loadCustomer = createAction(
  '[Customer] Load Customer',
  props<{ id: number }>()
);

export const loadCustomerSuccess = createAction(
  '[Customer] Load Customer Success',
  props<{ customer: Customer }>()
);

export const loadCustomerFailure = createAction(
  '[Customer] Load Customer Failure',
  props<{ error: string }>()
);

// Create customer
export const createCustomer = createAction(
  '[Customer] Create Customer',
  props<{ customer: CreateCustomerRequest }>()
);

export const createCustomerSuccess = createAction(
  '[Customer] Create Customer Success',
  props<{ customer: Customer }>()
);

export const createCustomerFailure = createAction(
  '[Customer] Create Customer Failure',
  props<{ error: string }>()
);

// Update customer
export const updateCustomer = createAction(
  '[Customer] Update Customer',
  props<{ id: number; customer: UpdateCustomerRequest }>()
);

export const updateCustomerSuccess = createAction(
  '[Customer] Update Customer Success',
  props<{ customer: Customer }>()
);

export const updateCustomerFailure = createAction(
  '[Customer] Update Customer Failure',
  props<{ error: string }>()
);

// Delete customer
export const deleteCustomer = createAction(
  '[Customer] Delete Customer',
  props<{ id: number }>()
);

export const deleteCustomerSuccess = createAction(
  '[Customer] Delete Customer Success',
  props<{ id: number }>()
);

export const deleteCustomerFailure = createAction(
  '[Customer] Delete Customer Failure',
  props<{ error: string }>()
);

// Set search criteria
export const setSearchCriteria = createAction(
  '[Customer] Set Search Criteria',
  props<{ customerId: number; criteria: CustomerSearchCriteria }>()
);

export const setSearchCriteriaSuccess = createAction(
  '[Customer] Set Search Criteria Success',
  props<{ criteria: CustomerSearchCriteria }>()
);

export const setSearchCriteriaFailure = createAction(
  '[Customer] Set Search Criteria Failure',
  props<{ error: string }>()
);

// Load search criteria
export const loadSearchCriteria = createAction(
  '[Customer] Load Search Criteria',
  props<{ customerId: number }>()
);

export const loadSearchCriteriaSuccess = createAction(
  '[Customer] Load Search Criteria Success',
  props<{ criteria: CustomerSearchCriteria }>()
);

export const loadSearchCriteriaFailure = createAction(
  '[Customer] Load Search Criteria Failure',
  props<{ error: string }>()
);

// Load property matches
export const loadMatches = createAction(
  '[Customer] Load Matches',
  props<{ customerId: number }>()
);

export const loadMatchesSuccess = createAction(
  '[Customer] Load Matches Success',
  props<{ matches: CustomerMatchesResponse }>()
);

export const loadMatchesFailure = createAction(
  '[Customer] Load Matches Failure',
  props<{ error: string }>()
);

// Clear selected customer
export const clearSelectedCustomer = createAction(
  '[Customer] Clear Selected Customer'
);

// Clear matches
export const clearMatches = createAction(
  '[Customer] Clear Matches'
);
