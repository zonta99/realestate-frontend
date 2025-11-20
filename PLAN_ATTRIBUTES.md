# Attributes Module - API Alignment Plan

## Current State Analysis

### ✅ What's Working
- Get all attributes
- Get searchable attributes
- Get attribute by ID
- Create attribute
- Update attribute
- Delete attribute
- Create/update/delete attribute options
- Property attribute value operations
- Utility methods (grouping, sorting, parsing)

### ❌ Issues to Fix

#### 1. Get Attributes by Category - Wrong Endpoint
**Current:**
```typescript
getAttributesByCategory(category: PropertyCategory): Observable<PropertyAttribute[]> {
  return this.http.get<PropertyAttribute[]>(`${this.apiUrl}/property-attributes/category/${category}`);
}
```

**Should Be (per API spec):**
```typescript
// Use query parameter, not path parameter
GET /api/property-attributes/by-category?category=FEATURES
```

#### 2. Reorder Attributes - Wrong Endpoint
**Current:**
```typescript
reorderAttributes(category: PropertyCategory, attributeIds: number[]): Observable<ApiResponse> {
  const request: ReorderAttributesRequest = { attributeIds };
  return this.http.put<ApiResponse>(`${this.apiUrl}/property-attributes/category/${category}/reorder`, request);
}
```

**Should Be (per API spec):**
```typescript
// POST, not PUT, and different structure
POST /api/property-attributes/reorder
Body: [
  {"attributeId": 1, "newDisplayOrder": 1},
  {"attributeId": 2, "newDisplayOrder": 2}
]
```

#### 3. Search Attributes - Missing
**Missing Method:**
```typescript
GET /api/property-attributes/search?name=bedroom
```

#### 4. Response Type Inconsistency
**Current:** `createAttribute()` returns `ApiResponse<PropertyAttribute>`
**Should Return:** `PropertyAttribute` (based on other CRUD patterns)

---

## Implementation Plan

### Phase 1: Update AttributeService

**File:** `src/app/features/attributes/services/attribute.service.ts`

#### Changes:
```typescript
// FIX: getAttributesByCategory - use query param (line 35)
getAttributesByCategory(category: PropertyCategory): Observable<PropertyAttribute[]> {
  const params = new HttpParams().set('category', category);
  return this.http.get<PropertyAttribute[]>(
    `${this.apiUrl}/property-attributes/by-category`,
    { params }
  );
}

// FIX: createAttribute - return PropertyAttribute directly (line 43)
createAttribute(request: CreateAttributeRequest): Observable<PropertyAttribute> {
  return this.http.post<PropertyAttribute>(`${this.apiUrl}/property-attributes`, request);
  // Remove ApiResponse wrapper
}

// FIX: reorderAttributes - use POST with different request structure (line 67)
reorderAttributes(reorderItems: AttributeReorderItem[]): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    `${this.apiUrl}/property-attributes/reorder`,
    reorderItems
  );
}

// ADD: Search attributes by name (new method)
/**
 * Search attributes by name
 * @param name Search term for attribute name
 */
searchAttributes(name: string): Observable<PropertyAttribute[]> {
  const params = new HttpParams().set('name', name);
  return this.http.get<PropertyAttribute[]>(
    `${this.apiUrl}/property-attributes/search`,
    { params }
  );
}
```

### Phase 2: Update Models/Interfaces

**File:** `src/app/features/properties/models/property.interface.ts`

#### Update Interface:
```typescript
// UPDATE: ReorderAttributesRequest (change structure)
export interface AttributeReorderItem {
  attributeId: number;
  newDisplayOrder: number;
}

// OLD (remove):
// export interface ReorderAttributesRequest {
//   attributeIds: number[];
// }
```

### Phase 3: Update Components

**Component:** Any component using `reorderAttributes()`
Need to find and update calls to match new signature.

Let me search for usages:
```typescript
// OLD call:
attributeService.reorderAttributes(category, [1, 2, 3]);

// NEW call:
const reorderItems: AttributeReorderItem[] = [
  { attributeId: 1, newDisplayOrder: 1 },
  { attributeId: 2, newDisplayOrder: 2 },
  { attributeId: 3, newDisplayOrder: 3 }
];
attributeService.reorderAttributes(reorderItems);
```

### Phase 4: Update Attribute Management UI (if exists)

If there's an admin attribute management component:

#### Add Search Feature:
```typescript
// attribute-list.ts (admin component)
searchForm = this.fb.group({
  name: ['']
});

onSearch(): void {
  const name = this.searchForm.value.name;
  if (name && name.trim()) {
    this.attributeService.searchAttributes(name.trim()).subscribe({
      next: (attributes) => this.attributes = attributes,
      error: (error) => this.handleError(error)
    });
  } else {
    this.loadAllAttributes();
  }
}
```

Add to template:
```html
<mat-card class="search-card">
  <mat-card-content>
    <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search Attributes</mat-label>
        <input matInput formControlName="name" placeholder="Enter attribute name">
        <mat-icon matPrefix>search</mat-icon>
        <button mat-icon-button matSuffix type="submit" [disabled]="!searchForm.value.name">
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </mat-form-field>
    </form>
  </mat-card-content>
</mat-card>
```

#### Update Reorder UI:
```typescript
// When reordering attributes (drag-drop or manual)
onReorderComplete(attributes: PropertyAttribute[]): void {
  const reorderItems: AttributeReorderItem[] = attributes.map((attr, index) => ({
    attributeId: attr.id,
    newDisplayOrder: index + 1
  }));

  this.attributeService.reorderAttributes(reorderItems).subscribe({
    next: () => {
      this.snackBar.open('Attributes reordered successfully', 'Close', { duration: 3000 });
      this.loadAttributes();
    },
    error: (error) => this.handleError(error)
  });
}
```

### Phase 5: Fix Response Type Handling

**Update any code expecting ApiResponse wrapper:**
```typescript
// OLD:
this.attributeService.createAttribute(request).subscribe({
  next: (response: ApiResponse<PropertyAttribute>) => {
    console.log(response.message);
    const attribute = response.data;
    // ...
  }
});

// NEW:
this.attributeService.createAttribute(request).subscribe({
  next: (attribute: PropertyAttribute) => {
    // Direct access to attribute
    console.log('Created:', attribute);
    // ...
  }
});
```

---

## Testing Checklist

- [ ] Get all attributes works
- [ ] Get attributes by category with query param works
- [ ] Search attributes by name works
- [ ] Get attribute by ID works
- [ ] Create attribute returns PropertyAttribute directly
- [ ] Update attribute works
- [ ] Delete attribute works
- [ ] Reorder attributes with new structure works
- [ ] Create attribute option works
- [ ] Update attribute option works
- [ ] Delete attribute option works
- [ ] Get property attribute values works
- [ ] Set property attribute value works
- [ ] Delete property attribute value works

---

## Files to Modify

1. ✏️ `src/app/features/attributes/services/attribute.service.ts`
2. ✏️ `src/app/features/properties/models/property.interface.ts`
3. ✏️ Any components using `createAttribute()` (update response handling)
4. ✏️ Any components using `reorderAttributes()` (update call structure)
5. ✏️ Admin attribute management UI (if exists)

---

## Estimated Impact
- **Risk Level:** LOW-MEDIUM (endpoint changes, but limited usage)
- **Breaking Changes:** Minor (reorder signature change)
- **Testing Required:** MEDIUM

---

## Additional Notes

### Attribute Categories (from API)
```typescript
enum PropertyCategory {
  BASIC = 'BASIC',
  LOCATION = 'LOCATION',
  STRUCTURE = 'STRUCTURE',
  FEATURES = 'FEATURES',
  FINANCIAL = 'FINANCIAL',
  LEGAL = 'LEGAL'
}
```

### Data Types Supported
```typescript
enum PropertyAttributeDataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_SELECT = 'MULTI_SELECT'
}
```

All data types are properly supported in the service ✅
