# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 20 real estate management frontend application using NgRx for state management and Angular Material for UI. The application manages properties, customers, users, and attributes with role-based access control.

## Development Commands

### Development Server
```bash
npm run start        # Start dev server on http://0.0.0.0:4200
ng serve            # Alternative, binds to localhost:4200
```

### Build & Test
```bash
npm run build       # Production build
npm run watch       # Watch mode for development
npm test            # Run tests with Karma + Jasmine
```

**Build System** (Angular 20 with esbuild):
- Builder: `@angular/build:application` (esbuild-based, faster than webpack)
- Output directory: `dist/`
- Production optimizations: tree-shaking, minification, output hashing

**Bundle Budgets** (configured in `angular.json`):
- Initial bundle: 500kB warning, 1MB error
- Component styles: 4kB warning, 8kB error
- Exceeding budgets will cause build warnings/errors

### Angular CLI
```bash
ng generate component <name>   # Generate new component
ng generate service <name>      # Generate new service
ng generate --help              # See all scaffolding options
```

## Architecture

### State Management (NgRx)

The application uses NgRx for centralized state management with a feature-based approach:

- **Global State** (`src/app/core/store/app.reducer.ts`): Combines auth and properties feature states
- **Feature States**: Each feature module has its own store directory with actions, reducers, effects, and selectors
- **Facade Pattern**: Services like `AuthFacadeService` provide a simple API over NgRx stores, exposing both signals (for components) and observables (for guards/services)

#### Key State Slices
- `auth`: Authentication state, user profile, roles, session management
- `properties`: Property listings, selected property, property values, sharing data

**Important**: When creating new feature state, update `AppState` interface in `app.reducer.ts` and add the reducer to `appReducers` ActionReducerMap.

#### NgRx Store Structure Pattern

Each feature with state management should follow this structure:

```
features/<feature>/store/
├── <feature>.actions.ts      # Action creators and action types
├── <feature>.effects.ts      # Side effects (API calls, routing, etc.)
├── <feature>.reducer.ts      # State shape and reducer functions
├── <feature>.selectors.ts    # Memoized state selectors
└── index.ts                  # Public API exports
```

**Action Naming Convention**:
```typescript
// Action types: [Feature] Action Description
export const loadProperties = createAction('[Property] Load Properties');
export const loadPropertiesSuccess = createAction(
  '[Property] Load Properties Success',
  props<{ properties: Property[] }>()
);
export const loadPropertiesFailure = createAction(
  '[Property] Load Properties Failure',
  props<{ error: string }>()
);
```

**Effects Pattern**:
```typescript
@Injectable()
export class FeatureEffects {
  private actions$ = inject(Actions);
  private service = inject(FeatureService);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeatureActions.loadItems),
      switchMap(() =>
        this.service.getItems().pipe(
          map(items => FeatureActions.loadItemsSuccess({ items })),
          catchError(error => of(FeatureActions.loadItemsFailure({ error: error.message })))
        )
      )
    )
  );
}
```

**Selector Composition**:
```typescript
// Feature selector
export const selectFeatureState = (state: AppState) => state.feature;

// Memoized selectors
export const selectAllItems = createSelector(
  selectFeatureState,
  (state) => state.items
);

export const selectLoading = createSelector(
  selectFeatureState,
  (state) => state.loading
);
```

**Registering State**:
1. Add to `AppState` interface in `app.reducer.ts`
2. Add reducer to `appReducers` ActionReducerMap
3. Add effects to `appEffects` array in `app.effects.ts`

### Directory Structure

```
src/app/
├── core/              # Singleton services, auth, global state
│   ├── auth/          # Authentication module
│   │   ├── components/    # Login component
│   │   ├── guards/        # authGuard, noAuthGuard, role guards
│   │   ├── interceptors/  # authInterceptor (JWT token handling)
│   │   ├── models/        # User, Role, AuthState models
│   │   ├── services/      # auth-api, auth-facade, token-storage
│   │   └── store/         # Auth NgRx state (actions/effects/reducers/selectors)
│   ├── navigation/    # Navigation service
│   ├── services/      # ErrorLoggingService
│   └── store/         # Global NgRx store (app.reducer, app.effects)
├── features/          # Feature modules (lazy-loaded)
│   ├── attributes/    # Property attribute management
│   │   └── services/      # attribute.service
│   ├── customers/     # Customer management (agents+)
│   ├── dashboard/     # Dashboard view
│   ├── profile/       # User profile
│   ├── properties/    # Property management (agents+)
│   │   ├── components/    # property-list, property-form, property-detail, etc.
│   │   ├── models/        # Property interfaces, enums, API types
│   │   ├── services/      # property.service, change-tracking.service
│   │   └── store/         # Property NgRx state (actions/effects/reducer/selectors)
│   └── users/         # User management (brokers+)
├── shared/            # Shared components and utilities
│   ├── components/    # navbar, loading, stat-card, not-found, unauthorized, etc.
│   ├── services/      # FormAutoSaveService
│   └── utils/         # AttributeValueNormalizer
└── environments/      # Environment configurations (base, local, prod)
```

### Authentication & Authorization

#### Role Hierarchy (from highest to lowest)
1. `ROLE_ADMIN` - Full system access
2. `ROLE_BROKER` - Manages users, properties, customers
3. `ROLE_AGENT` - Manages properties and customers
4. `ROLE_ASSISTANT` - Limited access

#### Role-Based Guards

**Basic Guards** (`src/app/core/auth/guards/`):
- `authGuard`: Requires authentication (any authenticated user)
- `noAuthGuard`: Only allows unauthenticated users (login/registration pages)

**Role-Specific Guards**:
- `adminGuard`: Requires ADMIN role
- `brokerGuard`: Requires BROKER or ADMIN role
- `agentGuard`: Requires AGENT, BROKER, or ADMIN role

**Business Logic Guards**:
- `canManageUsersGuard`: Requires ADMIN or BROKER (user management permission)
- `canManagePropertiesGuard`: Requires AGENT, BROKER, or ADMIN (property management)

**Custom Guard Factory**:
- `createRoleGuard(roles: Role[])`: Factory function to create custom role-based guards
- `createRoleGuardObservable(roles: Role[])`: Alternative using observables instead of signals

**Usage Examples**:
```typescript
// In route configuration
{
  path: 'properties',
  canActivate: [authGuard, agentGuard],
  loadChildren: () => import('./features/properties/properties.routes')
}

// Custom guard with factory
const supervisorGuard = createRoleGuard([Role.ADMIN, Role.BROKER]);
```

**Facade Service Role Checks**:
- Use `AuthFacadeService` signals in components: `isAdmin()`, `isBroker()`, `isAgent()`, `isAssistant()`, `isSupervisor()`

#### User Model
Users have `roles: string[]` (e.g., `["ROLE_ADMIN", "ROLE_BROKER"]`). Use `UserHelper` class for role operations:
```typescript
UserHelper.hasRole(user, Role.ADMIN)
UserHelper.isSupervisor(user)  // Checks if ADMIN or BROKER
UserHelper.getDisplayRoles(user)  // Returns ["ADMIN", "BROKER"]
```

### HTTP Interceptors

`authInterceptor` (`src/app/core/auth/interceptors/auth-interceptor.ts`):
- Adds JWT token to requests
- Handles 401 responses (token expiration)
- Refreshes tokens automatically

### Services Pattern

**Facade Services**: Expose NgRx state via signals (for components) and observables (for guards):
```typescript
// In components - use signals
readonly isAdmin = this.authFacade.isAdmin();

// In guards/services - use observables
this.authFacade.isAuthenticated$.pipe(...)
```

**API Services**: Direct HTTP communication with backend at `http://localhost:8080/api`

### Component Architecture

- **Standalone Components**: All components are standalone (no NgModules)
- **Signals**: Modern Angular signals are used throughout for reactive state
- **Material Design**: Angular Material components for UI
- **Route-based lazy loading**: Features are lazy-loaded via routing

**File Naming Convention**:
- Component files: `component-name.ts` (not `.component.ts`)
- Export class: `ComponentNameComponent` or `ComponentName`
- Examples: `property-list.ts` → `PropertyListComponent`, `navbar.ts` → `Navbar`

**Change Detection**:
- Use `ChangeDetectionStrategy.OnPush` for better performance
- Prefer signals for reactive state (automatic change detection)
- Use observables with `async` pipe for streams

### App Configuration

The application uses Angular 20's standalone API with `ApplicationConfig` pattern (`src/app/app.config.ts`):

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    // NgRx Store Configuration
    provideStore(appReducers),
    provideEffects(appEffects),
    provideRouterStore(),
    provideNativeDateAdapter(),
    // DevTools (only in development)
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
```

**Adding New Providers**:
1. Import the provider function (e.g., `provideSomeService`)
2. Add to `providers` array in `app.config.ts`
3. No need to modify NgModule - standalone approach

### Properties Module

The properties feature demonstrates the full architecture pattern:

1. **Store** (`store/`): Complete NgRx implementation with:
   - **Atomic Batch Operations**: Single-request create/update with attributes
     - `createPropertyWithAttributes`: POST to `/api/properties/with-attributes`
     - `updatePropertyWithAttributes`: PUT to `/api/properties/{id}/with-attributes`
   - Property listing with pagination and filtering
   - Property sharing data management
   - Granular loading states (loading, creating, updating, deleting, loadingSharing)

2. **Services**:
   - `PropertyService`: API communication with batch endpoints
     - `createPropertyWithAttributes()`: Atomic create with property data + attributes
     - `updatePropertyWithAttributes()`: Atomic update with property data + attributes
     - Normalizes attribute values before sending to backend
   - `AttributeService`: Attribute catalog and property values APIs
   - `ChangeTrackingService`: Tracks unsaved changes to prevent data loss

3. **Components**:
   - `PropertyListComponent`: Paginated property listing
   - `PropertyDetailComponent`: View property details
   - `PropertyFormComponent`: Create/edit properties with stepper navigation
     - Dispatches NgRx actions for batch create/update operations
     - Uses `ChangeTrackingService` to track dirty attributes
     - Only sends changed attributes on update (optimized)
   - `PropertyValuesDisplayComponent`: Display property attributes
   - `AttributeFormFieldComponent`: Dynamic form field based on attribute type
   - `AttributeDisplayComponent`: Display attribute values
   - `AddressAutocompleteComponent`: Google Maps address autocomplete with dropdown

**Important**: Always use batch operations (`createPropertyWithAttributes`, `updatePropertyWithAttributes`) for property CRUD. This reduces HTTP requests by 75-85% compared to individual operations.

### Environment Configuration

The application uses a multi-tier environment configuration system:

- **Base Configuration**: `src/environments/environment.ts`
  - Contains default values and placeholders
  - **NEVER commit real API keys here** - use placeholders only
  - API URL: `http://localhost:8080`
  - DevTools enabled

- **Local Development**: `src/environments/environment.local.ts` (GITIGNORED)
  - Override file for local development secrets
  - Contains real API keys for development
  - Copy from `environment.local.ts.example` and add your keys
  - **This file is excluded from version control**

- **Production**: `src/environments/environment.prod.ts`
  - Production configuration
  - Use environment variables or CI/CD secrets for sensitive values

**Security Best Practices**:
1. Never commit API keys or secrets to version control
2. Use `environment.local.ts` for local development keys (gitignored)
3. Use `environment.local.ts.example` as a template for team members
4. Configure API key restrictions in cloud consoles (domain/IP restrictions)
5. Rotate keys immediately if exposed in git history

**Importing environment config**:
```typescript
// Use relative path from your file location
import { environment } from '../../../../environments/environment';
// The number of '../' depends on your file's depth in the directory structure
```

### Google Maps Integration

The application uses Google Maps **Places API (New)** for address autocomplete functionality:

**Configuration** (`src/environments/environment.ts`):
```typescript
googleMaps: {
  apiKey: 'YOUR_API_KEY',
  defaultZoom: 15,
  defaultCenter: { lat: 40.7128, lng: -74.0060 }
}
```

**API Setup**:
- Loaded in `src/index.html` using dynamic library loading (`loading=async`)
- No `&libraries=places` parameter needed - uses `google.maps.importLibrary('places')`
- Requires **Places API (New)** enabled in Google Cloud Console
- Uses new `AutocompleteSuggestion.fetchAutocompleteSuggestions()` (not deprecated `AutocompleteService`)
- Uses new `Place` class with `fetchFields()` method (not deprecated `PlacesService`)

**AddressAutocompleteComponent** (`src/app/features/properties/components/address-autocomplete/`):
- Standalone Material autocomplete with dropdown predictions
- Session token management for billing optimization
- 300ms debounce to reduce API calls
- Displays structured addresses (main text + secondary text)
- Emits `{lat, lng, address, addressComponents}` on selection with parsed street, city, state, postal code, country
- Usage: `<app-address-autocomplete [initialValue]="address" (addressSelected)="onAddressSelect($event)">`

**Important**: Always use the new Places API methods (`AutocompleteSuggestion`, `Place.fetchFields()`), not the deprecated `google.maps.places.Autocomplete` widget or legacy services.

### Shared Components, Services & Utilities

**Shared Components** (`src/app/shared/components/`):
- `LoadingComponent`: Loading spinner for async operations
- `Navbar`: Main navigation bar with user menu
- `StatCard`: Dashboard statistics display card
- `Unauthorized`: 403 error page (shown when user lacks permissions)
- `NotFound`: 404 error page (shown for invalid routes)
- `UnsavedChangesDialog`: Dialog to warn users about unsaved form changes

**Core Services** (`src/app/core/services/`):
- `ErrorLoggingService`: Centralized error logging (replaces console.error in production)
  - Use `errorLog.error(message, error, context)` instead of `console.error`
  - Integration point for external error tracking (Sentry, Rollbar)

**Shared Services** (`src/app/shared/services/`):
- `FormAutoSaveService`: Auto-saves form drafts to localStorage
  - 30-second auto-save interval
  - 24-hour draft expiry
  - Use for all complex forms to prevent data loss

**Shared Utilities** (`src/app/shared/utils/`):
- `AttributeValueNormalizer`: Handles attribute value normalization across all data types
  - Use `normalize()`, `isValueEmpty()`, `areValuesEqual()` for consistent value handling
  - Prevents duplicate normalization logic

### Backend API & Routing Conventions

#### API Response Formats

**Standard API Response**:
```typescript
interface ApiResponse<T = any> {
  message: string;
  data?: T;
}
```

**Paginated Response** (for list endpoints):
```typescript
interface PropertyPageResponse {
  content: Property[];        // Array of items
  pageable: {
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
```

**Common Enums**:
```typescript
// Property Status
enum PropertyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SOLD = 'SOLD',
  INACTIVE = 'INACTIVE'
}

// Property Attribute Data Types
enum PropertyAttributeDataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_SELECT = 'MULTI_SELECT'
}
```

#### Routing Conventions

**Route File Pattern**:
- File naming: `<feature>.routes.ts`
- Export constant: `export const featureRoutes: Routes`
- Example: `properties.routes.ts` exports `propertyRoutes`

**Lazy Loading Pattern**:
```typescript
// In app.routes.ts
{
  path: 'properties',
  canActivate: [authGuard, agentGuard],
  loadChildren: () =>
    import('./features/properties/properties.routes')
      .then(m => m.propertyRoutes)
}

// In feature routes file
{
  path: 'list',
  loadComponent: () =>
    import('./components/property-list/property-list')
      .then(m => m.PropertyListComponent)
}
```

**Route Parameters**:
- List view: `path: 'list'`
- Detail view: `path: ':id'`
- Edit view: `path: ':id/edit'`
- Add view: `path: 'add'`

## Testing

- **Framework**: Jasmine + Karma
- **Test files**: `*.spec.ts` alongside source files
- **Run single test**: Use Karma's filter functionality or `fdescribe`/`fit` in test files

## Key Patterns to Follow

1. **Feature State**: Each feature with complex state should have a `store/` directory with actions, effects, reducer, and selectors (see NgRx Store Structure Pattern)
2. **Facade Services**: Create facade services to abstract NgRx complexity from components
3. **Standalone Components**: All new components must be standalone (no NgModules)
4. **File Naming**: Use `component-name.ts` format, not `.component.ts` suffix
5. **Signals over Observables**: Prefer signals in components; use observables in services/guards
6. **Change Detection**: Use `OnPush` strategy for better performance
7. **Role Checking**: Always use `UserHelper` or `AuthFacadeService` for role-based logic
8. **API Responses**: Backend returns `ApiResponse<T>` for single items or `PropertyPageResponse` for paginated lists
9. **Route Pattern**: Use `<feature>.routes.ts` files exporting `featureRoutes` constant
10. **Change Tracking**: Use `ChangeTrackingService` pattern for forms with unsaved changes detection
11. **Error Logging**: Use `ErrorLoggingService` instead of `console.error/log/warn` for production code
12. **Form Auto-save**: Use `FormAutoSaveService` for complex forms to prevent data loss
13. **Accessibility**: Add ARIA labels, keyboard shortcuts (Ctrl+S, Esc), and screen reader support to all forms
14. **Batch Operations**: Always use batch API endpoints (e.g., `/with-attributes`) instead of sequential individual requests
15. **API Key Security**: Never commit API keys - use `environment.local.ts` (gitignored) for local development

## Common Workflows

### Adding a New Feature Module

1. Create feature directory under `src/app/features/`
2. Create routing file (`<feature>.routes.ts`)
3. If complex state needed, create `store/` with actions, effects, reducer, selectors
4. Create facade service if using NgRx
5. Add route to `src/app/app.routes.ts` with appropriate guards
6. Update `AppState` in `app.reducer.ts` if adding to global state

### Adding a New Guard

1. Create guard in `src/app/core/auth/guards/`
2. Export from `src/app/core/auth/guards/index.ts`
3. Use in route configuration with `canActivate: [yourGuard]`

### Working with Property Attributes

Property attributes are typed key-value pairs (e.g., "bedrooms": "3", "price": "500000"):
- Attribute definitions come from `AttributeService.getAllAttributes()`
- **Create/Update**: Use batch operations with `PropertyActions.createPropertyWithAttributes()` or `updatePropertyWithAttributes()`
  - These actions accept `PropertyWithAttributes` interface containing both property data and `attributeValues` object
  - Attribute values are automatically normalized before sending to backend
  - Format: `{ attributeId: value }` where `attributeId` is numeric
- Attribute types: TEXT, NUMBER, DATE, BOOLEAN, DROPDOWN, MULTI_SELECT
- Use `AttributeDisplayComponent` for rendering and `AttributeFormFieldComponent` for editing

**Example PropertyWithAttributes**:
```typescript
{
  title: "Modern Apartment",
  description: "Beautiful 2BR apartment",
  price: 500000,
  attributeValues: {
    1: "2",        // bedrooms (attribute ID 1)
    2: "1",        // bathrooms (attribute ID 2)
    3: "850"       // square feet (attribute ID 3)
  }
}
```
