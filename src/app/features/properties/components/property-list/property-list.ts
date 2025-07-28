// src/app/features/properties/components/property-list/property-list.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-property-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Properties</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Add Property
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <p>Property list will be implemented here...</p>
          <p>This component will show:</p>
          <ul>
            <li>List of properties with filtering</li>
            <li>Search by dynamic attributes</li>
            <li>Property sharing functionality</li>
            <li>Pagination and sorting</li>
          </ul>
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
export class PropertyList {}
export { PropertyList as PropertyListComponent };
