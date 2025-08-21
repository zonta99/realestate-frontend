// src/app/features/properties/components/property-detail/property-detail.ts
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Subject, takeUntil } from 'rxjs';
import { PropertyService, PropertyFullData } from '../../services/property.service';
import { PropertyValuesDisplayComponent } from '../property-values-display/property-values-display';
import { PropertyStatus } from '../../models/property.interface';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatChipsModule,
    PropertyValuesDisplayComponent
  ],
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.scss']
})
export class PropertyDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertyService = inject(PropertyService);
  private destroy$ = new Subject<void>();

  // Signals for reactive state
  loading = signal(true);
  error = signal<string | null>(null);
  propertyData = signal<PropertyFullData | null>(null);

  // Computed properties
  propertyId = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? parseInt(id, 10) : null;
  });

  property = computed(() => this.propertyData()?.property || null);
  attributeValues = computed(() => this.propertyData()?.attributeValues || []);

  statusColor = computed(() => {
    const prop = this.property();
    if (!prop) return 'default';

    switch (prop.status) {
      case PropertyStatus.ACTIVE: return 'primary';
      case PropertyStatus.PENDING: return 'accent';
      case PropertyStatus.SOLD: return 'warn';
      case PropertyStatus.INACTIVE: return 'default';
      default: return 'default';
    }
  });

  ngOnInit(): void {
    const id = this.propertyId();
    if (id) {
      this.loadPropertyData(id);
    } else {
      this.router.navigate(['/properties']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPropertyData(propertyId: number): void {
    this.loading.set(true);
    this.error.set(null);

    // Load property data with attribute values
    this.propertyService.getPropertyFullData(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.propertyData.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load property data:', error);
          this.error.set('Failed to load property details. Please try again.');
          this.loading.set(false);
        }
      });
  }

  onEdit(): void {
    const id = this.propertyId();
    if (id) {
      this.router.navigate(['/properties', id, 'edit']);
    }
  }

  onShare(): void {
    // Implementation for sharing functionality
    console.log('Share property');
    // You can implement sharing logic here
  }

  onBack(): void {
    this.router.navigate(['/properties']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
