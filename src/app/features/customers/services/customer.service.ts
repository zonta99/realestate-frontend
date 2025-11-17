// src/app/features/customers/services/customer.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerPageResponse,
  CustomerListParams,
  CustomerSearchCriteria,
  CreateSearchCriteriaRequest,
  ApiResponse
} from '../models/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/customers`;

  // Get all customers with pagination and filtering
  getCustomers(params?: CustomerListParams): Observable<CustomerPageResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
    }

    return this.http.get<CustomerPageResponse>(this.baseUrl, { params: httpParams });
  }

  // Get customer by ID
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  // Create customer
  createCustomer(customer: CreateCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, customer);
  }

  // Update customer
  updateCustomer(id: number, customer: UpdateCustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, customer);
  }

  // Delete customer
  deleteCustomer(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  // Search criteria methods
  getSearchCriteria(customerId: number): Observable<CustomerSearchCriteria[]> {
    return this.http.get<CustomerSearchCriteria[]>(`${this.baseUrl}/${customerId}/search-criteria`);
  }

  createSearchCriteria(customerId: number, criteria: CreateSearchCriteriaRequest): Observable<CustomerSearchCriteria> {
    return this.http.post<CustomerSearchCriteria>(`${this.baseUrl}/${customerId}/search-criteria`, criteria);
  }

  // Get property matches for customer
  getPropertyMatches(customerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${customerId}/matches`);
  }
}
