// src/app/features/saved-searches/models/saved-search.interface.ts

import { PropertyAttributeDataType } from '../../properties/models/property.interface';

/**
 * Represents a filter criterion for property search
 */
export interface SearchFilter {
  attributeId: number;
  attributeName?: string; // For display purposes
  dataType: PropertyAttributeDataType;

  // For NUMBER and DATE ranges
  minValue?: number | string;
  maxValue?: number | string;

  // For SINGLE_SELECT and MULTI_SELECT (array of option values)
  selectedValues?: string[];

  // For TEXT contains search
  textValue?: string;

  // For BOOLEAN
  booleanValue?: boolean;
}

/**
 * Represents a saved property search
 */
export interface SavedSearch {
  id: number;
  userId: number;
  userName?: string;
  name: string;
  description?: string;
  filters: SearchFilter[];
  createdDate: string;
  updatedDate: string;
}

/**
 * Request DTO for creating a saved search
 */
export interface CreateSavedSearchRequest {
  name: string;
  description?: string;
  filters: SearchFilter[];
}

/**
 * Request DTO for updating a saved search
 */
export interface UpdateSavedSearchRequest {
  name?: string;
  description?: string;
  filters?: SearchFilter[];
}

/**
 * Request DTO for executing a property search by criteria
 */
export interface PropertySearchCriteriaRequest {
  filters: SearchFilter[];
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Helper type for building search filters in the UI
 */
export interface SearchFilterBuilder extends SearchFilter {
  // Additional UI state
  isValid?: boolean;
  errorMessage?: string;
}

/**
 * Response wrapper for saved search operations
 */
export interface SavedSearchResponse {
  message: string;
  data?: SavedSearch;
}
