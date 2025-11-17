// src/app/features/customers/store/customer.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from './customer.reducer';
import { Customer, CustomerStatus } from '../models/customer.interface';

// Feature selector
export const selectCustomerState = createFeatureSelector<CustomerState>('customers');

// Basic selectors
export const selectCustomers = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.customers
);

export const selectSelectedCustomer = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.selectedCustomer
);

export const selectCustomerSearchCriteria = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.customerSearchCriteria
);

export const selectPropertyMatches = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.propertyMatches
);

export const selectFilters = createSelector(
  selectCustomerState,
  (state: CustomerState) => state?.filters || {}
);

// Pagination selectors
export const selectPagination = createSelector(
  selectCustomerState,
  (state: CustomerState) => ({
    currentPage: state?.currentPage || 0,
    pageSize: state?.pageSize || 20,
    totalElements: state?.totalElements || 0,
    totalPages: state?.totalPages || 0
  })
);

export const selectCurrentPage = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.currentPage
);

export const selectPageSize = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.pageSize
);

export const selectTotalElements = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.totalElements
);

export const selectTotalPages = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.totalPages
);

// Loading state selectors
export const selectLoading = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.loading
);

export const selectCreating = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.creating
);

export const selectUpdating = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.updating
);

export const selectDeleting = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.deleting
);

export const selectLoadingCriteria = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.loadingCriteria
);

export const selectLoadingMatches = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.loadingMatches
);

export const selectAnyLoading = createSelector(
  selectCustomerState,
  (state: CustomerState) =>
    state.loading || state.creating || state.updating ||
    state.deleting || state.loadingCriteria || state.loadingMatches
);

// Error selector
export const selectError = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.error
);

export const selectLastOperation = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.lastOperation
);

// Computed selectors
export const selectCustomerById = (id: number) => createSelector(
  selectCustomers,
  (customers: Customer[]) => customers.find(customer => customer.id === id)
);

export const selectCustomersByStatus = (status: CustomerStatus) => createSelector(
  selectCustomers,
  (customers: Customer[]) => customers.filter(customer => customer.status === status)
);

export const selectCustomersByAgent = (agentId: number) => createSelector(
  selectCustomers,
  (customers: Customer[]) => customers.filter(customer => customer.agentId === agentId)
);

export const selectActiveCustomers = createSelector(
  selectCustomers,
  (customers: Customer[]) => customers.filter(customer => customer.status === CustomerStatus.ACTIVE)
);

export const selectLeads = createSelector(
  selectCustomers,
  (customers: Customer[]) => customers.filter(customer => customer.status === CustomerStatus.LEAD)
);

export const selectProspects = createSelector(
  selectCustomers,
  (customers: Customer[]) => customers.filter(customer => customer.status === CustomerStatus.PROSPECT)
);

export const selectClients = createSelector(
  selectCustomers,
  (customers: Customer[]) => customers.filter(customer => customer.status === CustomerStatus.CLIENT)
);

// Customer search criteria selectors
export const selectSearchCriteriaByCustomerId = (customerId: number) => createSelector(
  selectCustomerSearchCriteria,
  (criteria) => criteria[customerId] || []
);

// Property matches selectors
export const selectPropertyMatchesByCustomerId = (customerId: number) => createSelector(
  selectPropertyMatches,
  (matches) => matches[customerId] || []
);

// Statistics selectors
export const selectCustomerStatistics = createSelector(
  selectCustomers,
  (customers: Customer[]) => {
    const total = customers.length;
    const active = customers.filter(c => c.status === CustomerStatus.ACTIVE).length;
    const inactive = customers.filter(c => c.status === CustomerStatus.INACTIVE).length;
    const leads = customers.filter(c => c.status === CustomerStatus.LEAD).length;
    const prospects = customers.filter(c => c.status === CustomerStatus.PROSPECT).length;
    const clients = customers.filter(c => c.status === CustomerStatus.CLIENT).length;

    return {
      total,
      active,
      inactive,
      leads,
      prospects,
      clients
    };
  }
);

// Search and filter helpers
export const selectHasFilters = createSelector(
  selectFilters,
  (filters) => Object.keys(filters).length > 0
);

// UI state selectors
export const selectCanLoadMore = createSelector(
  selectCurrentPage,
  selectTotalPages,
  (currentPage, totalPages) => currentPage < totalPages - 1
);

export const selectIsFirstPage = createSelector(
  selectCurrentPage,
  (currentPage) => currentPage === 0
);

export const selectIsLastPage = createSelector(
  selectCurrentPage,
  selectTotalPages,
  (currentPage, totalPages) => currentPage === totalPages - 1
);

export const selectPageInfo = createSelector(
  selectCurrentPage,
  selectPageSize,
  selectTotalElements,
  (currentPage, pageSize, totalElements) => {
    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalElements);
    return {
      startItem: totalElements > 0 ? startItem : 0,
      endItem,
      totalElements
    };
  }
);
