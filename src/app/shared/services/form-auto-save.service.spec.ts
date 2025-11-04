// src/app/shared/services/form-auto-save.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { FormAutoSaveService } from './form-auto-save.service';

describe('FormAutoSaveService', () => {
  let service: FormAutoSaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormAutoSaveService);

    // Clear localStorage before each test
    localStorage.clear();

    // Spy on console methods
    spyOn(console, 'warn');
    spyOn(console, 'error');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveDraft()', () => {
    it('should save draft data to localStorage', () => {
      const formId = 'test-form';
      const data = { name: 'Test', value: 42 };

      service.saveDraft(formId, data);

      const key = 'form_draft_test-form';
      const saved = localStorage.getItem(key);
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual(data);
    });

    it('should save metadata with expiry time', () => {
      const formId = 'test-form';
      const data = { test: true };

      service.saveDraft(formId, data);

      const metadata = service.getDraftMetadata(formId);
      expect(metadata).toBeTruthy();
      expect(metadata!.formId).toBe(formId);
      expect(metadata!.savedAt).toBeInstanceOf(Date);
      expect(metadata!.expiresAt).toBeInstanceOf(Date);
      expect(metadata!.expiresAt.getTime()).toBeGreaterThan(metadata!.savedAt.getTime());
    });

    it('should use custom expiry hours', () => {
      const formId = 'test-form';
      const data = { test: true };
      const customHours = 12;

      const beforeSave = new Date();
      service.saveDraft(formId, data, customHours);
      const afterSave = new Date();

      const metadata = service.getDraftMetadata(formId);
      expect(metadata).toBeTruthy();

      const expectedExpiry = new Date(beforeSave.getTime() + customHours * 60 * 60 * 1000);
      const actualExpiry = metadata!.expiresAt;

      // Allow 1 second tolerance
      expect(Math.abs(actualExpiry.getTime() - expectedExpiry.getTime())).toBeLessThan(1000);
    });

    it('should warn when formId is empty', () => {
      service.saveDraft('', { test: true });
      expect(console.warn).toHaveBeenCalled();
    });

    it('should handle complex nested objects', () => {
      const formId = 'complex-form';
      const data = {
        nested: {
          array: [1, 2, 3],
          object: { key: 'value' }
        },
        date: new Date().toISOString()
      };

      service.saveDraft(formId, data);
      const loaded = service.loadDraft(formId);

      expect(loaded).toEqual(data);
    });
  });

  describe('loadDraft()', () => {
    it('should load saved draft', () => {
      const formId = 'test-form';
      const data = { name: 'Test', value: 42 };

      service.saveDraft(formId, data);
      const loaded = service.loadDraft(formId);

      expect(loaded).toEqual(data);
    });

    it('should return null if no draft exists', () => {
      const loaded = service.loadDraft('non-existent-form');
      expect(loaded).toBeNull();
    });

    it('should return null if formId is empty', () => {
      const loaded = service.loadDraft('');
      expect(loaded).toBeNull();
    });

    it('should return null and clear draft if expired', () => {
      const formId = 'expired-form';
      const data = { test: true };

      // Save with 0 hours expiry (immediately expired)
      service.saveDraft(formId, data, -1);

      const loaded = service.loadDraft(formId);
      expect(loaded).toBeNull();
      expect(service.hasDraft(formId)).toBe(false);
    });

    it('should handle corrupted data gracefully', () => {
      const formId = 'corrupted-form';
      localStorage.setItem('form_draft_corrupted-form', 'invalid json{{{');

      const loaded = service.loadDraft(formId);
      expect(loaded).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('clearDraft()', () => {
    it('should remove draft from localStorage', () => {
      const formId = 'test-form';
      const data = { test: true };

      service.saveDraft(formId, data);
      expect(service.hasDraft(formId)).toBe(true);

      service.clearDraft(formId);
      expect(service.hasDraft(formId)).toBe(false);
    });

    it('should remove metadata', () => {
      const formId = 'test-form';
      const data = { test: true };

      service.saveDraft(formId, data);
      expect(service.getDraftMetadata(formId)).toBeTruthy();

      service.clearDraft(formId);
      expect(service.getDraftMetadata(formId)).toBeNull();
    });

    it('should handle clearing non-existent draft', () => {
      expect(() => service.clearDraft('non-existent')).not.toThrow();
    });

    it('should handle empty formId', () => {
      expect(() => service.clearDraft('')).not.toThrow();
    });
  });

  describe('hasDraft()', () => {
    it('should return true when draft exists', () => {
      const formId = 'test-form';
      service.saveDraft(formId, { test: true });

      expect(service.hasDraft(formId)).toBe(true);
    });

    it('should return false when draft does not exist', () => {
      expect(service.hasDraft('non-existent')).toBe(false);
    });

    it('should return false for empty formId', () => {
      expect(service.hasDraft('')).toBe(false);
    });

    it('should return false and clear if draft is expired', () => {
      const formId = 'expired-form';
      service.saveDraft(formId, { test: true }, -1);

      expect(service.hasDraft(formId)).toBe(false);
    });
  });

  describe('getDraftMetadata()', () => {
    it('should return metadata for existing draft', () => {
      const formId = 'test-form';
      service.saveDraft(formId, { test: true });

      const metadata = service.getDraftMetadata(formId);
      expect(metadata).toBeTruthy();
      expect(metadata!.formId).toBe(formId);
      expect(metadata!.savedAt).toBeInstanceOf(Date);
      expect(metadata!.expiresAt).toBeInstanceOf(Date);
    });

    it('should return null for non-existent draft', () => {
      const metadata = service.getDraftMetadata('non-existent');
      expect(metadata).toBeNull();
    });
  });

  describe('getAllDrafts()', () => {
    it('should return empty map when no drafts exist', () => {
      const drafts = service.getAllDrafts();
      expect(drafts.size).toBe(0);
    });

    it('should return all saved drafts', () => {
      service.saveDraft('form1', { test: 1 });
      service.saveDraft('form2', { test: 2 });
      service.saveDraft('form3', { test: 3 });

      const drafts = service.getAllDrafts();
      expect(drafts.size).toBe(3);
      expect(drafts.has('form1')).toBe(true);
      expect(drafts.has('form2')).toBe(true);
      expect(drafts.has('form3')).toBe(true);
    });

    it('should include metadata for each draft', () => {
      service.saveDraft('form1', { test: 1 });

      const drafts = service.getAllDrafts();
      const draft = drafts.get('form1');

      expect(draft).toBeTruthy();
      expect(draft!.formId).toBe('form1');
      expect(draft!.savedAt).toBeInstanceOf(Date);
      expect(draft!.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('cleanupExpiredDrafts()', () => {
    it('should remove expired drafts', () => {
      // Save drafts with different expiry times
      service.saveDraft('expired1', { test: 1 }, -1); // Expired
      service.saveDraft('expired2', { test: 2 }, -1); // Expired
      service.saveDraft('valid', { test: 3 }, 24);    // Valid

      service.cleanupExpiredDrafts();

      expect(service.hasDraft('expired1')).toBe(false);
      expect(service.hasDraft('expired2')).toBe(false);
      expect(service.hasDraft('valid')).toBe(true);
    });

    it('should handle empty storage gracefully', () => {
      expect(() => service.cleanupExpiredDrafts()).not.toThrow();
    });

    it('should handle corrupted metadata gracefully', () => {
      localStorage.setItem('form_draft_metadata', 'invalid json{{{');
      expect(() => service.cleanupExpiredDrafts()).not.toThrow();
    });
  });

  describe('integration scenarios', () => {
    it('should support save-load-clear workflow', () => {
      const formId = 'test-form';
      const data = { name: 'Test', value: 42 };

      // Save
      service.saveDraft(formId, data);
      expect(service.hasDraft(formId)).toBe(true);

      // Load
      const loaded = service.loadDraft(formId);
      expect(loaded).toEqual(data);

      // Clear
      service.clearDraft(formId);
      expect(service.hasDraft(formId)).toBe(false);
      expect(service.loadDraft(formId)).toBeNull();
    });

    it('should overwrite existing draft', () => {
      const formId = 'test-form';
      const data1 = { version: 1 };
      const data2 = { version: 2 };

      service.saveDraft(formId, data1);
      expect(service.loadDraft(formId)).toEqual(data1);

      service.saveDraft(formId, data2);
      expect(service.loadDraft(formId)).toEqual(data2);
    });

    it('should handle multiple forms independently', () => {
      service.saveDraft('form1', { id: 1 });
      service.saveDraft('form2', { id: 2 });
      service.saveDraft('form3', { id: 3 });

      expect(service.loadDraft('form1')).toEqual({ id: 1 });
      expect(service.loadDraft('form2')).toEqual({ id: 2 });
      expect(service.loadDraft('form3')).toEqual({ id: 3 });

      service.clearDraft('form2');

      expect(service.hasDraft('form1')).toBe(true);
      expect(service.hasDraft('form2')).toBe(false);
      expect(service.hasDraft('form3')).toBe(true);
    });
  });
});
