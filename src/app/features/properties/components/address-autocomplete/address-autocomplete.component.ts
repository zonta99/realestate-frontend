/// <reference types="@types/google.maps" />
import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

interface AddressPrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface AddressComponents {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

@Component({
  selector: 'app-address-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
      <mat-label>Property Address</mat-label>
      <input
        matInput
        #addressInput
        [(ngModel)]="addressValue"
        [disabled]="disabled"
        [matAutocomplete]="auto"
        placeholder="Search for an address"
        autocomplete="off"
        (ngModelChange)="onInputChange($event)">
      <mat-icon matSuffix>location_on</mat-icon>
    </mat-form-field>

    <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onOptionSelected($event)">
      @for (prediction of predictions(); track prediction.placeId) {
        <mat-option [value]="prediction.description">
          <div class="prediction-option">
            <div class="main-text">{{ prediction.mainText }}</div>
            <div class="secondary-text">{{ prediction.secondaryText }}</div>
          </div>
        </mat-option>
      }
    </mat-autocomplete>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }

    .prediction-option {
      display: flex;
      flex-direction: column;
      padding: 4px 0;
    }

    .main-text {
      font-size: 14px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .secondary-text {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 2px;
    }
  `]
})
export class AddressAutocompleteComponent implements OnInit, OnDestroy {
  @Input() initialValue = '';
  @Input() disabled = false;
  @Output() addressSelected = new EventEmitter<{
    lat: number;
    lng: number;
    address: string;
    addressComponents?: AddressComponents;
  }>();

  @ViewChild('addressInput', { read: ElementRef }) addressInput!: ElementRef<HTMLInputElement>;

  addressValue = '';
  predictions = signal<AddressPrediction[]>([]);

  // AutocompleteService removed - using AutocompleteSuggestion.fetchAutocompleteSuggestions() static method instead
  private sessionToken: google.maps.places.AutocompleteSessionToken | null = null;
  private debounceTimer: any;
  private placesLibrary: any = null;

  ngOnInit(): void {
    this.addressValue = this.initialValue;
    this.initializeServices();
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  private async initializeServices(): Promise<void> {
    // Wait for Google Maps API to load
    if (typeof google === 'undefined' || !google.maps) {
      setTimeout(() => this.initializeServices(), 100);
      return;
    }

    try {
      // Dynamically import the places library (new API method)
      //@ts-ignore - importLibrary exists but may not be in all type definitions
      this.placesLibrary = await google.maps.importLibrary('places');

      // Initialize session token from the new library
      this.sessionToken = new this.placesLibrary.AutocompleteSessionToken();
    } catch (error) {
      console.error('Error loading Places library:', error);
    }
  }

  onInputChange(input: string): void {
    if (!input || input.length < 3) {
      this.predictions.set([]);
      return;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.fetchPredictions(input);
    }, 300);
  }

  private async fetchPredictions(input: string): Promise<void> {
    if (!this.placesLibrary) {
      return;
    }

    try {
      const { AutocompleteSuggestion } = this.placesLibrary;

      const request = {
        input,
        includedPrimaryTypes: ['geocode'],
        sessionToken: this.sessionToken!
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

      if (suggestions && suggestions.length > 0) {
        const addressPredictions: AddressPrediction[] = suggestions
          .map((s: any) => s.placePrediction)
          .filter((p: any) => p)
          .map((p: any) => ({
            placeId: p.placeId,
            description: p.text?.text || '',
            mainText: p.mainText?.text || '',
            secondaryText: p.secondaryText?.text || ''
          }));
        this.predictions.set(addressPredictions);
      } else {
        this.predictions.set([]);
      }
    } catch (error) {
      console.error('Error fetching autocomplete predictions:', error);
      this.predictions.set([]);
    }
  }

  onOptionSelected(event: any): void {
    const selectedPrediction = this.predictions().find(
      p => p.description === event.option.value
    );

    if (selectedPrediction) {
      this.fetchPlaceDetails(selectedPrediction.placeId);
    }
  }

  private parseAddressComponents(addressComponents: google.maps.places.AddressComponent[] | null | undefined): AddressComponents {
    const components: AddressComponents = {};

    if (!addressComponents) {
      return components;
    }

    let streetNumber = '';
    let route = '';

    for (const component of addressComponents) {
      const type = component.types[0];

      switch (type) {
        case 'street_number':
          streetNumber = component.longText || '';
          break;
        case 'route':
          route = component.longText || '';
          break;
        case 'locality':
          if (component.longText) components.city = component.longText;
          break;
        case 'administrative_area_level_1':
          if (component.shortText) components.state = component.shortText;
          break;
        case 'postal_code':
          if (component.longText) components.postalCode = component.longText;
          break;
        case 'country':
          if (component.longText) components.country = component.longText;
          break;
      }
    }

    // Combine street number and route
    if (streetNumber || route) {
      components.street = `${streetNumber} ${route}`.trim();
    }

    return components;
  }

  private async fetchPlaceDetails(placeId: string): Promise<void> {
    if (!this.placesLibrary) {
      console.error('Places library not loaded');
      return;
    }

    try {
      // Create Place instance with the place ID using dynamically loaded library
      const { Place } = this.placesLibrary;
      const place = new Place({
        id: placeId,
        requestedLanguage: 'en', // or use browser language
      });

      // Fetch place details using the new API
      await place.fetchFields({
        fields: ['location', 'formattedAddress', 'addressComponents']
      });

      // Check if location is available
      if (!place.location) {
        console.error('Place location not available');
        return;
      }

      // Extract data from Place object (camelCase properties)
      const lat = place.location.lat();
      const lng = place.location.lng();
      const address = place.formattedAddress || '';
      const addressComponents = this.parseAddressComponents(place.addressComponents);

      this.addressSelected.emit({ lat, lng, address, addressComponents });

      // Reset session token after successful selection
      this.sessionToken = new this.placesLibrary.AutocompleteSessionToken();
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  }
}
