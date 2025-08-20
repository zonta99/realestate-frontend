// src/app/features/properties/store/property.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Property, PropertyListParams, PropertyValue, PropertySharing } from '../models/property.interface';
import { PropertyActions } from './property.actions';

export interface PropertyState {
  // Properties list and pagination
  properties: Property[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;

  // Selected property details
  selectedProperty: Property | null;
  propertyValues: { [propertyId: number]: PropertyValue[] };
  propertySharing: { [propertyId: number]: PropertySharing[] };

  // Search and filters
  searchResults: Property[];
  filters: PropertyListParams;

  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loadingValues: boolean;
  loadingSharing: boolean;

  // Error handling
  error: any;

  // UI state
  lastOperation: string | null;
}

export const initialState: PropertyState = {
  properties: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 20,

  selectedProperty: null,
  propertyValues: {},
  propertySharing: {},

  searchResults: [],
  filters: {},

  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  loadingValues: false,
  loadingSharing: false,

  error: null,

  lastOperation: null
};

export const propertyReducer = createReducer(
  initialState,

  // Load Properties
  on(PropertyActions.loadProperties, (state, { params }) => ({
    ...state,
    loading: true,
    error: null,
    filters: params || state.filters,
    lastOperation: 'loadProperties'
  })),

  on(PropertyActions.loadPropertiesSuccess, (state, { response }) => ({
    ...state,
    properties: response.content,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    currentPage: response.number,
    pageSize: response.size,
    loading: false,
    error: null
  })),

  on(PropertyActions.loadPropertiesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Property by ID
  on(PropertyActions.loadProperty, (state) => ({
    ...state,
    loading: true,
    error: null,
    lastOperation: 'loadProperty'
  })),

  on(PropertyActions.loadPropertySuccess, (state, { property }) => ({
    ...state,
    selectedProperty: property,
    loading: false,
    error: null
  })),

  on(PropertyActions.loadPropertyFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Property
  on(PropertyActions.createProperty, (state) => ({
    ...state,
    creating: true,
    error: null,
    lastOperation: 'createProperty'
  })),

  on(PropertyActions.createPropertySuccess, (state, { property }) => ({
    ...state,
    properties: [property, ...state.properties],
    selectedProperty: property,
    creating: false,
    error: null,
    totalElements: state.totalElements + 1
  })),

  on(PropertyActions.createPropertyFailure, (state, { error }) => ({
    ...state,
    creating: false,
    error
  })),

  // Update Property
  on(PropertyActions.updateProperty, (state) => ({
    ...state,
    updating: true,
    error: null,
    lastOperation: 'updateProperty'
  })),

  on(PropertyActions.updatePropertySuccess, (state, { property }) => ({
    ...state,
    properties: state.properties.map(p => p.id === property.id ? property : p),
    selectedProperty: state.selectedProperty?.id === property.id ? property : state.selectedProperty,
    updating: false,
    error: null
  })),

  on(PropertyActions.updatePropertyFailure, (state, { error }) => ({
    ...state,
    updating: false,
    error
  })),

  // Delete Property
  on(PropertyActions.deleteProperty, (state) => ({
    ...state,
    deleting: true,
    error: null,
    lastOperation: 'deleteProperty'
  })),

  on(PropertyActions.deletePropertySuccess, (state, { id }) => ({
    ...state,
    properties: state.properties.filter(p => p.id !== id),
    selectedProperty: state.selectedProperty?.id === id ? null : state.selectedProperty,
    deleting: false,
    error: null,
    totalElements: Math.max(0, state.totalElements - 1),
    // Remove associated data
    propertyValues: Object.fromEntries(
      Object.entries(state.propertyValues).filter(([propertyId]) => +propertyId !== id)
    ),
    propertySharing: Object.fromEntries(
      Object.entries(state.propertySharing).filter(([propertyId]) => +propertyId !== id)
    )
  })),

  on(PropertyActions.deletePropertyFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error
  })),

  // Search Properties
  on(PropertyActions.searchProperties, (state) => ({
    ...state,
    loading: true,
    error: null,
    lastOperation: 'searchProperties'
  })),

  on(PropertyActions.searchPropertiesSuccess, (state, { properties }) => ({
    ...state,
    searchResults: properties,
    loading: false,
    error: null
  })),

  on(PropertyActions.searchPropertiesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Property Values Management
  on(PropertyActions.loadPropertyValues, (state) => ({
    ...state,
    loadingValues: true,
    error: null,
    lastOperation: 'loadPropertyValues'
  })),

  on(PropertyActions.loadPropertyValuesSuccess, (state, { propertyId, values }) => ({
    ...state,
    propertyValues: {
      ...state.propertyValues,
      [propertyId]: values
    },
    loadingValues: false,
    error: null
  })),

  on(PropertyActions.loadPropertyValuesFailure, (state, { error }) => ({
    ...state,
    loadingValues: false,
    error
  })),

  on(PropertyActions.setPropertyValueSuccess, (state, { value }) => ({
    ...state,
    propertyValues: {
      ...state.propertyValues,
      [value.propertyId]: [
        ...(state.propertyValues[value.propertyId] || []).filter(v => v.attributeId !== value.attributeId),
        value
      ]
    },
    error: null
  })),

  on(PropertyActions.deletePropertyValueSuccess, (state, { propertyId, attributeId }) => ({
    ...state,
    propertyValues: {
      ...state.propertyValues,
      [propertyId]: (state.propertyValues[propertyId] || []).filter(v => v.attributeId !== attributeId)
    },
    error: null
  })),

  // Property Sharing Management
  on(PropertyActions.loadPropertySharing, (state) => ({
    ...state,
    loadingSharing: true,
    error: null,
    lastOperation: 'loadPropertySharing'
  })),

  on(PropertyActions.loadPropertySharingSuccess, (state, { propertyId, sharing }) => ({
    ...state,
    propertySharing: {
      ...state.propertySharing,
      [propertyId]: sharing
    },
    loadingSharing: false,
    error: null
  })),

  on(PropertyActions.loadPropertySharingFailure, (state, { error }) => ({
    ...state,
    loadingSharing: false,
    error
  })),

  // UI State Management
  on(PropertyActions.setLoading, (state, { loading }) => ({
    ...state,
    loading
  })),

  on(PropertyActions.clearError, (state) => ({
    ...state,
    error: null
  })),

  on(PropertyActions.clearSelectedProperty, (state) => ({
    ...state,
    selectedProperty: null
  })),

  on(PropertyActions.setCurrentPage, (state, { page }) => ({
    ...state,
    currentPage: page
  })),

  on(PropertyActions.setPageSize, (state, { size }) => ({
    ...state,
    pageSize: size
  })),

  on(PropertyActions.setFilters, (state, { filters }) => ({
    ...state,
    filters
  })),

  on(PropertyActions.clearFilters, (state) => ({
    ...state,
    filters: {}
  })),

  on(PropertyActions.resetState, () => ({
    ...initialState
  }))
);
