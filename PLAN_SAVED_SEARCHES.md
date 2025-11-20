# Saved Searches Module - API Alignment Plan

## Current State Analysis

### ✅ What's Working
- Get all saved searches
- Get saved search by ID
- Create saved search
- Update saved search
- Delete saved search
- Execute saved search with criteria
- Filter validation logic

### ❌ Issues to Fix

#### 1. Customer-Scoped Endpoints Missing
**Current:**
- Only global saved search endpoints (`/api/saved-searches`)

**Missing (per API spec):**
- `GET /api/customers/:customerId/saved-searches` - Get saved searches for a customer
- `POST /api/customers/:customerId/saved-searches` - Create saved search for specific customer

**Per API, saved searches belong to customers**, not just users globally.

#### 2. Execute Saved Search Endpoint
**Current:**
- Uses generic search endpoint: `POST /api/properties/search/by-criteria`

**Should Also Support:**
- `GET /api/saved-searches/:id/execute` - Execute a saved search by ID
- `GET /api/saved-searches/:id/execute?page=0&size=5` - With pagination

---

## Implementation Plan

### Phase 1: Update SavedSearchService

**File:** `src/app/features/saved-searches/services/saved-search.service.ts`

#### Changes:
```typescript
// ADD customer-scoped endpoints (after line 29)

/**
 * Get all saved searches for a specific customer
 * @param customerId Customer ID
 */
getSavedSearchesByCustomer(customerId: number): Observable<SavedSearch[]> {
  return this.http.get<SavedSearch[]>(`${environment.apiUrl}/api/customers/${customerId}/saved-searches`);
}

/**
 * Create a saved search for a specific customer
 * @param customerId Customer ID
 * @param request Search criteria
 */
createSavedSearchForCustomer(customerId: number, request: CreateSavedSearchRequest): Observable<SavedSearchResponse> {
  return this.http.post<SavedSearchResponse>(
    `${environment.apiUrl}/api/customers/${customerId}/saved-searches`,
    request
  );
}

// ADD execute by ID endpoint (after line 83)

/**
 * Execute a saved search by ID using dedicated endpoint
 * @param savedSearchId Saved search ID
 * @param page Page number (default 0)
 * @param size Page size (default 20)
 */
executeSavedSearchById(
  savedSearchId: number,
  page: number = 0,
  size: number = 20
): Observable<PropertyPageResponse> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  return this.http.get<PropertyPageResponse>(
    `${this.apiUrl}/${savedSearchId}/execute`,
    { params }
  );
}

// KEEP existing executeSavedSearch as alternative method
// executeSavedSearch() - Uses POST /properties/search/by-criteria (line 69)
```

### Phase 2: Update Components

**File:** `src/app/features/saved-searches/components/saved-search-form/saved-search-form.ts`

#### Add Customer Context:
```typescript
// Add input for customer context
@Input() customerId?: number;

onSubmit(): void {
  if (this.savedSearchForm.invalid) {
    return;
  }

  const request: CreateSavedSearchRequest = {
    name: this.savedSearchForm.value.name!,
    description: this.savedSearchForm.value.description,
    filters: this.filters
  };

  if (this.isEditMode && this.savedSearchId) {
    // Update existing
    this.savedSearchService.updateSavedSearch(this.savedSearchId, request)
      .subscribe({
        next: () => this.router.navigate(['/saved-searches']),
        error: (error) => this.handleError(error)
      });
  } else {
    // Create new - use customer-scoped endpoint if customerId provided
    const createObs = this.customerId
      ? this.savedSearchService.createSavedSearchForCustomer(this.customerId, request)
      : this.savedSearchService.createSavedSearch(request);

    createObs.subscribe({
      next: () => {
        const route = this.customerId
          ? ['/customers/view', this.customerId]
          : ['/saved-searches'];
        this.router.navigate(route);
      },
      error: (error) => this.handleError(error)
    });
  }
}
```

**File:** `src/app/features/saved-searches/components/saved-search-list/saved-search-list.ts`

#### Add Customer Filter:
```typescript
// Add input for customer context
@Input() customerId?: number;

ngOnInit(): void {
  if (this.customerId) {
    // Load saved searches for specific customer
    this.loadCustomerSavedSearches();
  } else {
    // Load all saved searches for current user
    this.loadSavedSearches();
  }
}

loadCustomerSavedSearches(): void {
  this.savedSearchService.getSavedSearchesByCustomer(this.customerId!)
    .subscribe({
      next: (searches) => this.savedSearches = searches,
      error: (error) => this.handleError(error)
    });
}
```

**File:** `src/app/features/saved-searches/components/search-results/search-results.ts`

#### Update Execute Method:
```typescript
executeSearch(): void {
  if (this.savedSearch) {
    // Use dedicated execute endpoint
    this.savedSearchService.executeSavedSearchById(
      this.savedSearch.id,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.properties = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: (error) => this.handleError(error)
    });
  }
}
```

### Phase 3: Update Customer Detail to Show Saved Searches

**File:** `src/app/features/customers/components/customer-detail/customer-detail.ts`

#### Add Saved Searches Section:
```html
<!-- Add new section in template -->
<mat-card class="saved-searches-card">
  <mat-card-header>
    <mat-icon mat-card-avatar>search</mat-icon>
    <mat-card-title>Saved Searches</mat-card-title>
    <button mat-icon-button (click)="createSavedSearch()">
      <mat-icon>add</mat-icon>
    </button>
  </mat-card-header>
  <mat-card-content>
    <app-saved-search-list [customerId]="customer.id"></app-saved-search-list>
  </mat-card-content>
</mat-card>
```

```typescript
createSavedSearch(): void {
  this.router.navigate(['/saved-searches/new'], {
    queryParams: { customerId: this.customer.id }
  });
}
```

### Phase 4: Update Routing

**File:** `src/app/features/saved-searches/saved-searches.routes.ts`

#### Support Customer Context:
```typescript
export const savedSearchRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./components/saved-search-list/saved-search-list')
        .then(m => m.SavedSearchListComponent)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/saved-search-form/saved-search-form')
        .then(m => m.SavedSearchFormComponent)
    // Query param: ?customerId=123
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./components/saved-search-form/saved-search-form')
        .then(m => m.SavedSearchFormComponent)
  },
  {
    path: ':id/results',
    loadComponent: () =>
      import('./components/search-results/search-results')
        .then(m => m.SearchResultsComponent)
  }
];
```

---

## API Clarification Notes

Based on the API spec, saved searches can be:
1. **Global** - Created via `/api/saved-searches` (current implementation)
2. **Customer-Scoped** - Created via `/api/customers/:id/saved-searches` (missing)

Both are valid. The customer-scoped endpoints associate searches directly with customers.

**Recommendation:**
- Keep global endpoints for user's personal searches
- Add customer-scoped endpoints for customer-specific searches
- In the UI, show:
  - "My Searches" (global, user's personal)
  - "Customer Searches" (customer-scoped, shown in customer detail)

---

## Testing Checklist

- [ ] Get saved searches for specific customer
- [ ] Create saved search for specific customer
- [ ] Global saved searches still work
- [ ] Execute saved search by ID with pagination
- [ ] Execute saved search using criteria (existing method)
- [ ] Update saved search works
- [ ] Delete saved search works
- [ ] Customer detail shows saved searches
- [ ] Create saved search from customer detail page
- [ ] Filter validation still works

---

## Files to Modify

1. ✏️ `src/app/features/saved-searches/services/saved-search.service.ts`
2. ✏️ `src/app/features/saved-searches/components/saved-search-form/saved-search-form.ts`
3. ✏️ `src/app/features/saved-searches/components/saved-search-list/saved-search-list.ts`
4. ✏️ `src/app/features/saved-searches/components/search-results/search-results.ts`
5. ✏️ `src/app/features/customers/components/customer-detail/customer-detail.ts`

---

## Estimated Impact
- **Risk Level:** MEDIUM (new customer-scoped workflow)
- **Breaking Changes:** None (additive only)
- **Testing Required:** MEDIUM
