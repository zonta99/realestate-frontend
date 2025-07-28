// src/app/features/properties/components/property-detail/property-detail.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-property-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Property Details</h1>
        <div class="header-actions">
          <button mat-button>
            <mat-icon>edit</mat-icon>
            Edit
          </button>
          <button mat-button>
            <mat-icon>share</mat-icon>
            Share
          </button>
        </div>
      </div>

      <mat-card>
        <mat-card-content>
          <p>Property detail view will be implemented here...</p>
          <p>This will show all property attributes and customer matches.</p>
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
    .header-actions { display: flex; gap: 8px; }
    button { display: flex; align-items: center; gap: 8px; }
  `]
})
export class PropertyDetail {}
export { PropertyDetail as PropertyDetailComponent };
