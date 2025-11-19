// src/app/features/saved-searches/components/saved-search-form/saved-search-form.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppState } from '../../../../core/store/app.reducer';
import { AttributeService } from '../../../attributes/services/attribute.service';
import { PropertyAttribute } from '../../../properties/models/property.interface';
import { SearchFilter, CreateSavedSearchRequest, UpdateSavedSearchRequest } from '../../models/saved-search.interface';
import * as SavedSearchActions from '../../store/saved-search.actions';
import * as SavedSearchSelectors from '../../store/saved-search.selectors';
import { SearchFilterBuilderComponent } from '../search-filter-builder/search-filter-builder';

@Component({
  selector: 'app-saved-search-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SearchFilterBuilderComponent
  ],
  templateUrl: './saved-search-form.html',
  styleUrl: './saved-search-form.css'
})
export class SavedSearchFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private attributeService = inject(AttributeService);
  private snackBar = inject(MatSnackBar);

  searchForm!: FormGroup;
  filters = signal<SearchFilter[]>([]);
  attributes = signal<PropertyAttribute[]>([]);
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  searchId = signal<number | null>(null);

  ngOnInit(): void {
    // Initialize form
    this.searchForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.searchId.set(+params['id']);
        this.loadSavedSearch(+params['id']);
      } else {
        this.loading.set(false);
      }
    });

    // Load searchable attributes
    this.attributeService.getSearchableAttributes().subscribe({
      next: (attrs) => {
        this.attributes.set(attrs);
      },
      error: (error) => {
        this.snackBar.open('Failed to load attributes', 'Close', { duration: 3000 });
        console.error('Error loading attributes:', error);
      }
    });

    // Subscribe to saving state
    this.store.select(SavedSearchSelectors.selectCreating).subscribe(creating => {
      this.saving.set(creating);
    });

    this.store.select(SavedSearchSelectors.selectUpdating).subscribe(updating => {
      this.saving.set(updating);
    });
  }

  loadSavedSearch(id: number): void {
    this.store.dispatch(SavedSearchActions.loadSavedSearch({ id }));

    this.store.select(SavedSearchSelectors.selectSelectedSavedSearch).subscribe(search => {
      if (search && search.id === id) {
        this.searchForm.patchValue({
          name: search.name,
          description: search.description || ''
        });
        this.filters.set([...search.filters]);
        this.loading.set(false);
      }
    });
  }

  onAddFilter(): void {
    // Add an empty filter
    const newFilter: SearchFilter = {
      attributeId: 0,
      dataType: 'TEXT' as any
    };
    this.filters.set([...this.filters(), newFilter]);
  }

  onFilterChange(index: number, filter: SearchFilter): void {
    const updatedFilters = [...this.filters()];
    updatedFilters[index] = filter;
    this.filters.set(updatedFilters);
  }

  onRemoveFilter(index: number): void {
    const updatedFilters = this.filters().filter((_, i) => i !== index);
    this.filters.set(updatedFilters);
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.filters().length === 0) {
      this.snackBar.open('Please add at least one filter', 'Close', { duration: 3000 });
      return;
    }

    // Validate all filters
    const invalidFilters = this.filters().filter(f => !f.attributeId || f.attributeId === 0);
    if (invalidFilters.length > 0) {
      this.snackBar.open('Please complete all filters', 'Close', { duration: 3000 });
      return;
    }

    const formValue = this.searchForm.value;

    if (this.isEditMode()) {
      // Update existing search
      const request: UpdateSavedSearchRequest = {
        name: formValue.name,
        description: formValue.description,
        filters: this.filters()
      };
      this.store.dispatch(SavedSearchActions.updateSavedSearch({
        id: this.searchId()!,
        request
      }));
    } else {
      // Create new search
      const request: CreateSavedSearchRequest = {
        name: formValue.name,
        description: formValue.description,
        filters: this.filters()
      };
      this.store.dispatch(SavedSearchActions.createSavedSearch({ request }));
    }
  }

  onCancel(): void {
    this.router.navigate(['/searches']);
  }

  getFilterCount(): number {
    return this.filters().length;
  }
}
