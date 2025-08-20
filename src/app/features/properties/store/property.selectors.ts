// src/app/features/properties/store/property.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PropertyState } from './property.reducer';
import { Property, PropertyStatus } from '../models/property.interface';

// Feature selector
export const selectPropertyState = createFeatureSelector<PropertyState>('properties');

// Basic selectors
export const selectProperties = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.properties
);

export const selectSelectedProperty = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.selectedProperty
);

export const selectSearchResults = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.searchResults
);

export const selectPropertyValues = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.propertyValues
);

export const selectPropertySharing = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.propertySharing
);

export const selectFilters = createSelector(
  selectPropertyState,
  (state: PropertyState) => state?.filters || {}
);

// Pagination selectors
export const selectPagination = createSelector(
  selectPropertyState,
  (state: PropertyState) => ({
    currentPage: state?.currentPage || 0,
    pageSize: state?.pageSize || 20,
    totalElements: state?.totalElements || 0,
    totalPages: state?.totalPages || 0
  })
);

export const selectCurrentPage = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.currentPage
);

export const selectPageSize = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.pageSize
);

export const selectTotalElements = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.totalElements
);

export const selectTotalPages = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.totalPages
);

// Loading state selectors
export const selectLoading = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.loading
);

export const selectCreating = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.creating
);

export const selectUpdating = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.updating
);

export const selectDeleting = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.deleting
);

export const selectLoadingValues = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.loadingValues
);

export const selectLoadingSharing = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.loadingSharing
);

export const selectAnyLoading = createSelector(
  selectPropertyState,
  (state: PropertyState) =>
    state.loading || state.creating || state.updating ||
    state.deleting || state.loadingValues || state.loadingSharing
);

// Error selector
export const selectError = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.error
);

export const selectLastOperation = createSelector(
  selectPropertyState,
  (state: PropertyState) => state.lastOperation
);

// Computed selectors
export const selectPropertyById = (id: number) => createSelector(
  selectProperties,
  (properties: Property[]) => properties.find(property => property.id === id)
);

export const selectPropertiesByStatus = (status: PropertyStatus) => createSelector(
  selectProperties,
  (properties: Property[]) => properties.filter(property => property.status === status)
);

export const selectPropertiesByAgent = (agentId: number) => createSelector(
  selectProperties,
  (properties: Property[]) => properties.filter(property => property.agentId === agentId)
);

export const selectPropertiesInPriceRange = (minPrice: number, maxPrice: number) => createSelector(
  selectProperties,
  (properties: Property[]) => properties.filter(
    property => property.price >= minPrice && property.price <= maxPrice
  )
);

export const selectActiveProperties = createSelector(
  selectProperties,
  (properties: Property[]) => properties.filter(property => property.status === PropertyStatus.ACTIVE)
);

export const selectPendingProperties = createSelector(
  selectProperties,
  (properties: Property[]) => properties.filter(property => property.status === PropertyStatus.PENDING)
);

export const selectSoldProperties = createSelector(
  selectProperties,
  (properties: Property[]) => properties.filter(property => property.status === PropertyStatus.SOLD)
);

export const selectInactiveProperties = createSelector(
  selectProperties,
  (properties: Property[]) => properties.filter(property => property.status === PropertyStatus.INACTIVE)
);

// Property values selectors
export const selectPropertyValuesById = (propertyId: number) => createSelector(
  selectPropertyValues,
  (propertyValues) => propertyValues[propertyId] || []
);

export const selectPropertyValueByAttribute = (propertyId: number, attributeId: number) => createSelector(
  selectPropertyValues,
  (propertyValues) => {
    const values = propertyValues[propertyId] || [];
    return values.find(value => value.attributeId === attributeId);
  }
);

// Property sharing selectors
export const selectPropertySharingById = (propertyId: number) => createSelector(
  selectPropertySharing,
  (propertySharing) => propertySharing[propertyId] || []
);

export const selectIsPropertySharedWithUser = (propertyId: number, userId: number) => createSelector(
  selectPropertySharing,
  (propertySharing) => {
    const sharing = propertySharing[propertyId] || [];
    return sharing.some(share => share.sharedWithUserId === userId);
  }
);

// Statistics selectors
export const selectPropertyStatistics = createSelector(
  selectProperties,
  (properties: Property[]) => {
    const total = properties.length;
    const active = properties.filter(p => p.status === PropertyStatus.ACTIVE).length;
    const pending = properties.filter(p => p.status === PropertyStatus.PENDING).length;
    const sold = properties.filter(p => p.status === PropertyStatus.SOLD).length;
    const inactive = properties.filter(p => p.status === PropertyStatus.INACTIVE).length;

    const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
    const averagePrice = total > 0 ? totalValue / total : 0;

    const maxPrice = properties.length > 0 ? Math.max(...properties.map(p => p.price)) : 0;
    const minPrice = properties.length > 0 ? Math.min(...properties.map(p => p.price)) : 0;

    return {
      total,
      active,
      pending,
      sold,
      inactive,
      totalValue,
      averagePrice,
      maxPrice,
      minPrice
    };
  }
);

// Search and filter helpers
export const selectHasFilters = createSelector(
  selectFilters,
  (filters) => Object.keys(filters).length > 0
);

export const selectHasSearchResults = createSelector(
  selectSearchResults,
  (results) => results.length > 0
);

// UI state selectors
export const selectCanLoadMore = createSelector(
  selectCurrentPage,
  selectTotalPages,
  (currentPage, totalPages) => currentPage < totalPages - 1
);

export const selectIsFirstPage = createSelector(
  selectCurrentPage,
  (currentPage) => currentPage === 0
);

export const selectIsLastPage = createSelector(
  selectCurrentPage,
  selectTotalPages,
  (currentPage, totalPages) => currentPage === totalPages - 1
);

export const selectPageInfo = createSelector(
  selectCurrentPage,
  selectPageSize,
  selectTotalElements,
  (currentPage, pageSize, totalElements) => {
    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalElements);
    return {
      startItem: totalElements > 0 ? startItem : 0,
      endItem,
      totalElements
    };
  }
);
