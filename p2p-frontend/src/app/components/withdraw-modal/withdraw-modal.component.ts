import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-withdraw-modal',
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
    <h1 mat-dialog-title>Withdraw Funds</h1>
    <div mat-dialog-content [formGroup]="form">
      <p>Your maximum withdrawable amount is <strong>{{ data.maxAmount | currency:'USD' }}</strong>.</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Amount</mat-label>
        <input matInput type="number" formControlName="amount" placeholder="e.g., 100.00">
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="accent" [mat-dialog-close]="form.value.amount" [disabled]="form.invalid">Confirm Withdrawal</button>
    </div>
  `,
  styles: ['.full-width { width: 100%; }']
})
export class WithdrawModalComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<WithdrawModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { maxAmount: number },
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01), Validators.max(this.data.maxAmount)]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}