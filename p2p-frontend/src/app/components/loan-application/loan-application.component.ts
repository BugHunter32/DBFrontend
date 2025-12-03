import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider'; // For a better term selector
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoanService } from '../../services/loan.service';
import { CurrencyPipe } from '@angular/common'; // For formatting slider value

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // CurrencyPipe, // Add CurrencyPipe here
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSliderModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './loan-application.component.html',
  styleUrls: ['./loan-application.component.scss']
})
export class LoanApplicationComponent {
  applicationForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.applicationForm = this.fb.group({
      // Set a default value for better UX
      amount: [5000, [Validators.required, Validators.min(500), Validators.max(50000)]],
      // Set a default value
      term: [24, [Validators.required, Validators.min(6), Validators.max(60)]]
    });
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { amount, term } = this.applicationForm.value;

    // The non-null assertion operator (!) tells TypeScript we are sure these values are not null
    this.loanService.applyForLoan(amount!, term!).subscribe({
      next: () => {
        this.snackBar.open('Loan application submitted successfully! It is now pending review.', 'Close', { 
          duration: 5000 
        });
        // Navigate to the dashboard where they can see the new application's status
        this.router.navigate(['/my-loans']);
        this.isSubmitting = false;
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to submit application.', 'Close', { 
          duration: 3000 
        });
        this.isSubmitting = false;
      }
    });
  }

  // Helper to format the slider's thumb label
  formatLabel(value: number): string {
    return `${value} months`;
  }
}