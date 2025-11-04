// src/app/features/properties/store/property.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { PropertyService } from '../services/property.service';
import { PropertyActions } from './property.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class PropertyEffects {
  private actions$ = inject(Actions);
  private propertyService = inject(PropertyService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // Load Properties Effect
  loadProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertyActions.loadProperties),
      switchMap(({ params }) =>
        this.propertyService.getProperties(params).pipe(
          map(response => PropertyActions.loadPropertiesSuccess({ response })),
          catchError(error => of(PropertyActions.loadPropertiesFailure({ error })))
        )
      )
    )
  );

  // Load Property by ID Effect - Updated to use full data
  loadProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertyActions.loadProperty),
      switchMap(({ id }) =>
        this.propertyService.getPropertyFullData(id).pipe(
          map(propertyFullData => PropertyActions.loadPropertySuccess({
            property: propertyFullData.property
          })),
          catchError(error => of(PropertyActions.loadPropertyFailure({ error })))
        )
      )
    )
  );

  // Create Property with Attributes Effect - Atomic batch create
  createPropertyWithAttributes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertyActions.createPropertyWithAttributes),
      switchMap(({ propertyData }) =>
        this.propertyService.createPropertyWithAttributes(propertyData).pipe(
          map(createdProperty => PropertyActions.createPropertyWithAttributesSuccess({ property: createdProperty })),
          catchError(error => of(PropertyActions.createPropertyWithAttributesFailure({ error })))
        )
      )
    )
  );

  // Update Property with Attributes Effect - Atomic batch update
  updatePropertyWithAttributes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertyActions.updatePropertyWithAttributes),
      switchMap(({ id, propertyData }) =>
        this.propertyService.updatePropertyWithAttributes(id, propertyData).pipe(
          map(updatedProperty => PropertyActions.updatePropertyWithAttributesSuccess({ property: updatedProperty })),
          catchError(error => of(PropertyActions.updatePropertyWithAttributesFailure({ error })))
        )
      )
    )
  );

  // Delete Property Effect
  deleteProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertyActions.deleteProperty),
      switchMap(({ id }) =>
        this.propertyService.deleteProperty(id).pipe(
          map(response => PropertyActions.deletePropertySuccess({ id, message: response.message })),
          catchError(error => of(PropertyActions.deletePropertyFailure({ error })))
        )
      )
    )
  );

  // Search Properties Effect
  searchProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertyActions.searchProperties),
      switchMap(({ params }) =>
        this.propertyService.searchProperties(params).pipe(
          map(properties => PropertyActions.searchPropertiesSuccess({ properties })),
          catchError(error => of(PropertyActions.searchPropertiesFailure({ error })))
        )
      )
    )
  );

  // Load Property Sharing Effect
  loadPropertySharing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertyActions.loadPropertySharing),
      switchMap(({ propertyId }) =>
        this.propertyService.getPropertySharingDetails(propertyId).pipe(
          map(sharing => PropertyActions.loadPropertySharingSuccess({ propertyId, sharing })),
          catchError(error => of(PropertyActions.loadPropertySharingFailure({ error })))
        )
      )
    )
  );

  // Share Property Effect
  shareProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertyActions.shareProperty),
      switchMap(({ propertyId, shareRequest }) =>
        this.propertyService.shareProperty(propertyId, shareRequest).pipe(
          map(response => PropertyActions.sharePropertySuccess({
            propertyId,
            message: response.message
          })),
          catchError(error => of(PropertyActions.sharePropertyFailure({ error })))
        )
      )
    )
  );

  // Unshare Property Effect
  unshareProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertyActions.unshareProperty),
      switchMap(({ propertyId, userId }) =>
        this.propertyService.unshareProperty(propertyId, userId).pipe(
          map(response => PropertyActions.unsharePropertySuccess({
            propertyId,
            userId,
            message: response.message
          })),
          catchError(error => of(PropertyActions.unsharePropertyFailure({ error })))
        )
      )
    )
  );

  // Success Notifications
  createPropertyWithAttributesSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PropertyActions.createPropertyWithAttributesSuccess),
        tap(({ property }) => {
          this.snackBar.open(`Property "${property.title}" created successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // Navigate to property details
          this.router.navigate(['/properties', property.id]);
        })
      ),
    { dispatch: false }
  );

  updatePropertyWithAttributesSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PropertyActions.updatePropertyWithAttributesSuccess),
        tap(({ property }) => {
          this.snackBar.open(`Property "${property.title}" updated successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // Navigate to property details
          this.router.navigate(['/properties', property.id]);
        })
      ),
    { dispatch: false }
  );

  deletePropertySuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PropertyActions.deletePropertySuccess),
        tap(({ message }) => {
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        })
      ),
    { dispatch: false }
  );

  sharePropertySuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PropertyActions.sharePropertySuccess),
        tap(({ message }) => {
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        })
      ),
    { dispatch: false }
  );

  // Error Notifications
  propertyError$ = createEffect(() =>
      this.actions$.pipe(
        ofType(
          PropertyActions.loadPropertiesFailure,
          PropertyActions.loadPropertyFailure,
          PropertyActions.createPropertyWithAttributesFailure,
          PropertyActions.updatePropertyWithAttributesFailure,
          PropertyActions.deletePropertyFailure,
          PropertyActions.searchPropertiesFailure,
          PropertyActions.loadPropertySharingFailure,
          PropertyActions.sharePropertyFailure,
          PropertyActions.unsharePropertyFailure
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

  // Reload sharing after successful share/unshare
  reloadSharingAfterShare$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertyActions.sharePropertySuccess, PropertyActions.unsharePropertySuccess),
      map(({ propertyId }) => PropertyActions.loadPropertySharing({ propertyId }))
    )
  );
}
