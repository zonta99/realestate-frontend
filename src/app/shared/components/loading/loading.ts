// src/app/shared/components/loading/loading.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export type LoadingType = 'spinner' | 'bar' | 'dots' | 'pulse';
export type LoadingSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule],
  template: `
    <div class="loading-container"
         [class.fullscreen]="fullscreen"
         [class.overlay]="overlay"
         [attr.aria-label]="message || 'Loading'">

      @switch (type) {
        @case ('spinner') {
          <mat-spinner
            [diameter]="spinnerSize"
            [strokeWidth]="strokeWidth">
          </mat-spinner>
        }
        @case ('bar') {
          <div class="progress-container">
            <mat-progress-bar
              mode="indeterminate"
              [color]="color">
            </mat-progress-bar>
          </div>
        }
        @case ('dots') {
          <div class="loading-dots" [class]="'size-' + size">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        }
        @case ('pulse') {
          <div class="loading-pulse" [class]="'size-' + size">
            <div class="pulse-circle"></div>
          </div>
        }
      }

      @if (message) {
        <p class="loading-message" [class]="'size-' + size">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--app-spacing-md);
      padding: var(--app-spacing-lg);
      background-color: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      border-radius: var(--app-border-radius);
    }

    .loading-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      background-color: var(--mat-sys-background);
      backdrop-filter: blur(2px);
    }

    .loading-container.overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--mat-sys-scrim);
      backdrop-filter: blur(2px);
    }

    .progress-container {
      width: 200px;
      max-width: 80vw;
    }

    .loading-message {
      margin: 0;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
    }

    .loading-message.size-small {
      font-family: var(--mat-sys-typescale-body-small-font-family-name);
      font-size: var(--mat-sys-typescale-body-small-font-size);
      line-height: var(--mat-sys-typescale-body-small-line-height);
    }

    .loading-message.size-medium {
      font-family: var(--mat-sys-typescale-body-medium-font-family-name);
      font-size: var(--mat-sys-typescale-body-medium-font-size);
      line-height: var(--mat-sys-typescale-body-medium-line-height);
    }

    .loading-message.size-large {
      font-family: var(--mat-sys-typescale-body-large-font-family-name);
      font-size: var(--mat-sys-typescale-body-large-font-size);
      line-height: var(--mat-sys-typescale-body-large-line-height);
    }

    /* Custom Dots Animation */
    .loading-dots {
      display: flex;
      gap: var(--app-spacing-xs);
    }

    .loading-dots.size-small .dot {
      width: 6px;
      height: 6px;
    }

    .loading-dots.size-medium .dot {
      width: 8px;
      height: 8px;
    }

    .loading-dots.size-large .dot {
      width: 12px;
      height: 12px;
    }

    .dot {
      border-radius: 50%;
      background-color: var(--mat-sys-primary);
      animation: loading-dots 1.4s infinite ease-in-out both;
    }

    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    .dot:nth-child(3) { animation-delay: 0s; }

    @keyframes loading-dots {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Custom Pulse Animation */
    .loading-pulse {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-pulse.size-small .pulse-circle {
      width: 30px;
      height: 30px;
    }

    .loading-pulse.size-medium .pulse-circle {
      width: 40px;
      height: 40px;
    }

    .loading-pulse.size-large .pulse-circle {
      width: 60px;
      height: 60px;
    }

    .pulse-circle {
      border-radius: 50%;
      background-color: var(--mat-sys-primary);
      animation: pulse 2s infinite ease-in-out;
    }

    .pulse-circle::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background-color: var(--mat-sys-primary);
      animation: pulse-ring 2s infinite ease-out;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(0.8);
        opacity: 0.7;
      }
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(1);
        opacity: 0.8;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .loading-container {
        padding: var(--app-spacing-md);
        gap: var(--app-spacing-sm);
      }

      .progress-container {
        width: 150px;
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .dot,
      .pulse-circle {
        border: 2px solid var(--mat-sys-on-surface);
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .dot,
      .pulse-circle,
      .pulse-circle::before {
        animation-duration: 3s;
      }

      mat-spinner {
        animation-duration: 3s;
      }
    }
  `]
})
export class LoadingComponent {
  @Input() type: LoadingType = 'spinner';
  @Input() size: LoadingSize = 'medium';
  @Input() message?: string;
  @Input() fullscreen: boolean = false;
  @Input() overlay: boolean = false;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';

  get spinnerSize(): number {
    switch (this.size) {
      case 'small': return 30;
      case 'large': return 60;
      default: return 40;
    }
  }

  get strokeWidth(): number {
    switch (this.size) {
      case 'small': return 3;
      case 'large': return 5;
      default: return 4;
    }
  }
}
