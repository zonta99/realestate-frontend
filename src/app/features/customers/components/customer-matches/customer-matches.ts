// src/app/features/customers/components/customer-matches/customer-matches.ts
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chip';
import { MatBadgeModule } from '@angular/material/badge';
import { CustomerFacadeService } from '../../services';

@Component({
  selector: 'app-customer-matches',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule
  ],
  template: `
    <div class="page-layout">
      <header class="page-header">
        <div class="header-left">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="mat-headline-4">Property Matches</h1>
          @if (customerFacade.matches()) {
            <mat-chip highlighted>
              {{ customerFacade.matches()?.totalMatches }} matches found
            </mat-chip>
          }
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="refreshMatches()">
            <mat-icon>refresh</mat-icon>
            Refresh Matches
          </button>
        </div>
      </header>

      <main class="page-content">
        @if (customerFacade.loadingMatches()) {
          <div class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Finding matching properties...</p>
          </div>
        }

        @if (!customerFacade.loadingMatches() && customerFacade.matches()) {
          <div class="customer-info">
            <mat-card>
              <mat-card-content>
                <div class="customer-header">
                  <div>
                    <h3>Customer: {{ customerFacade.matches()?.customerName }}</h3>
                    <p>Showing properties that match search criteria</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          @if (customerFacade.matches()?.matches && customerFacade.matches()!.matches.length > 0) {
            <div class="matches-grid">
              @for (match of customerFacade.matches()!.matches; track match.propertyId) {
                <mat-card class="match-card" (click)="viewProperty(match.propertyId)">
                  <mat-card-header>
                    <mat-card-title>
                      <div class="title-with-score">
                        {{ match.title }}
                        <mat-chip [highlighted]="match.matchScore >= 80">
                          {{ match.matchScore }}% Match
                        </mat-chip>
                      </div>
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="property-details">
                      <div class="detail-item">
                        <mat-icon>attach_money</mat-icon>
                        <span class="price">\${{ match.price?.toLocaleString() }}</span>
                      </div>

                      @if (match.bedrooms) {
                        <div class="detail-item">
                          <mat-icon>bed</mat-icon>
                          <span>{{ match.bedrooms }} Bedrooms</span>
                        </div>
                      }

                      @if (match.city) {
                        <div class="detail-item">
                          <mat-icon>location_on</mat-icon>
                          <span>{{ match.city }}</span>
                        </div>
                      }
                    </div>

                    <div class="match-score-bar">
                      <div
                        class="score-fill"
                        [style.width.%]="match.matchScore"
                        [class.high-score]="match.matchScore >= 80"
                        [class.medium-score]="match.matchScore >= 60 && match.matchScore < 80"
                        [class.low-score]="match.matchScore < 60">
                      </div>
                    </div>
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button color="primary" (click)="viewProperty(match.propertyId); $event.stopPropagation()">
                      <mat-icon>visibility</mat-icon>
                      View Details
                    </button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          } @else {
            <mat-card>
              <mat-card-content>
                <div class="no-matches">
                  <mat-icon>home_off</mat-icon>
                  <h2>No matching properties found</h2>
                  <p>There are no properties currently matching the customer's search criteria.</p>
                  <div class="no-matches-actions">
                    <button mat-raised-button color="primary" (click)="editCustomer()">
                      <mat-icon>edit</mat-icon>
                      Edit Search Criteria
                    </button>
                    <button mat-button (click)="goBack()">
                      <mat-icon>arrow_back</mat-icon>
                      Back to Customer
                    </button>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          }
        }

        @if (!customerFacade.loadingMatches() && !customerFacade.matches()) {
          <mat-card>
            <mat-card-content>
              <div class="no-data">
                <mat-icon>search_off</mat-icon>
                <h2>No search criteria set</h2>
                <p>Please set search criteria for this customer to find matching properties.</p>
                <button mat-raised-button color="primary" (click)="editCustomer()">
                  <mat-icon>settings</mat-icon>
                  Set Search Criteria
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

    .customer-info mat-card {
      background: white;
      border-radius: 8px;
    }

    .customer-header h3 {
      margin: 0 0 4px 0;
      font-size: 1.25rem;
      font-weight: 500;
    }

    .customer-header p {
      margin: 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.875rem;
    }

    .matches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .match-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      background: white;
      border-radius: 8px;
    }

    .match-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .title-with-score {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .property-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 16px 0;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(0, 0, 0, 0.87);
    }

    .detail-item mat-icon {
      color: rgba(0, 0, 0, 0.54);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .detail-item .price {
      font-size: 1.25rem;
      font-weight: 500;
      color: #1976d2;
    }

    .match-score-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 12px;
    }

    .score-fill {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 4px;
    }

    .score-fill.high-score {
      background: linear-gradient(90deg, #4caf50, #66bb6a);
    }

    .score-fill.medium-score {
      background: linear-gradient(90deg, #ff9800, #ffb74d);
    }

    .score-fill.low-score {
      background: linear-gradient(90deg, #f44336, #ef5350);
    }

    mat-card-actions {
      padding: 8px 16px;
      display: flex;
      justify-content: flex-end;
    }

    .no-matches,
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
    }

    .no-matches mat-icon,
    .no-data mat-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: rgba(0, 0, 0, 0.26);
      margin-bottom: 16px;
    }

    .no-matches h2,
    .no-data h2 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      font-weight: 400;
    }

    .no-matches p,
    .no-data p {
      margin: 0 0 24px 0;
      color: rgba(0, 0, 0, 0.6);
    }

    .no-matches-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .no-matches-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
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
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .header-actions {
        width: 100%;
      }

      .header-actions button {
        width: 100%;
        justify-content: center;
      }

      .matches-grid {
        grid-template-columns: 1fr;
      }

      .no-matches-actions {
        flex-direction: column;
        width: 100%;
      }

      .no-matches-actions button {
        width: 100%;
      }
    }
  `]
})
export class CustomerMatches implements OnInit, OnDestroy {
  protected readonly customerFacade = inject(CustomerFacadeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  customerId?: number;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.customerId = +params['id'];
        this.loadMatches();
      }
    });
  }

  ngOnDestroy(): void {
    this.customerFacade.clearMatches();
  }

  loadMatches(): void {
    if (this.customerId) {
      this.customerFacade.loadMatches(this.customerId);
    }
  }

  refreshMatches(): void {
    this.loadMatches();
  }

  viewProperty(propertyId: number): void {
    this.router.navigate(['/properties', propertyId]);
  }

  editCustomer(): void {
    if (this.customerId) {
      this.router.navigate(['/customers/edit', this.customerId]);
    }
  }

  goBack(): void {
    if (this.customerId) {
      this.router.navigate(['/customers/view', this.customerId]);
    } else {
      this.router.navigate(['/customers/list']);
    }
  }
}
