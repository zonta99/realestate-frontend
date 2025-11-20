# Users Module - API Alignment Plan

## Current State Analysis

### ✅ What's Working
- Basic CRUD operations (create, read, update, delete)
- Pagination and filtering
- User hierarchy management (subordinates, supervisors)
- Password change functionality
- Status updates
- Role-based filtering

### ❌ Issues to Fix

#### 1. Search Endpoint Inconsistency
**Current:**
- `getUsersByRole()` uses `/search?role=X`
- Missing generic search method for username and status

**Should Have:**
- `searchUsers()` method that supports multiple params: `?username=X&role=Y&status=Z`

#### 2. API Response Type Mismatch
**Need to verify:**
- All endpoints return correct response types
- Status update should return `ApiResponse` not full user

---

## Implementation Plan

### Phase 1: Update UserService

**File:** `src/app/features/users/services/user.service.ts`

#### Changes:
```typescript
// REPLACE getUsersByRole with generic searchUsers (line 72)
/**
 * Search users by various criteria
 * @param params Search parameters (username, role, status)
 */
searchUsers(params: UserSearchParams): Observable<UserResponse[]> {
  let httpParams = new HttpParams();

  if (params.username) httpParams = httpParams.set('username', params.username);
  if (params.role) httpParams = httpParams.set('role', params.role);
  if (params.status) httpParams = httpParams.set('status', params.status);

  return this.http.get<UserResponse[]>(`${this.baseUrl}/search`, { params: httpParams });
}

// Keep getUsersByRole as convenience method
getUsersByRole(role: Role): Observable<UserResponse[]> {
  return this.searchUsers({ role });
}

// Verify all endpoints match API spec (should be correct already)
```

### Phase 2: Update User Models

**File:** `src/app/features/users/models/user-api.model.ts`

#### Add Interface:
```typescript
// ADD search params interface
export interface UserSearchParams {
  username?: string;
  role?: Role;
  status?: UserStatus;
}
```

### Phase 3: Update User Components (Verification Only)

**File:** `src/app/features/users/components/user-list/user-list.ts`
- Verify search functionality
- Add search filters if not present

**File:** `src/app/features/users/components/user-form/user-form.ts`
- Verify create/update operations conform to API
- Already looks correct ✅

**File:** `src/app/features/users/components/user-detail/user-detail.ts`
- Verify display shows all user information
- Verify hierarchy display works

---

## Implementation Details

### Search Enhancement (Optional)

Add search form to UserList component:
```typescript
// user-list.ts
searchForm = this.fb.group({
  username: [''],
  role: [''],
  status: ['']
});

onSearch(): void {
  const params: UserSearchParams = {};
  const formValue = this.searchForm.value;

  if (formValue.username) params.username = formValue.username;
  if (formValue.role) params.role = formValue.role;
  if (formValue.status) params.status = formValue.status;

  this.userFacade.searchUsers(params);
}
```

Add to template:
```html
<mat-card class="search-card">
  <mat-card-content>
    <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
      <div class="search-grid">
        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" placeholder="Search by username">
          <mat-icon matPrefix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="">All Roles</mat-option>
            <mat-option [value]="Role.ADMIN">Admin</mat-option>
            <mat-option [value]="Role.BROKER">Broker</mat-option>
            <mat-option [value]="Role.AGENT">Agent</mat-option>
            <mat-option [value]="Role.ASSISTANT">Assistant</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="">All Statuses</mat-option>
            <mat-option [value]="UserStatus.ACTIVE">Active</mat-option>
            <mat-option [value]="UserStatus.INACTIVE">Inactive</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit">
          <mat-icon>search</mat-icon>
          Search
        </button>
      </div>
    </form>
  </mat-card-content>
</mat-card>
```

---

## Testing Checklist

- [ ] Get all users with pagination works
- [ ] Get user by ID works
- [ ] Create user works (all roles)
- [ ] Update user works (including role changes)
- [ ] Delete user works
- [ ] Search by username works
- [ ] Search by role works
- [ ] Search by status works
- [ ] Combined search (multiple params) works
- [ ] Update user status (PATCH) works
- [ ] Change password works
- [ ] Add supervisor relationship works
- [ ] Remove supervisor relationship works
- [ ] Get user subordinates works

---

## Files to Modify

1. ✏️ `src/app/features/users/models/user-api.model.ts`
2. ✏️ `src/app/features/users/services/user.service.ts`
3. ✏️ `src/app/features/users/components/user-list/user-list.ts` (enhancement)

---

## Estimated Impact
- **Risk Level:** LOW (minor enhancement)
- **Breaking Changes:** None
- **Testing Required:** LOW
