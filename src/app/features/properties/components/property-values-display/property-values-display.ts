// src/app/features/properties/components/property-values-display/property-values-display.ts
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  PropertyValue,
  PropertyAttributeDataType,
  PropertyCategory
} from '../../models/property.interface';

interface CategorySection {
  category: PropertyCategory;
  categoryName: string;
  values: PropertyValue[];
}

@Component({
  selector: 'app-property-values-display',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="property-values-display">
      @if (categorizedValues().length > 0) {
        @for (section of categorizedValues(); track section.category) {
          <mat-card class="mat-elevation-2 category-card">
            <!-- Category header -->
            <mat-card-header>
              <div mat-card-avatar>
                <mat-icon>{{ getCategoryIcon(section.category) }}</mat-icon>
              </div>
              <mat-card-title>{{ section.categoryName }}</mat-card-title>
            </mat-card-header>

            <mat-divider/>

            <!-- Category values -->
            <mat-card-content>
              <div class="values-grid">
                @for (value of section.values; track value.id) {
                  <div class="value-item">
                    <span class="value-label">{{ value.attributeName }}</span>
                    <div class="value-content">
                      @if (value.dataType === PropertyAttributeDataType.BOOLEAN) {
                        <!-- Boolean display -->
                        <div class="boolean-display">
                          <mat-icon [color]="formatBooleanValue(value.value) ? 'primary' : 'warn'">
                            {{ formatBooleanValue(value.value) ? 'check_circle' : 'cancel' }}
                          </mat-icon>
                          <span>{{ formatBooleanValue(value.value) ? 'Yes' : 'No' }}</span>
                        </div>
                      } @else if (value.dataType === PropertyAttributeDataType.MULTI_SELECT) {
                        <!-- Multi-select chips -->
                        <mat-chip-set>
                          @for (chip of parseMultiSelectValue(value.value); track chip) {
                            <mat-chip>{{ chip }}</mat-chip>
                          }
                        </mat-chip-set>
                      } @else {
                        <!-- Regular text display -->
                        <span class="value-text">{{ formatDisplayValue(value) }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        } @empty {
          <mat-card>
            <mat-card-content class="empty-content">
              <mat-icon>info</mat-icon>
              <h3>No Property Details</h3>
              <p>This property doesn't have any additional details set.</p>
            </mat-card-content>
          </mat-card>
        }
      } @else {
        <mat-card>
          <mat-card-content class="empty-content">
            <mat-icon>info</mat-icon>
            <h3>No Property Details</h3>
            <p>This property doesn't have any additional details set.</p>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .property-values-display {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .category-card {
      margin-bottom: 1rem;
    }

    .values-grid {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .value-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .value-label {
      font-weight: 500;
      font-size: 0.875rem;
    }

    .value-content {
      display: flex;
      align-items: center;
    }

    .value-text {
      font-size: 1rem;
    }

    .boolean-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .empty-content {
      text-align: center;
      padding: 2rem;
    }

    .empty-content mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
    }

    .empty-content h3 {
      margin: 0 0 0.5rem 0;
    }

    .empty-content p {
      margin: 0;
    }

    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyValuesDisplayComponent {
  @Input({ required: true }) values: PropertyValue[] = [];

  // Expose enum for template
  readonly PropertyAttributeDataType = PropertyAttributeDataType;

  // Computed categorized values
  categorizedValues = computed(() => this.processCategorizedValues());

  private processCategorizedValues(): CategorySection[] {
    if (!this.values || this.values.length === 0) return [];

    // Group values by category (assuming we can determine category from attribute name or add category to PropertyValue)
    const grouped = new Map<PropertyCategory, PropertyValue[]>();

    // For now, put all values in BASIC category since PropertyValue doesn't include category
    // In a real implementation, you might need to fetch attribute metadata or modify the API
    this.values.forEach(value => {
      const category = PropertyCategory.BASIC; // Default category
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(value);
    });

    const sections: CategorySection[] = [];

    // Define category display names
    const categoryNames: { [key in PropertyCategory]: string } = {
      [PropertyCategory.BASIC]: 'Property Details',
      [PropertyCategory.FEATURES]: 'Features',
      [PropertyCategory.FINANCIAL]: 'Financial Information',
      [PropertyCategory.LOCATION]: 'Location',
      [PropertyCategory.STRUCTURE]: 'Structure'
    };

    grouped.forEach((values, category) => {
      sections.push({
        category,
        categoryName: categoryNames[category],
        values: values.sort((a, b) => a.attributeName.localeCompare(b.attributeName))
      });
    });

    return sections;
  }

  formatDisplayValue(value: PropertyValue): string {
    if (!value.value) return '-';

    switch (value.dataType) {
      case PropertyAttributeDataType.NUMBER:
        return Number(value.value).toLocaleString();

      case PropertyAttributeDataType.DATE:
        try {
          const date = new Date(value.value);
          return date.toLocaleDateString();
        } catch {
          return value.value;
        }

      case PropertyAttributeDataType.TEXT:
      case PropertyAttributeDataType.SINGLE_SELECT:
      default:
        return value.value;
    }
  }

  formatBooleanValue(value: string): boolean {
    return value === 'true' || value === 'True' ;
  }

  parseMultiSelectValue(value: string): string[] {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value.split(',').map(v => v.trim());
    }
  }

  getCategoryIcon(category: PropertyCategory): string {
    const iconMap: { [key in PropertyCategory]: string } = {
      [PropertyCategory.BASIC]: 'info',
      [PropertyCategory.FEATURES]: 'star',
      [PropertyCategory.FINANCIAL]: 'attach_money',
      [PropertyCategory.LOCATION]: 'location_on',
      [PropertyCategory.STRUCTURE]: 'architecture'
    };
    return iconMap[category] || 'info';
  }
}
