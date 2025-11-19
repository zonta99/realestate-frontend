// src/app/features/attributes/services/attribute.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  PropertyAttribute,
  PropertyValue,
  CreateAttributeRequest,
  UpdateAttributeRequest,
  CreateAttributeOptionRequest,
  UpdateAttributeOptionRequest,
  ReorderAttributesRequest,
  SetAttributeValueRequest,
  PropertyCategory,
  ApiResponse
} from '../../properties/models/property.interface';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  // Attribute Catalog APIs
  getAllAttributes(): Observable<PropertyAttribute[]> {
    return this.http.get<PropertyAttribute[]>(`${this.apiUrl}/property-attributes`);
  }

  getSearchableAttributes(): Observable<PropertyAttribute[]> {
    return this.http.get<PropertyAttribute[]>(`${this.apiUrl}/property-attributes/searchable`);
  }

  getAttributesByCategory(category: PropertyCategory): Observable<PropertyAttribute[]> {
    return this.http.get<PropertyAttribute[]>(`${this.apiUrl}/property-attributes/category/${category}`);
  }

  getAttributeById(id: number): Observable<PropertyAttribute> {
    return this.http.get<PropertyAttribute>(`${this.apiUrl}/property-attributes/${id}`);
  }

  createAttribute(request: CreateAttributeRequest): Observable<ApiResponse<PropertyAttribute>> {
    return this.http.post<ApiResponse<PropertyAttribute>>(`${this.apiUrl}/property-attributes`, request);
  }

  updateAttribute(id: number, request: UpdateAttributeRequest): Observable<PropertyAttribute> {
    return this.http.put<PropertyAttribute>(`${this.apiUrl}/property-attributes/${id}`, request);
  }

  deleteAttribute(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/property-attributes/${id}`);
  }

  createAttributeOption(attributeId: number, request: CreateAttributeOptionRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/property-attributes/${attributeId}/options`, request);
  }

  updateAttributeOption(attributeId: number, optionId: number, request: UpdateAttributeOptionRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/property-attributes/${attributeId}/options/${optionId}`, request);
  }

  deleteAttributeOption(optionId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/property-attributes/options/${optionId}`);
  }

  reorderAttributes(category: PropertyCategory, attributeIds: number[]): Observable<ApiResponse> {
    const request: ReorderAttributesRequest = { attributeIds };
    return this.http.put<ApiResponse>(`${this.apiUrl}/property-attributes/category/${category}/reorder`, request);
  }

  // Property Attribute Values APIs
  getPropertyAttributeValues(propertyId: number): Observable<PropertyValue[]> {
    return this.http.get<PropertyValue[]>(`${this.apiUrl}/properties/${propertyId}/values`);
  }

  setPropertyAttributeValue(propertyId: number, request: SetAttributeValueRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/properties/${propertyId}/values`, request);
  }

  deletePropertyAttributeValue(propertyId: number, attributeId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/properties/${propertyId}/values/${attributeId}`);
  }

  // Utility methods for frontend
  groupAttributesByCategory(attributes: PropertyAttribute[]): Map<PropertyCategory, PropertyAttribute[]> {
    return attributes.reduce((groups, attribute) => {
      if (!groups.has(attribute.category)) {
        groups.set(attribute.category, []);
      }
      groups.get(attribute.category)!.push(attribute);
      return groups;
    }, new Map<PropertyCategory, PropertyAttribute[]>());
  }

  sortAttributesByDisplayOrder(attributes: PropertyAttribute[]): PropertyAttribute[] {
    return [...attributes].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  // Helper method for MULTI_SELECT values
  parseMultiSelectValue(value: string): string[] {
    try {
      return JSON.parse(value) as string[];
    } catch {
      return [];
    }
  }

  stringifyMultiSelectValue(values: string[]): string {
    return JSON.stringify(values);
  }
}
