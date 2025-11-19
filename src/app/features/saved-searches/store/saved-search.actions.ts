// src/app/features/saved-searches/store/saved-search.actions.ts

import { createAction, props } from '@ngrx/store';
import {
  SavedSearch,
  CreateSavedSearchRequest,
  UpdateSavedSearchRequest,
  PropertySearchCriteriaRequest
} from '../models/saved-search.interface';
import { Property, PropertyPageResponse } from '../../properties/models/property.interface';

// Load all saved searches
export const loadSavedSearches = createAction('[SavedSearch] Load Saved Searches');

export const loadSavedSearchesSuccess = createAction(
  '[SavedSearch] Load Saved Searches Success',
  props<{ searches: SavedSearch[] }>()
);

export const loadSavedSearchesFailure = createAction(
  '[SavedSearch] Load Saved Searches Failure',
  props<{ error: string }>()
);

// Load single saved search
export const loadSavedSearch = createAction(
  '[SavedSearch] Load Saved Search',
  props<{ id: number }>()
);

export const loadSavedSearchSuccess = createAction(
  '[SavedSearch] Load Saved Search Success',
  props<{ search: SavedSearch }>()
);

export const loadSavedSearchFailure = createAction(
  '[SavedSearch] Load Saved Search Failure',
  props<{ error: string }>()
);

// Create saved search
export const createSavedSearch = createAction(
  '[SavedSearch] Create Saved Search',
  props<{ request: CreateSavedSearchRequest }>()
);

export const createSavedSearchSuccess = createAction(
  '[SavedSearch] Create Saved Search Success',
  props<{ search: SavedSearch }>()
);

export const createSavedSearchFailure = createAction(
  '[SavedSearch] Create Saved Search Failure',
  props<{ error: string }>()
);

// Update saved search
export const updateSavedSearch = createAction(
  '[SavedSearch] Update Saved Search',
  props<{ id: number; request: UpdateSavedSearchRequest }>()
);

export const updateSavedSearchSuccess = createAction(
  '[SavedSearch] Update Saved Search Success',
  props<{ search: SavedSearch }>()
);

export const updateSavedSearchFailure = createAction(
  '[SavedSearch] Update Saved Search Failure',
  props<{ error: string }>()
);

// Delete saved search
export const deleteSavedSearch = createAction(
  '[SavedSearch] Delete Saved Search',
  props<{ id: number }>()
);

export const deleteSavedSearchSuccess = createAction(
  '[SavedSearch] Delete Saved Search Success',
  props<{ id: number }>()
);

export const deleteSavedSearchFailure = createAction(
  '[SavedSearch] Delete Saved Search Failure',
  props<{ error: string }>()
);

// Execute search
export const executeSearch = createAction(
  '[SavedSearch] Execute Search',
  props<{ criteria: PropertySearchCriteriaRequest }>()
);

export const executeSearchSuccess = createAction(
  '[SavedSearch] Execute Search Success',
  props<{ results: PropertyPageResponse }>()
);

export const executeSearchFailure = createAction(
  '[SavedSearch] Execute Search Failure',
  props<{ error: string }>()
);

// Execute saved search by ID
export const executeSavedSearch = createAction(
  '[SavedSearch] Execute Saved Search',
  props<{ searchId: number; page?: number; size?: number; sort?: string }>()
);

// Clear search results
export const clearSearchResults = createAction('[SavedSearch] Clear Search Results');

// Select saved search for editing
export const selectSavedSearch = createAction(
  '[SavedSearch] Select Saved Search',
  props<{ search: SavedSearch | null }>()
);
