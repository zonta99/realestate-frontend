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
  private apiUrl = `${environment.apiUrl}/customers`;

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
}
