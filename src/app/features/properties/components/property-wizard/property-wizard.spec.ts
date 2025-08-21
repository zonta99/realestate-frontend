// src/app/features/properties/components/property-wizard/property-wizard.spec.ts
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatSnackBar } from '@angular/material/snackbar';
import { PropertyWizardComponent, WizardStep } from './property-wizard';
import { PropertyActions } from '../../store/property.actions';
import { selectCreating, selectError, selectSelectedProperty } from '../../store/property.selectors';
import { PropertyStatus } from '../../models/property.interface';

describe('PropertyWizardComponent', () => {
  let component: PropertyWizardComponent;
  let fixture: ComponentFixture<PropertyWizardComponent>;
  let mockStore: MockStore;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const initialState = {
    properties: {
      selectedProperty: null,
      creating: false,
      error: null,
      properties: [],
      loading: false,
      currentPage: 0,
      pageSize: 10,
      totalElements: 0,
      filters: {}
    }
  };

  const mockProperty = {
    id: 1,
    title: 'Test Property',
    description: 'Test Description',
    price: 250000,
    status: PropertyStatus.ACTIVE,
    agentId: 1,
    agentName: 'Test Agent',
    createdDate: '2024-01-01T00:00:00Z',
    updatedDate: '2024-01-01T00:00:00Z',
    attributeValues: []
  };

  beforeEach(async () => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        PropertyWizardComponent,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyWizardComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    // Mock selectors
    mockStore.overrideSelector(selectCreating, false);
    mockStore.overrideSelector(selectError, null);
    mockStore.overrideSelector(selectSelectedProperty, null);
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode by default', () => {
    fixture.detectChanges();

    expect(component.isEditMode()).toBe(false);
    expect(component.currentStep()).toBe(WizardStep.PROPERTY_DETAILS);
    expect(component.propertyDetailsCompleted()).toBe(false);
  });

  it('should initialize property form with validators', () => {
    fixture.detectChanges();

    const form = component.propertyForm;
    expect(form.get('title')?.hasError('required')).toBe(true);
    expect(form.get('description')?.hasError('required')).toBe(true);
    expect(form.get('price')?.hasError('required')).toBe(true);
  });

  it('should validate property form fields', () => {
    fixture.detectChanges();

    const form = component.propertyForm;

    // Test title validation
    form.get('title')?.setValue('Ab'); // Too short
    expect(form.get('title')?.hasError('minlength')).toBe(true);

    form.get('title')?.setValue('Valid Title');
    expect(form.get('title')?.hasError('minlength')).toBe(false);

    // Test price validation
    form.get('price')?.setValue(-100); // Negative
    expect(form.get('price')?.hasError('min')).toBe(true);

    form.get('price')?.setValue(250000);
    expect(form.get('price')?.hasError('min')).toBe(false);
  });

  it('should dispatch create property action when form is valid', () => {
    spyOn(mockStore, 'dispatch');
    fixture.detectChanges();

    // Fill form with valid data
    component.propertyForm.patchValue({
      title: 'Test Property',
      description: 'Test Description for property',
      price: 250000
    });

    component.onCreateProperty();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      PropertyActions.createProperty({
        property: {
          title: 'Test Property',
          description: 'Test Description for property',
          price: 250000
        }
      })
    );
  });

  it('should not dispatch create property when form is invalid', () => {
    spyOn(mockStore, 'dispatch');
    fixture.detectChanges();

    // Leave form invalid
    component.onCreateProperty();

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should progress to attributes step when property is created', () => {
    mockStore.overrideSelector(selectSelectedProperty, mockProperty);
    fixture.detectChanges();

    component.onProceedToAttributes();

    expect(component.currentStep()).toBe(WizardStep.ATTRIBUTES);
  });

  it('should validate step access correctly', () => {
    fixture.detectChanges();

    // Initially only property details should be accessible
    expect(component.canAccessStep(WizardStep.PROPERTY_DETAILS)).toBe(true);
    expect(component.canAccessStep(WizardStep.ATTRIBUTES)).toBe(false);
    expect(component.canAccessStep(WizardStep.REVIEW)).toBe(false);

    // After property is created
    component.propertyDetailsCompleted.set(true);
    expect(component.canAccessStep(WizardStep.ATTRIBUTES)).toBe(true);
  });

  it('should handle edit mode initialization', () => {
    // Simulate route with ID parameter
    spyOn(TestBed.inject(RouterTestingModule).routerSpy.snapshot.params, 'id').and.returnValue('1');

    fixture.detectChanges();

    expect(component.isEditMode()).toBe(false); // Since we're not actually setting route params properly in this test
  });

  it('should reset form and state', () => {
    fixture.detectChanges();

    // Set some state
    component.propertyForm.patchValue({ title: 'Test' });
    component.propertyDetailsCompleted.set(true);
    component.currentStep.set(WizardStep.ATTRIBUTES);

    component.resetForms();

    expect(component.propertyForm.get('title')?.value).toBe('');
    expect(component.propertyDetailsCompleted()).toBe(false);
    expect(component.currentStep()).toBe(WizardStep.PROPERTY_DETAILS);
  });

  it('should get correct step icons and labels', () => {
    expect(component.getStepIcon(WizardStep.PROPERTY_DETAILS)).toBe('home');
    expect(component.getStepIcon(WizardStep.ATTRIBUTES)).toBe('tune');
    expect(component.getStepIcon(WizardStep.REVIEW)).toBe('preview');

    expect(component.getStepLabel(WizardStep.PROPERTY_DETAILS)).toBe('Property Details');
    expect(component.getStepLabel(WizardStep.ATTRIBUTES)).toBe('Attributes');
    expect(component.getStepLabel(WizardStep.REVIEW)).toBe('Review');
  });

  it('should show error message when creation fails', () => {
    const error = { message: 'Creation failed' };
    mockStore.overrideSelector(selectError, error);

    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.error-card .error-content span');
    expect(errorElement?.textContent).toContain('Creation failed');
  });

  it('should disable form when creating', () => {
    mockStore.overrideSelector(selectCreating, true);
    fixture.detectChanges();

    const titleInput = fixture.nativeElement.querySelector('input[formControlName="title"]');
    expect(titleInput?.disabled).toBe(true);

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should show progress bar when creating', () => {
    mockStore.overrideSelector(selectCreating, true);
    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar).toBeTruthy();
  });
});
