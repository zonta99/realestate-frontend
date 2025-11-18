// src/app/features/saved-searches/store/saved-search.effects.ts

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { SavedSearchService } from '../services/saved-search.service';
import * as SavedSearchActions from './saved-search.actions';
import * as SavedSearchSelectors from './saved-search.selectors';
import { AppState } from '../../../core/store/app.reducer';

@Injectable()
export class SavedSearchEffects {
  private actions$ = inject(Actions);
  private savedSearchService = inject(SavedSearchService);
  private store = inject(Store<AppState>);
  private router = inject(Router);

  // Load all saved searches
  loadSavedSearches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavedSearchActions.loadSavedSearches),
      switchMap(() =>
        this.savedSearchService.getAllSavedSearches().pipe(
          map((searches) => SavedSearchActions.loadSavedSearchesSuccess({ searches })),
          catchError((error) =>
            of(SavedSearchActions.loadSavedSearchesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Load single saved search
  loadSavedSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavedSearchActions.loadSavedSearch),
      switchMap(({ id }) =>
        this.savedSearchService.getSavedSearchById(id).pipe(
          map((search) => SavedSearchActions.loadSavedSearchSuccess({ search })),
          catchError((error) =>
            of(SavedSearchActions.loadSavedSearchFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Create saved search
  createSavedSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavedSearchActions.createSavedSearch),
      switchMap(({ request }) =>
        this.savedSearchService.createSavedSearch(request).pipe(
          map((response) => SavedSearchActions.createSavedSearchSuccess({ search: response.data! })),
          catchError((error) =>
            of(SavedSearchActions.createSavedSearchFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Navigate to search list after successful create
  createSavedSearchSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SavedSearchActions.createSavedSearchSuccess),
        tap(({ search }) => {
          this.router.navigate(['/searches']);
        })
      ),
    { dispatch: false }
  );

  // Update saved search
  updateSavedSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavedSearchActions.updateSavedSearch),
      switchMap(({ id, request }) =>
        this.savedSearchService.updateSavedSearch(id, request).pipe(
          map((response) => SavedSearchActions.updateSavedSearchSuccess({ search: response.data! })),
          catchError((error) =>
            of(SavedSearchActions.updateSavedSearchFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Navigate to search list after successful update
  updateSavedSearchSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SavedSearchActions.updateSavedSearchSuccess),
        tap(() => {
          this.router.navigate(['/searches']);
        })
      ),
    { dispatch: false }
  );

  // Delete saved search
  deleteSavedSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavedSearchActions.deleteSavedSearch),
      switchMap(({ id }) =>
        this.savedSearchService.deleteSavedSearch(id).pipe(
          map(() => SavedSearchActions.deleteSavedSearchSuccess({ id })),
          catchError((error) =>
            of(SavedSearchActions.deleteSavedSearchFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Execute search
  executeSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavedSearchActions.executeSearch),
      switchMap(({ criteria }) =>
        this.savedSearchService.executeSearch(criteria).pipe(
          map((results) => SavedSearchActions.executeSearchSuccess({ results })),
          catchError((error) =>
            of(SavedSearchActions.executeSearchFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Execute saved search by ID
  executeSavedSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SavedSearchActions.executeSavedSearch),
      withLatestFrom(this.store.select(SavedSearchSelectors.selectAllSavedSearches)),
      switchMap(([{ searchId, page, size, sort }, searches]) => {
        const savedSearch = searches.find((s) => s.id === searchId);
        if (!savedSearch) {
          return of(
            SavedSearchActions.executeSearchFailure({ error: 'Saved search not found' })
          );
        }

        return this.savedSearchService
          .executeSavedSearch(savedSearch, page, size, sort)
          .pipe(
            map((results) => SavedSearchActions.executeSearchSuccess({ results })),
            catchError((error) =>
              of(SavedSearchActions.executeSearchFailure({ error: error.message }))
            )
          );
      })
    )
  );

  // Navigate to results page after successful search execution
  executeSearchSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SavedSearchActions.executeSearchSuccess),
        tap(() => {
          // Note: Navigation is handled by the component calling the action
          // We may navigate to results with the search ID in the URL
        })
      ),
    { dispatch: false }
  );
}
