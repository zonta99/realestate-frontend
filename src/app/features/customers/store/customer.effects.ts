// src/app/features/customers/store/customer.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { CustomerService } from '../services/customer.service';
import { CustomerActions } from './customer.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class CustomerEffects {
  private actions$ = inject(Actions);
  private customerService = inject(CustomerService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // Load Customers Effect
  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      switchMap(({ params }) =>
        this.customerService.getCustomers(params).pipe(
          map(response => CustomerActions.loadCustomersSuccess({ response })),
          catchError(error => of(CustomerActions.loadCustomersFailure({ error })))
        )
      )
    )
  );

  // Load Customer by ID Effect
  loadCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomer),
      switchMap(({ id }) =>
        this.customerService.getCustomerById(id).pipe(
          map(customer => CustomerActions.loadCustomerSuccess({ customer })),
          catchError(error => of(CustomerActions.loadCustomerFailure({ error })))
        )
      )
    )
  );

  // Create Customer Effect
  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createCustomer),
      switchMap(({ customer }) =>
        this.customerService.createCustomer(customer).pipe(
          map(createdCustomer => CustomerActions.createCustomerSuccess({ customer: createdCustomer })),
          catchError(error => of(CustomerActions.createCustomerFailure({ error })))
        )
      )
    )
  );

  // Update Customer Effect
  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      switchMap(({ id, customer }) =>
        this.customerService.updateCustomer(id, customer).pipe(
          map(updatedCustomer => CustomerActions.updateCustomerSuccess({ customer: updatedCustomer })),
          catchError(error => of(CustomerActions.updateCustomerFailure({ error })))
        )
      )
    )
  );

  // Delete Customer Effect
  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteCustomer),
      switchMap(({ id }) =>
        this.customerService.deleteCustomer(id).pipe(
          map(response => CustomerActions.deleteCustomerSuccess({ id, message: response.message })),
          catchError(error => of(CustomerActions.deleteCustomerFailure({ error })))
        )
      )
    )
  );

  // Load Search Criteria Effect
  loadSearchCriteria$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadSearchCriteria),
      switchMap(({ customerId }) =>
        this.customerService.getSearchCriteria(customerId).pipe(
          map(criteria => CustomerActions.loadSearchCriteriaSuccess({ customerId, criteria })),
          catchError(error => of(CustomerActions.loadSearchCriteriaFailure({ error })))
        )
      )
    )
  );

  // Create Search Criteria Effect
  createSearchCriteria$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.createSearchCriteria),
      switchMap(({ customerId, criteria }) =>
        this.customerService.createSearchCriteria(customerId, criteria).pipe(
          map(createdCriteria => CustomerActions.createSearchCriteriaSuccess({ customerId, criteria: createdCriteria })),
          catchError(error => of(CustomerActions.createSearchCriteriaFailure({ error })))
        )
      )
    )
  );

  // Load Property Matches Effect
  loadPropertyMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadPropertyMatches),
      switchMap(({ customerId }) =>
        this.customerService.getPropertyMatches(customerId).pipe(
          map(matches => CustomerActions.loadPropertyMatchesSuccess({ customerId, matches })),
          catchError(error => of(CustomerActions.loadPropertyMatchesFailure({ error })))
        )
      )
    )
  );

  // Success Notifications
  createCustomerSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CustomerActions.createCustomerSuccess),
        tap(({ customer }) => {
          this.snackBar.open(`Customer "${customer.firstName} ${customer.lastName}" created successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // Navigate to customer details
          this.router.navigate(['/customers/view', customer.id]);
        })
      ),
    { dispatch: false }
  );

  updateCustomerSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CustomerActions.updateCustomerSuccess),
        tap(({ customer }) => {
          this.snackBar.open(`Customer "${customer.firstName} ${customer.lastName}" updated successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // Navigate to customer details
          this.router.navigate(['/customers/view', customer.id]);
        })
      ),
    { dispatch: false }
  );

  deleteCustomerSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CustomerActions.deleteCustomerSuccess),
        tap(({ message }) => {
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // Navigate back to list
          this.router.navigate(['/customers/list']);
        })
      ),
    { dispatch: false }
  );

  createSearchCriteriaSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CustomerActions.createSearchCriteriaSuccess),
        tap(() => {
          this.snackBar.open('Search criteria saved successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        })
      ),
    { dispatch: false }
  );

  // Error Notifications
  customerError$ = createEffect(() =>
      this.actions$.pipe(
        ofType(
          CustomerActions.loadCustomersFailure,
          CustomerActions.loadCustomerFailure,
          CustomerActions.createCustomerFailure,
          CustomerActions.updateCustomerFailure,
          CustomerActions.deleteCustomerFailure,
          CustomerActions.loadSearchCriteriaFailure,
          CustomerActions.createSearchCriteriaFailure,
          CustomerActions.loadPropertyMatchesFailure
        ),
        tap(({ error }) => {
          const errorMessage = error?.error?.message || error?.message || 'An error occurred';
          this.snackBar.open(`Error: ${errorMessage}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        })
      ),
    { dispatch: false }
  );
}
