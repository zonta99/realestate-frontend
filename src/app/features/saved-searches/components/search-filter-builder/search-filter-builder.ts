// src/app/features/saved-searches/components/search-filter-builder/search-filter-builder.ts

import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PropertyAttribute, PropertyAttributeDataType } from '../../../properties/models/property.interface';
import { SearchFilter } from '../../models/saved-search.interface';

@Component({
  selector: 'app-search-filter-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  templateUrl: './search-filter-builder.html',
  styleUrl: './search-filter-builder.css'
})
export class SearchFilterBuilderComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() attributes: PropertyAttribute[] = [];
  @Input() existingFilter?: SearchFilter;
  @Output() filterChange = new EventEmitter<SearchFilter>();
  @Output() remove = new EventEmitter<void>();

  filterForm!: FormGroup;
  selectedAttribute = signal<PropertyAttribute | null>(null);
  DataType = PropertyAttributeDataType;

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      attributeId: [this.existingFilter?.attributeId || null, Validators.required],
      // NUMBER and DATE
      minValue: [this.existingFilter?.minValue || null],
      maxValue: [this.existingFilter?.maxValue || null],
      // SELECT types
      selectedValues: [this.existingFilter?.selectedValues || []],
      // TEXT
      textValue: [this.existingFilter?.textValue || ''],
      // BOOLEAN
      booleanValue: [this.existingFilter?.booleanValue ?? null]
    });

    // If we have an existing filter, set the selected attribute
    if (this.existingFilter) {
      const attr = this.attributes.find(a => a.id === this.existingFilter!.attributeId);
      if (attr) {
        this.selectedAttribute.set(attr);
      }
    }

    // Watch for attribute selection changes
    this.filterForm.get('attributeId')?.valueChanges.subscribe((attributeId) => {
      const attribute = this.attributes.find(a => a.id === attributeId);
      this.selectedAttribute.set(attribute || null);
      this.resetFilterValues();
      this.emitFilterChange();
    });

    // Watch for any form changes
    this.filterForm.valueChanges.subscribe(() => {
      this.emitFilterChange();
    });
  }

  resetFilterValues(): void {
    this.filterForm.patchValue({
      minValue: null,
      maxValue: null,
      selectedValues: [],
      textValue: '',
      booleanValue: null
    }, { emitEvent: false });
  }

  emitFilterChange(): void {
    if (!this.selectedAttribute()) return;

    const formValue = this.filterForm.value;
    const filter: SearchFilter = {
      attributeId: formValue.attributeId,
      attributeName: this.selectedAttribute()!.name,
      dataType: this.selectedAttribute()!.dataType
    };

    // Add relevant fields based on data type
    switch (this.selectedAttribute()!.dataType) {
      case PropertyAttributeDataType.NUMBER:
      case PropertyAttributeDataType.DATE:
        if (formValue.minValue !== null) filter.minValue = formValue.minValue;
        if (formValue.maxValue !== null) filter.maxValue = formValue.maxValue;
        break;
      case PropertyAttributeDataType.SINGLE_SELECT:
      case PropertyAttributeDataType.MULTI_SELECT:
        if (formValue.selectedValues && formValue.selectedValues.length > 0) {
          filter.selectedValues = formValue.selectedValues;
        }
        break;
      case PropertyAttributeDataType.TEXT:
        if (formValue.textValue) filter.textValue = formValue.textValue;
        break;
      case PropertyAttributeDataType.BOOLEAN:
        if (formValue.booleanValue !== null) filter.booleanValue = formValue.booleanValue;
        break;
    }

    this.filterChange.emit(filter);
  }

  onRemove(): void {
    this.remove.emit();
  }

  isValid(): boolean {
    if (!this.selectedAttribute()) return false;

    const formValue = this.filterForm.value;
    const dataType = this.selectedAttribute()!.dataType;

    switch (dataType) {
      case PropertyAttributeDataType.NUMBER:
      case PropertyAttributeDataType.DATE:
        return formValue.minValue !== null || formValue.maxValue !== null;
      case PropertyAttributeDataType.SINGLE_SELECT:
      case PropertyAttributeDataType.MULTI_SELECT:
        return formValue.selectedValues && formValue.selectedValues.length > 0;
      case PropertyAttributeDataType.TEXT:
        return formValue.textValue && formValue.textValue.trim() !== '';
      case PropertyAttributeDataType.BOOLEAN:
        return formValue.booleanValue !== null;
      default:
        return false;
    }
  }

  getAvailableAttributes(): PropertyAttribute[] {
    // Only show searchable attributes
    return this.attributes.filter(attr => attr.isSearchable);
  }

  getAttributeOptions(): string[] {
    const attr = this.selectedAttribute();
    if (!attr || !attr.options) return [];
    return attr.options.map(opt => opt.optionValue);
  }
}
