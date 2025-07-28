// src/app/features/customers/components/customer-detail/customer-detail.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Customer Details</h1>
        <div class="header-actions">
          <button mat-button>
            <mat-icon>edit</mat-icon>
            Edit
          </button>
          <button mat-button>
            <mat-icon>home_work</mat-icon>
            Find Matches
          </button>
        </div>
      </div>

      <mat-card>
        <mat-card-content>
          <p>Customer detail view will be implemented here...</p>
          <p>This will show customer info and property matches.</p>
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
export class CustomerDetail {}
export { CustomerDetail as CustomerDetailComponent };
