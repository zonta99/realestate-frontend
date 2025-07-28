// src/app/features/properties/components/property-form/property-form.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-property-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Property Form</h1>
        <button mat-button>
          <mat-icon>arrow_back</mat-icon>
          Back to List
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <p>Property form will be implemented here...</p>
          <p>This will include dynamic attribute form builder.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .page-header h1 { margin: 0; }
    button { display: flex; align-items: center; gap: 8px; }
  `]
})
export class PropertyForm {}
export { PropertyForm as PropertyFormComponent };
