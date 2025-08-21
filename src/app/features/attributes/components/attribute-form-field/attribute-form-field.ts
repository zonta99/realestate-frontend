// src/app/features/attributes/components/attribute-form-field/attribute-form-field.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import {
  PropertyAttribute,
  PropertyAttributeDataType
} from '../../../properties/models/property.interface';

@Component({
  selector: 'app-attribute-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './attribute-form-field.html',
  styleUrls: ['./attribute-form-field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeFormFieldComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  @Input({ required: true }) attribute!: PropertyAttribute;
  @Input() value: any = null;
  @Input() disabled = false;
  @Input() isDirty: boolean = false;
  @Output() valueChange = new EventEmitter<{ attributeId: number; value: any }>();

  // Expose enum for template
  readonly PropertyAttributeDataType = PropertyAttributeDataType;

  // Form control for the field
  formControl = new FormControl();

  // Multi-select values handling
  multiSelectValues = signal<string[]>([]);
  availableOptions = computed(() => this.attribute?.options || []);

  ngOnInit() {
    this.initializeFormControl();
    this.setupValueChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && !changes['value'].firstChange) {
      this.setFormValue(this.value);
    }

    if (changes['disabled']) {
      if (this.disabled) {
        this.formControl.disable();
      } else {
        this.formControl.enable();
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeFormControl() {
    // Set validators based on attribute requirements
    const validators = [];
    if (this.attribute.isRequired) {
      validators.push(Validators.required);
    }

    // Add type-specific validators
    if (this.attribute.dataType === PropertyAttributeDataType.NUMBER) {
      validators.push(Validators.pattern(/^-?(\d+\.?\d*|\.\d+)$/));
    }

    this.formControl.setValidators(validators);

    // Set initial value if provided
    if (this.value !== null && this.value !== undefined) {
      this.setFormValue(this.value);
    }

    // Set disabled state
    if (this.disabled) {
      this.formControl.disable();
    }
  }

  private setFormValue(value: any) {
    if (value === null || value === undefined) {
      this.formControl.setValue(null);
      if (this.attribute.dataType === PropertyAttributeDataType.MULTI_SELECT) {
        this.multiSelectValues.set([]);
      }
      return;
    }

    switch (this.attribute.dataType) {
      case PropertyAttributeDataType.MULTI_SELECT:
        let multiValues: string[] = [];
        if (Array.isArray(value)) {
          multiValues = value;
        } else if (typeof value === 'string') {
          try {
            multiValues = JSON.parse(value);
          } catch {
            multiValues = value ? [value] : [];
          }
        }
        this.multiSelectValues.set(multiValues);
        this.formControl.setValue(multiValues);
        break;

      case PropertyAttributeDataType.BOOLEAN:
        let boolValue: boolean | null;
        if (value === '') {
          boolValue = null;
        } else if (value === true || value === 'true') {
          boolValue = true;
        } else if (value === false || value === 'false') {
          boolValue = false;
        } else {
          boolValue = null; // Default for unexpected values
        }
        this.formControl.setValue(boolValue);
        break;

      case PropertyAttributeDataType.NUMBER:
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        this.formControl.setValue(isNaN(numValue) ? null : numValue);
        break;

      case PropertyAttributeDataType.DATE:
        if (value instanceof Date) {
          this.formControl.setValue(value);
        } else if (typeof value === 'string') {
          this.formControl.setValue(new Date(value));
        }
        break;

      default:
        this.formControl.setValue(value);
        break;
    }
  }

  private setupValueChanges() {
    this.formControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        // Always emit the value change, even if invalid, so parent can track state
        let processedValue = value;

        // Special handling for multi-select
        if (this.attribute.dataType === PropertyAttributeDataType.MULTI_SELECT) {
          processedValue = this.multiSelectValues();
        }

        this.valueChange.emit({
          attributeId: this.attribute.id,
          value: processedValue
        });
      });
  }

  // Multi-select chip handling
  toggleChip(option: string) {
    const currentValues = this.multiSelectValues();
    let newValues: string[];

    if (currentValues.includes(option)) {
      newValues = currentValues.filter(v => v !== option);
    } else {
      newValues = [...currentValues, option];
    }

    this.multiSelectValues.set(newValues);
    this.formControl.setValue(newValues);
  }

  removeChip(option: string) {
    const currentValues = this.multiSelectValues();
    const newValues = currentValues.filter(v => v !== option);
    this.multiSelectValues.set(newValues);
    this.formControl.setValue(newValues);
  }

  // Utility methods for template
  getErrorMessage(): string {
    if (this.formControl.hasError('required')) {
      return `${this.attribute.name} is required`;
    }
    if (this.formControl.hasError('pattern')) {
      return `${this.attribute.name} must be a valid number`;
    }
    return '';
  }

  isChipSelected(option: string): boolean {
    return this.multiSelectValues().includes(option);
  }

  // Boolean value handling - cycle through states
  cycleBooleanValue() {
    const currentValue = this.formControl.value;
    let nextValue: boolean | null;

    if (currentValue === null || currentValue === undefined) {
      nextValue = true;
    } else if (currentValue === true) {
      nextValue = false;
    } else {
      nextValue = null;
    }

    this.formControl.setValue(nextValue);
  }

  getBooleanIcon(): string {
    const value = this.formControl.value;
    if (value === true) return 'check_circle';
    if (value === false) return 'cancel';
    return 'help_outline';
  }

  getBooleanLabel(): string {
    const value = this.formControl.value;
    if (value === true) return 'True';
    if (value === false) return 'False';
    return 'Undefined';
  }

  // TrackBy functions for better performance
  trackByOptionId(index: number, option: any): number {
    return option.id;
  }

  trackByValue(index: number, value: string): string {
    return value;
  }
}
