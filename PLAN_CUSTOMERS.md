# Customers Module - API Alignment Plan

## Current State Analysis

### ✅ What's Working
- Basic CRUD operations (create, read, update, delete)
- Pagination and filtering
- Search by name, email, status
- Customer notes (create, read, delete)
- Customer interactions (create, read, delete)
- Search criteria management

### ❌ Issues to Fix

#### 1. Missing Fields in Customer Model
**Current Model Missing:**
- `budgetMin?: number` - Minimum budget for property search
- `budgetMax?: number` - Maximum budget for property search
- `leadSource?: string` - Source of the lead (Website, Referral, etc.)

#### 2. Missing API Methods in CustomerService

**Missing Methods:**
- `updateCustomerNote()` - `PUT /api/customers/:id/notes/:noteId`
- `updateCustomerInteraction()` - `PUT /api/customers/:id/interactions/:interactionId`
- `updateCustomerStatus()` - `PATCH /api/customers/:id/status?status=X`

**Search Endpoint Issue:**
- Budget range search exists but uses wrong endpoint: should be `/search?minBudget=X&maxBudget=Y` not `/budget-range`

#### 3. Customer Form Missing Fields
- Form doesn't include `budgetMin`, `budgetMax`, `leadSource` fields
- These are critical for lead qualification workflow

#### 4. Missing Update Interfaces
Need to add:
- `UpdateCustomerNoteRequest`
- `UpdateCustomerInteractionRequest`

---

## Implementation Plan

### Phase 1: Update Customer Models

**File:** `src/app/features/customers/models/customer.interface.ts`

#### Changes:
```typescript
// Update Customer interface (around line 3)
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  budgetMin?: number;        // ADD
  budgetMax?: number;        // ADD
  notes?: string;
  leadSource?: string;       // ADD
  status: CustomerStatus;
  agentId: number;
  agentName?: string;
  createdDate: string;
  updatedDate: string;
  searchCriteria?: CustomerSearchCriteria[];
}

// Update CreateCustomerRequest (around line 35)
export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  budgetMin?: number;        // ADD
  budgetMax?: number;        // ADD
  notes?: string;
  leadSource?: string;       // ADD
  status?: CustomerStatus;   // ADD (make optional, defaults to LEAD)
}

// Update UpdateCustomerRequest (around line 43)
export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  budgetMin?: number;        // ADD
  budgetMax?: number;        // ADD
  notes?: string;
  leadSource?: string;       // ADD
  status?: CustomerStatus;
}

// ADD new interface
export interface UpdateCustomerNoteRequest {
  content: string;
}

// ADD new interface
export interface UpdateCustomerInteractionRequest {
  interactionType: string;
  notes: string;
  interactionDate: string;
}
```

### Phase 2: Update CustomerService

**File:** `src/app/features/customers/services/customer.service.ts`

#### Changes:
```typescript
// ADD: Update customer note (after line 151)
/**
 * Update a customer note
 * @param customerId Customer ID
 * @param noteId Note ID
 * @param note Updated note content
 */
updateCustomerNote(customerId: number, noteId: number, note: UpdateCustomerNoteRequest): Observable<CustomerNote> {
  return this.http.put<CustomerNote>(`${this.apiUrl}/${customerId}/notes/${noteId}`, note);
}

// ADD: Update customer interaction (after line 181)
/**
 * Update a customer interaction
 * @param customerId Customer ID
 * @param interactionId Interaction ID
 * @param interaction Updated interaction data
 */
updateCustomerInteraction(customerId: number, interactionId: number, interaction: UpdateCustomerInteractionRequest): Observable<CustomerInteraction> {
  return this.http.put<CustomerInteraction>(`${this.apiUrl}/${customerId}/interactions/${interactionId}`, interaction);
}

// ADD: Update customer status (after line 86)
/**
 * Update customer status
 * @param id Customer ID
 * @param status New status
 */
updateCustomerStatus(id: number, status: CustomerStatus): Observable<ApiResponse> {
  const params = new HttpParams().set('status', status);
  return this.http.patch<ApiResponse>(`${this.apiUrl}/${id}/status`, null, { params });
}

// UPDATE: Fix budget range search (line 207)
// REMOVE getCustomersByBudgetRange() method - use searchCustomers() instead

// UPDATE: searchCustomers method to support budget params (line 191)
searchCustomers(params: CustomerSearchParams): Observable<Customer[]> {
  let httpParams = new HttpParams();

  if (params.name) httpParams = httpParams.set('name', params.name);
  if (params.status) httpParams = httpParams.set('status', params.status);
  if (params.phone) httpParams = httpParams.set('phone', params.phone);
  if (params.email) httpParams = httpParams.set('email', params.email);
  if (params.minBudget !== undefined) httpParams = httpParams.set('minBudget', params.minBudget.toString());  // ADD
  if (params.maxBudget !== undefined) httpParams = httpParams.set('maxBudget', params.maxBudget.toString());  // ADD

  return this.http.get<Customer[]>(`${this.apiUrl}/search`, { params: httpParams });
}
```

**File:** `src/app/features/customers/models/customer.model.ts`
```typescript
// ADD to CustomerSearchParams interface
export interface CustomerSearchParams {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  minBudget?: number;   // ADD
  maxBudget?: number;   // ADD
}
```

### Phase 3: Update Customer Form

**File:** `src/app/features/customers/components/customer-form/customer-form.ts`

#### Changes:
```typescript
// Update form initialization (around line 479)
initializeForms(): void {
  this.customerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    status: [CustomerStatus.LEAD, Validators.required],
    budgetMin: [null],                          // ADD
    budgetMax: [null],                          // ADD
    leadSource: [''],                           // ADD
    agentId: [null],
    notes: ['']
  });

  this.searchCriteriaForm = this.fb.group({
    minPrice: [null],
    maxPrice: [null],
    minBedrooms: [null],
    maxBedrooms: [null],
    city: [''],
    propertyType: [''],
    mustHaveGarage: [null]
  });
}

// Update template to add Step 2: Budget & Lead Info
// Insert between Step 1 (Basic Info) and current Step 2 (Search Criteria)
```

#### Add to Template (after line 123):
```html
<!-- Step 2: Budget & Lead Information -->
<mat-step [stepControl]="customerForm">
  <ng-template matStepLabel>Budget & Lead Information</ng-template>

  <p class="step-description">
    Set the customer's budget range and track the lead source.
  </p>

  <div class="form-grid">
    <mat-form-field appearance="outline">
      <mat-label>Minimum Budget</mat-label>
      <input matInput type="number" [formControl]="customerForm.get('budgetMin')">
      <span matPrefix>$&nbsp;</span>
      <mat-hint>Customer's minimum budget for property search</mat-hint>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Maximum Budget</mat-label>
      <input matInput type="number" [formControl]="customerForm.get('budgetMax')">
      <span matPrefix>$&nbsp;</span>
      <mat-hint>Customer's maximum budget for property search</mat-hint>
    </mat-form-field>

    <mat-form-field appearance="outline" class="full-width">
      <mat-label>Lead Source</mat-label>
      <mat-select [formControl]="customerForm.get('leadSource')">
        <mat-option value="">None</mat-option>
        <mat-option value="Website Inquiry">Website Inquiry</mat-option>
        <mat-option value="Phone Call">Phone Call</mat-option>
        <mat-option value="Walk-In">Walk-In</mat-option>
        <mat-option value="Referral">Referral</mat-option>
        <mat-option value="Social Media">Social Media</mat-option>
        <mat-option value="Email Campaign">Email Campaign</mat-option>
        <mat-option value="Open House">Open House</mat-option>
        <mat-option value="Other">Other</mat-option>
      </mat-select>
      <mat-hint>How did this customer find us?</mat-hint>
    </mat-form-field>
  </div>

  <div class="step-actions">
    <button mat-button matStepperPrevious>Back</button>
    <button mat-raised-button matStepperNext>Next</button>
  </div>
</mat-step>
```

#### Update Review Section (around line 190):
```html
<!-- Add to review section -->
@if (customerForm.value.budgetMin || customerForm.value.budgetMax) {
  <div class="review-item">
    <strong>Budget Range:</strong>
    <span>
      {{ customerForm.value.budgetMin ? ('$' + customerForm.value.budgetMin.toLocaleString()) : 'Any' }}
      -
      {{ customerForm.value.budgetMax ? ('$' + customerForm.value.budgetMax.toLocaleString()) : 'Any' }}
    </span>
  </div>
}
@if (customerForm.value.leadSource) {
  <div class="review-item">
    <strong>Lead Source:</strong>
    <span>{{ customerForm.value.leadSource }}</span>
  </div>
}
```

### Phase 4: Update Customer Detail Component

**File:** `src/app/features/customers/components/customer-detail/customer-detail.ts`

#### Add Display Sections:
```html
<!-- Add after basic info section -->
<mat-card class="info-card">
  <mat-card-header>
    <mat-icon mat-card-avatar>attach_money</mat-icon>
    <mat-card-title>Budget Information</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <div class="info-grid">
      <div class="info-item">
        <strong>Budget Range:</strong>
        <span>
          {{ customer.budgetMin ? ('$' + customer.budgetMin.toLocaleString()) : 'Not specified' }}
          -
          {{ customer.budgetMax ? ('$' + customer.budgetMax.toLocaleString()) : 'Not specified' }}
        </span>
      </div>
      @if (customer.leadSource) {
        <div class="info-item">
          <strong>Lead Source:</strong>
          <mat-chip>{{ customer.leadSource }}</mat-chip>
        </div>
      }
    </div>
  </mat-card-content>
</mat-card>
```

### Phase 5: Update Customer List Component (Optional Enhancement)

**File:** `src/app/features/customers/components/customer-list/customer-list.ts`

#### Add Budget Column:
```typescript
// Add to displayedColumns
displayedColumns = ['name', 'email', 'phone', 'budget', 'status', 'agent', 'actions'];

// Add to template
<ng-container matColumnDef="budget">
  <th mat-header-cell *matHeaderCellDef>Budget Range</th>
  <td mat-cell *matCellDef="let customer">
    @if (customer.budgetMin || customer.budgetMax) {
      {{ customer.budgetMin ? ('$' + (customer.budgetMin / 1000) + 'k') : 'Any' }}
      -
      {{ customer.budgetMax ? ('$' + (customer.budgetMax / 1000) + 'k') : 'Any' }}
    } @else {
      <span class="muted">Not set</span>
    }
  </td>
</ng-container>
```

---

## Testing Checklist

- [ ] Create customer with budgetMin, budgetMax, leadSource
- [ ] Update customer including budget fields
- [ ] Update customer note (PUT endpoint)
- [ ] Update customer interaction (PUT endpoint)
- [ ] Update customer status via PATCH
- [ ] Search customers by budget range
- [ ] Customer form displays all new fields
- [ ] Customer detail shows budget and lead source
- [ ] Customer list shows budget column
- [ ] Form validation: budgetMin < budgetMax

---

## Files to Modify

1. ✏️ `src/app/features/customers/models/customer.interface.ts`
2. ✏️ `src/app/features/customers/models/customer.model.ts`
3. ✏️ `src/app/features/customers/services/customer.service.ts`
4. ✏️ `src/app/features/customers/components/customer-form/customer-form.ts`
5. ✏️ `src/app/features/customers/components/customer-detail/customer-detail.ts`
6. ✏️ `src/app/features/customers/components/customer-list/customer-list.ts` (optional)

---

## Estimated Impact
- **Risk Level:** MEDIUM (model changes, new fields)
- **Breaking Changes:** None (all new fields are optional)
- **Testing Required:** HIGH (many changes)
