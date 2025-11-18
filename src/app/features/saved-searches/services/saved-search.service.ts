// src/app/features/saved-searches/services/saved-search.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  SavedSearch,
  CreateSavedSearchRequest,
  UpdateSavedSearchRequest,
  PropertySearchCriteriaRequest,
  SavedSearchResponse
} from '../models/saved-search.interface';
import { PropertyPageResponse } from '../../properties/models/property.interface';

@Injectable({
  providedIn: 'root'
})
export class SavedSearchService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/saved-searches`;
  private readonly propertySearchUrl = `${environment.apiUrl}/api/properties/search/by-criteria`;

  /**
   * Get all saved searches for the current authenticated user
   */
  getAllSavedSearches(): Observable<SavedSearch[]> {
    return this.http.get<SavedSearch[]>(this.apiUrl);
  }

  /**
   * Get a specific saved search by ID
   */
  getSavedSearchById(id: number): Observable<SavedSearch> {
    return this.http.get<SavedSearch>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new saved search
   */
  createSavedSearch(request: CreateSavedSearchRequest): Observable<SavedSearchResponse> {
    return this.http.post<SavedSearchResponse>(this.apiUrl, request);
  }

  /**
   * Update an existing saved search
   */
  updateSavedSearch(id: number, request: UpdateSavedSearchRequest): Observable<SavedSearchResponse> {
    return this.http.put<SavedSearchResponse>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete a saved search
   */
  deleteSavedSearch(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Execute a property search using the provided criteria
   */
  executeSearch(criteria: PropertySearchCriteriaRequest): Observable<PropertyPageResponse> {
    return this.http.post<PropertyPageResponse>(this.propertySearchUrl, criteria);
  }

  /**
   * Execute a saved search by ID (convenience method)
   */
  executeSavedSearch(
    savedSearch: SavedSearch,
    page: number = 0,
    size: number = 20,
    sort: string = 'createdDate,desc'
  ): Observable<PropertyPageResponse> {
    const criteria: PropertySearchCriteriaRequest = {
      filters: savedSearch.filters,
      page,
      size,
      sort
    };
    return this.executeSearch(criteria);
  }

  /**
   * Validate a search filter
   */
  validateFilter(filter: any): { isValid: boolean; errorMessage?: string } {
    if (!filter.attributeId) {
      return { isValid: false, errorMessage: 'Attribute is required' };
    }

    switch (filter.dataType) {
      case 'NUMBER':
        if (filter.minValue === undefined && filter.maxValue === undefined) {
          return { isValid: false, errorMessage: 'At least one value (min or max) is required' };
        }
        if (filter.minValue !== undefined && isNaN(Number(filter.minValue))) {
          return { isValid: false, errorMessage: 'Min value must be a valid number' };
        }
        if (filter.maxValue !== undefined && isNaN(Number(filter.maxValue))) {
          return { isValid: false, errorMessage: 'Max value must be a valid number' };
        }
        if (
          filter.minValue !== undefined &&
          filter.maxValue !== undefined &&
          Number(filter.minValue) > Number(filter.maxValue)
        ) {
          return { isValid: false, errorMessage: 'Min value cannot be greater than max value' };
        }
        break;

      case 'DATE':
        if (!filter.minValue && !filter.maxValue) {
          return { isValid: false, errorMessage: 'At least one date (min or max) is required' };
        }
        break;

      case 'SINGLE_SELECT':
      case 'MULTI_SELECT':
        if (!filter.selectedValues || filter.selectedValues.length === 0) {
          return { isValid: false, errorMessage: 'At least one option must be selected' };
        }
        break;

      case 'TEXT':
        if (!filter.textValue || filter.textValue.trim() === '') {
          return { isValid: false, errorMessage: 'Text value is required' };
        }
        break;

      case 'BOOLEAN':
        if (filter.booleanValue === undefined || filter.booleanValue === null) {
          return { isValid: false, errorMessage: 'Boolean value is required' };
        }
        break;

      default:
        return { isValid: false, errorMessage: 'Invalid data type' };
    }

    return { isValid: true };
  }

  /**
   * Validate all filters in a search request
   */
  validateSearchRequest(request: CreateSavedSearchRequest | UpdateSavedSearchRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if ('name' in request && (!request.name || request.name.trim() === '')) {
      errors.push('Search name is required');
    }

    if ('name' in request && request.name && request.name.length > 100) {
      errors.push('Search name must be 100 characters or less');
    }

    if (request.description && request.description.length > 500) {
      errors.push('Description must be 500 characters or less');
    }

    if (request.filters) {
      if (request.filters.length === 0) {
        errors.push('At least one filter is required');
      }

      request.filters.forEach((filter, index) => {
        const validation = this.validateFilter(filter);
        if (!validation.isValid) {
          errors.push(`Filter ${index + 1}: ${validation.errorMessage}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
