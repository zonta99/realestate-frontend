// src/app/shared/components/unsaved-changes-dialog/unsaved-changes-dialog.ts
import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface UnsavedChangesDialogData {
  title?: string;
  message?: string;
}

export interface UnsavedChangesDialogResult {
  action: 'save' | 'discard' | 'cancel';
}

@Component({
  selector: 'app-unsaved-changes-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div mat-dialog-title>
      <mat-icon color="warn">warning</mat-icon>
      <span>{{ title }}</span>
    </div>

    <div mat-dialog-content>
      <p>{{ message }}</p>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        Cancel
      </button>
      <button mat-button color="warn" (click)="onDiscard()">
        Discard Changes
      </button>
      <button mat-raised-button color="primary" (click)="onSave()">
        Save Changes
      </button>
    </div>
  `,
  styles: [`
    [mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    [mat-dialog-content] {
      min-width: 300px;
      margin-bottom: 16px;
    }

    [mat-dialog-actions] {
      gap: 8px;
    }
  `]
})
export class UnsavedChangesDialogComponent {
  private dialogRef = inject(MatDialogRef<UnsavedChangesDialogComponent>);

  title = 'Unsaved Changes';
  message = 'You have unsaved changes that will be lost. What would you like to do?';

  onSave(): void {
    this.dialogRef.close({ action: 'save' } as UnsavedChangesDialogResult);
  }

  onDiscard(): void {
    this.dialogRef.close({ action: 'discard' } as UnsavedChangesDialogResult);
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' } as UnsavedChangesDialogResult);
  }
}
