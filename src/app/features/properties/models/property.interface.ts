// src/app/features/properties/models/property.interface.ts

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  agentId: number;
  agentName: string;
  status: PropertyStatus;
  createdDate: string;
  updatedDate: string;
  attributeValues?: PropertyValue[];
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  price: number;
}

export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  price?: number;
  status?: PropertyStatus;
}

export interface PropertyValue {
  id: number;
  propertyId: number;
  attributeId: number;
  attributeName: string;
  dataType: PropertyAttributeDataType;
  value: string;
}

export interface CreatePropertyValueRequest {
  attributeId: number;
  value: string;
}

export interface PropertySharing {
  id: number;
  propertyId: number;
  sharedWithUserId: number;
  sharedWithUserName: string;
  sharedByUserId: number;
  sharedByUserName: string;
  createdDate: string;
}

export interface SharePropertyRequest {
  sharedWithUserId: number;
}

export interface PropertySearchParams {
  minPrice?: number;
  maxPrice?: number;
  status?: PropertyStatus;
}

export interface PropertyListParams extends PropertySearchParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PropertySearchCriteriaRequest {
  minPrice?: number;
  maxPrice?: number;
  filters?: PropertySearchFilter[];
  page?: number;
  size?: number;
  sort?: string;
}

export interface PropertySearchFilter {
  attributeId: number;
  dataType: PropertyAttributeDataType;
  minValue?: number;
  maxValue?: number;
  textValue?: string;
  booleanValue?: boolean;
  selectedValues?: string[];
}

export interface PropertyPageResponse {
  content: Property[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export enum PropertyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SOLD = 'SOLD',
  INACTIVE = 'INACTIVE'
}

export enum PropertyAttributeDataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_SELECT = 'MULTI_SELECT'
}

export enum PropertyCategory {
  BASIC = 'BASIC',
  FEATURES = 'FEATURES',
  FINANCIAL = 'FINANCIAL',
  LOCATION = 'LOCATION',
  STRUCTURE = 'STRUCTURE'
}

export interface PropertyAttribute {
  id: number;
  name: string;
  dataType: PropertyAttributeDataType;
  isRequired: boolean;
  isSearchable: boolean;
  category: PropertyCategory;
  displayOrder: number;
  createdDate: string;
  updatedDate: string;
  options: PropertyAttributeOption[] | null;
  value?: any;
}

export interface PropertyAttributeOption {
  id: number;
  attributeId: number;
  optionValue: string;
  displayOrder: number;
}

export interface CreateAttributeRequest {
  name: string;
  dataType: PropertyAttributeDataType;
  isRequired: boolean;
  isSearchable: boolean;
  category: PropertyCategory;
  displayOrder?: number;
}

export interface CreateAttributeOptionRequest {
  optionValue: string;
  displayOrder?: number;
}

export interface UpdateAttributeRequest {
  name: string;
  dataType: PropertyAttributeDataType;
  isRequired: boolean;
  isSearchable: boolean;
  category: PropertyCategory;
  displayOrder?: number;
}

export interface UpdateAttributeOptionRequest {
  optionValue: string;
  displayOrder?: number;
}

export interface ReorderAttributesRequest {
  attributeIds: number[];
}

export interface SetAttributeValueRequest {
  attributeId: number;
  value: any;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}
