// src/app/features/customers/components/customer-form/customer-form.ts
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { CustomerFacadeService } from '../../services';
import { CustomerStatus } from '../../models';

@Component({
  selector: 'app-customer-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatStepperModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>{{ isEditMode ? 'Edit Customer' : 'Add New Customer' }}</h1>
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          @if (customerFacade.loading()) {
            <div class="loading-container">
              <mat-spinner diameter="50"></mat-spinner>
              <p>{{ isEditMode ? 'Loading customer...' : 'Creating customer...' }}</p>
            </div>
          }

          @if (!customerFacade.loading()) {
            <mat-stepper [linear]="true" #stepper>
              <!-- Step 1: Basic Information -->
              <mat-step [stepControl]="customerForm">
                <form [formGroup]="customerForm">
                  <ng-template matStepLabel>Basic Information</ng-template>

                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>First Name</mat-label>
                      <input matInput formControlName="firstName" required>
                      @if (customerForm.get('firstName')?.hasError('required')) {
                        <mat-error>First name is required</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Last Name</mat-label>
                      <input matInput formControlName="lastName" required>
                      @if (customerForm.get('lastName')?.hasError('required')) {
                        <mat-error>Last name is required</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Email</mat-label>
                      <input matInput type="email" formControlName="email" required>
                      @if (customerForm.get('email')?.hasError('required')) {
                        <mat-error>Email is required</mat-error>
                      }
                      @if (customerForm.get('email')?.hasError('email')) {
                        <mat-error>Please enter a valid email</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Phone</mat-label>
                      <input matInput type="tel" formControlName="phone" required>
                      @if (customerForm.get('phone')?.hasError('required')) {
                        <mat-error>Phone is required</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Status</mat-label>
                      <mat-select formControlName="status" required>
                        <mat-option [value]="CustomerStatus.LEAD">Lead</mat-option>
                        <mat-option [value]="CustomerStatus.ACTIVE">Active</mat-option>
                        <mat-option [value]="CustomerStatus.INACTIVE">Inactive</mat-option>
                        <mat-option [value]="CustomerStatus.CONVERTED">Converted</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Assigned Agent ID</mat-label>
                      <input matInput type="number" formControlName="agentId">
                      <mat-hint>Optional - leave empty for unassigned</mat-hint>
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Notes</mat-label>
                    <textarea matInput formControlName="notes" rows="4"></textarea>
                    <mat-hint>Any additional notes about the customer</mat-hint>
                  </mat-form-field>

                  <div class="step-actions">
                    <button mat-raised-button matStepperNext>Next</button>
                  </div>
                </form>
              </mat-step>

              <!-- Step 2: Budget & Lead Information -->
              <mat-step>
                <ng-template matStepLabel>Budget & Lead Information</ng-template>

                <p class="step-description">
                  Set the customer's budget range and track the lead source for qualification.
                </p>

                <div class="form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Minimum Budget</mat-label>
                    <input matInput type="number" [formControl]="customerForm.get('budgetMin')!">
                    <span matPrefix>$&nbsp;</span>
                    <mat-hint>Customer's minimum budget for property search</mat-hint>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Maximum Budget</mat-label>
                    <input matInput type="number" [formControl]="customerForm.get('budgetMax')!">
                    <span matPrefix>$&nbsp;</span>
                    <mat-hint>Customer's maximum budget for property search</mat-hint>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Lead Source</mat-label>
                    <mat-select [formControl]="customerForm.get('leadSource')!">
                      <mat-option value="">None</mat-option>
                      <mat-option value="Website Inquiry">Website Inquiry</mat-option>
                      <mat-option value="Phone Call">Phone Call</mat-option>
                      <mat-option value="Walk-In">Walk-In</mat-option>
                      <mat-option value="Referral">Referral</mat-option>
                      <mat-option value="Social Media">Social Media</mat-option>
                      <mat-option value="Email Campaign">Email Campaign</mat-option>
                      <mat-option value="Open House">Open House</mat-option>
                      <mat-option value="Other">Other</mat-option>
                    </mat-select>
                    <mat-hint>How did this customer find us?</mat-hint>
                  </mat-form-field>
                </div>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Back</button>
                  <button mat-raised-button matStepperNext>Next</button>
                </div>
              </mat-step>

              <!-- Step 3: Search Criteria -->
              <mat-step [stepControl]="searchCriteriaForm">
                <form [formGroup]="searchCriteriaForm">
                  <ng-template matStepLabel>Search Criteria (Optional)</ng-template>

                  <p class="step-description">
                    Set property search criteria to help find matching properties for this customer.
                  </p>

                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Minimum Price</mat-label>
                      <input matInput type="number" formControlName="minPrice">
                      <span matPrefix>$&nbsp;</span>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Maximum Price</mat-label>
                      <input matInput type="number" formControlName="maxPrice">
                      <span matPrefix>$&nbsp;</span>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Minimum Bedrooms</mat-label>
                      <input matInput type="number" formControlName="minBedrooms">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Maximum Bedrooms</mat-label>
                      <input matInput type="number" formControlName="maxBedrooms">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>City</mat-label>
                      <input matInput formControlName="city">
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Property Type</mat-label>
                      <input matInput formControlName="propertyType">
                      <mat-hint>e.g., Single Family Home, Condo, Townhouse</mat-hint>
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Must Have Garage</mat-label>
                    <mat-select formControlName="mustHaveGarage">
                      <mat-option [value]="null">No Preference</mat-option>
                      <mat-option [value]="true">Yes</mat-option>
                      <mat-option [value]="false">No</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <div class="step-actions">
                    <button mat-button matStepperPrevious>Back</button>
                    <button mat-raised-button matStepperNext>Next</button>
                  </div>
                </form>
              </mat-step>

              <!-- Step 4: Review & Submit -->
              <mat-step>
                <ng-template matStepLabel>Review & Submit</ng-template>

                <div class="review-section">
                  <h3>Customer Information</h3>
                  <div class="review-grid">
                    <div class="review-item">
                      <strong>Name:</strong>
                      <span>{{ customerForm.value.firstName }} {{ customerForm.value.lastName }}</span>
                    </div>
                    <div class="review-item">
                      <strong>Email:</strong>
                      <span>{{ customerForm.value.email }}</span>
                    </div>
                    <div class="review-item">
                      <strong>Phone:</strong>
                      <span>{{ customerForm.value.phone }}</span>
                    </div>
                    <div class="review-item">
                      <strong>Status:</strong>
                      <span>{{ customerForm.value.status }}</span>
                    </div>
                    @if (customerForm.value.budgetMin || customerForm.value.budgetMax) {
                      <div class="review-item">
                        <strong>Budget Range:</strong>
                        <span>
                          {{ customerForm.value.budgetMin ? ('$' + customerForm.value.budgetMin.toLocaleString()) : 'Any' }}
                          -
                          {{ customerForm.value.budgetMax ? ('$' + customerForm.value.budgetMax.toLocaleString()) : 'Any' }}
                        </span>
                      </div>
                    }
                    @if (customerForm.value.leadSource) {
                      <div class="review-item">
                        <strong>Lead Source:</strong>
                        <span>{{ customerForm.value.leadSource }}</span>
                      </div>
                    }
                    @if (customerForm.value.notes) {
                      <div class="review-item full-width">
                        <strong>Notes:</strong>
                        <span>{{ customerForm.value.notes }}</span>
                      </div>
                    }
                  </div>

                  <mat-divider></mat-divider>

                  <h3>Search Criteria</h3>
                  @if (hasSearchCriteria()) {
                    <div class="review-grid">
                      @if (searchCriteriaForm.value.minPrice || searchCriteriaForm.value.maxPrice) {
                        <div class="review-item">
                          <strong>Price Range:</strong>
                          <span>
                            {{ searchCriteriaForm.value.minPrice ? ('$' + searchCriteriaForm.value.minPrice) : 'Any' }}
                            -
                            {{ searchCriteriaForm.value.maxPrice ? ('$' + searchCriteriaForm.value.maxPrice) : 'Any' }}
                          </span>
                        </div>
                      }
                      @if (searchCriteriaForm.value.minBedrooms || searchCriteriaForm.value.maxBedrooms) {
                        <div class="review-item">
                          <strong>Bedrooms:</strong>
                          <span>
                            {{ searchCriteriaForm.value.minBedrooms || 'Any' }}
                            -
                            {{ searchCriteriaForm.value.maxBedrooms || 'Any' }}
                          </span>
                        </div>
                      }
                      @if (searchCriteriaForm.value.city) {
                        <div class="review-item">
                          <strong>City:</strong>
                          <span>{{ searchCriteriaForm.value.city }}</span>
                        </div>
                      }
                      @if (searchCriteriaForm.value.propertyType) {
                        <div class="review-item">
                          <strong>Property Type:</strong>
                          <span>{{ searchCriteriaForm.value.propertyType }}</span>
                        </div>
                      }
                    </div>
                  } @else {
                    <p class="no-criteria">No search criteria specified</p>
                  }
                </div>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Back</button>
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="onSubmit()"
                    [disabled]="customerFacade.creating() || customerFacade.updating()">
                    @if (customerFacade.creating() || customerFacade.updating()) {
                      <mat-spinner diameter="20"></mat-spinner>
                      {{ isEditMode ? 'Updating...' : 'Creating...' }}
                    } @else {
                      <ng-container>
                        <mat-icon>save</mat-icon>
                        {{ isEditMode ? 'Update Customer' : 'Create Customer' }}
                       </ng-container>
                    }
                  </button>
                </div>
              </mat-step>
            </mat-stepper>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 500;
    }

    .page-header button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .step-description {
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 24px;
    }

    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .step-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .review-section {
      padding: 16px 0;
    }

    .review-section h3 {
      margin: 24px 0 16px 0;
      font-size: 1.25rem;
      font-weight: 500;
    }

    .review-section h3:first-child {
      margin-top: 0;
    }

    .review-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .review-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .review-item.full-width {
      grid-column: 1 / -1;
    }

    .review-item strong {
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.875rem;
    }

    .review-item span {
      color: rgba(0, 0, 0, 0.87);
    }

    .no-criteria {
      color: rgba(0, 0, 0, 0.6);
      font-style: italic;
      margin: 8px 0;
    }

    mat-divider {
      margin: 24px 0;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .step-actions {
        flex-direction: column;
      }

      .step-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class CustomerForm implements OnInit, OnDestroy {
  protected readonly CustomerStatus = CustomerStatus;
  protected readonly customerFacade = inject(CustomerFacadeService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  customerForm!: FormGroup;
  searchCriteriaForm!: FormGroup;
  isEditMode = false;
  customerId?: number;

  constructor() {
    // Use effect to watch for customer data changes and patch form
    effect(() => {
      const customer = this.customerFacade.selectedCustomer();
      const searchCriteria = this.customerFacade.searchCriteria();

      if (customer && this.isEditMode && this.customerForm) {
        this.customerForm.patchValue({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          status: customer.status,
          budgetMin: customer.budgetMin,
          budgetMax: customer.budgetMax,
          leadSource: customer.leadSource,
          agentId: customer.agentId,
          notes: customer.notes
        });
      }

      if (searchCriteria && this.searchCriteriaForm) {
        this.searchCriteriaForm.patchValue(searchCriteria);
      }
    });
  }

  ngOnInit(): void {
    this.initializeForms();

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.customerId = +params['id'];
        this.customerFacade.loadCustomer(this.customerId);
        this.customerFacade.loadSearchCriteria(this.customerId);
      }
    });
  }

  ngOnDestroy(): void {
    this.customerFacade.clearSelectedCustomer();
  }

  initializeForms(): void {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      status: [CustomerStatus.LEAD, Validators.required],
      budgetMin: [null],
      budgetMax: [null],
      leadSource: [''],
      agentId: [null],
      notes: ['']
    });

    this.searchCriteriaForm = this.fb.group({
      minPrice: [null],
      maxPrice: [null],
      minBedrooms: [null],
      maxBedrooms: [null],
      city: [''],
      propertyType: [''],
      mustHaveGarage: [null]
    });
  }

  hasSearchCriteria(): boolean {
    const criteria = this.searchCriteriaForm.value;
    return !!(
      criteria.minPrice ||
      criteria.maxPrice ||
      criteria.minBedrooms ||
      criteria.maxBedrooms ||
      criteria.city ||
      criteria.propertyType ||
      criteria.mustHaveGarage !== null
    );
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const customerData = {
      ...this.customerForm.value,
      agentId: this.customerForm.value.agentId || undefined
    };

    if (this.isEditMode && this.customerId) {
      this.customerFacade.updateCustomer(this.customerId, customerData);

      // Update search criteria if any
      if (this.hasSearchCriteria()) {
        this.customerFacade.setSearchCriteria(this.customerId, this.searchCriteriaForm.value);
      }
    } else {
      this.customerFacade.createCustomer(customerData);

      // Note: Search criteria will need to be set after customer is created
      // This would typically be handled in an effect that listens to createCustomerSuccess
    }
  }

  goBack(): void {
    if (this.isEditMode && this.customerId) {
      this.router.navigate(['/customers/view', this.customerId]);
    } else {
      this.router.navigate(['/customers/list']);
    }
  }
}
