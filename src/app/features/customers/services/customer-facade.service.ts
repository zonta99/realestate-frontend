// src/app/features/customers/services/customer-facade.service.ts

import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerSearchCriteria,
  CustomerMatchesResponse
} from '../models';
import * as CustomerActions from '../store/customer.actions';
import * as CustomerSelectors from '../store/customer.selectors';

/**
 * Facade service for customer feature
 * Provides a simple API over NgRx store
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerFacadeService {
  private store = inject(Store);

  // Observables (for guards/services)
  readonly customers$: Observable<Customer[]> = this.store.select(
    CustomerSelectors.selectAllCustomers
  );

  readonly selectedCustomer$: Observable<Customer | null> = this.store.select(
    CustomerSelectors.selectSelectedCustomer
  );

  readonly searchCriteria$: Observable<CustomerSearchCriteria | null> = this.store.select(
    CustomerSelectors.selectSearchCriteria
  );

  readonly matches$: Observable<CustomerMatchesResponse | null> = this.store.select(
    CustomerSelectors.selectMatches
  );

  readonly loading$: Observable<boolean> = this.store.select(
    CustomerSelectors.selectLoading
  );

  readonly creating$: Observable<boolean> = this.store.select(
    CustomerSelectors.selectCreating
  );

  readonly updating$: Observable<boolean> = this.store.select(
    CustomerSelectors.selectUpdating
  );

  readonly deleting$: Observable<boolean> = this.store.select(
    CustomerSelectors.selectDeleting
  );

  readonly loadingMatches$: Observable<boolean> = this.store.select(
    CustomerSelectors.selectLoadingMatches
  );

  readonly error$: Observable<string | null> = this.store.select(
    CustomerSelectors.selectError
  );

  readonly totalElements$: Observable<number> = this.store.select(
    CustomerSelectors.selectTotalElements
  );

  readonly totalPages$: Observable<number> = this.store.select(
    CustomerSelectors.selectTotalPages
  );

  readonly currentPage$: Observable<number> = this.store.select(
    CustomerSelectors.selectCurrentPage
  );

  // Signals (for components)
  readonly customers: Signal<Customer[]> = toSignal(this.customers$, {
    initialValue: []
  });

  readonly selectedCustomer: Signal<Customer | null> = toSignal(
    this.selectedCustomer$,
    { initialValue: null }
  );

  readonly searchCriteria: Signal<CustomerSearchCriteria | null> = toSignal(
    this.searchCriteria$,
    { initialValue: null }
  );

  readonly matches: Signal<CustomerMatchesResponse | null> = toSignal(
    this.matches$,
    { initialValue: null }
  );

  readonly loading: Signal<boolean> = toSignal(this.loading$, {
    initialValue: false
  });

  readonly creating: Signal<boolean> = toSignal(this.creating$, {
    initialValue: false
  });

  readonly updating: Signal<boolean> = toSignal(this.updating$, {
    initialValue: false
  });

  readonly deleting: Signal<boolean> = toSignal(this.deleting$, {
    initialValue: false
  });

  readonly loadingMatches: Signal<boolean> = toSignal(this.loadingMatches$, {
    initialValue: false
  });

  readonly error: Signal<string | null> = toSignal(this.error$, {
    initialValue: null
  });

  readonly totalElements: Signal<number> = toSignal(this.totalElements$, {
    initialValue: 0
  });

  readonly totalPages: Signal<number> = toSignal(this.totalPages$, {
    initialValue: 0
  });

  readonly currentPage: Signal<number> = toSignal(this.currentPage$, {
    initialValue: 0
  });

  /**
   * Load customers with optional filters
   */
  loadCustomers(page: number = 0, size: number = 20, status?: string): void {
    this.store.dispatch(CustomerActions.loadCustomers({ page, size, status }));
  }

  /**
   * Load a single customer by ID
   */
  loadCustomer(id: number): void {
    this.store.dispatch(CustomerActions.loadCustomer({ id }));
  }

  /**
   * Create a new customer
   */
  createCustomer(customer: CreateCustomerRequest): void {
    this.store.dispatch(CustomerActions.createCustomer({ customer }));
  }

  /**
   * Update an existing customer
   */
  updateCustomer(id: number, customer: UpdateCustomerRequest): void {
    this.store.dispatch(CustomerActions.updateCustomer({ id, customer }));
  }

  /**
   * Delete a customer
   */
  deleteCustomer(id: number): void {
    this.store.dispatch(CustomerActions.deleteCustomer({ id }));
  }

  /**
   * Set search criteria for a customer
   */
  setSearchCriteria(customerId: number, criteria: CustomerSearchCriteria): void {
    this.store.dispatch(CustomerActions.setSearchCriteria({ customerId, criteria }));
  }

  /**
   * Load search criteria for a customer
   */
  loadSearchCriteria(customerId: number): void {
    this.store.dispatch(CustomerActions.loadSearchCriteria({ customerId }));
  }

  /**
   * Load property matches for a customer
   */
  loadMatches(customerId: number): void {
    this.store.dispatch(CustomerActions.loadMatches({ customerId }));
  }

  /**
   * Clear selected customer
   */
  clearSelectedCustomer(): void {
    this.store.dispatch(CustomerActions.clearSelectedCustomer());
  }

  /**
   * Clear matches
   */
  clearMatches(): void {
    this.store.dispatch(CustomerActions.clearMatches());
  }

  /**
   * Get customer by ID from store
   */
  getCustomerById(id: number): Observable<Customer | undefined> {
    return this.store.select(CustomerSelectors.selectCustomerById(id));
  }
}
