// src/app/features/customers/services/customer-facade.service.ts
import { Injectable, inject, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerActions } from '../store/customer.actions';
import {
  selectCustomers,
  selectSelectedCustomer,
  selectPagination,
  selectLoading,
  selectCreating,
  selectUpdating,
  selectDeleting,
  selectLoadingCriteria,
  selectLoadingMatches,
  selectAnyLoading,
  selectError,
  selectFilters,
  selectCustomerStatistics,
  selectCustomerSearchCriteria,
  selectPropertyMatches,
  selectSearchCriteriaByCustomerId,
  selectPropertyMatchesByCustomerId,
  selectPageInfo
} from '../store/customer.selectors';
import {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerListParams,
  CreateSearchCriteriaRequest
} from '../models/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerFacadeService {
  private store = inject(Store);

  // Selectors as signals (for use in components)
  readonly customers = this.store.selectSignal(selectCustomers);
  readonly selectedCustomer = this.store.selectSignal(selectSelectedCustomer);
  readonly pagination = this.store.selectSignal(selectPagination);
  readonly filters = this.store.selectSignal(selectFilters);
  readonly error = this.store.selectSignal(selectError);
  readonly statistics = this.store.selectSignal(selectCustomerStatistics);
  readonly pageInfo = this.store.selectSignal(selectPageInfo);

  // Loading state signals
  readonly loading = this.store.selectSignal(selectLoading);
  readonly creating = this.store.selectSignal(selectCreating);
  readonly updating = this.store.selectSignal(selectUpdating);
  readonly deleting = this.store.selectSignal(selectDeleting);
  readonly loadingCriteria = this.store.selectSignal(selectLoadingCriteria);
  readonly loadingMatches = this.store.selectSignal(selectLoadingMatches);
  readonly anyLoading = this.store.selectSignal(selectAnyLoading);

  // Computed values
  readonly hasCustomers = computed(() => this.customers().length > 0);
  readonly hasFilters = computed(() => Object.keys(this.filters()).length > 0);
  readonly isFirstPage = computed(() => this.pagination().currentPage === 0);
  readonly isLastPage = computed(() =>
    this.pagination().currentPage === this.pagination().totalPages - 1
  );

  // Observable versions for guards and other services
  readonly customers$ = this.store.select(selectCustomers);
  readonly selectedCustomer$ = this.store.select(selectSelectedCustomer);
  readonly loading$ = this.store.select(selectLoading);
  readonly error$ = this.store.select(selectError);

  // Actions - Customer CRUD
  loadCustomers(params?: CustomerListParams): void {
    this.store.dispatch(CustomerActions.loadCustomers({ params }));
  }

  loadCustomer(id: number): void {
    this.store.dispatch(CustomerActions.loadCustomer({ id }));
  }

  createCustomer(customer: CreateCustomerRequest): void {
    this.store.dispatch(CustomerActions.createCustomer({ customer }));
  }

  updateCustomer(id: number, customer: UpdateCustomerRequest): void {
    this.store.dispatch(CustomerActions.updateCustomer({ id, customer }));
  }

  deleteCustomer(id: number): void {
    this.store.dispatch(CustomerActions.deleteCustomer({ id }));
  }

  // Actions - Search Criteria
  loadSearchCriteria(customerId: number): void {
    this.store.dispatch(CustomerActions.loadSearchCriteria({ customerId }));
  }

  createSearchCriteria(customerId: number, criteria: CreateSearchCriteriaRequest): void {
    this.store.dispatch(CustomerActions.createSearchCriteria({ customerId, criteria }));
  }

  // Actions - Property Matches
  loadPropertyMatches(customerId: number): void {
    this.store.dispatch(CustomerActions.loadPropertyMatches({ customerId }));
  }

  // Actions - UI State
  setCurrentPage(page: number): void {
    this.store.dispatch(CustomerActions.setCurrentPage({ page }));
  }

  setPageSize(size: number): void {
    this.store.dispatch(CustomerActions.setPageSize({ size }));
  }

  setFilters(filters: CustomerListParams): void {
    this.store.dispatch(CustomerActions.setFilters({ filters }));
  }

  clearFilters(): void {
    this.store.dispatch(CustomerActions.clearFilters());
  }

  clearError(): void {
    this.store.dispatch(CustomerActions.clearError());
  }

  clearSelectedCustomer(): void {
    this.store.dispatch(CustomerActions.clearSelectedCustomer());
  }

  resetState(): void {
    this.store.dispatch(CustomerActions.resetState());
  }

  // Helper methods to get specific customer data
  getSearchCriteria(customerId: number) {
    return this.store.selectSignal(selectSearchCriteriaByCustomerId(customerId));
  }

  getPropertyMatches(customerId: number) {
    return this.store.selectSignal(selectPropertyMatchesByCustomerId(customerId));
  }
}
