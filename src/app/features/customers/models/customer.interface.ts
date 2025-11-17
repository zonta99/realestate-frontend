// src/app/features/customers/models/customer.interface.ts

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: CustomerStatus;
  agentId: number;
  agentName?: string;
  notes?: string;
  createdDate: string;
  updatedDate: string;
  searchCriteria?: CustomerSearchCriteria[];
}

export interface CustomerSearchCriteria {
  id: number;
  customerId: number;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  propertyType?: string;
  location?: string;
  createdDate: string;
  updatedDate: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: CustomerStatus;
  notes?: string;
}

export interface CreateSearchCriteriaRequest {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  propertyType?: string;
  location?: string;
}

export interface CustomerListParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: CustomerStatus;
  search?: string;
}

export interface CustomerPageResponse {
  content: Customer[];
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

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEAD = 'LEAD',
  PROSPECT = 'PROSPECT',
  CLIENT = 'CLIENT'
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}
