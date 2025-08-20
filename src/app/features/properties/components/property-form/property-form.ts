// src/app/features/properties/components/property-form/property-form.ts
import { Component, ChangeDetectionStrategy, inject, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
import { PropertyActions } from '../../store/property.actions';
import { selectCreating, selectError } from '../../store/property.selectors';

@Component({
  selector: 'app-property-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './property-form.html',
  styleUrl: './property-form.scss',
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
    MatToolbarModule
  ]
})
export class PropertyFormComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  // Signals for reactive state
  creating = this.store.selectSignal(selectCreating);
  error = this.store.selectSignal(selectError);

  // Reactive form
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

  onSubmit(): void {
    if (this.propertyForm.valid && !this.creating()) {
      const formValue = this.propertyForm.getRawValue();
      this.store.dispatch(PropertyActions.createProperty({
        property: {
          title: formValue.title!,
          description: formValue.description!,
          price: formValue.price!
        }
      }));
    }
  }

  resetForm(): void {
    this.propertyForm.reset();
    this.store.dispatch(PropertyActions.clearError());
  }

  goBack(): void {
    this.router.navigate(['/properties']);
  }
}

// Export alias for consistency
export { PropertyFormComponent as PropertyForm };
