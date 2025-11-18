// src/app/features/saved-searches/components/search-results/search-results.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AppState } from '../../../../core/store/app.reducer';
import * as SavedSearchActions from '../../store/saved-search.actions';
import * as SavedSearchSelectors from '../../store/saved-search.selectors';
import { SavedSearch } from '../../models/saved-search.interface';
import { Property } from '../../../properties/models/property.interface';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule
  ],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css'
})
export class SearchResultsComponent implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  searchId = signal<number | null>(null);
  savedSearch = signal<SavedSearch | null>(null);
  properties = signal<Property[]>([]);
  totalElements = signal<number>(0);
  pageSize = signal<number>(20);
  pageIndex = signal<number>(0);
  loading = signal<boolean>(false);
  executing = signal<boolean>(false);

  ngOnInit(): void {
    // Get search ID from route
    this.route.params.subscribe(params => {
      if (params['id']) {
        const searchId = +params['id'];
        this.searchId.set(searchId);
        this.loadSearchAndExecute(searchId);
      }
    });

    // Subscribe to store updates
    this.store.select(SavedSearchSelectors.selectSelectedSavedSearch).subscribe(search => {
      if (search) {
        this.savedSearch.set(search);
      }
    });

    this.store.select(SavedSearchSelectors.selectSearchResults).subscribe(results => {
      if (results) {
        this.properties.set(results.content);
        this.totalElements.set(results.totalElements);
        this.pageSize.set(results.size);
        this.pageIndex.set(results.number);
      }
    });

    this.store.select(SavedSearchSelectors.selectLoading).subscribe(loading => {
      this.loading.set(loading);
    });

    this.store.select(SavedSearchSelectors.selectExecuting).subscribe(executing => {
      this.executing.set(executing);
    });
  }

  loadSearchAndExecute(searchId: number): void {
    // Load the saved search details
    this.store.dispatch(SavedSearchActions.loadSavedSearch({ id: searchId }));

    // Execute the search
    this.store.dispatch(SavedSearchActions.executeSavedSearch({
      searchId,
      page: this.pageIndex(),
      size: this.pageSize()
    }));
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    if (this.searchId()) {
      this.store.dispatch(SavedSearchActions.executeSavedSearch({
        searchId: this.searchId()!,
        page: event.pageIndex,
        size: event.pageSize
      }));
    }
  }

  onViewProperty(property: Property): void {
    this.router.navigate(['/properties', property.id]);
  }

  onBackToSearches(): void {
    this.router.navigate(['/searches']);
  }

  onEditSearch(): void {
    if (this.searchId()) {
      this.router.navigate(['/searches', this.searchId(), 'edit']);
    }
  }

  getFilterCount(): number {
    return this.savedSearch()?.filters.length || 0;
  }

  getFormattedPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'SOLD':
        return 'error';
      case 'INACTIVE':
        return 'default';
      default:
        return 'default';
    }
  }
}
