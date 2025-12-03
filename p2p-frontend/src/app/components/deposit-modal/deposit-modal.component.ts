import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-deposit-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h1 mat-dialog-title>Deposit Funds</h1>
    <div mat-dialog-content [formGroup]="form">
      <p>Enter the amount you wish to deposit into your wallet.</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Amount</mat-label>
        <input matInput type="number" formControlName="amount" placeholder="e.g., 500.00" min="1">
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="form.value.amount" [disabled]="form.invalid">Confirm Deposit</button>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class DepositModalComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DepositModalComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}