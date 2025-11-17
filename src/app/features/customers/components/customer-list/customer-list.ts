// src/app/features/customers/components/customer-list/customer-list.ts
import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerFacadeService } from '../../services';
import { CustomerStatus } from '../../models';

@Component({
  selector: 'app-customer-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
templateUrl: './customer-list.html',
styleUrls: ['./customer-list.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Customers</h1>
        <button mat-raised-button color="primary" (click)="addCustomer()">
          <mat-icon>person_add</mat-icon>
          Add Customer
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <!-- Filters -->
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Status Filter</mat-label>
              <mat-select [(value)]="statusFilter" (selectionChange)="onFilterChange()">
                <mat-option [value]="null">All Statuses</mat-option>
                <mat-option [value]="CustomerStatus.LEAD">Lead</mat-option>
                <mat-option [value]="CustomerStatus.ACTIVE">Active</mat-option>
                <mat-option [value]="CustomerStatus.INACTIVE">Inactive</mat-option>
                <mat-option [value]="CustomerStatus.CONVERTED">Converted</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Loading Spinner -->
          @if (customerFacade.loading()) {
            <div class="loading-container">
              <mat-spinner diameter="50"></mat-spinner>
              <p>Loading customers...</p>
            </div>
          }

          <!-- Error Message -->
          @if (customerFacade.error()) {
            <div class="error-message">
              <mat-icon color="warn">error</mat-icon>
              <p>{{ customerFacade.error() }}</p>
            </div>
          }

          <!-- Customer Table -->
          @if (!customerFacade.loading() && customerFacade.customers().length > 0) {
            <div class="table-container">
              <table mat-table [dataSource]="customerFacade.customers()">
                <!-- Name Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let customer">
                    {{ customer.firstName }} {{ customer.lastName }}
                  </td>
                </ng-container>

                <!-- Email Column -->
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let customer">{{ customer.email }}</td>
                </ng-container>

                <!-- Phone Column -->
                <ng-container matColumnDef="phone">
                  <th mat-header-cell *matHeaderCellDef>Phone</th>
                  <td mat-cell *matCellDef="let customer">{{ customer.phone }}</td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let customer">
                    <mat-chip [highlighted]="customer.status === CustomerStatus.ACTIVE">
                      {{ customer.status }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Agent Column -->
                <ng-container matColumnDef="agent">
                  <th mat-header-cell *matHeaderCellDef>Assigned Agent</th>
                  <td mat-cell *matCellDef="let customer">
                    {{ customer.assignedAgentName || 'Unassigned' }}
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let customer">
                    <div class="action-buttons">
                      <button
                        mat-icon-button
                        color="primary"
                        matTooltip="View Details"
                        (click)="viewCustomer(customer.id)">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      <button
                        mat-icon-button
                        color="accent"
                        matTooltip="Edit Customer"
                        (click)="editCustomer(customer.id)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button
                        mat-icon-button
                        color="primary"
                        matTooltip="Find Matches"
                        (click)="viewMatches(customer.id)">
                        <mat-icon>home_work</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns;"
                  class="customer-row"
                  (click)="viewCustomer(row.id)">
                </tr>
              </table>
            </div>

            <!-- Paginator -->
            <mat-paginator
              [length]="customerFacade.totalElements()"
              [pageSize]="pageSize"
              [pageIndex]="currentPage"
              [pageSizeOptions]="[10, 20, 50, 100]"
              (page)="onPageChange($event)"
              showFirstLastButtons>
            </mat-paginator>
          }

          <!-- Empty State -->
          @if (!customerFacade.loading() && customerFacade.customers().length === 0) {
            <div class="empty-state">
              <mat-icon>people_outline</mat-icon>
              <h2>No customers found</h2>
              <p>Get started by adding your first customer.</p>
              <button mat-raised-button color="primary" (click)="addCustomer()">
                <mat-icon>person_add</mat-icon>
                Add Customer
              </button>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 500;
    }

    .page-header button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filters {
      margin-bottom: 16px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .filters mat-form-field {
      min-width: 200px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background-color: #ffebee;
      border-radius: 4px;
      color: #c62828;
      margin-bottom: 16px;
    }

    .table-container {
      overflow-x: auto;
      margin-bottom: 16px;
    }

    table {
      width: 100%;
    }

    .customer-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .customer-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: rgba(0, 0, 0, 0.26);
      margin-bottom: 16px;
    }

    .empty-state h2 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      font-weight: 400;
    }

    .empty-state p {
      margin: 0 0 24px 0;
      color: rgba(0, 0, 0, 0.6);
    }

    .empty-state button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .page-header button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class CustomerList implements OnInit {
  protected readonly CustomerStatus = CustomerStatus;
  protected readonly customerFacade = inject(CustomerFacadeService);
  private readonly router = inject(Router);

  displayedColumns: string[] = ['name', 'email', 'phone', 'status', 'agent', 'actions'];
  pageSize = 20;
  currentPage = 0;
  statusFilter: CustomerStatus | null = null;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerFacade.loadCustomers(
      this.currentPage,
      this.pageSize,
      this.statusFilter || undefined
    );
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCustomers();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadCustomers();
  }

  addCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

  viewCustomer(id: number): void {
    this.router.navigate(['/customers/view', id]);
  }

  editCustomer(id: number): void {
    this.router.navigate(['/customers/edit', id]);
  }

  viewMatches(id: number): void {
    this.router.navigate(['/customers', id, 'matches']);
  }
}
