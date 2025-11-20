// src/app/features/customers/services/customer.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerSearchCriteria,
  CustomerMatchesResponse,
  CustomerPageResponse,
  CustomerNote,
  CreateCustomerNoteRequest,
  UpdateCustomerNoteRequest,
  CustomerInteraction,
  CreateCustomerInteractionRequest,
  UpdateCustomerInteractionRequest,
  CustomerSearchParams,
  CustomerStatus,
  ApiResponse
} from '../models';

/**
 * Service for customer-related API operations
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/customers`;

  /**
   * Get paginated list of customers
   * @param page Page number (default: 0)
   * @param size Page size (default: 20)
   * @param status Optional status filter
   */
  getCustomers(
    page: number = 0,
    size: number = 20,
    status?: string
  ): Observable<CustomerPageResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<CustomerPageResponse>(this.apiUrl, { params });
  }

  /**
   * Get a single customer by ID
   * @param id Customer ID
   */
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new customer
   * @param customer Customer data
   */
  createCustomer(customer: CreateCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  /**
   * Update an existing customer
   * @param id Customer ID
   * @param customer Updated customer data
   */
  updateCustomer(id: number, customer: UpdateCustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  /**
   * Update customer status
   * @param id Customer ID
   * @param status New status
   */
  updateCustomerStatus(id: number, status: CustomerStatus): Observable<ApiResponse> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<ApiResponse>(`${this.apiUrl}/${id}/status`, null, { params });
  }

  /**
   * Delete a customer
   * @param id Customer ID
   */
  deleteCustomer(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Set search criteria for a customer
   * @param customerId Customer ID
   * @param criteria Search criteria
   */
  setSearchCriteria(
    customerId: number,
    criteria: CustomerSearchCriteria
  ): Observable<CustomerSearchCriteria> {
    return this.http.post<CustomerSearchCriteria>(
      `${this.apiUrl}/${customerId}/search-criteria`,
      criteria
    );
  }

  /**
   * Get search criteria for a customer
   * @param customerId Customer ID
   */
  getSearchCriteria(customerId: number): Observable<CustomerSearchCriteria> {
    return this.http.get<CustomerSearchCriteria>(
      `${this.apiUrl}/${customerId}/search-criteria`
    );
  }

  /**
   * Get property matches for a customer based on their search criteria
   * @param customerId Customer ID
   */
  getMatches(customerId: number): Observable<CustomerMatchesResponse> {
    return this.http.get<CustomerMatchesResponse>(
      `${this.apiUrl}/${customerId}/matches`
    );
  }

  // ============================================
  // CUSTOMER NOTES ENDPOINTS
  // ============================================

  /**
   * Get all notes for a customer
   * @param customerId Customer ID
   */
  getCustomerNotes(customerId: number): Observable<CustomerNote[]> {
    return this.http.get<CustomerNote[]>(`${this.apiUrl}/${customerId}/notes`);
  }

  /**
   * Add a note to a customer
   * @param customerId Customer ID
   * @param note Note content
   */
  addCustomerNote(customerId: number, note: CreateCustomerNoteRequest): Observable<CustomerNote> {
    return this.http.post<CustomerNote>(`${this.apiUrl}/${customerId}/notes`, note);
  }

  /**
   * Update a customer note
   * @param customerId Customer ID
   * @param noteId Note ID
   * @param note Updated note content
   */
  updateCustomerNote(customerId: number, noteId: number, note: UpdateCustomerNoteRequest): Observable<CustomerNote> {
    return this.http.put<CustomerNote>(`${this.apiUrl}/${customerId}/notes/${noteId}`, note);
  }

  /**
   * Delete a customer note
   * @param customerId Customer ID
   * @param noteId Note ID
   */
  deleteCustomerNote(customerId: number, noteId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${customerId}/notes/${noteId}`);
  }

  // ============================================
  // CUSTOMER INTERACTIONS ENDPOINTS
  // ============================================

  /**
   * Get all interactions for a customer
   * @param customerId Customer ID
   */
  getCustomerInteractions(customerId: number): Observable<CustomerInteraction[]> {
    return this.http.get<CustomerInteraction[]>(`${this.apiUrl}/${customerId}/interactions`);
  }

  /**
   * Add an interaction to a customer
   * @param customerId Customer ID
   * @param interaction Interaction data
   */
  addCustomerInteraction(customerId: number, interaction: CreateCustomerInteractionRequest): Observable<CustomerInteraction> {
    return this.http.post<CustomerInteraction>(`${this.apiUrl}/${customerId}/interactions`, interaction);
  }

  /**
   * Update a customer interaction
   * @param customerId Customer ID
   * @param interactionId Interaction ID
   * @param interaction Updated interaction data
   */
  updateCustomerInteraction(customerId: number, interactionId: number, interaction: UpdateCustomerInteractionRequest): Observable<CustomerInteraction> {
    return this.http.put<CustomerInteraction>(`${this.apiUrl}/${customerId}/interactions/${interactionId}`, interaction);
  }

  /**
   * Delete a customer interaction
   * @param customerId Customer ID
   * @param interactionId Interaction ID
   */
  deleteCustomerInteraction(customerId: number, interactionId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${customerId}/interactions/${interactionId}`);
  }

  // ============================================
  // CUSTOMER SEARCH ENDPOINTS
  // ============================================

  /**
   * Search customers by criteria
   * @param params Search parameters (name, status, phone, email, budget range)
   */
  searchCustomers(params: CustomerSearchParams): Observable<Customer[]> {
    let httpParams = new HttpParams();

    if (params.name) httpParams = httpParams.set('name', params.name);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.phone) httpParams = httpParams.set('phone', params.phone);
    if (params.email) httpParams = httpParams.set('email', params.email);
    if (params.minBudget !== undefined) httpParams = httpParams.set('minBudget', params.minBudget.toString());
    if (params.maxBudget !== undefined) httpParams = httpParams.set('maxBudget', params.maxBudget.toString());

    return this.http.get<Customer[]>(`${this.apiUrl}/search`, { params: httpParams });
  }
}
