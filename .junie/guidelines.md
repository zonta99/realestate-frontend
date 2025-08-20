# Development Guidelines - Real Estate Frontend

## Build/Configuration Instructions

### Prerequisites
- Node.js with npm
- Angular CLI 20+

### Build Commands
```bash
# Development server (accessible on network)
npm start  # Uses --host 0.0.0.0

# Build for production
npm run build

# Build with file watching for development
npm run watch
```

### Configuration Details
- **Angular Version**: 20.1.2 (latest features including signals, standalone components)
- **Build System**: Uses new `@angular/build:application` builder
- **TypeScript**: Version 5.8.2 with strict mode enabled
- **Bundle Budgets**: 500kB warning, 1MB error for initial bundle
- **Component Style Budget**: 4kB warning, 8kB error per component
- **Theming**: SCSS-based theming with `src/theme.scss` and Material Design 3

### Key Dependencies
- **State Management**: NgRx (store, effects, router-store, devtools)
- **UI Framework**: Angular Material 20.1.2
- **Forms**: Reactive Forms with custom validators
- **HTTP**: Built-in Angular HTTP client with interceptors

## Testing Information

### Testing Framework
- **Test Runner**: Karma with Jasmine
- **Configuration**: Uses `@angular/build:karma` builder (no separate karma.conf.js needed)
- **TypeScript Config**: `tsconfig.spec.json` with Jasmine types

### Running Tests
```bash
# Run all tests
npm test
```

### Writing Tests
The project follows standard Angular testing patterns:

#### Basic Component Test Structure
```typescript
import { TestBed } from '@angular/core/testing';
import { YourComponent } from './your-component';

describe('YourComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourComponent], // For standalone components
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(YourComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
```

#### Testing Patterns Used
- **Standalone Components**: Import components directly in TestBed
- **DOM Testing**: Use `fixture.nativeElement.querySelector()` 
- **Event Testing**: Trigger events with `button?.click()` and call `fixture.detectChanges()`
- **Signal Testing**: Test computed signals and signal updates
- **Service Testing**: Mock services using TestBed dependency injection

### Example Test
See `src/app/example-test.spec.ts` for a comprehensive test example demonstrating:
- Component creation and basic functionality
- DOM element testing
- Event handling and state changes
- Template binding verification

## Additional Development Information

### Project Architecture

#### Directory Structure
```
src/app/
├── core/           # Singleton services, guards, interceptors
│   ├── auth/       # Authentication system
│   ├── navigation/ # Navigation services
│   └── store/      # Global NgRx store
├── features/       # Feature modules (lazy-loaded)
│   ├── dashboard/
│   ├── profile/
│   ├── properties/
│   ├── customers/
│   └── users/
└── shared/         # Reusable components, directives, pipes
    └── components/
```

### Coding Patterns and Conventions

#### Component Structure
- **Standalone Components**: All components use `standalone: true`
- **Signals**: Use Angular signals for reactive state management
- **Dependency Injection**: Use `inject()` function instead of constructor injection
- **Change Detection**: OnPush strategy with signals for optimal performance

#### Example Component Pattern
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, /* Material modules */],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  private service = inject(SomeService);
  
  // Use signals for reactive state
  loading = signal(false);
  data = computed(() => this.service.getData());
  
  // Use reactive forms
  form = this.fb.group({
    field: ['', Validators.required]
  });
}
```

#### State Management
- **NgRx**: Used for global state management
- **Facade Pattern**: Services like `AuthFacadeService` abstract store complexity
- **Effects**: Handle side effects and API calls
- **Selectors**: Use memoized selectors for derived state

#### Form Validation
- **Custom Validators**: Project includes custom validators like `passwordStrengthValidator`
- **Cross-field Validation**: Use `AbstractControlOptions` for form-level validators
- **Error Handling**: Comprehensive error display in templates

#### Authentication System
- **Guards**: `auth-guard`, `no-auth-guard`, `role-guard` for route protection
- **Interceptors**: HTTP interceptor for automatic token attachment
- **Token Storage**: Service for secure token management
- **Role-based Access**: Granular permissions (Admin, Broker, Agent, Assistant)

### Code Style Guidelines

#### TypeScript Configuration
- **Strict Mode**: Enabled with comprehensive strict checks
- **Import Helpers**: Enabled for better bundle size
- **Target**: ES2022 for modern JavaScript features
- **Module**: Preserve for optimal bundling

#### Formatting
- **Prettier**: Configured for HTML templates with Angular parser
- **File Organization**: Group imports (Angular core, Material, local imports)
- **Naming**: Use descriptive names, follow Angular style guide

#### Material Design
- **Theme**: Custom SCSS theme in `src/theme.scss`
- **Components**: Consistent use of Angular Material components
- **Accessibility**: Material components provide built-in accessibility

### Performance Considerations
- **OnPush Change Detection**: Used with signals for optimal performance
- **Lazy Loading**: Feature modules are lazy-loaded
- **Bundle Optimization**: Strict bundle budgets enforced
- **Tree Shaking**: Optimized imports and modern build system

### Development Workflow
1. **Feature Development**: Create features in `src/app/features/`
2. **Component Creation**: Use standalone components with signals
3. **State Management**: Add NgRx actions/reducers for complex state
4. **Testing**: Write unit tests for all components and services
5. **Build Verification**: Check bundle sizes and run tests before deployment

### Common Pitfalls to Avoid
- Don't mix constructor injection with `inject()` function
- Always call `fixture.detectChanges()` after programmatic changes in tests
- Import Material modules individually, not from `@angular/material`
- Use signals instead of traditional property binding for reactive state
- Ensure all forms use reactive form validation patterns established in the project
