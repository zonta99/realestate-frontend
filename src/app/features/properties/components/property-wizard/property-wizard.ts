// src/app/features/properties/components/property-wizard/property-wizard.ts
import { Component, ChangeDetectionStrategy, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil, filter, switchMap } from 'rxjs';
import { PropertyActions } from '../../store/property.actions';
import { selectCreating, selectError, selectSelectedProperty } from '../../store/property.selectors';
import { AttributeManagerComponent } from '../../../attributes/components/attribute-manager/attribute-manager';
import { Property, CreatePropertyRequest, UpdatePropertyRequest, PropertyStatus } from '../../models/property.interface';

export enum WizardStep {
  PROPERTY_DETAILS = 0,
  ATTRIBUTES = 1,
  REVIEW = 2
}

@Component({
  selector: 'app-property-wizard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './property-wizard.html',
  styleUrl: './property-wizard.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDividerModule,
    MatStepperModule,
    MatSnackBarModule,
    MatDialogModule,
    AttributeManagerComponent
  ]
})
export class PropertyWizardComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  // Expose enum to template
  readonly WizardStep = WizardStep;

  // Signals for reactive state
  creating = this.store.selectSignal(selectCreating);
  error = this.store.selectSignal(selectError);
  selectedProperty = this.store.selectSignal(selectSelectedProperty);

  // Component state
  currentStep = signal<WizardStep>(WizardStep.PROPERTY_DETAILS);
  isEditMode = signal<boolean>(false);
  propertyId = signal<number | null>(null);
  createdProperty = signal<Property | null>(null);

  // Wizard progress tracking
  propertyDetailsCompleted = signal<boolean>(false);
  attributesCompleted = signal<boolean>(false);
  canProceedToAttributes = computed(() => this.propertyDetailsCompleted() && !this.creating());
  canProceedToReview = computed(() => this.canProceedToAttributes() && this.attributesCompleted());

  // Property details form
  propertyForm = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200)
    ]],
    description: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(1000)
    ]],
    price: [null as number | null, [
      Validators.required,
      Validators.min(1),
      Validators.max(50000000)
    ]]
  });

  // Edit form for existing properties
  editForm = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200)
    ]],
    description: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(1000)
    ]],
    price: [null as number | null, [
      Validators.required,
      Validators.min(1),
      Validators.max(50000000)
    ]],
    status: [PropertyStatus.ACTIVE, [Validators.required]]
  });

  ngOnInit(): void {
    this.initializeWizard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(PropertyActions.clearSelectedProperty());
  }

  private initializeWizard(): void {
    const propertyId = this.route.snapshot.params['id'];

    if (propertyId) {
      // Edit mode
      this.isEditMode.set(true);
      this.propertyId.set(+propertyId);
      this.currentStep.set(WizardStep.ATTRIBUTES); // Skip to attributes for editing
      this.propertyDetailsCompleted.set(true);

      // Load the property
      this.store.dispatch(PropertyActions.loadProperty({ id: +propertyId }));

      // Listen for property loading success
      this.store.select(selectSelectedProperty)
        .pipe(
          takeUntil(this.destroy$),
          filter(property => !!property)
        )
        .subscribe(property => {
          if (property) {
            this.createdProperty.set(property);
            this.initializeEditForm(property);
          }
        });
    } else {
      // Create mode
      this.isEditMode.set(false);
      this.currentStep.set(WizardStep.PROPERTY_DETAILS);
    }

    // Listen for property creation success
    this.store.select(selectSelectedProperty)
      .pipe(
        takeUntil(this.destroy$),
        filter(property => !!property && !this.isEditMode())
      )
      .subscribe(property => {
        if (property && !this.createdProperty()) {
          this.createdProperty.set(property);
          this.propertyId.set(property.id);
          this.propertyDetailsCompleted.set(true);
          this.snackBar.open('Property created successfully!', 'Close', { duration: 3000 });
        }
      });
  }

  private initializeEditForm(property: Property): void {
    this.editForm.patchValue({
      title: property.title,
      description: property.description,
      price: property.price,
      status: property.status
    });
  }

  onCreateProperty(): void {
    if (this.propertyForm.valid && !this.creating()) {
      const formValue = this.propertyForm.getRawValue();

      const request: CreatePropertyRequest = {
        title: formValue.title!,
        description: formValue.description!,
        price: formValue.price!
      };

      this.store.dispatch(PropertyActions.createProperty({ property: request }));
    }
  }

  onUpdateProperty(): void {
    if (this.editForm.valid && !this.creating() && this.propertyId()) {
      const formValue = this.editForm.getRawValue();

      const request: UpdatePropertyRequest = {
        title: formValue.title!,
        description: formValue.description!,
        price: formValue.price!,
        status: formValue.status!
      };

      this.store.dispatch(PropertyActions.updateProperty({
        id: this.propertyId()!,
        property: request
      }));

      this.snackBar.open('Property updated successfully!', 'Close', { duration: 3000 });
    }
  }

  onProceedToAttributes(): void {
    if (this.canProceedToAttributes()) {
      this.currentStep.set(WizardStep.ATTRIBUTES);
    }
  }

  onProceedToReview(): void {
    if (this.canProceedToReview()) {
      this.currentStep.set(WizardStep.REVIEW);
    }
  }

  onBackToDetails(): void {
    this.currentStep.set(WizardStep.PROPERTY_DETAILS);
  }

  onBackToAttributes(): void {
    this.currentStep.set(WizardStep.ATTRIBUTES);
  }

  onSkipAttributes(): void {
    this.attributesCompleted.set(true);
    this.finishWizard();
  }

  onAttributesCompleted(): void {
    this.attributesCompleted.set(true);
  }

  onFinishWizard(): void {
    this.finishWizard();
  }

  private finishWizard(): void {
    if (this.isEditMode()) {
      this.router.navigate(['/properties', this.propertyId()]);
    } else {
      this.router.navigate(['/properties']);
    }
  }

  resetForms(): void {
    this.propertyForm.reset();
    this.editForm.reset();
    this.currentStep.set(WizardStep.PROPERTY_DETAILS);
    this.propertyDetailsCompleted.set(false);
    this.attributesCompleted.set(false);
    this.createdProperty.set(null);
    this.store.dispatch(PropertyActions.clearError());
  }

  goBack(): void {
    this.router.navigate(['/properties']);
  }

  getStepIcon(step: WizardStep): string {
    switch (step) {
      case WizardStep.PROPERTY_DETAILS:
        return 'home';
      case WizardStep.ATTRIBUTES:
        return 'tune';
      case WizardStep.REVIEW:
        return 'preview';
      default:
        return 'help';
    }
  }

  getStepLabel(step: WizardStep): string {
    switch (step) {
      case WizardStep.PROPERTY_DETAILS:
        return 'Property Details';
      case WizardStep.ATTRIBUTES:
        return 'Attributes';
      case WizardStep.REVIEW:
        return 'Review';
      default:
        return 'Unknown';
    }
  }

  isStepCompleted(step: WizardStep): boolean {
    switch (step) {
      case WizardStep.PROPERTY_DETAILS:
        return this.propertyDetailsCompleted();
      case WizardStep.ATTRIBUTES:
        return this.attributesCompleted();
      case WizardStep.REVIEW:
        return false; // Review is never "completed"
      default:
        return false;
    }
  }

  isStepActive(step: WizardStep): boolean {
    return this.currentStep() === step;
  }

  canAccessStep(step: WizardStep): boolean {
    switch (step) {
      case WizardStep.PROPERTY_DETAILS:
        return true; // Always accessible
      case WizardStep.ATTRIBUTES:
        return this.propertyDetailsCompleted() || this.isEditMode();
      case WizardStep.REVIEW:
        return this.canProceedToReview();
      default:
        return false;
    }
  }
}

// Export alias for consistency
export { PropertyWizardComponent as PropertyWizard };
