// src/app/shared/utils/attribute-value-normalizer.ts

/**
 * Utility class for normalizing attribute values based on their data type.
 * Extracted from ChangeTrackingService to eliminate duplicate logic.
 */
export class AttributeValueNormalizer {
  /**
   * Normalize a value based on its data type
   * @param value The value to normalize
   * @param dataType The attribute data type
   * @returns The normalized value
   */
  static normalize(value: any, dataType?: string): any {
    if (!dataType) {
      // Fallback to original logic when no data type provided
      return (value === null || value === undefined || value === '') ? null : value;
    }

    switch (dataType) {
      case 'TEXT':
      case 'SINGLE_SELECT':
        // Only normalize to null if empty string
        return (value === '') ? null : value;

      case 'BOOLEAN':
        // Only normalize to null if undefined
        return (value === undefined) ? null : value;

      case 'NUMBER':
        // Only normalize to null if empty string, keep 0 as valid
        return (value === '' || (typeof value === 'string' && value.trim() === '')) ? null : value;

      case 'MULTI_SELECT':
        // Only normalize to null if undefined
        return (value === undefined) ? null : value;

      case 'DATE':
        // Keep existing logic for dates
        return (value === null || value === undefined || value === '') ? null : value;

      default:
        // Keep existing logic for unknown types
        return (value === null || value === undefined || value === '') ? null : value;
    }
  }

  /**
   * Check if a value is considered empty based on its data type
   * @param value The value to check
   * @param dataType The attribute data type
   * @returns True if the value is considered empty
   */
  static isValueEmpty(value: any, dataType?: string): boolean {
    const normalized = this.normalize(value, dataType);

    if (normalized === null || normalized === undefined) {
      return true;
    }

    // Special handling for arrays (MULTI_SELECT)
    if (Array.isArray(normalized)) {
      return normalized.length === 0;
    }

    // Special handling for strings
    if (typeof normalized === 'string') {
      return normalized.trim() === '';
    }

    return false;
  }

  /**
   * Compare two values for equality based on their data type
   * @param value1 First value
   * @param value2 Second value
   * @param dataType The attribute data type (optional, for special handling)
   * @returns True if values are equal
   */
  static areValuesEqual(value1: any, value2: any, dataType?: string): boolean {
    // Exact match
    if (value1 === value2) return true;

    // Handle null/undefined cases - both null/undefined are considered equal
    if ((value1 == null && value2 == null)) return true;
    if (value1 == null || value2 == null) return false;

    // Handle arrays (for multi-select)
    if (Array.isArray(value1) && Array.isArray(value2)) {
      if (value1.length !== value2.length) return false;

      // Sort arrays before comparison to handle order differences
      const sorted1 = [...value1].sort();
      const sorted2 = [...value2].sort();

      return sorted1.every((item, index) => item === sorted2[index]);
    }

    // Handle objects
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      const keys1 = Object.keys(value1);
      const keys2 = Object.keys(value2);

      if (keys1.length !== keys2.length) return false;

      return keys1.every(key => this.areValuesEqual(value1[key], value2[key]));
    }

    // Handle primitive values (boolean, string, number)
    // Convert to string for comparison to handle type coercion
    return String(value1) === String(value2);
  }

  /**
   * Parse a value from string representation based on data type
   * Useful for deserializing values from API or storage
   * @param value The string value to parse
   * @param dataType The attribute data type
   * @returns The parsed value
   */
  static parseValue(value: string, dataType: string): any {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    switch (dataType) {
      case 'BOOLEAN':
        return value === 'true';

      case 'NUMBER':
        const num = parseFloat(value);
        return isNaN(num) ? null : num;

      case 'MULTI_SELECT':
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }

      case 'DATE':
        // Return as-is, let the component handle date parsing
        return value;

      case 'TEXT':
      case 'SINGLE_SELECT':
      default:
        return value;
    }
  }

  /**
   * Serialize a value to string representation for API or storage
   * @param value The value to serialize
   * @param dataType The attribute data type
   * @returns The serialized string value
   */
  static serializeValue(value: any, dataType: string): string | null {
    const normalized = this.normalize(value, dataType);

    if (normalized === null || normalized === undefined) {
      return null;
    }

    switch (dataType) {
      case 'BOOLEAN':
        return String(normalized);

      case 'NUMBER':
        return String(normalized);

      case 'MULTI_SELECT':
        return JSON.stringify(normalized);

      case 'DATE':
      case 'TEXT':
      case 'SINGLE_SELECT':
      default:
        return String(normalized);
    }
  }
}
