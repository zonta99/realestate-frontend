// src/app/features/properties/components/property-form/property-form.ts
import { Component, ChangeDetectionStrategy, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import {CommonModule, KeyValue} from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
import { Subject, takeUntil } from 'rxjs';
import { PropertyActions } from '../../store/property.actions';
import { selectCreating, selectError } from '../../store/property.selectors';
import { AttributeService } from '../../../attributes/services/attribute.service';
import { AttributeFormFieldComponent } from '../../../attributes/components/attribute-form-field/attribute-form-field';
import { PropertyAttribute, PropertyCategory } from '../../models/property.interface';

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
  private store = inject(Store);
  private router = inject(Router);
  private attributeService = inject(AttributeService);
  private destroy$ = new Subject<void>();

  // Signals for reactive state
  creating = this.store.selectSignal(selectCreating);
  error = this.store.selectSignal(selectError);

  // Attribute-related signals
  attributes = signal<PropertyAttribute[]>([]);
  attributesLoading = signal(true);
  attributeValues = signal<Map<number, any>>(new Map());

  // Computed categorized attributes for template
  categorizedAttributes = computed(() => {
    const attrs = this.attributes();
    if (!attrs.length) return new Map();

    return this.attributeService.groupAttributesByCategory(attrs);
  });

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
    ]]
  });

  ngOnInit(): void {
    this.loadAttributes();
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
        }
      });
  }

  onAttributeValueChange(event: { attributeId: number; value: any }): void {
    const currentValues = this.attributeValues();
    currentValues.set(event.attributeId, event.value);
    this.attributeValues.set(new Map(currentValues));
  }

  onSubmit(): void {
    if (this.propertyForm.valid && !this.creating()) {
      const formValue = this.propertyForm.getRawValue();

      // First create the property
      this.store.dispatch(PropertyActions.createProperty({
        property: {
          title: formValue.title!,
          description: formValue.description!,
          price: formValue.price!
        }
      }));

      // Note: In a real implementation, we would need to wait for property creation
      // success and then set attribute values. This would require updating the
      // property effects and actions to handle attribute values as well.
    }
  }

  resetForm(): void {
    this.propertyForm.reset();
    this.attributeValues.set(new Map());
    this.store.dispatch(PropertyActions.clearError());
  }

  goBack(): void {
    this.router.navigate(['/properties']);
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
}

// Export alias for consistency
export { PropertyFormComponent as PropertyForm };
