// src/app/features/attributes/components/attribute-form-field/attribute-form-field.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject
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
import { Subject, takeUntil } from 'rxjs';
import {
  PropertyAttribute,
  PropertyAttributeDataType,
  PropertyValue
} from '../../../properties/models/property.interface';
import { AttributeService } from '../../services/attribute.service';

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
    MatIconModule
  ],
  templateUrl: './attribute-form-field.html',
  styleUrls: ['./attribute-form-field.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeFormFieldComponent implements OnInit, OnDestroy {
  private attributeService = inject(AttributeService);
  private destroy$ = new Subject<void>();

  @Input({ required: true }) attribute!: PropertyAttribute;
  @Input() value?: PropertyValue;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<{ attributeId: number; value: any; isValid: boolean }>();

  // Expose enum for template
  readonly PropertyAttributeDataType = PropertyAttributeDataType;

  // Form control for the field
  formControl = new FormControl();

  // Multi-select chips handling
  multiSelectValues = signal<string[]>([]);
  availableOptions = computed(() => this.attribute?.options || []);

  ngOnInit() {
    this.initializeFormControl();
    this.setupValueChanges();
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

    // Set initial value
    if (this.value) {
      this.setInitialValue();
    }

    // Disable if needed
    if (this.disabled) {
      this.formControl.disable();
    }
  }

  private setInitialValue() {
    if (!this.value) return;

    switch (this.attribute.dataType) {
      case PropertyAttributeDataType.MULTI_SELECT:
        const multiValues = this.attributeService.parseMultiSelectValue(this.value.value);
        this.multiSelectValues.set(multiValues);
        break;
      case PropertyAttributeDataType.BOOLEAN:
        this.formControl.setValue(this.value.value === 'true' || this.value.value);
        break;
      case PropertyAttributeDataType.NUMBER:
        this.formControl.setValue(Number(this.value.value));
        break;
      default:
        this.formControl.setValue(this.value.value);
        break;
    }
  }

  private setupValueChanges() {
    this.formControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        let processedValue = value;

        // Process value based on data type
        if (this.attribute.dataType === PropertyAttributeDataType.MULTI_SELECT) {
          processedValue = this.attributeService.stringifyMultiSelectValue(this.multiSelectValues());
        }

        this.valueChange.emit({
          attributeId: this.attribute.id,
          value: processedValue,
          isValid: this.formControl.valid
        });
      });
  }

  // Multi-select chip handling
  addChip(event: any) {
    if (event.value) {
      const currentValues = this.multiSelectValues();
      if (!currentValues.includes(event.value)) {
        const newValues = [...currentValues, event.value];
        this.multiSelectValues.set(newValues);
        this.emitMultiSelectChange();
      }
      event.chipInput.clear();
    }
  }

  removeChip(option: string) {
    const currentValues = this.multiSelectValues();
    const newValues = currentValues.filter(v => v !== option);
    this.multiSelectValues.set(newValues);
    this.emitMultiSelectChange();
  }

  toggleChip(option: string) {
    const currentValues = this.multiSelectValues();
    let newValues: string[];

    if (currentValues.includes(option)) {
      newValues = currentValues.filter(v => v !== option);
    } else {
      newValues = [...currentValues, option];
    }

    this.multiSelectValues.set(newValues);
    this.emitMultiSelectChange();
  }

  private emitMultiSelectChange() {
    const stringValue = this.attributeService.stringifyMultiSelectValue(this.multiSelectValues());
    this.valueChange.emit({
      attributeId: this.attribute.id,
      value: stringValue,
      isValid: this.formControl.valid
    });
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

  // TrackBy functions for better performance
  trackByOptionId(index: number, option: any): number {
    return option.id;
  }

  trackByValue(index: number, value: string): string {
    return value;
  }
}
