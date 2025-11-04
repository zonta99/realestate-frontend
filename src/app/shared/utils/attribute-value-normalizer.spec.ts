// src/app/shared/utils/attribute-value-normalizer.spec.ts
import { AttributeValueNormalizer } from './attribute-value-normalizer';

describe('AttributeValueNormalizer', () => {
  describe('normalize()', () => {
    describe('TEXT type', () => {
      it('should normalize empty string to null', () => {
        expect(AttributeValueNormalizer.normalize('', 'TEXT')).toBeNull();
      });

      it('should preserve non-empty string', () => {
        expect(AttributeValueNormalizer.normalize('test', 'TEXT')).toBe('test');
      });

      it('should preserve whitespace-only strings', () => {
        expect(AttributeValueNormalizer.normalize('  ', 'TEXT')).toBe('  ');
      });

      it('should normalize null to null', () => {
        expect(AttributeValueNormalizer.normalize(null, 'TEXT')).toBeNull();
      });

      it('should normalize undefined to null', () => {
        expect(AttributeValueNormalizer.normalize(undefined, 'TEXT')).toBeNull();
      });
    });

    describe('NUMBER type', () => {
      it('should normalize empty string to null', () => {
        expect(AttributeValueNormalizer.normalize('', 'NUMBER')).toBeNull();
      });

      it('should normalize whitespace string to null', () => {
        expect(AttributeValueNormalizer.normalize('  ', 'NUMBER')).toBeNull();
      });

      it('should preserve zero', () => {
        expect(AttributeValueNormalizer.normalize(0, 'NUMBER')).toBe(0);
      });

      it('should preserve positive numbers', () => {
        expect(AttributeValueNormalizer.normalize(42, 'NUMBER')).toBe(42);
      });

      it('should preserve negative numbers', () => {
        expect(AttributeValueNormalizer.normalize(-10, 'NUMBER')).toBe(-10);
      });

      it('should preserve number strings', () => {
        expect(AttributeValueNormalizer.normalize('123', 'NUMBER')).toBe('123');
      });
    });

    describe('BOOLEAN type', () => {
      it('should normalize undefined to null', () => {
        expect(AttributeValueNormalizer.normalize(undefined, 'BOOLEAN')).toBeNull();
      });

      it('should preserve true', () => {
        expect(AttributeValueNormalizer.normalize(true, 'BOOLEAN')).toBe(true);
      });

      it('should preserve false', () => {
        expect(AttributeValueNormalizer.normalize(false, 'BOOLEAN')).toBe(false);
      });

      it('should preserve null', () => {
        expect(AttributeValueNormalizer.normalize(null, 'BOOLEAN')).toBeNull();
      });
    });

    describe('MULTI_SELECT type', () => {
      it('should normalize undefined to null', () => {
        expect(AttributeValueNormalizer.normalize(undefined, 'MULTI_SELECT')).toBeNull();
      });

      it('should preserve empty array', () => {
        expect(AttributeValueNormalizer.normalize([], 'MULTI_SELECT')).toEqual([]);
      });

      it('should preserve array with values', () => {
        const arr = ['a', 'b', 'c'];
        expect(AttributeValueNormalizer.normalize(arr, 'MULTI_SELECT')).toEqual(arr);
      });

      it('should preserve null', () => {
        expect(AttributeValueNormalizer.normalize(null, 'MULTI_SELECT')).toBeNull();
      });
    });

    describe('DATE type', () => {
      it('should normalize empty string to null', () => {
        expect(AttributeValueNormalizer.normalize('', 'DATE')).toBeNull();
      });

      it('should normalize null to null', () => {
        expect(AttributeValueNormalizer.normalize(null, 'DATE')).toBeNull();
      });

      it('should normalize undefined to null', () => {
        expect(AttributeValueNormalizer.normalize(undefined, 'DATE')).toBeNull();
      });

      it('should preserve date string', () => {
        const date = '2024-01-01';
        expect(AttributeValueNormalizer.normalize(date, 'DATE')).toBe(date);
      });
    });

    describe('no data type provided', () => {
      it('should normalize empty string to null', () => {
        expect(AttributeValueNormalizer.normalize('')).toBeNull();
      });

      it('should normalize null to null', () => {
        expect(AttributeValueNormalizer.normalize(null)).toBeNull();
      });

      it('should normalize undefined to null', () => {
        expect(AttributeValueNormalizer.normalize(undefined)).toBeNull();
      });

      it('should preserve non-empty values', () => {
        expect(AttributeValueNormalizer.normalize('test')).toBe('test');
        expect(AttributeValueNormalizer.normalize(42)).toBe(42);
      });
    });
  });

  describe('isValueEmpty()', () => {
    it('should return true for null', () => {
      expect(AttributeValueNormalizer.isValueEmpty(null, 'TEXT')).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(AttributeValueNormalizer.isValueEmpty(undefined, 'TEXT')).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(AttributeValueNormalizer.isValueEmpty('', 'TEXT')).toBe(true);
    });

    it('should return true for whitespace-only string', () => {
      expect(AttributeValueNormalizer.isValueEmpty('   ', 'TEXT')).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(AttributeValueNormalizer.isValueEmpty([], 'MULTI_SELECT')).toBe(true);
    });

    it('should return false for non-empty string', () => {
      expect(AttributeValueNormalizer.isValueEmpty('test', 'TEXT')).toBe(false);
    });

    it('should return false for zero', () => {
      expect(AttributeValueNormalizer.isValueEmpty(0, 'NUMBER')).toBe(false);
    });

    it('should return false for false boolean', () => {
      expect(AttributeValueNormalizer.isValueEmpty(false, 'BOOLEAN')).toBe(false);
    });

    it('should return false for non-empty array', () => {
      expect(AttributeValueNormalizer.isValueEmpty(['a'], 'MULTI_SELECT')).toBe(false);
    });
  });

  describe('areValuesEqual()', () => {
    it('should return true for identical values', () => {
      expect(AttributeValueNormalizer.areValuesEqual('test', 'test')).toBe(true);
      expect(AttributeValueNormalizer.areValuesEqual(42, 42)).toBe(true);
      expect(AttributeValueNormalizer.areValuesEqual(true, true)).toBe(true);
    });

    it('should return true for both null and undefined', () => {
      expect(AttributeValueNormalizer.areValuesEqual(null, null)).toBe(true);
      expect(AttributeValueNormalizer.areValuesEqual(undefined, undefined)).toBe(true);
      expect(AttributeValueNormalizer.areValuesEqual(null, undefined)).toBe(true);
    });

    it('should return false for null vs non-null', () => {
      expect(AttributeValueNormalizer.areValuesEqual(null, 'test')).toBe(false);
      expect(AttributeValueNormalizer.areValuesEqual('test', null)).toBe(false);
    });

    it('should compare arrays by content', () => {
      expect(AttributeValueNormalizer.areValuesEqual(['a', 'b'], ['a', 'b'])).toBe(true);
      expect(AttributeValueNormalizer.areValuesEqual(['a', 'b'], ['b', 'a'])).toBe(true); // Order doesn't matter
      expect(AttributeValueNormalizer.areValuesEqual(['a', 'b'], ['a', 'c'])).toBe(false);
      expect(AttributeValueNormalizer.areValuesEqual(['a'], ['a', 'b'])).toBe(false);
    });

    it('should compare objects by content', () => {
      expect(AttributeValueNormalizer.areValuesEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(AttributeValueNormalizer.areValuesEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
      expect(AttributeValueNormalizer.areValuesEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(AttributeValueNormalizer.areValuesEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('should compare primitives by string conversion', () => {
      expect(AttributeValueNormalizer.areValuesEqual(42, '42')).toBe(true);
      expect(AttributeValueNormalizer.areValuesEqual(true, 'true')).toBe(true);
      expect(AttributeValueNormalizer.areValuesEqual(false, 'false')).toBe(true);
    });

    it('should return false for different types', () => {
      expect(AttributeValueNormalizer.areValuesEqual([], 'test')).toBe(false);
      expect(AttributeValueNormalizer.areValuesEqual({}, 'test')).toBe(false);
    });
  });

  describe('parseValue()', () => {
    it('should parse BOOLEAN values', () => {
      expect(AttributeValueNormalizer.parseValue('true', 'BOOLEAN')).toBe(true);
      expect(AttributeValueNormalizer.parseValue('false', 'BOOLEAN')).toBe(false);
    });

    it('should parse NUMBER values', () => {
      expect(AttributeValueNormalizer.parseValue('42', 'NUMBER')).toBe(42);
      expect(AttributeValueNormalizer.parseValue('3.14', 'NUMBER')).toBe(3.14);
      expect(AttributeValueNormalizer.parseValue('-10', 'NUMBER')).toBe(-10);
      expect(AttributeValueNormalizer.parseValue('invalid', 'NUMBER')).toBeNull();
    });

    it('should parse MULTI_SELECT values', () => {
      expect(AttributeValueNormalizer.parseValue('["a","b","c"]', 'MULTI_SELECT')).toEqual(['a', 'b', 'c']);
      expect(AttributeValueNormalizer.parseValue('[]', 'MULTI_SELECT')).toEqual([]);
      expect(AttributeValueNormalizer.parseValue('invalid', 'MULTI_SELECT')).toEqual([]);
    });

    it('should parse TEXT values', () => {
      expect(AttributeValueNormalizer.parseValue('test', 'TEXT')).toBe('test');
    });

    it('should parse DATE values', () => {
      expect(AttributeValueNormalizer.parseValue('2024-01-01', 'DATE')).toBe('2024-01-01');
    });

    it('should return null for empty values', () => {
      expect(AttributeValueNormalizer.parseValue('', 'TEXT')).toBeNull();
      expect(AttributeValueNormalizer.parseValue(null as any, 'TEXT')).toBeNull();
      expect(AttributeValueNormalizer.parseValue(undefined as any, 'TEXT')).toBeNull();
    });
  });

  describe('serializeValue()', () => {
    it('should serialize BOOLEAN values', () => {
      expect(AttributeValueNormalizer.serializeValue(true, 'BOOLEAN')).toBe('true');
      expect(AttributeValueNormalizer.serializeValue(false, 'BOOLEAN')).toBe('false');
    });

    it('should serialize NUMBER values', () => {
      expect(AttributeValueNormalizer.serializeValue(42, 'NUMBER')).toBe('42');
      expect(AttributeValueNormalizer.serializeValue(3.14, 'NUMBER')).toBe('3.14');
      expect(AttributeValueNormalizer.serializeValue(0, 'NUMBER')).toBe('0');
    });

    it('should serialize MULTI_SELECT values', () => {
      expect(AttributeValueNormalizer.serializeValue(['a', 'b'], 'MULTI_SELECT')).toBe('["a","b"]');
      expect(AttributeValueNormalizer.serializeValue([], 'MULTI_SELECT')).toBe('[]');
    });

    it('should serialize TEXT values', () => {
      expect(AttributeValueNormalizer.serializeValue('test', 'TEXT')).toBe('test');
    });

    it('should serialize DATE values', () => {
      expect(AttributeValueNormalizer.serializeValue('2024-01-01', 'DATE')).toBe('2024-01-01');
    });

    it('should return null for null/undefined values', () => {
      expect(AttributeValueNormalizer.serializeValue(null, 'TEXT')).toBeNull();
      expect(AttributeValueNormalizer.serializeValue(undefined, 'TEXT')).toBeNull();
      expect(AttributeValueNormalizer.serializeValue('', 'TEXT')).toBeNull();
    });
  });
});
