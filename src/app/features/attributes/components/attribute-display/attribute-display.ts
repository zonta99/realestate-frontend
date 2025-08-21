// src/app/features/attributes/components/attribute-display/attribute-display.ts
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  computed,
  inject,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  PropertyAttribute,
  PropertyValue,
  PropertyAttributeDataType,
  PropertyCategory
} from '../../../properties/models/property.interface';
import { AttributeService } from '../../services/attribute.service';
import {MatTooltip} from '@angular/material/tooltip';

interface AttributeDisplayItem {
  attribute: PropertyAttribute;
  value?: PropertyValue;
  displayValue: string;
  hasValue: boolean;
}

interface CategorySection {
  category: PropertyCategory;
  categoryName: string;
  attributes: AttributeDisplayItem[];
}

@Component({
  selector: 'app-attribute-display',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatTooltip
  ],
  templateUrl: './attribute-display.html',
  styleUrls: ['./attribute-display.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeDisplayComponent implements OnInit {
  private attributeService = inject(AttributeService);

  @Input({ required: true }) attributes: PropertyAttribute[] = [];
  @Input() values: PropertyValue[] = [];
  @Input() showEmptyValues = false;
  @Input() groupByCategory = true;

  // Expose enum for template
  readonly PropertyAttributeDataType = PropertyAttributeDataType;

  // Computed data for template
  categorizedAttributes = computed(() => this.processCategorizedAttributes());
  flatAttributes = computed(() => this.processFlatAttributes());

  ngOnInit() {
    // Component initialization
  }

  private processCategorizedAttributes(): CategorySection[] {
    if (!this.groupByCategory) return [];

    const grouped = this.attributeService.groupAttributesByCategory(this.attributes);
    const sections: CategorySection[] = [];

    // Define category display order and names
    const categoryOrder: { [key in PropertyCategory]: string } = {
      [PropertyCategory.BASICS]: 'Basic Information',
      [PropertyCategory.INTERIOR]: 'Interior Features',
      [PropertyCategory.EXTERIOR]: 'Exterior Features',
      [PropertyCategory.NEIGHBORHOOD]: 'Neighborhood',
      [PropertyCategory.AMENITIES]: 'Amenities',
      [PropertyCategory.OTHER]: 'Other'
    };

    // Process each category in order
    Object.entries(categoryOrder).forEach(([category, categoryName]) => {
      const categoryAttributes = grouped.get(category as PropertyCategory) || [];
      if (categoryAttributes.length === 0) return;

      const sortedAttributes = this.attributeService.sortAttributesByDisplayOrder(categoryAttributes);
      const attributeItems = this.processAttributeItems(sortedAttributes);

      // Only add section if it has attributes (and values if showEmptyValues is false)
      if (attributeItems.length > 0 && (this.showEmptyValues || attributeItems.some(item => item.hasValue))) {
        sections.push({
          category: category as PropertyCategory,
          categoryName,
          attributes: attributeItems
        });
      }
    });

    return sections;
  }

  private processFlatAttributes(): AttributeDisplayItem[] {
    if (this.groupByCategory) return [];

    const sortedAttributes = this.attributeService.sortAttributesByDisplayOrder(this.attributes);
    return this.processAttributeItems(sortedAttributes);
  }

  private processAttributeItems(attributes: PropertyAttribute[]): AttributeDisplayItem[] {
    return attributes
      .map(attribute => this.createAttributeDisplayItem(attribute))
      .filter(item => this.showEmptyValues || item.hasValue);
  }

  private createAttributeDisplayItem(attribute: PropertyAttribute): AttributeDisplayItem {
    const value = this.values.find(v => v.attributeId === attribute.id);
    const hasValue = Boolean(value?.value);

    return {
      attribute,
      value,
      displayValue: this.formatDisplayValue(attribute, value),
      hasValue
    };
  }

  private formatDisplayValue(attribute: PropertyAttribute, value?: PropertyValue): string {
    if (!value?.value) return '-';

    switch (attribute.dataType) {
      case PropertyAttributeDataType.BOOLEAN:
        const boolValue = value.value === 'true' || value.value;
        return boolValue ? 'Yes' : 'No';

      case PropertyAttributeDataType.NUMBER:
        return Number(value.value).toLocaleString();

      case PropertyAttributeDataType.DATE:
        try {
          const date = new Date(value.value);
          return date.toLocaleDateString();
        } catch {
          return value.value;
        }

      case PropertyAttributeDataType.MULTI_SELECT:
        const multiValues = this.attributeService.parseMultiSelectValue(value.value);
        return multiValues.join(', ');

      case PropertyAttributeDataType.TEXT:
      case PropertyAttributeDataType.SINGLE_SELECT:
      default:
        return value.value;
    }
  }

  // Utility methods for template
  getCategoryIcon(category: PropertyCategory): string {
    const iconMap: { [key in PropertyCategory]: string } = {
      [PropertyCategory.BASICS]: 'info',
      [PropertyCategory.INTERIOR]: 'home',
      [PropertyCategory.EXTERIOR]: 'landscape',
      [PropertyCategory.NEIGHBORHOOD]: 'location_city',
      [PropertyCategory.AMENITIES]: 'pool',
      [PropertyCategory.OTHER]: 'more_horiz'
    };
    return iconMap[category] || 'info';
  }

  getMultiSelectChips(value: string): string[] {
    return this.attributeService.parseMultiSelectValue(value);
  }

  trackByCategory(index: number, section: CategorySection): string {
    return section.category;
  }

  trackByAttribute(index: number, item: AttributeDisplayItem): number {
    return item.attribute.id;
  }

  trackByChip(index: number, chip: string): string {
    return chip;
  }
}
