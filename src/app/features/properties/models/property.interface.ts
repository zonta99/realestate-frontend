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
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE'
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}
