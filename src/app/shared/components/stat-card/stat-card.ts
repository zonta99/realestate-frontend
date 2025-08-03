// src/app/shared/components/stat-card/stat-card.ts - Reusable stat card component
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export interface StatCardData {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';
}

@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './stat-card.html',
  styleUrls: ['./stat-card.css']
})
export class StatCard {
  @Input() data!: StatCardData;
  @Input() clickable = false;

  getColorClass(): string {
    return this.data.color || 'primary';
  }

  getTrendIcon(): string {
    if (!this.data.trend) return '';
    return this.data.trend.isPositive ? 'trending_up' : 'trending_down';
  }

  getTrendClass(): string {
    if (!this.data.trend) return '';
    return this.data.trend.isPositive ? 'positive' : 'negative';
  }
} 