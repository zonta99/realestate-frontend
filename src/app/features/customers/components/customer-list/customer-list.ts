// src/app/features/customers/components/customer-list/customer-list.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Customers</h1>
        <button mat-raised-button color="primary">
          <mat-icon>person_add</mat-icon>
          Add Customer
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <p>Customer list will be implemented here...</p>
          <p>This component will show:</p>
          <ul>
            <li>List of customers with status</li>
            <li>Customer search criteria</li>
            <li>Property matching results</li>
            <li>Lead management workflow</li>
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
export class CustomerList {}
