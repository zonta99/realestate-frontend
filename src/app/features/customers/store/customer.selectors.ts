// src/app/features/customers/store/customer.selectors.ts

import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CustomerState } from './customer.reducer';

/**
 * Feature selector for customer state
 */
export const selectCustomerState = createFeatureSelector<CustomerState>('customers');

/**
 * Select all customers
 */
export const selectAllCustomers = createSelector(
  selectCustomerState,
  (state) => state.customers
);

/**
 * Select selected customer
 */
export const selectSelectedCustomer = createSelector(
  selectCustomerState,
  (state) => state.selectedCustomer
);

/**
 * Select customer search criteria
 */
export const selectSearchCriteria = createSelector(
  selectCustomerState,
  (state) => state.searchCriteria
);

/**
 * Select customer property matches
 */
export const selectMatches = createSelector(
  selectCustomerState,
  (state) => state.matches
);

/**
 * Select loading state
 */
export const selectLoading = createSelector(
  selectCustomerState,
  (state) => state.loading
);

/**
 * Select creating state
 */
export const selectCreating = createSelector(
  selectCustomerState,
  (state) => state.creating
);

/**
 * Select updating state
 */
export const selectUpdating = createSelector(
  selectCustomerState,
  (state) => state.updating
);

/**
 * Select deleting state
 */
export const selectDeleting = createSelector(
  selectCustomerState,
  (state) => state.deleting
);

/**
 * Select loading matches state
 */
export const selectLoadingMatches = createSelector(
  selectCustomerState,
  (state) => state.loadingMatches
);

/**
 * Select error
 */
export const selectError = createSelector(
  selectCustomerState,
  (state) => state.error
);

/**
 * Select total elements (for pagination)
 */
export const selectTotalElements = createSelector(
  selectCustomerState,
  (state) => state.totalElements
);

/**
 * Select total pages (for pagination)
 */
export const selectTotalPages = createSelector(
  selectCustomerState,
  (state) => state.totalPages
);

/**
 * Select current page
 */
export const selectCurrentPage = createSelector(
  selectCustomerState,
  (state) => state.currentPage
);

/**
 * Select customer by ID
 */
export const selectCustomerById = (id: number) =>
  createSelector(selectAllCustomers, (customers) =>
    customers.find(customer => customer.id === id)
  );
