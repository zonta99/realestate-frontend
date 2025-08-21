// src/app/features/properties/services/change-tracking.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface AttributeChange {
  attributeId: number;
  originalValue: any;
  currentValue: any;
  isDirty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChangeTrackingService {
  private originalValues = signal<Map<number, any>>(new Map());
  private currentValues = signal<Map<number, any>>(new Map());

  // Computed properties
  changes = computed(() => {
    const original = this.originalValues();
    const current = this.currentValues();
    const changes: AttributeChange[] = [];

    // Check all current values for changes
    current.forEach((value, attributeId) => {
      const originalValue = original.get(attributeId);
      const isDirty = !this.areValuesEqual(originalValue, value);

      changes.push({
        attributeId,
        originalValue,
        currentValue: value,
        isDirty
      });
    });

    // Check for deleted values (existed in original but not in current)
    original.forEach((value, attributeId) => {
      if (!current.has(attributeId)) {
        changes.push({
          attributeId,
          originalValue: value,
          currentValue: null,
          isDirty: true
        });
      }
    });

    return changes;
  });

  hasChanges = computed(() => {
    return this.changes().some(change => change.isDirty);
  });

  changedValues = computed(() => {
    return this.changes()
      .filter(change => change.isDirty)
      .reduce((acc, change) => {
        acc[change.attributeId] = change.currentValue;
        return acc;
      }, {} as { [key: number]: any });
  });

  // Initialize with original values
  setOriginalValues(values: Map<number, any>): void {
    this.originalValues.set(new Map(values));
    this.currentValues.set(new Map(values));
  }

  // Update current value for an attribute with optional data type
  updateCurrentValue(attributeId: number, value: any, dataType?: string): void {
    const current = new Map(this.currentValues());

    // Handle empty values based on data type requirements
    let normalizedValue = value;

    if (dataType) {
      switch (dataType) {
        case 'TEXT':
        case 'SINGLE_SELECT':
          // Only normalize to null if empty string
          normalizedValue = (value === '') ? null : value;
          break;
        case 'BOOLEAN':
          // Only normalize to null if undefined
          normalizedValue = (value === undefined) ? null : value;
          break;
        case 'NUMBER':
          // Only normalize to null if empty string, keep 0 as valid
          normalizedValue = (value === '' || (typeof value === 'string' && value.trim() === '')) ? null : value;
          break;
        case 'MULTI_SELECT':
          // Only normalize to null if undefined
          normalizedValue = (value === undefined) ? null : value;
          break;
        case 'DATE':
          // Keep existing logic for dates
          normalizedValue = (value === null || value === undefined || value === '') ? null : value;
          break;
        default:
          // Keep existing logic for unknown types
          normalizedValue = (value === null || value === undefined || value === '') ? null : value;
      }
    } else {
      // Fallback to original logic when no data type provided
      normalizedValue = (value === null || value === undefined || value === '') ? null : value;
    }

    current.set(attributeId, normalizedValue);
    this.currentValues.set(current);
  }

  // Check if a specific attribute is dirty
  isAttributeDirty(attributeId: number): boolean {
    const change = this.changes().find(c => c.attributeId === attributeId);
    return change?.isDirty ?? false;
  }

  // Get the original value for an attribute
  getOriginalValue(attributeId: number): any {
    return this.originalValues().get(attributeId);
  }

  // Get the current value for an attribute
  getCurrentValue(attributeId: number): any {
    return this.currentValues().get(attributeId);
  }

  // Reset to original values
  resetToOriginal(): void {
    this.currentValues.set(new Map(this.originalValues()));
  }

  // Accept current changes as new original values
  acceptChanges(): void {
    this.originalValues.set(new Map(this.currentValues()));
  }

  // Clear all values
  clear(): void {
    this.originalValues.set(new Map());
    this.currentValues.set(new Map());
  }

  private areValuesEqual(value1: any, value2: any): boolean {
    if (value1 === value2) return true;

    // Handle null/undefined cases - both null/undefined are considered equal
    if ((value1 == null && value2 == null)) return true;
    if (value1 == null || value2 == null) return false;

    // Handle arrays (for multi-select)
    if (Array.isArray(value1) && Array.isArray(value2)) {
      if (value1.length !== value2.length) return false;
      return value1.every((item, index) => item === value2[index]);
    }

    // Handle objects
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      const keys1 = Object.keys(value1);
      const keys2 = Object.keys(value2);

      if (keys1.length !== keys2.length) return false;

      return keys1.every(key => this.areValuesEqual(value1[key], value2[key]));
    }

    // Handle primitive values (boolean, string, number)
    return String(value1) === String(value2);
  }
}
