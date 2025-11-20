# Properties Module - API Alignment Plan

## Current State Analysis

### ✅ What's Working
- Batch operations (`createPropertyWithAttributes`, `updatePropertyWithAttributes`)
- Basic CRUD operations (create, update, delete)
- Pagination and filtering
- Property search functionality
- Status updates

### ❌ Issues to Fix

#### 1. Incorrect Endpoint Paths
**Current:**
- `GET /api/properties/:id/values` → Get property attribute values
- `POST /api/properties/:id/values` → Set property attribute value
- `DELETE /api/properties/:id/values/:attributeId` → Delete attribute value
- `GET /api/properties/:id/sharing` → Get sharing details

**Should Be (per API spec):**
- `GET /api/properties/:id/attribute-values` ✅
- `POST /api/properties/:id/attribute-values` ✅
- `DELETE /api/properties/:id/attribute-values/:attributeId` ✅
- `GET /api/properties/:id/shares` ✅

#### 2. Missing Status Update Endpoint
**Missing:**
- `PATCH /api/properties/:id/status?status=ACTIVE` - Update property status separately

#### 3. Search by Criteria Endpoint
**Current:** Using basic search
**Should Add:** `POST /api/properties/search/by-criteria` - Advanced search with filters

---

## Implementation Plan

### Phase 1: Update PropertyService Endpoints

**File:** `src/app/features/properties/services/property.service.ts`

#### Changes:
```typescript
// Line 59: Fix endpoint
getPropertyValues(propertyId: number): Observable<PropertyValue[]> {
  return this.http.get<PropertyValue[]>(`${this.baseUrl}/${propertyId}/attribute-values`);
  // OLD: /values → NEW: /attribute-values
}

// Line 154: Fix endpoint
setPropertyValue(propertyId: number, attributeId: number, value: any): Observable<PropertyValue> {
  return this.http.post<PropertyValue>(`${this.baseUrl}/${propertyId}/attribute-values`, {
    // OLD: /values → NEW: /attribute-values
    attributeId,
    value: this.normalizeValue(value)
  });
}

// Line 161: Fix endpoint
deletePropertyValue(propertyId: number, attributeId: number): Observable<ApiResponse> {
  return this.http.delete<ApiResponse>(`${this.baseUrl}/${propertyId}/attribute-values/${attributeId}`);
  // OLD: /values/ → NEW: /attribute-values/
}

// Line 174: Fix endpoint
getPropertySharingDetails(propertyId: number): Observable<PropertySharing[]> {
  return this.http.get<PropertySharing[]>(`${this.baseUrl}/${propertyId}/shares`);
  // OLD: /sharing → NEW: /shares
}

// ADD NEW METHOD: Update property status
updatePropertyStatus(id: number, status: PropertyStatus): Observable<ApiResponse> {
  const params = new HttpParams().set('status', status);
  return this.http.patch<ApiResponse>(`${this.baseUrl}/${id}/status`, null, { params });
}

// ADD NEW METHOD: Advanced search by criteria
searchByCriteria(criteria: PropertySearchCriteriaRequest): Observable<PropertyPageResponse> {
  return this.http.post<PropertyPageResponse>(`${this.baseUrl}/search/by-criteria`, criteria);
}
```

### Phase 2: Update Models/Interfaces

**File:** `src/app/features/properties/models/property.interface.ts`

#### Add Interface:
```typescript
export interface PropertySearchCriteriaRequest {
  minPrice?: number;
  maxPrice?: number;
  filters?: PropertySearchFilter[];
  page?: number;
  size?: number;
  sort?: string;
}

export interface PropertySearchFilter {
  attributeId: number;
  dataType: PropertyAttributeDataType;
  minValue?: number;
  maxValue?: number;
  textValue?: string;
  booleanValue?: boolean;
  selectedValues?: string[];
}
```

### Phase 3: Update Components (if needed)

**File:** `src/app/features/properties/components/property-detail/property-detail.ts`
- Update calls from `/values` to `/attribute-values`
- Add status update button using PATCH endpoint

**File:** `src/app/features/properties/components/property-form/property-form.ts`
- Verify batch operations are used (already done ✅)
- Update any direct attribute value calls

---

## Testing Checklist

- [ ] GET property attribute values works with `/attribute-values`
- [ ] POST set attribute value works with `/attribute-values`
- [ ] DELETE attribute value works with `/attribute-values`
- [ ] GET property shares works with `/shares`
- [ ] PATCH update property status works
- [ ] POST search by criteria works with filters
- [ ] Property form still works with batch operations
- [ ] Property detail displays attributes correctly
- [ ] Sharing functionality works with new endpoint

---

## Files to Modify

1. ✏️ `src/app/features/properties/services/property.service.ts`
2. ✏️ `src/app/features/properties/models/property.interface.ts`
3. ✏️ `src/app/features/properties/components/property-detail/property-detail.ts` (verify)
4. ✏️ `src/app/features/properties/components/property-form/property-form.ts` (verify)

---

## Estimated Impact
- **Risk Level:** LOW (simple endpoint path changes)
- **Breaking Changes:** None (internal refactoring only)
- **Testing Required:** Medium
