// src/app/features/properties/components/property-form/property-form.ts
import { Component, ChangeDetectionStrategy, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { PropertyService, PropertyWithAttributes, PropertyFullData } from '../../services/property.service';
import { AttributeService } from '../../../attributes/services/attribute.service';
import { ChangeTrackingService } from '../../services/change-tracking.service';
import { AttributeFormFieldComponent } from '../../../attributes/components/attribute-form-field/attribute-form-field';
import { PropertyAttribute, PropertyCategory, PropertyStatus } from '../../models/property.interface';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedChangesDialogComponent, UnsavedChangesDialogResult } from '../../../../shared/components/unsaved-changes-dialog/unsaved-changes-dialog';

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
    AttributeFormFieldComponent
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

  // Reactive form
  propertyForm = this.fb.group({
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
    ]],
    status: [PropertyStatus.ACTIVE, [Validators.required]]
  });

  ngOnInit(): void {
    this.detectMode();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
          console.error('Failed to load attributes:', error);
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
          console.error('Failed to load property data:', error);
          this.error.set('Failed to load property data. Please try again.');
          this.loading.set(false);
        }
      });
  }

  private populateForm(data: PropertyFullData): void {
    // Set basic property form values
    this.propertyForm.patchValue({
      title: data.property.title,
      description: data.property.description,
      price: data.property.price,
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
    // Update change tracking service
    this.changeTrackingService.updateCurrentValue(event.attributeId, event.value);

    // Update current values for display
    const currentValues = new Map(this.attributeValues());

    if (event.value === null || event.value === undefined || event.value === '') {
      currentValues.delete(event.attributeId);
    } else {
      currentValues.set(event.attributeId, event.value);
    }

    this.attributeValues.set(currentValues);
  }

  onSubmit(): void {
    if (this.propertyForm.valid && !this.saving()) {
      this.saving.set(true);
      this.error.set(null);

      const formValue = this.propertyForm.getRawValue();

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

          // Navigate to property details or list
          if (this.isEditMode()) {
            this.router.navigate(['/properties', this.propertyId()]);
          } else {
            this.router.navigate(['/properties', property.id]);
          }
        },
        error: (error) => {
          console.error('Failed to save property:', error);
          const action = this.isEditMode() ? 'update' : 'create';
          this.error.set(`Failed to ${action} property. Please try again.`);
          this.saving.set(false);

          this.snackBar.open(`Error: Failed to ${action} property`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  resetForm(): void {
    this.propertyForm.reset();
    this.attributeValues.set(new Map());
    this.error.set(null);
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
      [PropertyCategory.BASICS]: 'info',
      [PropertyCategory.INTERIOR]: 'home',
      [PropertyCategory.EXTERIOR]: 'landscape',
      [PropertyCategory.NEIGHBORHOOD]: 'location_city',
      [PropertyCategory.AMENITIES]: 'pool',
      [PropertyCategory.OTHER]: 'more_horiz'
    };
    return iconMap[category] || 'info';
  }

  getCategoryDisplayName(category: PropertyCategory): string {
    const nameMap: { [key in PropertyCategory]: string } = {
      [PropertyCategory.BASICS]: 'Basic Information',
      [PropertyCategory.INTERIOR]: 'Interior Features',
      [PropertyCategory.EXTERIOR]: 'Exterior Features',
      [PropertyCategory.NEIGHBORHOOD]: 'Neighborhood',
      [PropertyCategory.AMENITIES]: 'Amenities',
      [PropertyCategory.OTHER]: 'Other'
    };
    return nameMap[category] || 'Other';
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
