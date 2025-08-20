// src/app/features/properties/services/property.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Property,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertyPageResponse,
  PropertyListParams,
  PropertySearchParams,
  PropertyValue,
  CreatePropertyValueRequest,
  PropertySharing,
  SharePropertyRequest,
  ApiResponse
} from '../models/property.interface';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/properties`;

  // Get all properties with pagination and filtering
  getProperties(params?: PropertyListParams): Observable<PropertyPageResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.minPrice !== undefined) httpParams = httpParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
    }

    return this.http.get<PropertyPageResponse>(this.baseUrl, { params: httpParams });
  }

  // Get property by ID
  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/${id}`);
  }

  // Create new property
  createProperty(property: CreatePropertyRequest): Observable<Property> {
    return this.http.post<Property>(this.baseUrl, property);
  }

  // Update existing property
  updateProperty(id: number, property: UpdatePropertyRequest): Observable<Property> {
    return this.http.put<Property>(`${this.baseUrl}/${id}`, property);
  }

  // Delete property
  deleteProperty(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  // Search properties
  searchProperties(params: PropertySearchParams): Observable<Property[]> {
    let httpParams = new HttpParams();

    if (params.minPrice !== undefined) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params.status) httpParams = httpParams.set('status', params.status);

    return this.http.get<Property[]>(`${this.baseUrl}/search`, { params: httpParams });
  }

  // Property Values Management

  // Get property values
  getPropertyValues(propertyId: number): Observable<PropertyValue[]> {
    return this.http.get<PropertyValue[]>(`${this.baseUrl}/${propertyId}/values`);
  }

  // Set property value
  setPropertyValue(propertyId: number, valueRequest: CreatePropertyValueRequest): Observable<PropertyValue> {
    return this.http.post<PropertyValue>(`${this.baseUrl}/${propertyId}/values`, valueRequest);
  }

  // Delete property value
  deletePropertyValue(propertyId: number, attributeId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${propertyId}/values/${attributeId}`);
  }

  // Property Sharing Management

  // Share property with user
  shareProperty(propertyId: number, shareRequest: SharePropertyRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/${propertyId}/share`, shareRequest);
  }

  // Unshare property from user
  unshareProperty(propertyId: number, userId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${propertyId}/share/${userId}`);
  }

  // Get property sharing details
  getPropertySharingDetails(propertyId: number): Observable<PropertySharing[]> {
    return this.http.get<PropertySharing[]>(`${this.baseUrl}/${propertyId}/sharing`);
  }
}
