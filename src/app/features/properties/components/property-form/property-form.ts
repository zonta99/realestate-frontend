// src/app/features/properties/components/property-form/property-form.ts
import { Component, ChangeDetectionStrategy, inject, OnInit, OnDestroy, signal, computed, HostListener, ViewChild } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { Subject, takeUntil } from 'rxjs';
import type { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PropertyService, PropertyWithAttributes, PropertyFullData } from '../../services/property.service';
import { AttributeService } from '../../../attributes/services/attribute.service';
import { ChangeTrackingService } from '../../services/change-tracking.service';
import { AttributeFormFieldComponent } from '../../../attributes/components/attribute-form-field/attribute-form-field';
import { PropertyAttribute, PropertyCategory, PropertyStatus } from '../../models/property.interface';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedChangesDialogComponent, UnsavedChangesDialogResult } from '../../../../shared/components/unsaved-changes-dialog/unsaved-changes-dialog';
import { ErrorLoggingService } from '../../../../core/services/error-logging.service';
import { AttributeValueNormalizer } from '../../../../shared/utils/attribute-value-normalizer';
import { AddressAutocompleteComponent } from '../address-autocomplete/address-autocomplete.component';

@Component({
  selector: 'app-property-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './property-form.html',
  styleUrl: './property-form.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDividerModule,
    MatExpansionModule,
    MatStepperModule,
    AttributeFormFieldComponent,
    AddressAutocompleteComponent
  ]
})
export class PropertyFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);
  private attributeService = inject(AttributeService);
  changeTrackingService = inject(ChangeTrackingService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private errorLogger = inject(ErrorLoggingService);
  private destroy$ = new Subject<void>();

  // Signals for reactive state
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);

  // Mode detection
  isEditMode = signal(false);
  propertyId = signal<number | null>(null);

  // Data signals
  attributes = signal<PropertyAttribute[]>([]);
  attributeValues = signal<Map<number, any>>(new Map());
  propertyData = signal<PropertyFullData | null>(null);

  // Computed categorized attributes for template
  categorizedAttributes = computed(() => {
    const attrs = this.attributes();
    if (!attrs.length) return new Map();
    return this.attributeService.groupAttributesByCategory(attrs);
  });

  // Computed property for change tracking
  hasUnsavedChanges = computed(() => this.changeTrackingService.hasChanges());

  // Page title
  pageTitle = computed(() => this.isEditMode() ? 'Edit Property' : 'Add New Property');

  // Stepper state
  currentStep = signal(0);
  totalSteps = 7;

  @ViewChild('stepper', { static: false }) stepper?: any;

  // Step 1: Basic Information
  basicInfoForm = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200)
    ]],
    description: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(1000)
    ]],
    price: [null as number | null, [
      Validators.required,
      Validators.min(1),
      Validators.max(50000000)
    ]]
  });

  // Step 2: Property Details (status + BASIC attributes)
  propertyDetailsForm = this.fb.group({
    status: [PropertyStatus.ACTIVE, [Validators.required]]
  });

  // Location signals
  selectedAddress = signal<string>('');
  selectedLat = signal<number | null>(null);
  selectedLng = signal<number | null>(null);

  ngOnInit(): void {
    this.detectMode();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle stepper step change
   */
  onStepChange(event: StepperSelectionEvent): void {
    this.currentStep.set(event.selectedIndex);
  }

  /**
   * Get attributes by category
   */
  getAttributesByCategory(category: PropertyCategory): PropertyAttribute[] {
    return this.attributes().filter(attr => attr.category === category);
  }

  /**
   * Keyboard shortcut: Ctrl+S to save
   */
  @HostListener('window:keydown.control.s', ['$event'])
  @HostListener('window:keydown.meta.s', ['$event'])
  handleSaveShortcut(event: Event): void {
    event.preventDefault();
    const allFormsValid = this.basicInfoForm.valid && this.propertyDetailsForm.valid;
    if (allFormsValid && !this.saving()) {
      this.onSubmit();
    } else if (!allFormsValid) {
      // Show validation error
      this.snackBar.open('Please complete all required fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  /**
   * Keyboard shortcut: Esc to cancel
   */
  @HostListener('window:keydown.escape', ['$event'])
  handleCancelShortcut(event: Event): void {
    event.preventDefault();
    this.goBack();
  }

  private detectMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.propertyId.set(parseInt(id, 10));
    }
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    // Load attributes first
    this.attributeService.getAllAttributes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attributes) => {
          this.attributes.set(attributes);

          // If edit mode, load property data
          if (this.isEditMode() && this.propertyId()) {
            this.loadPropertyData(this.propertyId()!);
          } else {
            this.loading.set(false);
          }
        },
        error: (error) => {
          this.errorLogger.error('Failed to load attributes', error, {
            component: 'PropertyFormComponent',
            method: 'loadData'
          });
          this.error.set('Failed to load form data. Please try again.');
          this.loading.set(false);
        }
      });
  }

  private loadPropertyData(propertyId: number): void {
    this.propertyService.getPropertyFullData(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (propertyData: PropertyFullData) => {
          this.propertyData.set(propertyData);
          this.populateForm(propertyData);
          this.loading.set(false);
        },
        error: (error) => {
          this.errorLogger.error('Failed to load property data', error, {
            component: 'PropertyFormComponent',
            method: 'loadPropertyData',
            propertyId
          });
          this.error.set('Failed to load property data. Please try again.');
          this.loading.set(false);
        }
      });
  }

  private populateForm(data: PropertyFullData): void {
    // Set basic info form values
    this.basicInfoForm.patchValue({
      title: data.property.title,
      description: data.property.description,
      price: data.property.price
    });

    // Set property details form values
    this.propertyDetailsForm.patchValue({
      status: data.property.status
    });

    // Set attribute values
    const valueMap = new Map<number, any>();
    data.attributeValues.forEach(value => {
      const attr = this.attributes().find(a => a.id === value.attributeId);
      if (attr) {
        let parsedValue

        // Parse value based on attribute type
        switch (attr.dataType) {
          case 'BOOLEAN':
            parsedValue = value.value === 'true';
            break;
          case 'NUMBER':
            parsedValue = parseFloat(value.value);
            break;
          case 'MULTI_SELECT':
            try {
              parsedValue = JSON.parse(value.value);
            } catch {
              parsedValue = [];
            }
            break;
          default:
            parsedValue = value.value;
        }

        valueMap.set(value.attributeId, parsedValue);
      }
    });

    // Initialize change tracking with original values
    this.changeTrackingService.setOriginalValues(valueMap);
    this.attributeValues.set(valueMap);
  }

  onAttributeValueChange(event: { attributeId: number; value: any }): void {
    // Find the attribute to get its data type
    const attribute = this.attributes().find(attr => attr.id === event.attributeId);
    const dataType = attribute?.dataType;

    // Use AttributeValueNormalizer utility for consistent normalization
    const normalizedValue = AttributeValueNormalizer.normalize(event.value, dataType);

    // Update change tracking service with data type information
    this.changeTrackingService.updateCurrentValue(event.attributeId, event.value, dataType);

    // Update current values for display
    const currentValues = new Map(this.attributeValues());
    currentValues.set(event.attributeId, normalizedValue);
    this.attributeValues.set(currentValues);
  }

  onSubmit(): void {
    // Validate all forms before submission
    const allFormsValid = this.basicInfoForm.valid && this.propertyDetailsForm.valid;

    if (allFormsValid && !this.saving()) {
      this.saving.set(true);
      this.error.set(null);

      // Disable all form controls during save
      this.basicInfoForm.disable();
      this.propertyDetailsForm.disable();

      // Combine form values
      const basicInfoValue = this.basicInfoForm.getRawValue();
      const propertyDetailsValue = this.propertyDetailsForm.getRawValue();

      const formValue = { ...basicInfoValue, ...propertyDetailsValue };

      // Use only changed attribute values for update
      const attributeValuesObj = this.isEditMode()
        ? this.changeTrackingService.changedValues()
        : Object.fromEntries(this.attributeValues());

      const propertyData: PropertyWithAttributes = {
        title: formValue.title!,
        description: formValue.description!,
        price: formValue.price!,
        ...(this.isEditMode() && { status: formValue.status! }),
        attributeValues: attributeValuesObj
      };

      const operation = this.isEditMode()
        ? this.propertyService.updatePropertyWithAttributes(this.propertyId()!, propertyData)
        : this.propertyService.createPropertyWithAttributes(propertyData);

      operation.pipe(takeUntil(this.destroy$)).subscribe({
        next: (property) => {
          // Accept changes after a successful save
          this.changeTrackingService.acceptChanges();

          const action = this.isEditMode() ? 'updated' : 'created';
          this.snackBar.open(`Property "${property.title}" ${action} successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          this.errorLogger.info(`Property ${action}`, {
            propertyId: property.id,
            title: property.title
          });

          // Navigate to property details or list
          if (this.isEditMode()) {
            this.router.navigate(['/properties', this.propertyId()]);
          } else {
            // Check if property.id exists before navigation
            if (property.id) {
              this.router.navigate(['/properties', property.id]);
            } else {
              // Fallback to list if id is undefined
              this.router.navigate(['/properties']);
            }
          }
        },
        error: (error) => {
          const action = this.isEditMode() ? 'update' : 'create';
          this.errorLogger.error(`Failed to ${action} property`, error, {
            component: 'PropertyFormComponent',
            method: 'onSubmit',
            formData: formValue
          });

          this.error.set(`Failed to ${action} property. Please try again.`);
          this.saving.set(false);

          // Re-enable form controls after error
          this.basicInfoForm.enable();
          this.propertyDetailsForm.enable();

          this.snackBar.open(`Error: Failed to ${action} property`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  resetForm(): void {
    this.basicInfoForm.reset();
    this.propertyDetailsForm.reset({ status: PropertyStatus.ACTIVE });
    this.attributeValues.set(new Map());
    this.error.set(null);
    if (this.stepper) {
      this.stepper.reset();
      this.currentStep.set(0);
    }
  }

  /**
   * Handle address selection from autocomplete
   */
  onAddressSelected(event: {lat: number; lng: number; address: string}): void {
    this.selectedAddress.set(event.address);
    this.selectedLat.set(event.lat);
    this.selectedLng.set(event.lng);
  }

  goBack(): void {
    // Check for unsaved changes before navigation
    if (this.hasUnsavedChanges()) {
      const dialogRef = this.dialog.open(UnsavedChangesDialogComponent);

      dialogRef.afterClosed().subscribe((result: UnsavedChangesDialogResult | undefined) => {
        if (result?.action === 'save') {
          // Save changes first, then navigate
          this.onSubmit();
        } else if (result?.action === 'discard') {
          // Discard changes and navigate
          this.changeTrackingService.resetToOriginal();
          this.navigateBack();
        }
        // If cancel or no result, do nothing (stay on form)
      });
    } else {
      // No changes, navigate directly
      this.navigateBack();
    }
  }

  private navigateBack(): void {
    if (this.isEditMode() && this.propertyId()) {
      this.router.navigate(['/properties', this.propertyId()]);
    } else {
      this.router.navigate(['/properties']);
    }
  }

  // Utility methods for template
  getCategoryIcon(category: PropertyCategory): string {
    const iconMap: { [key in PropertyCategory]: string } = {
      [PropertyCategory.BASIC]: 'info',
      [PropertyCategory.FEATURES]: 'star',
      [PropertyCategory.FINANCIAL]: 'attach_money',
      [PropertyCategory.LOCATION]: 'location_on',
      [PropertyCategory.STRUCTURE]: 'architecture'
    };
    return iconMap[category] || 'info';
  }

  getCategoryDisplayName(category: PropertyCategory): string {
    const nameMap: { [key in PropertyCategory]: string } = {
      [PropertyCategory.BASIC]: 'Basic Information',
      [PropertyCategory.FEATURES]: 'Features',
      [PropertyCategory.FINANCIAL]: 'Financial Information',
      [PropertyCategory.LOCATION]: 'Location',
      [PropertyCategory.STRUCTURE]: 'Structure'
    };
    return nameMap[category] || 'Basic Information';
  }

  getAttributeValue(attributeId: number): any {
    return this.attributeValues().get(attributeId);
  }

  trackByCategory(index: number, entry: KeyValue<any, any>): PropertyCategory {
    return entry.key;
  }

  trackByAttribute(index: number, attribute: PropertyAttribute): number {
    return attribute.id;
  }
}
