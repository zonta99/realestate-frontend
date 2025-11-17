// src/app/features/customers/store/customer.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Customer, CustomerListParams, CustomerSearchCriteria } from '../models/customer.interface';
import { CustomerActions } from './customer.actions';

export interface CustomerState {
  // Customers list and pagination
  customers: Customer[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;

  // Selected customer details
  selectedCustomer: Customer | null;
  customerSearchCriteria: { [customerId: number]: CustomerSearchCriteria[] };
  propertyMatches: { [customerId: number]: any[] };

  // Filters
  filters: CustomerListParams;

  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loadingCriteria: boolean;
  loadingMatches: boolean;

  // Error handling
  error: any;

  // UI state
  lastOperation: string | null;
}

export const initialState: CustomerState = {
  customers: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 20,

  selectedCustomer: null,
  customerSearchCriteria: {},
  propertyMatches: {},

  filters: {},

  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  loadingCriteria: false,
  loadingMatches: false,

  error: null,

  lastOperation: null
};

export const customerReducer = createReducer(
  initialState,

  // Load Customers
  on(CustomerActions.loadCustomers, (state, { params }) => ({
    ...state,
    loading: true,
    error: null,
    filters: params || state.filters,
    lastOperation: 'loadCustomers'
  })),

  on(CustomerActions.loadCustomersSuccess, (state, { response }) => ({
    ...state,
    customers: response.content,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    currentPage: response.number,
    pageSize: response.size,
    loading: false,
    error: null
  })),

  on(CustomerActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Customer by ID
  on(CustomerActions.loadCustomer, (state) => ({
    ...state,
    loading: true,
    error: null,
    lastOperation: 'loadCustomer'
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

  // Create Customer
  on(CustomerActions.createCustomer, (state) => ({
    ...state,
    creating: true,
    error: null,
    lastOperation: 'createCustomer'
  })),

  on(CustomerActions.createCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: [customer, ...state.customers],
    selectedCustomer: customer,
    creating: false,
    error: null,
    totalElements: state.totalElements + 1
  })),

  on(CustomerActions.createCustomerFailure, (state, { error }) => ({
    ...state,
    creating: false,
    error
  })),

  // Update Customer
  on(CustomerActions.updateCustomer, (state) => ({
    ...state,
    updating: true,
    error: null,
    lastOperation: 'updateCustomer'
  })),

  on(CustomerActions.updateCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: state.customers.map(c => c.id === customer.id ? customer : c),
    selectedCustomer: state.selectedCustomer?.id === customer.id ? customer : state.selectedCustomer,
    updating: false,
    error: null
  })),

  on(CustomerActions.updateCustomerFailure, (state, { error }) => ({
    ...state,
    updating: false,
    error
  })),

  // Delete Customer
  on(CustomerActions.deleteCustomer, (state) => ({
    ...state,
    deleting: true,
    error: null,
    lastOperation: 'deleteCustomer'
  })),

  on(CustomerActions.deleteCustomerSuccess, (state, { id }) => ({
    ...state,
    customers: state.customers.filter(c => c.id !== id),
    selectedCustomer: state.selectedCustomer?.id === id ? null : state.selectedCustomer,
    deleting: false,
    error: null,
    totalElements: Math.max(0, state.totalElements - 1),
    // Remove associated data
    customerSearchCriteria: Object.fromEntries(
      Object.entries(state.customerSearchCriteria).filter(([customerId]) => +customerId !== id)
    ),
    propertyMatches: Object.fromEntries(
      Object.entries(state.propertyMatches).filter(([customerId]) => +customerId !== id)
    )
  })),

  on(CustomerActions.deleteCustomerFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error
  })),

  // Search Criteria Management
  on(CustomerActions.loadSearchCriteria, (state) => ({
    ...state,
    loadingCriteria: true,
    error: null,
    lastOperation: 'loadSearchCriteria'
  })),

  on(CustomerActions.loadSearchCriteriaSuccess, (state, { customerId, criteria }) => ({
    ...state,
    customerSearchCriteria: {
      ...state.customerSearchCriteria,
      [customerId]: criteria
    },
    loadingCriteria: false,
    error: null
  })),

  on(CustomerActions.loadSearchCriteriaFailure, (state, { error }) => ({
    ...state,
    loadingCriteria: false,
    error
  })),

  on(CustomerActions.createSearchCriteria, (state) => ({
    ...state,
    loadingCriteria: true,
    error: null,
    lastOperation: 'createSearchCriteria'
  })),

  on(CustomerActions.createSearchCriteriaSuccess, (state, { customerId, criteria }) => ({
    ...state,
    customerSearchCriteria: {
      ...state.customerSearchCriteria,
      [customerId]: [...(state.customerSearchCriteria[customerId] || []), criteria]
    },
    loadingCriteria: false,
    error: null
  })),

  on(CustomerActions.createSearchCriteriaFailure, (state, { error }) => ({
    ...state,
    loadingCriteria: false,
    error
  })),

  // Property Matches
  on(CustomerActions.loadPropertyMatches, (state) => ({
    ...state,
    loadingMatches: true,
    error: null,
    lastOperation: 'loadPropertyMatches'
  })),

  on(CustomerActions.loadPropertyMatchesSuccess, (state, { customerId, matches }) => ({
    ...state,
    propertyMatches: {
      ...state.propertyMatches,
      [customerId]: matches
    },
    loadingMatches: false,
    error: null
  })),

  on(CustomerActions.loadPropertyMatchesFailure, (state, { error }) => ({
    ...state,
    loadingMatches: false,
    error
  })),

  // UI State Management
  on(CustomerActions.setLoading, (state, { loading }) => ({
    ...state,
    loading
  })),

  on(CustomerActions.clearError, (state) => ({
    ...state,
    error: null
  })),

  on(CustomerActions.clearSelectedCustomer, (state) => ({
    ...state,
    selectedCustomer: null
  })),

  on(CustomerActions.setCurrentPage, (state, { page }) => ({
    ...state,
    currentPage: page
  })),

  on(CustomerActions.setPageSize, (state, { size }) => ({
    ...state,
    pageSize: size
  })),

  on(CustomerActions.setFilters, (state, { filters }) => ({
    ...state,
    filters
  })),

  on(CustomerActions.clearFilters, (state) => ({
    ...state,
    filters: {}
  })),

  on(CustomerActions.resetState, () => ({
    ...initialState
  }))
);
