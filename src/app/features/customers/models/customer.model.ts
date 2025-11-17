// src/app/features/customers/models/customer.model.ts

/**
 * Customer status enumeration
 */
export enum CustomerStatus {
  LEAD = 'LEAD',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CONVERTED = 'CONVERTED'
}

/**
 * Customer entity interface
 */
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  assignedAgentId: number;
  assignedAgentName?: string;
  notes?: string;
  createdDate: string;
  updatedDate: string;
}

/**
 * Request payload for creating a customer
 */
export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status?: CustomerStatus;
  assignedAgentId?: number;
  notes?: string;
}

/**
 * Request payload for updating a customer
 */
export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: CustomerStatus;
  assignedAgentId?: number;
  notes?: string;
}

/**
 * Customer search criteria interface
 */
export interface CustomerSearchCriteria {
  id?: number;
  customerId?: number;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  city?: string;
  propertyType?: string;
  mustHaveGarage?: boolean;
}

/**
 * Property match result for a customer
 */
export interface PropertyMatch {
  propertyId: number;
  title: string;
  price: number;
  bedrooms?: number;
  city?: string;
  matchScore: number;
}

/**
 * Customer property matches response
 */
export interface CustomerMatchesResponse {
  customerId: number;
  customerName: string;
  matches: PropertyMatch[];
  totalMatches: number;
}

/**
 * Paginated customer response
 */
export interface CustomerPageResponse {
  content: Customer[];
  pageable: {
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}
