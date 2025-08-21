// src/app/features/attributes/components/attribute-manager/attribute-manager.ts
import { Component, ChangeDetectionStrategy, inject, OnInit, OnDestroy, signal, computed, input, output } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
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
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil, finalize } from 'rxjs';
import { PropertyActions } from '../../../properties/store/property.actions';
import { AttributeService } from '../../services/attribute.service';
import { AttributeFormFieldComponent } from '../attribute-form-field/attribute-form-field';
import { PropertyAttribute, PropertyCategory, PropertyValue, CreatePropertyValueRequest } from '../../../properties/models/property.interface';

@Component({
  selector: 'app-attribute-manager',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './attribute-manager.html',
  styleUrl: './attribute-manager.scss',
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
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    AttributeFormFieldComponent
  ]
})
export class AttributeManagerComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private attributeService = inject(AttributeService);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  // Input signals
  propertyId = input.required<number>();
  readonly = input<boolean>(false);
  showTitle = input<boolean>(true);
  existingValues = input<PropertyValue[]>([]);

  // Output events
  attributeValueChanged = output<{ attributeId: number; value: any; isValid: boolean }>();
  attributeValueSaved = output<{ attributeId: number; value: any }>();
  attributeValueDeleted = output<{ attributeId: number }>();

  // Component state signals
  attributes = signal<PropertyAttribute[]>([]);
  attributesLoading = signal(true);
  attributeValues = signal<Map<number, any>>(new Map());
  savingValues = signal<Set<number>>(new Set());
  deletingValues = signal<Set<number>>(new Set());

  // Computed categorized attributes for template
  categorizedAttributes = computed(() => {
    const attrs = this.attributes();
    if (!attrs.length) return new Map();

    return this.attributeService.groupAttributesByCategory(attrs);
  });

  // Computed attribute values with existing data
  mergedAttributeValues = computed(() => {
    const values = new Map(this.attributeValues());
    const existing = this.existingValues();

    // Merge existing values
    existing.forEach(value => {
      if (!values.has(value.attributeId)) {
        values.set(value.attributeId, value.value);
      }
    });

    return values;
  });

  ngOnInit(): void {
    this.loadAttributes();
    this.initializeExistingValues();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAttributes(): void {
    this.attributesLoading.set(true);
    this.attributeService.getAllAttributes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attributes) => {
          this.attributes.set(attributes);
          this.attributesLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load attributes:', error);
          this.attributesLoading.set(false);
          this.snackBar.open('Failed to load attributes', 'Close', { duration: 5000 });
        }
      });
  }

  private initializeExistingValues(): void {
    const existing = this.existingValues();
    if (existing.length > 0) {
      const valueMap = new Map();
      existing.forEach(value => {
        valueMap.set(value.attributeId, value.value);
      });
      this.attributeValues.set(valueMap);
    }
  }

  onAttributeValueChange(event: { attributeId: number; value: any; isValid: boolean }): void {
    const currentValues = this.attributeValues();
    currentValues.set(event.attributeId, event.value);
    this.attributeValues.set(new Map(currentValues));

    this.attributeValueChanged.emit(event);
  }

  saveAttributeValue(attributeId: number): void {
    if (this.readonly()) return;

    const value = this.mergedAttributeValues().get(attributeId);
    if (value === undefined || value === null || value === '') return;

    const saving = this.savingValues();
    saving.add(attributeId);
    this.savingValues.set(new Set(saving));

    const request: CreatePropertyValueRequest = {
      attributeId,
      value
    };

    this.store.dispatch(PropertyActions.setPropertyValue({
      propertyId: this.propertyId(),
      valueRequest: request
    }));

    // Note: In a real implementation, you would listen to the success/failure actions
    // For now, we'll simulate the completion
    setTimeout(() => {
      const savingSet = this.savingValues();
      savingSet.delete(attributeId);
      this.savingValues.set(new Set(savingSet));

      this.attributeValueSaved.emit({ attributeId, value });
      this.snackBar.open('Attribute value saved successfully', 'Close', { duration: 3000 });
    }, 1000);
  }

  deleteAttributeValue(attributeId: number): void {
    if (this.readonly()) return;

    const deleting = this.deletingValues();
    deleting.add(attributeId);
    this.deletingValues.set(new Set(deleting));

    this.store.dispatch(PropertyActions.deletePropertyValue({
      propertyId: this.propertyId(),
      attributeId
    }));

    // Note: In a real implementation, you would listen to the success/failure actions
    setTimeout(() => {
      const deletingSet = this.deletingValues();
      deletingSet.delete(attributeId);
      this.deletingValues.set(new Set(deletingSet));

      // Remove from local state
      const currentValues = this.attributeValues();
      currentValues.delete(attributeId);
      this.attributeValues.set(new Map(currentValues));

      this.attributeValueDeleted.emit({ attributeId });
      this.snackBar.open('Attribute value deleted successfully', 'Close', { duration: 3000 });
    }, 1000);
  }

  saveAllAttributes(): void {
    if (this.readonly()) return;

    const values = this.mergedAttributeValues();
    const attributesToSave = Array.from(values.entries())
      .filter(([_, value]) => value !== undefined && value !== null && value !== '');

    if (attributesToSave.length === 0) {
      this.snackBar.open('No attributes to save', 'Close', { duration: 3000 });
      return;
    }

    attributesToSave.forEach(([attributeId, _]) => {
      this.saveAttributeValue(attributeId);
    });
  }

  hasUnsavedChanges(): boolean {
    const localValues = this.attributeValues();
    const existingValues = this.existingValues();

    // Check if there are any local changes not reflected in existing values
    for (const [attributeId, value] of localValues.entries()) {
      const existingValue = existingValues.find(v => v.attributeId === attributeId);
      if (!existingValue || existingValue.value !== value) {
        return true;
      }
    }

    return false;
  }

  getAttributeValue(attributeId: number): any {
    return this.mergedAttributeValues().get(attributeId);
  }

  isAttributeSaving(attributeId: number): boolean {
    return this.savingValues().has(attributeId);
  }

  isAttributeDeleting(attributeId: number): boolean {
    return this.deletingValues().has(attributeId);
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

  trackByCategory(index: number, entry: KeyValue<any, any>): PropertyCategory {
    return entry.key;
  }

  trackByAttribute(index: number, attribute: PropertyAttribute): number {
    return attribute.id;
  }

  hasValueToSave(attributeId: number): boolean {
    const value = this.mergedAttributeValues().get(attributeId);
    return value !== undefined && value !== null && value !== '';
  }

  hasExistingValue(attributeId: number): boolean {
    const existing = this.existingValues();
    return existing.some(v => v.attributeId === attributeId);
  }

  hasUnsavedChangesInCategory(category: PropertyCategory): boolean {
    const categoryAttributes = this.categorizedAttributes().get(category) || [];
    const localValues = this.attributeValues();
    const existingValues = this.existingValues();

    return categoryAttributes.some((attr: { id: number; }) => {
      const localValue = localValues.get(attr.id);
      const existingValue = existingValues.find(v => v.attributeId === attr.id);

      if (localValue !== undefined && localValue !== null && localValue !== '') {
        return !existingValue || existingValue.value !== localValue;
      }
      return false;
    });
  }

  refreshAttributes(): void {
    this.loadAttributes();
  }
}

// Export alias for consistency
export { AttributeManagerComponent as AttributeManager };
