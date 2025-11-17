// src/app/features/customers/store/customer.effects.ts

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { CustomerService } from '../services';
import * as CustomerActions from './customer.actions';

/**
 * Customer effects for handling side effects
 */
@Injectable()
export class CustomerEffects {
  private actions$ = inject(Actions);
  private customerService = inject(CustomerService);
  private router = inject(Router);

  /**
   * Load customers effect
   */
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      switchMap(({ page = 0, size = 20, status }) =>
        this.customerService.getCustomers(page, size, status).pipe(
          map(response =>
            CustomerActions.loadCustomersSuccess({
              customers: response.content,
              totalElements: response.totalElements,
              totalPages: response.totalPages
            })
          ),
          catchError(error =>
            of(CustomerActions.loadCustomersFailure({
              error: error.message || 'Failed to load customers'
            }))
          )
        )
      )
    )
  );

  /**
   * Load single customer effect
   */
  loadCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomer),
      switchMap(({ id }) =>
        this.customerService.getCustomerById(id).pipe(
          map(customer =>
            CustomerActions.loadCustomerSuccess({ customer })
          ),
          catchError(error =>
            of(CustomerActions.loadCustomerFailure({
              error: error.message || 'Failed to load customer'
            }))
          )
        )
      )
    )
  );

  /**
   * Create customer effect
   */
  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomer),
      switchMap(({ customer }) =>
        this.customerService.createCustomer(customer).pipe(
          map(createdCustomer =>
            CustomerActions.createCustomerSuccess({ customer: createdCustomer })
          ),
          catchError(error =>
            of(CustomerActions.createCustomerFailure({
              error: error.message || 'Failed to create customer'
            }))
          )
        )
      )
    )
  );

  /**
   * Navigate after successful customer creation
   */
  createCustomerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerActions.createCustomerSuccess),
        tap(({ customer }) => {
          this.router.navigate(['/customers/view', customer.id]);
        })
      ),
    { dispatch: false }
  );

  /**
   * Update customer effect
   */
  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      switchMap(({ id, customer }) =>
        this.customerService.updateCustomer(id, customer).pipe(
          map(updatedCustomer =>
            CustomerActions.updateCustomerSuccess({ customer: updatedCustomer })
          ),
          catchError(error =>
            of(CustomerActions.updateCustomerFailure({
              error: error.message || 'Failed to update customer'
            }))
          )
        )
      )
    )
  );

  /**
   * Navigate after successful customer update
   */
  updateCustomerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerActions.updateCustomerSuccess),
        tap(({ customer }) => {
          this.router.navigate(['/customers/view', customer.id]);
        })
      ),
    { dispatch: false }
  );

  /**
   * Delete customer effect
   */
  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomer),
      switchMap(({ id }) =>
        this.customerService.deleteCustomer(id).pipe(
          map(() =>
            CustomerActions.deleteCustomerSuccess({ id })
          ),
          catchError(error =>
            of(CustomerActions.deleteCustomerFailure({
              error: error.message || 'Failed to delete customer'
            }))
          )
        )
      )
    )
  );

  /**
   * Navigate after successful customer deletion
   */
  deleteCustomerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerActions.deleteCustomerSuccess),
        tap(() => {
          this.router.navigate(['/customers/list']);
        })
      ),
    { dispatch: false }
  );

  /**
   * Set search criteria effect
   */
  setSearchCriteria$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.setSearchCriteria),
      switchMap(({ customerId, criteria }) =>
        this.customerService.setSearchCriteria(customerId, criteria).pipe(
          map(savedCriteria =>
            CustomerActions.setSearchCriteriaSuccess({ criteria: savedCriteria })
          ),
          catchError(error =>
            of(CustomerActions.setSearchCriteriaFailure({
              error: error.message || 'Failed to save search criteria'
            }))
          )
        )
      )
    )
  );

  /**
   * Load search criteria effect
   */
  loadSearchCriteria$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadSearchCriteria),
      switchMap(({ customerId }) =>
        this.customerService.getSearchCriteria(customerId).pipe(
          map(criteria =>
            CustomerActions.loadSearchCriteriaSuccess({ criteria })
          ),
          catchError(error =>
            of(CustomerActions.loadSearchCriteriaFailure({
              error: error.message || 'Failed to load search criteria'
            }))
          )
        )
      )
    )
  );

  /**
   * Load property matches effect
   */
  loadMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadMatches),
      switchMap(({ customerId }) =>
        this.customerService.getMatches(customerId).pipe(
          map(matches =>
            CustomerActions.loadMatchesSuccess({ matches })
          ),
          catchError(error =>
            of(CustomerActions.loadMatchesFailure({
              error: error.message || 'Failed to load property matches'
            }))
          )
        )
      )
    )
  );
}
