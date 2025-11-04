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
      color: rgba(0, 0, 0, 0.87);
    }

    .secondary-text {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.54);
      margin-top: 2px;
    }
  `]
})
export class AddressAutocompleteComponent implements OnInit, OnDestroy {
  @Input() initialValue = '';
  @Input() disabled = false;
  @Output() addressSelected = new EventEmitter<{lat: number; lng: number; address: string}>();

  @ViewChild('addressInput', { read: ElementRef }) addressInput!: ElementRef<HTMLInputElement>;

  addressValue = '';
  predictions = signal<AddressPrediction[]>([]);

  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;
  private sessionToken: google.maps.places.AutocompleteSessionToken | null = null;
  private debounceTimer: any;

  ngOnInit(): void {
    this.addressValue = this.initialValue;
    this.initializeServices();
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  private initializeServices(): void {
    // Wait for Google Maps API to load
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      setTimeout(() => this.initializeServices(), 100);
      return;
    }

    // Initialize new Places API services
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
    this.sessionToken = new google.maps.places.AutocompleteSessionToken();
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

  private fetchPredictions(input: string): void {
    if (!this.autocompleteService) {
      return;
    }

    this.autocompleteService.getPlacePredictions(
      {
        input,
        types: ['address'],
        sessionToken: this.sessionToken!
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const addressPredictions: AddressPrediction[] = predictions.map(p => ({
            placeId: p.place_id,
            description: p.description,
            mainText: p.structured_formatting.main_text,
            secondaryText: p.structured_formatting.secondary_text
          }));
          this.predictions.set(addressPredictions);
        } else {
          this.predictions.set([]);
        }
      }
    );
  }

  onOptionSelected(event: any): void {
    const selectedPrediction = this.predictions().find(
      p => p.description === event.option.value
    );

    if (selectedPrediction) {
      this.fetchPlaceDetails(selectedPrediction.placeId);
    }
  }

  private fetchPlaceDetails(placeId: string): void {
    if (!this.placesService) {
      return;
    }

    this.placesService.getDetails(
      {
        placeId,
        fields: ['place_id', 'formatted_address', 'geometry', 'name'],
        sessionToken: this.sessionToken!
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          if (!place.geometry || !place.geometry.location) {
            return;
          }

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || place.name || '';

          this.addressSelected.emit({ lat, lng, address });

          // Reset session token after successful selection
          this.sessionToken = new google.maps.places.AutocompleteSessionToken();
        }
      }
    );
  }
}
