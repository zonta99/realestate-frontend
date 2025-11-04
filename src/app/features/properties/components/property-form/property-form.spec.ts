// src/app/features/properties/components/property-form/property-form.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyFormComponent } from './property-form';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PropertyService } from '../../services/property.service';
import { AttributeService } from '../../../attributes/services/attribute.service';
import { ChangeTrackingService } from '../../services/change-tracking.service';
import { ErrorLoggingService } from '../../../../core/services/error-logging.service';
import { FormAutoSaveService } from '../../../../shared/services/form-auto-save.service';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

describe('PropertyFormComponent', () => {
  let component: PropertyFormComponent;
  let fixture: ComponentFixture<PropertyFormComponent>;
  let mockPropertyService: jasmine.SpyObj<PropertyService>;
  let mockAttributeService: jasmine.SpyObj<AttributeService>;
  let mockChangeTrackingService: jasmine.SpyObj<ChangeTrackingService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockErrorLogger: jasmine.SpyObj<ErrorLoggingService>;
  let mockAutoSaveService: jasmine.SpyObj<FormAutoSaveService>;

  const mockAttributes = [
    {
      id: 1,
      name: 'Bedrooms',
      dataType: 'NUMBER',
      category: 'BASIC',
      required: true
    },
    {
      id: 2,
      name: 'Description',
      dataType: 'TEXT',
      category: 'BASIC',
      required: false
    }
  ];

  const mockPropertyFullData = {
    property: {
      id: 1,
      title: 'Test Property',
      description: 'Test Description',
      price: 100000,
      status: 'ACTIVE'
    },
    attributeValues: [
      { attributeId: 1, value: '3' },
      { attributeId: 2, value: 'Spacious' }
    ]
  };

  beforeEach(async () => {
    // Create spies
    mockPropertyService = jasmine.createSpyObj('PropertyService', [
      'getPropertyFullData',
      'createPropertyWithAttributes',
      'updatePropertyWithAttributes'
    ]);

    mockAttributeService = jasmine.createSpyObj('AttributeService', [
      'getAllAttributes',
      'groupAttributesByCategory'
    ]);

    mockChangeTrackingService = jasmine.createSpyObj('ChangeTrackingService', [
      'setOriginalValues',
      'updateCurrentValue',
      'acceptChanges',
      'resetToOriginal',
      'isAttributeDirty',
      'clear'
    ], {
      hasChanges: signal(false),
      changes: signal([]),
      changedValues: signal({})
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockErrorLogger = jasmine.createSpyObj('ErrorLoggingService', ['error', 'warn', 'info', 'debug']);
    mockAutoSaveService = jasmine.createSpyObj('FormAutoSaveService', [
      'hasDraft',
      'getDraftMetadata',
      'loadDraft',
      'saveDraft',
      'clearDraft'
    ]);

    // Default return values
    mockAttributeService.getAllAttributes.and.returnValue(of(mockAttributes as any));
    mockAttributeService.groupAttributesByCategory.and.returnValue(new Map());
    mockAutoSaveService.hasDraft.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        PropertyFormComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: PropertyService, useValue: mockPropertyService },
        { provide: AttributeService, useValue: mockAttributeService },
        { provide: ChangeTrackingService, useValue: mockChangeTrackingService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ErrorLoggingService, useValue: mockErrorLogger },
        { provide: FormAutoSaveService, useValue: mockAutoSaveService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize in create mode when no id in route', () => {
      fixture.detectChanges();

      expect(component.isEditMode()).toBe(false);
      expect(component.propertyId()).toBeNull();
      expect(component.pageTitle()).toBe('Add New Property');
    });

    it('should initialize in edit mode when id in route', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('123');
      mockPropertyService.getPropertyFullData.and.returnValue(of(mockPropertyFullData as any));

      fixture.detectChanges();

      expect(component.isEditMode()).toBe(true);
      expect(component.propertyId()).toBe(123);
      expect(component.pageTitle()).toBe('Edit Property');
    });

    it('should load attributes on init', () => {
      fixture.detectChanges();

      expect(mockAttributeService.getAllAttributes).toHaveBeenCalled();
      expect(component.attributes().length).toBe(2);
    });

    it('should handle attribute loading error', () => {
      const error = new Error('Failed to load');
      mockAttributeService.getAllAttributes.and.returnValue(throwError(() => error));

      fixture.detectChanges();

      expect(mockErrorLogger.error).toHaveBeenCalledWith(
        'Failed to load attributes',
        error,
        jasmine.objectContaining({ component: 'PropertyFormComponent' })
      );
      expect(component.error()).toBe('Failed to load form data. Please try again.');
    });

    it('should load property data in edit mode', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
      mockPropertyService.getPropertyFullData.and.returnValue(of(mockPropertyFullData as any));

      fixture.detectChanges();

      expect(mockPropertyService.getPropertyFullData).toHaveBeenCalledWith(1);
      expect(component.basicInfoForm.get('title')?.value).toBe('Test Property');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have invalid form when title is empty', () => {
      component.basicInfoForm.patchValue({ title: '' });
      expect(component.basicInfoForm.valid).toBe(false);
    });

    it('should have invalid form when title is too short', () => {
      component.basicInfoForm.patchValue({ title: 'ab' });
      expect(component.basicInfoForm.get('title')?.hasError('minlength')).toBe(true);
    });

    it('should have invalid form when description is empty', () => {
      component.basicInfoForm.patchValue({ description: '' });
      expect(component.basicInfoForm.valid).toBe(false);
    });

    it('should have invalid form when price is missing', () => {
      component.basicInfoForm.patchValue({ price: null });
      expect(component.basicInfoForm.valid).toBe(false);
    });

    it('should have invalid form when price is zero or negative', () => {
      component.basicInfoForm.patchValue({ price: 0 });
      expect(component.basicInfoForm.get('price')?.hasError('min')).toBe(true);

      component.basicInfoForm.patchValue({ price: -100 });
      expect(component.basicInfoForm.get('price')?.hasError('min')).toBe(true);
    });

    it('should have valid form with all required fields', () => {
      component.basicInfoForm.patchValue({
        title: 'Valid Title',
        description: 'Valid description with enough characters',
        price: 100000
      });

      expect(component.basicInfoForm.valid).toBe(true);
    });
  });

  describe('Submit Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.basicInfoForm.patchValue({
        title: 'Test Property',
        description: 'Test Description',
        price: 100000
      });
    });

    it('should create property in create mode', () => {
      const createdProperty = { ...mockPropertyFullData.property, id: 1 };
      mockPropertyService.createPropertyWithAttributes.and.returnValue(of(createdProperty as any));

      component.onSubmit();

      expect(mockPropertyService.createPropertyWithAttributes).toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        jasmine.stringContaining('created successfully'),
        'Close',
        jasmine.any(Object)
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/properties', 1]);
    });

    it('should update property in edit mode', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
      mockPropertyService.getPropertyFullData.and.returnValue(of(mockPropertyFullData as any));
      mockPropertyService.updatePropertyWithAttributes.and.returnValue(of(mockPropertyFullData.property as any));

      fixture = TestBed.createComponent(PropertyFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.basicInfoForm.patchValue({
        title: 'Updated Title',
        description: 'Updated Description',
        price: 150000
      });

      component.onSubmit();

      expect(mockPropertyService.updatePropertyWithAttributes).toHaveBeenCalledWith(
        1,
        jasmine.objectContaining({ title: 'Updated Title' })
      );
    });

    it('should handle submit error', () => {
      const error = new Error('Submit failed');
      mockPropertyService.createPropertyWithAttributes.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(mockErrorLogger.error).toHaveBeenCalledWith(
        'Failed to create property',
        error,
        jasmine.any(Object)
      );
      expect(component.error()).toBe('Failed to create property. Please try again.');
    });

    it('should clear draft after successful submit', () => {
      mockPropertyService.createPropertyWithAttributes.and.returnValue(of({ id: 1 } as any));

      component.onSubmit();

      expect(mockAutoSaveService.clearDraft).toHaveBeenCalled();
    });

    it('should not submit if form is invalid', () => {
      component.basicInfoForm.patchValue({ title: '' });
      component.onSubmit();

      expect(mockPropertyService.createPropertyWithAttributes).not.toHaveBeenCalled();
    });
  });

  describe('Auto-save Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should check for draft on initialization', () => {
      expect(mockAutoSaveService.hasDraft).toHaveBeenCalled();
    });

    it('should restore draft when requested', () => {
      const draftData = {
        formData: {
          title: 'Draft Title',
          description: 'Draft Description',
          price: 50000
        },
        attributeValues: { '1': '2' }
      };

      mockAutoSaveService.loadDraft.and.returnValue(draftData);

      component.restoreDraft();

      expect(component.basicInfoForm.get('title')?.value).toBe('Draft Title');
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Draft restored successfully',
        'Close',
        jasmine.any(Object)
      );
    });

    it('should discard draft when requested', () => {
      component.discardDraft();

      expect(mockAutoSaveService.clearDraft).toHaveBeenCalled();
      expect(component.hasDraft()).toBe(false);
    });

    it('should handle draft restore error gracefully', () => {
      mockAutoSaveService.loadDraft.and.returnValue(null);

      component.restoreDraft();

      expect(mockErrorLogger.warn).toHaveBeenCalled();
    });
  });

  describe('Change Tracking Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update change tracking on attribute value change', () => {
      const event = { attributeId: 1, value: '4' };

      component.onAttributeValueChange(event);

      expect(mockChangeTrackingService.updateCurrentValue).toHaveBeenCalledWith(
        1,
        '4',
        'NUMBER'
      );
    });

    it('should use AttributeValueNormalizer for value normalization', () => {
      const event = { attributeId: 1, value: '' };

      component.onAttributeValueChange(event);

      const currentValues = component.attributeValues();
      expect(currentValues.get(1)).toBeNull(); // Empty string normalized to null
    });
  });

  describe('Keyboard Shortcuts', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.basicInfoForm.patchValue({
        title: 'Test',
        description: 'Test description',
        price: 100000
      });
    });

    it('should save on Ctrl+S', () => {
      mockPropertyService.createPropertyWithAttributes.and.returnValue(of({ id: 1 } as any));

      const event = new Event('keydown');
      spyOn(event, 'preventDefault');

      component.handleSaveShortcut(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockPropertyService.createPropertyWithAttributes).toHaveBeenCalled();
    });

    it('should not save on Ctrl+S if form is invalid', () => {
      component.basicInfoForm.patchValue({ title: '' });

      const event = new Event('keydown');
      component.handleSaveShortcut(event);

      expect(mockPropertyService.createPropertyWithAttributes).not.toHaveBeenCalled();
    });

    it('should go back on Escape', () => {
      const event = new Event('keydown');
      spyOn(event, 'preventDefault');

      component.handleCancelShortcut(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Error Logging', () => {
    it('should log errors instead of console.error', () => {
      const error = new Error('Test error');
      mockAttributeService.getAllAttributes.and.returnValue(throwError(() => error));

      fixture.detectChanges();

      expect(mockErrorLogger.error).toHaveBeenCalled();
    });

    it('should log info on successful property creation', () => {
      mockPropertyService.createPropertyWithAttributes.and.returnValue(
        of({ id: 1, title: 'Test' } as any)
      );

      component.basicInfoForm.patchValue({
        title: 'Test',
        description: 'Test description',
        price: 100000
      });

      component.onSubmit();

      expect(mockErrorLogger.info).toHaveBeenCalledWith(
        'Property created',
        jasmine.objectContaining({ propertyId: 1 })
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on form', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      const form = compiled.querySelector('form');
      expect(form?.getAttribute('aria-label')).toBe('Property form');
    });

    it('should announce loading state to screen readers', () => {
      component.loading.set(true);
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      const loadingCard = compiled.querySelector('.loading-card');
      expect(loadingCard?.getAttribute('role')).toBe('status');
      expect(loadingCard?.getAttribute('aria-live')).toBe('polite');
    });

    it('should announce errors to screen readers', () => {
      component.error.set('Test error');
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      const errorCard = compiled.querySelector('.error-card');
      expect(errorCard?.getAttribute('role')).toBe('alert');
      expect(errorCard?.getAttribute('aria-live')).toBe('assertive');
    });
  });

  describe('resetForm', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reset form to initial state', () => {
      component.basicInfoForm.patchValue({
        title: 'Test',
        description: 'Test',
        price: 100000
      });

      component.resetForm();

      expect(component.basicInfoForm.get('title')?.value).toBeNull();
      expect(component.basicInfoForm.get('description')?.value).toBeNull();
    });

    it('should clear attribute values', () => {
      component.attributeValues.set(new Map([[1, 'test']]));

      component.resetForm();

      expect(component.attributeValues().size).toBe(0);
    });

    it('should clear error', () => {
      component.error.set('Test error');

      component.resetForm();

      expect(component.error()).toBeNull();
    });
  });
});
