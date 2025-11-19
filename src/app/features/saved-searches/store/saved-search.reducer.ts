// src/app/features/saved-searches/store/saved-search.reducer.ts

import { createReducer, on } from '@ngrx/store';
import { SavedSearch } from '../models/saved-search.interface';
import { PropertyPageResponse } from '../../properties/models/property.interface';
import * as SavedSearchActions from './saved-search.actions';

export interface SavedSearchState {
  searches: SavedSearch[];
  selectedSearch: SavedSearch | null;
  searchResults: PropertyPageResponse | null;
  loading: boolean;
  loadingSearch: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  executing: boolean;
  error: string | null;
}

export const initialState: SavedSearchState = {
  searches: [],
  selectedSearch: null,
  searchResults: null,
  loading: false,
  loadingSearch: false,
  creating: false,
  updating: false,
  deleting: false,
  executing: false,
  error: null
};

export const savedSearchReducer = createReducer(
  initialState,

  // Load all saved searches
  on(SavedSearchActions.loadSavedSearches, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SavedSearchActions.loadSavedSearchesSuccess, (state, { searches }) => ({
    ...state,
    searches,
    loading: false,
    error: null
  })),
  on(SavedSearchActions.loadSavedSearchesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load single saved search
  on(SavedSearchActions.loadSavedSearch, (state) => ({
    ...state,
    loadingSearch: true,
    error: null
  })),
  on(SavedSearchActions.loadSavedSearchSuccess, (state, { search }) => ({
    ...state,
    selectedSearch: search,
    loadingSearch: false,
    error: null
  })),
  on(SavedSearchActions.loadSavedSearchFailure, (state, { error }) => ({
    ...state,
    loadingSearch: false,
    error
  })),

  // Create saved search
  on(SavedSearchActions.createSavedSearch, (state) => ({
    ...state,
    creating: true,
    error: null
  })),
  on(SavedSearchActions.createSavedSearchSuccess, (state, { search }) => ({
    ...state,
    searches: [...state.searches, search],
    selectedSearch: search,
    creating: false,
    error: null
  })),
  on(SavedSearchActions.createSavedSearchFailure, (state, { error }) => ({
    ...state,
    creating: false,
    error
  })),

  // Update saved search
  on(SavedSearchActions.updateSavedSearch, (state) => ({
    ...state,
    updating: true,
    error: null
  })),
  on(SavedSearchActions.updateSavedSearchSuccess, (state, { search }) => ({
    ...state,
    searches: state.searches.map((s) => (s.id === search.id ? search : s)),
    selectedSearch: search,
    updating: false,
    error: null
  })),
  on(SavedSearchActions.updateSavedSearchFailure, (state, { error }) => ({
    ...state,
    updating: false,
    error
  })),

  // Delete saved search
  on(SavedSearchActions.deleteSavedSearch, (state) => ({
    ...state,
    deleting: true,
    error: null
  })),
  on(SavedSearchActions.deleteSavedSearchSuccess, (state, { id }) => ({
    ...state,
    searches: state.searches.filter((s) => s.id !== id),
    selectedSearch: state.selectedSearch?.id === id ? null : state.selectedSearch,
    deleting: false,
    error: null
  })),
  on(SavedSearchActions.deleteSavedSearchFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error
  })),

  // Execute search
  on(SavedSearchActions.executeSearch, (state) => ({
    ...state,
    executing: true,
    error: null
  })),
  on(SavedSearchActions.executeSearchSuccess, (state, { results }) => ({
    ...state,
    searchResults: results,
    executing: false,
    error: null
  })),
  on(SavedSearchActions.executeSearchFailure, (state, { error }) => ({
    ...state,
    executing: false,
    error
  })),

  // Execute saved search by ID
  on(SavedSearchActions.executeSavedSearch, (state) => ({
    ...state,
    executing: true,
    error: null
  })),

  // Clear search results
  on(SavedSearchActions.clearSearchResults, (state) => ({
    ...state,
    searchResults: null
  })),

  // Select saved search
  on(SavedSearchActions.selectSavedSearch, (state, { search }) => ({
    ...state,
    selectedSearch: search
  }))
);
