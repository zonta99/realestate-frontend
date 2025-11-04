// src/app/shared/services/form-auto-save.service.ts
import { Injectable } from '@angular/core';

export interface DraftMetadata {
  formId: string;
  savedAt: Date;
  expiresAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FormAutoSaveService {
  private readonly STORAGE_PREFIX = 'form_draft_';
  private readonly METADATA_KEY = 'form_draft_metadata';
  private readonly DEFAULT_EXPIRY_HOURS = 24; // Drafts expire after 24 hours

  /**
   * Save form data as a draft
   * @param formId Unique identifier for the form
   * @param data The form data to save
   * @param expiryHours Optional custom expiry time in hours (default: 24)
   */
  saveDraft(formId: string, data: any, expiryHours: number = this.DEFAULT_EXPIRY_HOURS): void {
    if (!formId) {
      console.warn('FormAutoSaveService: Cannot save draft without formId');
      return;
    }

    try {
      const key = this.getStorageKey(formId);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);

      // Save draft data
      localStorage.setItem(key, JSON.stringify(data));

      // Update metadata
      this.updateMetadata(formId, now, expiresAt);
    } catch (error) {
      console.error('FormAutoSaveService: Failed to save draft', error);
    }
  }

  /**
   * Load a draft if it exists and hasn't expired
   * @param formId Unique identifier for the form
   * @returns The draft data or null if no valid draft exists
   */
  loadDraft(formId: string): any | null {
    if (!formId) {
      return null;
    }

    try {
      const key = this.getStorageKey(formId);
      const draftJson = localStorage.getItem(key);

      if (!draftJson) {
        return null;
      }

      // Check if draft has expired
      if (this.isDraftExpired(formId)) {
        this.clearDraft(formId);
        return null;
      }

      return JSON.parse(draftJson);
    } catch (error) {
      console.error('FormAutoSaveService: Failed to load draft', error);
      return null;
    }
  }

  /**
   * Clear a draft from storage
   * @param formId Unique identifier for the form
   */
  clearDraft(formId: string): void {
    if (!formId) {
      return;
    }

    try {
      const key = this.getStorageKey(formId);
      localStorage.removeItem(key);
      this.removeMetadata(formId);
    } catch (error) {
      console.error('FormAutoSaveService: Failed to clear draft', error);
    }
  }

  /**
   * Check if a draft exists for the given form
   * @param formId Unique identifier for the form
   * @returns True if a valid draft exists
   */
  hasDraft(formId: string): boolean {
    if (!formId) {
      return false;
    }

    try {
      const key = this.getStorageKey(formId);
      const exists = localStorage.getItem(key) !== null;

      if (!exists) {
        return false;
      }

      // Check if expired
      if (this.isDraftExpired(formId)) {
        this.clearDraft(formId);
        return false;
      }

      return true;
    } catch (error) {
      console.error('FormAutoSaveService: Failed to check draft existence', error);
      return false;
    }
  }

  /**
   * Get metadata about a draft
   * @param formId Unique identifier for the form
   * @returns Draft metadata or null if not found
   */
  getDraftMetadata(formId: string): DraftMetadata | null {
    try {
      const metadata = this.loadAllMetadata();
      const meta = metadata[formId];

      if (!meta) {
        return null;
      }

      return {
        formId,
        savedAt: new Date(meta.savedAt),
        expiresAt: new Date(meta.expiresAt)
      };
    } catch (error) {
      console.error('FormAutoSaveService: Failed to get draft metadata', error);
      return null;
    }
  }

  /**
   * Get all draft metadata
   * @returns Map of formId to metadata
   */
  getAllDrafts(): Map<string, DraftMetadata> {
    const drafts = new Map<string, DraftMetadata>();

    try {
      const metadata = this.loadAllMetadata();

      Object.keys(metadata).forEach(formId => {
        const meta = metadata[formId];
        drafts.set(formId, {
          formId,
          savedAt: new Date(meta.savedAt),
          expiresAt: new Date(meta.expiresAt)
        });
      });
    } catch (error) {
      console.error('FormAutoSaveService: Failed to get all drafts', error);
    }

    return drafts;
  }

  /**
   * Clean up expired drafts
   * This should be called periodically (e.g., on app startup)
   */
  cleanupExpiredDrafts(): void {
    try {
      const metadata = this.loadAllMetadata();
      const now = new Date();

      Object.keys(metadata).forEach(formId => {
        const expiresAt = new Date(metadata[formId].expiresAt);
        if (expiresAt < now) {
          this.clearDraft(formId);
        }
      });
    } catch (error) {
      console.error('FormAutoSaveService: Failed to cleanup expired drafts', error);
    }
  }

  /**
   * Get the storage key for a form
   */
  private getStorageKey(formId: string): string {
    return `${this.STORAGE_PREFIX}${formId}`;
  }

  /**
   * Check if a draft has expired
   */
  private isDraftExpired(formId: string): boolean {
    try {
      const metadata = this.loadAllMetadata();
      const meta = metadata[formId];

      if (!meta) {
        return true;
      }

      const expiresAt = new Date(meta.expiresAt);
      return expiresAt < new Date();
    } catch (error) {
      return true;
    }
  }

  /**
   * Load all metadata from storage
   */
  private loadAllMetadata(): any {
    try {
      const metadataJson = localStorage.getItem(this.METADATA_KEY);
      return metadataJson ? JSON.parse(metadataJson) : {};
    } catch (error) {
      return {};
    }
  }

  /**
   * Update metadata for a form
   */
  private updateMetadata(formId: string, savedAt: Date, expiresAt: Date): void {
    const metadata = this.loadAllMetadata();

    metadata[formId] = {
      savedAt: savedAt.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
  }

  /**
   * Remove metadata for a form
   */
  private removeMetadata(formId: string): void {
    const metadata = this.loadAllMetadata();
    delete metadata[formId];
    localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
  }
}
