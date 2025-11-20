// src/app/features/customers/models/customer.interface.ts

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  budgetMin?: number;
  budgetMax?: number;
  notes?: string;
  leadSource?: string;
  status: CustomerStatus;
  agentId: number;
  agentName?: string;
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
  city?: string;
  mustHaveGarage?: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  budgetMin?: number;
  budgetMax?: number;
  notes?: string;
  leadSource?: string;
  status?: CustomerStatus;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  budgetMin?: number;
  budgetMax?: number;
  notes?: string;
  leadSource?: string;
  status?: CustomerStatus;
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
  city?: string;
  mustHaveGarage?: boolean;
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
  CLIENT = 'CLIENT',
  CONVERTED = 'CONVERTED'
}

export interface PropertyMatch {
  propertyId: number;
  title: string;
  price: number;
  bedrooms?: number;
  city?: string;
  matchScore: number;
}

export interface CustomerMatchesResponse {
  customerId: number;
  customerName: string;
  matches: PropertyMatch[];
  totalMatches: number;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

// Customer Notes
export interface CustomerNote {
  id: number;
  customerId: number;
  customerName: string;
  createdByUserId: number;
  createdByUserName: string;
  content: string;
  createdDate: string;
}

export interface CreateCustomerNoteRequest {
  content: string;
}

export interface UpdateCustomerNoteRequest {
  content: string;
}

// Customer Interactions
export enum InteractionType {
  PHONE_CALL = 'PHONE_CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  PROPERTY_VIEWING = 'PROPERTY_VIEWING',
  SMS = 'SMS',
  VIDEO_CALL = 'VIDEO_CALL',
  OTHER = 'OTHER'
}

export interface CustomerInteraction {
  id: number;
  customerId: number;
  customerName: string;
  userId: number;
  userName: string;
  type: InteractionType;
  subject: string;
  notes: string | null;
  interactionDate: string;
  durationMinutes: number | null;
  relatedPropertyId: number | null;
  relatedPropertyTitle: string | null;
  createdDate: string;
}

export interface CreateCustomerInteractionRequest {
  type: InteractionType;
  subject: string;
  notes?: string;
  interactionDate: string;
  durationMinutes?: number;
  relatedPropertyId?: number;
}

export interface UpdateCustomerInteractionRequest {
  type: InteractionType;
  subject: string;
  notes?: string;
  interactionDate: string;
  durationMinutes?: number;
  relatedPropertyId?: number;
}

// Customer Search
export interface CustomerSearchParams {
  name?: string;
  status?: CustomerStatus;
  phone?: string;
  email?: string;
  minBudget?: number;
  maxBudget?: number;
}
