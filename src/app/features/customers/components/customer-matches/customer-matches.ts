// src/app/features/customers/components/customer-matches/customer-matches.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-matches',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-layout">
      <header class="page-header">
        <h1 class="mat-headline-4">Property Matches</h1>
        <div class="header-actions">
          <button mat-button>
            <mat-icon>arrow_back</mat-icon>
            Back to Customer
          </button>
        </div>
      </header>

      <main class="page-content">
        <mat-card class="content-card">
          <mat-card-content>
            <p>Customer property matches will be shown here...</p>
            <p>This will implement the matching algorithm.</p>
          </mat-card-content>
        </mat-card>
      </main>
    </div>
  `,
  styles: [`
    /* Modern CSS Grid layout using Material Design 3 tokens */
    .page-layout {
      display: grid;
      grid-template-rows: auto 1fr;
      gap: var(--mat-sys-spacing-lg);
      min-height: 100vh;
      padding: var(--mat-sys-spacing-lg);
      background: var(--mat-sys-background);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--mat-sys-spacing-md);
      background: var(--mat-sys-surface-container);
      border-radius: var(--mat-sys-shape-corner-medium);
      box-shadow: var(--mat-sys-elevation-1);
    }

    .page-header h1 {
      margin: 0;
      color: var(--mat-sys-on-surface);
      font-family: var(--mat-sys-typescale-headline-medium-font-family-name);
      font-size: var(--mat-sys-typescale-headline-medium-font-size);
      font-weight: var(--mat-sys-typescale-headline-medium-font-weight);
    }

    .header-actions {
      display: flex;
      gap: var(--mat-sys-spacing-sm);
    }

    .header-actions button {
      display: flex;
      align-items: center;
      gap: var(--mat-sys-spacing-xs);
      height: 40px;
      border-radius: var(--mat-sys-shape-corner-medium);
      font-family: var(--mat-sys-typescale-label-large-font-family-name);
      font-size: var(--mat-sys-typescale-label-large-font-size);
      color: var(--mat-sys-on-surface);
    }

    .page-content {
      display: flex;
      flex-direction: column;
      gap: var(--mat-sys-spacing-md);
    }

    .content-card {
      background: var(--mat-sys-surface-container);
      border-radius: var(--mat-sys-shape-corner-medium);
      box-shadow: var(--mat-sys-elevation-1);
    }

    .content-card mat-card-content {
      padding: var(--mat-sys-spacing-lg);
      color: var(--mat-sys-on-surface);
      font-family: var(--mat-sys-typescale-body-medium-font-family-name);
      font-size: var(--mat-sys-typescale-body-medium-font-size);
      line-height: var(--mat-sys-typescale-body-medium-line-height);
    }

    /* Responsive design using container queries */
    @container (max-width: 768px) {
      .page-layout {
        padding: var(--mat-sys-spacing-md);
        gap: var(--mat-sys-spacing-md);
      }

      .page-header {
        flex-direction: column;
        gap: var(--mat-sys-spacing-md);
        align-items: stretch;
      }

      .header-actions button {
        width: 100%;
        justify-content: center;
      }

      .page-header h1 {
        text-align: center;
        font-size: var(--mat-sys-typescale-headline-small-font-size);
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: more) {
      .page-header {
        border: 2px solid var(--mat-sys-outline);
      }

      .content-card {
        border: 2px solid var(--mat-sys-outline);
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .page-layout,
      .page-header,
      .content-card {
        transition: none;
      }
    }
  `]
})
export class CustomerMatches {}

