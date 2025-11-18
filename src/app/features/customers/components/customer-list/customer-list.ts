// src/app/features/customers/components/customer-list/customer-list.ts
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { CustomerFacadeService } from '../../services/customer-facade.service';
import { CustomerStatus } from '../../models/customer.interface';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './customer-list.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    MatToolbarModule,
    MatTableModule
  ]
})
export class CustomerListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private customerFacade = inject(CustomerFacadeService);
  private router = inject(Router);

  // Signals for reactive state
  customers = this.customerFacade.customers;
  loading = this.customerFacade.loading;
  error = this.customerFacade.error;
  pagination = () => ({
    totalElements: this.customerFacade.totalElements(),
    totalPages: this.customerFacade.totalPages(),
    currentPage: this.customerFacade.currentPage(),
    pageSize: 20
  });

  // Table columns
  displayedColumns = ['name', 'email', 'phone', 'status', 'agent', 'actions'];

  // Customer statuses
  customerStatuses = Object.values(CustomerStatus);

  // Filters form
  filtersForm = this.fb.group({
    search: [''],
    status: ['']
  });

  ngOnInit(): void {
    // Load initial customers
    this.loadCustomers();
  }

  loadCustomers(): void {
    const statusFilter = this.filtersForm.value.status;
    this.customerFacade.loadCustomers(
      this.pagination().currentPage,
      this.pagination().pageSize,
      statusFilter || undefined
    );
  }

  applyFilters(): void {
    this.loadCustomers();
  }

  clearFilters(): void {
    this.filtersForm.reset();
    this.loadCustomers();
  }

  onPageChange(event: PageEvent): void {
    this.customerFacade.loadCustomers(
      event.pageIndex,
      event.pageSize,
      this.filtersForm.value.status || undefined
    );
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

  deleteCustomer(id: number, name: string): void {
    if (confirm(`Are you sure you want to delete customer "${name}"? This action cannot be undone.`)) {
      this.customerFacade.deleteCustomer(id);
    }
  }

  retryLoad(): void {
    this.loadCustomers();
  }

  getStatusColor(status: CustomerStatus): string {
    switch (status) {
      case CustomerStatus.ACTIVE:
        return 'primary';
      case CustomerStatus.CLIENT:
        return 'accent';
      case CustomerStatus.PROSPECT:
        return 'warn';
      case CustomerStatus.LEAD:
        return '';
      case CustomerStatus.INACTIVE:
        return '';
      default:
        return '';
    }
  }
}

// Export alias for consistency
export { CustomerListComponent as CustomerList };
