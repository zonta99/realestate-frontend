// src/app/features/properties/components/property-detail/property-detail.ts
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { PropertyActions } from '../../store/property.actions';
import { selectSelectedProperty, selectLoading, selectError } from '../../store/property.selectors';
import { AttributeService } from '../../../attributes/services/attribute.service';
import { AttributeDisplayComponent } from '../../../attributes/components/attribute-display/attribute-display';
import { PropertyAttribute, PropertyValue, PropertyStatus } from '../../models/property.interface';

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
    AttributeDisplayComponent
  ],
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.scss']
})
export class PropertyDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private attributeService = inject(AttributeService);
  private destroy$ = new Subject<void>();

  // Store selectors
  property = this.store.selectSignal(selectSelectedProperty);
  loading = this.store.selectSignal(selectLoading);
  error = this.store.selectSignal(selectError);

  // Local state
  attributes = signal<PropertyAttribute[]>([]);
  attributeValues = signal<PropertyValue[]>([]);
  attributesLoading = signal(true);

  // Computed properties
  propertyId = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? parseInt(id, 10) : null;
  });

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
    // Load property details
    this.store.dispatch(PropertyActions.loadProperty({ id: propertyId }));

    // Load attributes and property attribute values
    this.attributesLoading.set(true);

    forkJoin({
      attributes: this.attributeService.getAllAttributes(),
      attributeValues: this.attributeService.getPropertyAttributeValues(propertyId)
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ attributes, attributeValues }) => {
        this.attributes.set(attributes);
        this.attributeValues.set(attributeValues);
        this.attributesLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load attribute data:', error);
        this.attributesLoading.set(false);
      }
    });
  }

  onEdit(): void {
    const id = this.propertyId();
    if (id) {
      this.router.navigate(['/properties', 'edit', id]);
    }
  }

  onShare(): void {
    // Implementation for sharing functionality
    console.log('Share property');
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
