// src/app/features/properties/components/property-list/property-list.component.ts
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
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
import { PropertyActions } from '../../store/property.actions';
import {
  selectProperties,
  selectLoading,
  selectPagination,
  selectFilters,
  selectError
} from '../../store/property.selectors';
import { PropertyStatus } from '../../models/property.interface';

@Component({
  selector: 'app-property-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './property-list.html',
  styleUrl: './property-list.scss',
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
    MatToolbarModule
  ]
})
export class PropertyListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  // Signals for reactive state
  properties = this.store.selectSignal(selectProperties);
  loading = this.store.selectSignal(selectLoading);
  pagination = this.store.selectSignal(selectPagination);
  filters = this.store.selectSignal(selectFilters);
  error = this.store.selectSignal(selectError);

  // Filters form
  filtersForm = this.fb.group({
    search: [''],
    status: [''],
    minPrice: [null as number | null],
    maxPrice: [null as number | null]
  });

  ngOnInit(): void {
    // Load initial properties
    this.loadProperties();
  }

  loadProperties(): void {
    const currentFilters = this.filters();
    this.store.dispatch(PropertyActions.loadProperties({
      params: {
        ...currentFilters,
        page: this.pagination().currentPage,
        size: this.pagination().pageSize
      }
    }));
  }

  applyFilters(): void {
    const formValue = this.filtersForm.getRawValue();
    const filterParams: any = {};

    if (formValue.search) filterParams.search = formValue.search;
    if (formValue.status) filterParams.status = formValue.status as PropertyStatus;
    if (formValue.minPrice) filterParams.minPrice = formValue.minPrice;
    if (formValue.maxPrice) filterParams.maxPrice = formValue.maxPrice;

    this.store.dispatch(PropertyActions.setFilters({ filters: filterParams }));
    this.store.dispatch(PropertyActions.setCurrentPage({ page: 0 })); // Reset to first page
    this.loadProperties();
  }

  clearFilters(): void {
    this.filtersForm.reset();
    this.store.dispatch(PropertyActions.clearFilters());
    this.store.dispatch(PropertyActions.setCurrentPage({ page: 0 }));
    this.loadProperties();
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(PropertyActions.setCurrentPage({ page: event.pageIndex }));
    this.store.dispatch(PropertyActions.setPageSize({ size: event.pageSize }));
    this.loadProperties();
  }

  addProperty(): void {
    this.router.navigate(['/properties/add']);
  }

  viewProperty(id: number): void {
    this.router.navigate(['/properties', id]);
  }

  editProperty(id: number): void {
    this.router.navigate(['/properties', id, 'edit']);
  }

  deleteProperty(id: number): void {
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      this.store.dispatch(PropertyActions.deleteProperty({ id }));
    }
  }

  retryLoad(): void {
    this.store.dispatch(PropertyActions.clearError());
    this.loadProperties();
  }
}

// Export alias for consistency
export { PropertyListComponent as PropertyList };
