import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RoboAdvisorService, RoboAdvisorStrategy } from '../../services/robo-advisor.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-robo-advisor-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './robo-advisor-settings.component.html',
  styleUrls: ['./robo-advisor-settings.component.scss']
})
export class RoboAdvisorSettingsComponent implements OnInit {
  strategyForm: FormGroup;
  isLoading = true;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private roboAdvisorService: RoboAdvisorService,
    private snackBar: MatSnackBar
  ) {
    // Initialize the form structure
    this.strategyForm = this.fb.group({
      active: [false],
      maxInvestmentPerLoan: [100, [Validators.required, Validators.min(10)]],
      riskScores: this.fb.group({
        A: [true],
        B: [true],
        C: [false]
      }),
      minInterestRate: [null, [Validators.min(0), Validators.max(50)]],
      maxLoanTerm: [null, [Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadStrategy();
  }

  loadStrategy(): void {
    this.isLoading = true;
    this.roboAdvisorService.getStrategy().pipe(
      // If a 404 is returned (no strategy exists), continue with null
      catchError(error => of(null))
    ).subscribe(strategy => {
      if (strategy) {
        // If a strategy exists, patch the form with its values
        this.strategyForm.patchValue({
          active: strategy.active,
          maxInvestmentPerLoan: strategy.maxInvestmentPerLoan,
          minInterestRate: strategy.minInterestRate,
          maxLoanTerm: strategy.maxLoanTerm,
          riskScores: {
            A: strategy.riskScores.includes('A'),
            B: strategy.riskScores.includes('B'),
            C: strategy.riskScores.includes('C'),
          }
        });
      }
      this.isLoading = false;
    });
  }

  onSubmit(): void {
    if (this.strategyForm.invalid) {
      this.strategyForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.strategyForm.value;

    // Convert the riskScores form group into an array of strings
    const selectedRiskScores = Object.keys(formValue.riskScores!)
      .filter(key => (formValue.riskScores as any)[key]);

    const strategyData: Partial<RoboAdvisorStrategy> = {
      active: formValue.active!,
      maxInvestmentPerLoan: formValue.maxInvestmentPerLoan!,
      riskScores: selectedRiskScores as ('A' | 'B' | 'C')[],
      minInterestRate: formValue.minInterestRate,
      maxLoanTerm: formValue.maxLoanTerm
    };

    this.roboAdvisorService.saveStrategy(strategyData).subscribe({
      next: () => {
        this.snackBar.open('Robo-Advisor strategy saved successfully!', 'Close', { duration: 3000 });
        this.isSaving = false;
        this.strategyForm.markAsPristine(); // Mark form as unchanged
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to save strategy.', 'Close', { duration: 3000 });
        this.isSaving = false;
      }
    });
  }
}