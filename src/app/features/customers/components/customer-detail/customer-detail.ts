// src/app/features/customers/components/customer-detail/customer-detail.ts
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerFacadeService } from '../../services';
import { Customer } from '../../models';

@Component({
  selector: 'app-customer-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="page-layout">
      <header class="page-header">
        <div class="header-left">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="mat-headline-4">Customer Details</h1>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="viewMatches()">
            <mat-icon>home_work</mat-icon>
            Find Matches
          </button>
          <button mat-raised-button color="accent" (click)="editCustomer()">
            <mat-icon>edit</mat-icon>
            Edit
          </button>
          <button mat-raised-button color="warn" (click)="deleteCustomer()">
            <mat-icon>delete</mat-icon>
            Delete
          </button>
        </div>
      </header>

      <main class="page-content">
        @if (customerFacade.loading()) {
          <div class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Loading customer details...</p>
          </div>
        }

        @if (!customerFacade.loading() && customerFacade.selectedCustomer()) {
          <div class="cards-container">
            <!-- Basic Information Card -->
            <mat-card class="content-card">
              <mat-card-header>
                <mat-card-title>Basic Information</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Name</span>
                    <span class="value">
                      {{ customerFacade.selectedCustomer()?.firstName }}
                      {{ customerFacade.selectedCustomer()?.lastName }}
                    </span>
                  </div>

                  <div class="info-item">
                    <span class="label">Email</span>
                    <span class="value">{{ customerFacade.selectedCustomer()?.email }}</span>
                  </div>

                  <div class="info-item">
                    <span class="label">Phone</span>
                    <span class="value">{{ customerFacade.selectedCustomer()?.phone }}</span>
                  </div>

                  <div class="info-item">
                    <span class="label">Status</span>
                    <mat-chip [highlighted]="customerFacade.selectedCustomer()?.status === 'ACTIVE'">
                      {{ customerFacade.selectedCustomer()?.status }}
                    </mat-chip>
                  </div>

                  <div class="info-item">
                    <span class="label">Assigned Agent</span>
                    <span class="value">
                      {{ customerFacade.selectedCustomer()?.assignedAgentName || 'Unassigned' }}
                    </span>
                  </div>

                  <div class="info-item">
                    <span class="label">Created Date</span>
                    <span class="value">
                      {{ customerFacade.selectedCustomer()?.createdDate | date:'medium' }}
                    </span>
                  </div>

                  <div class="info-item">
                    <span class="label">Last Updated</span>
                    <span class="value">
                      {{ customerFacade.selectedCustomer()?.updatedDate | date:'medium' }}
                    </span>
                  </div>

                  @if (customerFacade.selectedCustomer()?.notes) {
                    <div class="info-item full-width">
                      <span class="label">Notes</span>
                      <span class="value">{{ customerFacade.selectedCustomer()?.notes }}</span>
                    </div>
                  }
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Search Criteria Card -->
            <mat-card class="content-card">
              <mat-card-header>
                <mat-card-title>Property Search Criteria</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                @if (customerFacade.searchCriteria()) {
                  <div class="info-grid">
                    @if (customerFacade.searchCriteria()?.minPrice || customerFacade.searchCriteria()?.maxPrice) {
                      <div class="info-item">
                        <span class="label">Price Range</span>
                        <span class="value">
                          {{ customerFacade.searchCriteria()?.minPrice ? ('$' + customerFacade.searchCriteria()?.minPrice) : 'Any' }}
                          -
                          {{ customerFacade.searchCriteria()?.maxPrice ? ('$' + customerFacade.searchCriteria()?.maxPrice) : 'Any' }}
                        </span>
                      </div>
                    }

                    @if (customerFacade.searchCriteria()?.minBedrooms || customerFacade.searchCriteria()?.maxBedrooms) {
                      <div class="info-item">
                        <span class="label">Bedrooms</span>
                        <span class="value">
                          {{ customerFacade.searchCriteria()?.minBedrooms || 'Any' }}
                          -
                          {{ customerFacade.searchCriteria()?.maxBedrooms || 'Any' }}
                        </span>
                      </div>
                    }

                    @if (customerFacade.searchCriteria()?.city) {
                      <div class="info-item">
                        <span class="label">City</span>
                        <span class="value">{{ customerFacade.searchCriteria()?.city }}</span>
                      </div>
                    }

                    @if (customerFacade.searchCriteria()?.propertyType) {
                      <div class="info-item">
                        <span class="label">Property Type</span>
                        <span class="value">{{ customerFacade.searchCriteria()?.propertyType }}</span>
                      </div>
                    }

                    @if (customerFacade.searchCriteria()?.mustHaveGarage !== null && customerFacade.searchCriteria()?.mustHaveGarage !== undefined) {
                      <div class="info-item">
                        <span class="label">Garage Required</span>
                        <span class="value">{{ customerFacade.searchCriteria()?.mustHaveGarage ? 'Yes' : 'No' }}</span>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="no-criteria">
                    <mat-icon>search_off</mat-icon>
                    <p>No search criteria set yet</p>
                    <button mat-raised-button color="primary" (click)="editCustomer()">
                      Set Search Criteria
                    </button>
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        }

        @if (!customerFacade.loading() && !customerFacade.selectedCustomer()) {
          <mat-card class="content-card">
            <mat-card-content>
              <div class="no-data">
                <mat-icon>person_off</mat-icon>
                <h2>Customer not found</h2>
                <p>The requested customer could not be found.</p>
                <button mat-raised-button color="primary" (click)="goBack()">
                  Back to List
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </main>
    </div>
  `,
  styles: [`
    .page-layout {
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 24px;
      min-height: 100vh;
      padding: 24px;
      background: #fafafa;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .page-header h1 {
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .header-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      gap: 16px;
      background: white;
      border-radius: 8px;
    }

    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .content-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .content-card mat-card-header {
      padding: 16px 16px 0;
    }

    .content-card mat-card-title {
      font-size: 1.25rem;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item .label {
      font-size: 0.875rem;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 500;
    }

    .info-item .value {
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.87);
    }

    .no-criteria,
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      text-align: center;
    }

    .no-criteria mat-icon,
    .no-data mat-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: rgba(0, 0, 0, 0.26);
      margin-bottom: 16px;
    }

    .no-criteria h2,
    .no-data h2 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      font-weight: 400;
    }

    .no-criteria p,
    .no-data p {
      margin: 0 0 24px 0;
      color: rgba(0, 0, 0, 0.6);
    }

    @media (max-width: 768px) {
      .page-layout {
        padding: 16px;
        gap: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header-left {
        justify-content: center;
      }

      .header-actions {
        flex-direction: column;
        width: 100%;
      }

      .header-actions button {
        width: 100%;
        justify-content: center;
      }

      .cards-container {
        grid-template-columns: 1fr;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CustomerDetail implements OnInit, OnDestroy {
  protected readonly customerFacade = inject(CustomerFacadeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  customerId?: number;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.customerId = +params['id'];
        this.customerFacade.loadCustomer(this.customerId);
        this.customerFacade.loadSearchCriteria(this.customerId);
      }
    });
  }

  ngOnDestroy(): void {
    this.customerFacade.clearSelectedCustomer();
  }

  editCustomer(): void {
    if (this.customerId) {
      this.router.navigate(['/customers/edit', this.customerId]);
    }
  }

  deleteCustomer(): void {
    if (this.customerId && confirm('Are you sure you want to delete this customer?')) {
      this.customerFacade.deleteCustomer(this.customerId);
    }
  }

  viewMatches(): void {
    if (this.customerId) {
      this.router.navigate(['/customers', this.customerId, 'matches']);
    }
  }

  goBack(): void {
    this.router.navigate(['/customers/list']);
  }
}
