// src/app/features/saved-searches/components/saved-search-list/saved-search-list.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppState } from '../../../../core/store/app.reducer';
import * as SavedSearchActions from '../../store/saved-search.actions';
import * as SavedSearchSelectors from '../../store/saved-search.selectors';
import { SavedSearch } from '../../models/saved-search.interface';

@Component({
  selector: 'app-saved-search-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './saved-search-list.html',
  styleUrl: './saved-search-list.css'
})
export class SavedSearchListComponent implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  searches = signal<SavedSearch[]>([]);
  loading = signal<boolean>(false);
  deleting = signal<boolean>(false);

  ngOnInit(): void {
    // Load saved searches on component init
    this.store.dispatch(SavedSearchActions.loadSavedSearches());

    // Subscribe to store
    this.store.select(SavedSearchSelectors.selectAllSavedSearches).subscribe((searches) => {
      this.searches.set(searches);
    });

    this.store.select(SavedSearchSelectors.selectLoading).subscribe((loading) => {
      this.loading.set(loading);
    });

    this.store.select(SavedSearchSelectors.selectDeleting).subscribe((deleting) => {
      this.deleting.set(deleting);
    });
  }

  onCreateNew(): void {
    this.router.navigate(['/searches/new']);
  }

  onEdit(search: SavedSearch): void {
    this.router.navigate(['/searches', search.id, 'edit']);
  }

  onDelete(search: SavedSearch): void {
    if (confirm(`Are you sure you want to delete "${search.name}"?`)) {
      this.store.dispatch(SavedSearchActions.deleteSavedSearch({ id: search.id }));
      this.snackBar.open(`Search "${search.name}" deleted successfully`, 'Close', {
        duration: 3000
      });
    }
  }

  onExecute(search: SavedSearch): void {
    this.router.navigate(['/searches', search.id, 'results']);
  }

  getFilterCount(search: SavedSearch): number {
    return search.filters.length;
  }

  getFilterSummary(search: SavedSearch): string {
    const count = search.filters.length;
    if (count === 0) return 'No filters';
    if (count === 1) return '1 filter';
    return `${count} filters`;
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
