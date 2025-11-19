// src/app/features/saved-searches/store/saved-search.selectors.ts

import { createSelector } from '@ngrx/store';
import { AppState } from '../../../core/store/app.reducer';
import { SavedSearchState } from './saved-search.reducer';

// Feature selector
export const selectSavedSearchState = (state: AppState) => state.savedSearches;

// Memoized selectors
export const selectAllSavedSearches = createSelector(
  selectSavedSearchState,
  (state: SavedSearchState) => state.searches
);

export const selectSelectedSavedSearch = createSelector(
  selectSavedSearchState,
  (state: SavedSearchState) => state.selectedSearch
);

export const selectSearchResults = createSelector(
  selectSavedSearchState,
  (state: SavedSearchState) => state.searchResults
);

export const selectLoading = createSelector(
  selectSavedSearchState,
  (state: SavedSearchState) => state.loading
);

export const selectLoadingSearch = createSelector(
  selectSavedSearchState,
  (state: SavedSearchState) => state.loadingSearch
);

export const selectCreating = createSelector(
  selectSavedSearchState,
  (state: SavedSearchState) => state.creating
);

export const selectUpdating = createSelector(
  selectSavedSearchState,
  (state: SavedSearchState) => state.updating
);

export const selectDeleting = createSelector(
  selectSavedSearchState,
  (state: SavedSearchState) => state.deleting
);

export const selectExecuting = createSelector(
  selectSavedSearchState,
  (state: SavedSearchState) => state.executing
);

export const selectError = createSelector(
  selectSavedSearchState,
  (state: SavedSearchState) => state.error
);

// Composite selectors
export const selectSavedSearchById = (id: number) =>
  createSelector(selectAllSavedSearches, (searches) => searches.find((s) => s.id === id));

export const selectSearchCount = createSelector(
  selectAllSavedSearches,
  (searches) => searches.length
);

export const selectHasSearches = createSelector(
  selectSearchCount,
  (count) => count > 0
);

export const selectSearchResultsCount = createSelector(
  selectSearchResults,
  (results) => results?.totalElements ?? 0
);

export const selectHasSearchResults = createSelector(
  selectSearchResults,
  (results) => results !== null && results.content.length > 0
);

// Loading state combinations
export const selectIsLoadingAny = createSelector(
  selectLoading,
  selectLoadingSearch,
  selectCreating,
  selectUpdating,
  selectDeleting,
  selectExecuting,
  (loading, loadingSearch, creating, updating, deleting, executing) =>
    loading || loadingSearch || creating || updating || deleting || executing
);
