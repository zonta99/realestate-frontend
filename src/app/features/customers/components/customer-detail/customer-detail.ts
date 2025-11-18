// src/app/features/customers/components/customer-detail/customer-detail.ts
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerFacadeService } from '../../services';

@Component({
  selector: 'app-customer-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <mat-toolbar color="primary" style="display: flex; justify-content: space-between; align-items: center">
      <div style="display: flex; align-items: center; gap: 8px">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Customer Details</span>
      </div>
      <div style="display: flex; gap: 8px">
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
    </mat-toolbar>

    <div style="padding: 24px">
      @if (customerFacade.loading()) {
        <mat-card style="text-align: center; padding: 48px">
          <mat-card-content>
            <mat-spinner diameter="50" style="margin: 0 auto 16px"></mat-spinner>
            <p>Loading customer details...</p>
          </mat-card-content>
        </mat-card>
      }

      @if (!customerFacade.loading() && customerFacade.selectedCustomer()) {
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px">
          <!-- Basic Information Card -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Basic Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div style="display: grid; gap: 16px">
                <div>
                  <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Name</div>
                  <div>{{ customerFacade.selectedCustomer()?.firstName }} {{ customerFacade.selectedCustomer()?.lastName }}</div>
                </div>

                <div>
                  <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Email</div>
                  <div>{{ customerFacade.selectedCustomer()?.email }}</div>
                </div>

                <div>
                  <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Phone</div>
                  <div>{{ customerFacade.selectedCustomer()?.phone }}</div>
                </div>

                <div>
                  <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Status</div>
                  <mat-chip [highlighted]="customerFacade.selectedCustomer()?.status === 'ACTIVE'">
                    {{ customerFacade.selectedCustomer()?.status }}
                  </mat-chip>
                </div>

                <div>
                  <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Assigned Agent</div>
                  <div>{{ customerFacade.selectedCustomer()?.agentName || 'Unassigned' }}</div>
                </div>

                <div>
                  <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Created Date</div>
                  <div>{{ customerFacade.selectedCustomer()?.createdDate | date:'medium' }}</div>
                </div>

                <div>
                  <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Last Updated</div>
                  <div>{{ customerFacade.selectedCustomer()?.updatedDate | date:'medium' }}</div>
                </div>

                @if (customerFacade.selectedCustomer()?.notes) {
                  <div>
                    <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Notes</div>
                    <div>{{ customerFacade.selectedCustomer()?.notes }}</div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Search Criteria Card -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Property Search Criteria</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @if (customerFacade.searchCriteria()) {
                <div style="display: grid; gap: 16px">
                  @if (customerFacade.searchCriteria()?.minPrice || customerFacade.searchCriteria()?.maxPrice) {
                    <div>
                      <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Price Range</div>
                      <div>
                        {{ customerFacade.searchCriteria()?.minPrice ? ('$' + customerFacade.searchCriteria()?.minPrice) : 'Any' }}
                        -
                        {{ customerFacade.searchCriteria()?.maxPrice ? ('$' + customerFacade.searchCriteria()?.maxPrice) : 'Any' }}
                      </div>
                    </div>
                  }

                  @if (customerFacade.searchCriteria()?.minBedrooms || customerFacade.searchCriteria()?.maxBedrooms) {
                    <div>
                      <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Bedrooms</div>
                      <div>
                        {{ customerFacade.searchCriteria()?.minBedrooms || 'Any' }}
                        -
                        {{ customerFacade.searchCriteria()?.maxBedrooms || 'Any' }}
                      </div>
                    </div>
                  }

                  @if (customerFacade.searchCriteria()?.city) {
                    <div>
                      <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">City</div>
                      <div>{{ customerFacade.searchCriteria()?.city }}</div>
                    </div>
                  }

                  @if (customerFacade.searchCriteria()?.propertyType) {
                    <div>
                      <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Property Type</div>
                      <div>{{ customerFacade.searchCriteria()?.propertyType }}</div>
                    </div>
                  }

                  @if (customerFacade.searchCriteria()?.mustHaveGarage !== null && customerFacade.searchCriteria()?.mustHaveGarage !== undefined) {
                    <div>
                      <div style="font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 4px">Garage Required</div>
                      <div>{{ customerFacade.searchCriteria()?.mustHaveGarage ? 'Yes' : 'No' }}</div>
                    </div>
                  }
                </div>
              } @else {
                <div style="text-align: center; padding: 24px">
                  <mat-icon style="font-size: 48px; width: 48px; height: 48px; color: rgba(0,0,0,0.26)">search_off</mat-icon>
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
        <mat-card>
          <mat-card-content style="text-align: center; padding: 48px">
            <mat-icon style="font-size: 48px; width: 48px; height: 48px; color: rgba(0,0,0,0.26); margin-bottom: 16px">person_off</mat-icon>
            <h2 style="margin: 0 0 8px">Customer not found</h2>
            <p>The requested customer could not be found.</p>
            <button mat-raised-button color="primary" (click)="goBack()">
              Back to List
            </button>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: []
})
export class CustomerDetail implements OnInit, OnDestroy {
  protected readonly customerFacade = inject(CustomerFacadeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
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
