// src/app/features/properties/services/property.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Property,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertyPageResponse,
  PropertyListParams,
  PropertySearchParams,
  PropertyValue,
  PropertySharing,
  SharePropertyRequest,
  PropertyStatus,
  ApiResponse
} from '../models/property.interface';

export interface PropertyWithAttributes extends CreatePropertyRequest {
  status?: PropertyStatus;
  attributeValues?: { [attributeId: number]: any };
}

export interface PropertyFullData {
  property: Property;
  attributeValues: PropertyValue[];
  sharing?: PropertySharing[];
}

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

  // Get property by ID with all related data
  getPropertyFullData(id: number): Observable<PropertyFullData> {
    return forkJoin({
      property: this.http.get<Property>(`${this.baseUrl}/${id}`),
      attributeValues: this.http.get<PropertyValue[]>(`${this.baseUrl}/${id}/values`)
    }).pipe(
      map(({ property, attributeValues }) => ({
        property,
        attributeValues
      }))
    );
  }

  // Create property with attributes in one atomic transaction
  createPropertyWithAttributes(propertyData: PropertyWithAttributes): Observable<Property> {
    // Normalize attribute values if present
    const normalizedData = { ...propertyData };
    if (normalizedData.attributeValues) {
      normalizedData.attributeValues = Object.entries(normalizedData.attributeValues).reduce(
        (acc, [attributeId, value]) => {
          acc[parseInt(attributeId)] = this.normalizeValue(value);
          return acc;
        },
        {} as { [key: number]: any }
      );
    }

    // Single atomic POST request to backend
    return this.http.post<Property>(`${this.baseUrl}/with-attributes`, normalizedData);
  }

  // Update property with attributes in one atomic transaction
  updatePropertyWithAttributes(id: number, propertyData: PropertyWithAttributes): Observable<Property> {
    // Normalize attribute values if present
    const normalizedData = { ...propertyData };
    if (normalizedData.attributeValues) {
      normalizedData.attributeValues = Object.entries(normalizedData.attributeValues).reduce(
        (acc, [attributeId, value]) => {
          acc[parseInt(attributeId)] = this.normalizeValue(value);
          return acc;
        },
        {} as { [key: number]: any }
      );
    }

    // Single atomic PUT request to backend
    return this.http.put<Property>(`${this.baseUrl}/${id}/with-attributes`, normalizedData);
  }

  // Helper method to normalize values for storage
  private normalizeValue(value: any): any {
    if (typeof value === 'boolean') {
      return value
    }
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    // Preserve numbers as numbers, don't convert to string
    if (typeof value === 'number') {
      return value;
    }
    return String(value);
  }

  // Existing methods for backward compatibility
  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/${id}`);
  }

  createProperty(property: CreatePropertyRequest): Observable<Property> {
    return this.http.post<Property>(this.baseUrl, property);
  }

  updateProperty(id: number, property: UpdatePropertyRequest): Observable<Property> {
    return this.http.put<Property>(`${this.baseUrl}/${id}`, property);
  }

  deleteProperty(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }

  searchProperties(params: PropertySearchParams): Observable<Property[]> {
    let httpParams = new HttpParams();

    if (params.minPrice !== undefined) httpParams = httpParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params.status) httpParams = httpParams.set('status', params.status);

    return this.http.get<Property[]>(`${this.baseUrl}/search`, { params: httpParams });
  }

  // Attribute value methods
  getPropertyValues(propertyId: number): Observable<PropertyValue[]> {
    return this.http.get<PropertyValue[]>(`${this.baseUrl}/${propertyId}/values`);
  }

  setPropertyValue(propertyId: number, attributeId: number, value: any): Observable<PropertyValue> {
    return this.http.post<PropertyValue>(`${this.baseUrl}/${propertyId}/values`, {
      attributeId,
      value: this.normalizeValue(value)
    });
  }

  deletePropertyValue(propertyId: number, attributeId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${propertyId}/values/${attributeId}`);
  }

  // Property sharing methods
  shareProperty(propertyId: number, shareRequest: SharePropertyRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/${propertyId}/share`, shareRequest);
  }

  unshareProperty(propertyId: number, userId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${propertyId}/share/${userId}`);
  }

  getPropertySharingDetails(propertyId: number): Observable<PropertySharing[]> {
    return this.http.get<PropertySharing[]>(`${this.baseUrl}/${propertyId}/sharing`);
  }
}
