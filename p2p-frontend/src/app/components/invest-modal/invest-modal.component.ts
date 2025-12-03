import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface InvestModalData {
  maxAmount: number;
  currentFunding: number;
  amountRequested: number;
}

@Component({
  selector: 'app-invest-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h1 mat-dialog-title>Invest in Loan</h1>
    <div mat-dialog-content [formGroup]="form">
      <p>Amount Needed: <strong>{{ data.amountRequested - data.currentFunding | currency:'USD' }}</strong></p>
      <p>Your wallet balance allows you to invest up to <strong>{{ data.maxAmount | currency:'USD' }}</strong>.</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Investment Amount</mat-label>
        <input matInput type="number" formControlName="amount" placeholder="e.g., 250.00">
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="form.value.amount" [disabled]="form.invalid">Confirm Investment</button>
    </div>
  `,
  styles: ['.full-width { width: 100%; }']
})
export class InvestModalComponent {
  form: FormGroup; // <-- 1. DECLARE the form property here

  constructor(
    public dialogRef: MatDialogRef<InvestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InvestModalData,
    private fb: FormBuilder
  ) {
    // 2. INITIALIZE the form inside the constructor
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(10), Validators.max(this.data.maxAmount || 0)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}