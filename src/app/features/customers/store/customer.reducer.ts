// src/app/features/customers/store/customer.reducer.ts

import { createReducer, on } from '@ngrx/store';
import {
  Customer,
  CustomerSearchCriteria,
  CustomerMatchesResponse
} from '../models';
import * as CustomerActions from './customer.actions';

/**
 * Customer feature state interface
 */
export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  searchCriteria: CustomerSearchCriteria | null;
  matches: CustomerMatchesResponse | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loadingMatches: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Initial state
 */
export const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  searchCriteria: null,
  matches: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  loadingMatches: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0
};

/**
 * Customer reducer
 */
export const customerReducer = createReducer(
  initialState,

  // Load customers
  on(CustomerActions.loadCustomers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CustomerActions.loadCustomersSuccess, (state, { customers, totalElements, totalPages }) => ({
    ...state,
    customers,
    totalElements,
    totalPages,
    loading: false,
    error: null
  })),
  on(CustomerActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load single customer
  on(CustomerActions.loadCustomer, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CustomerActions.loadCustomerSuccess, (state, { customer }) => ({
    ...state,
    selectedCustomer: customer,
    loading: false,
    error: null
  })),
  on(CustomerActions.loadCustomerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create customer
  on(CustomerActions.createCustomer, (state) => ({
    ...state,
    creating: true,
    error: null
  })),
  on(CustomerActions.createCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: [...state.customers, customer],
    selectedCustomer: customer,
    creating: false,
    error: null
  })),
  on(CustomerActions.createCustomerFailure, (state, { error }) => ({
    ...state,
    creating: false,
    error
  })),

  // Update customer
  on(CustomerActions.updateCustomer, (state) => ({
    ...state,
    updating: true,
    error: null
  })),
  on(CustomerActions.updateCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: state.customers.map(c => c.id === customer.id ? customer : c),
    selectedCustomer: customer,
    updating: false,
    error: null
  })),
  on(CustomerActions.updateCustomerFailure, (state, { error }) => ({
    ...state,
    updating: false,
    error
  })),

  // Delete customer
  on(CustomerActions.deleteCustomer, (state) => ({
    ...state,
    deleting: true,
    error: null
  })),
  on(CustomerActions.deleteCustomerSuccess, (state, { id }) => ({
    ...state,
    customers: state.customers.filter(c => c.id !== id),
    selectedCustomer: state.selectedCustomer?.id === id ? null : state.selectedCustomer,
    deleting: false,
    error: null
  })),
  on(CustomerActions.deleteCustomerFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error
  })),

  // Set search criteria
  on(CustomerActions.setSearchCriteria, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CustomerActions.setSearchCriteriaSuccess, (state, { criteria }) => ({
    ...state,
    searchCriteria: criteria,
    loading: false,
    error: null
  })),
  on(CustomerActions.setSearchCriteriaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load search criteria
  on(CustomerActions.loadSearchCriteria, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CustomerActions.loadSearchCriteriaSuccess, (state, { criteria }) => ({
    ...state,
    searchCriteria: criteria,
    loading: false,
    error: null
  })),
  on(CustomerActions.loadSearchCriteriaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load matches
  on(CustomerActions.loadMatches, (state) => ({
    ...state,
    loadingMatches: true,
    error: null
  })),
  on(CustomerActions.loadMatchesSuccess, (state, { matches }) => ({
    ...state,
    matches,
    loadingMatches: false,
    error: null
  })),
  on(CustomerActions.loadMatchesFailure, (state, { error }) => ({
    ...state,
    loadingMatches: false,
    error
  })),

  // Clear selected customer
  on(CustomerActions.clearSelectedCustomer, (state) => ({
    ...state,
    selectedCustomer: null,
    searchCriteria: null,
    matches: null
  })),

  // Clear matches
  on(CustomerActions.clearMatches, (state) => ({
    ...state,
    matches: null
  }))
);
