import { Component, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// --- Required Angular Material Modules ---
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { Stock } from '../../services/market.service';

// Interface to define the shape of data passed into this modal
export interface TradeModalData {
  tradeType: 'BUY' | 'SELL';
  stock: Stock;
  maxSellQuantity?: number; // Only needed for 'SELL' orders
}

@Component({
  selector: 'app-trade-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  // --- Inline HTML Template ---
  template: `
    <h1 mat-dialog-title>
      {{ data.tradeType === 'BUY' ? 'Buy' : 'Sell' }} {{ data.stock.companyName }} ({{ data.stock.symbol }})
    </h1>

    <div mat-dialog-content [formGroup]="form">
      <div class="info-row">
        <span>Current Market Price:</span>
        <strong class="price">{{ data.stock.currentPrice | currency:'USD' }}</strong>
      </div>

      <div class="info-row" *ngIf="data.tradeType === 'SELL'">
        <span>Shares Owned:</span>
        <strong>{{ data.maxSellQuantity | number }}</strong>
      </div>

      <mat-divider></mat-divider>
      
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Quantity</mat-label>
        <input matInput type="number" formControlName="quantity" placeholder="e.g., 10" required>
        <mat-error *ngIf="form.get('quantity')?.hasError('required')">Quantity is required.</mat-error>
        <mat-error *ngIf="form.get('quantity')?.hasError('min')">Quantity must be positive.</mat-error>
        <mat-error *ngIf="form.get('quantity')?.hasError('max')">Cannot sell more shares than you own.</mat-error>
      </mat-form-field>
      
      <div class="total-summary" *ngIf="form.valid && form.value.quantity">
        <span>Estimated {{ data.tradeType === 'BUY' ? 'Cost' : 'Proceeds' }}:</span> 
        <strong [ngClass]="data.tradeType === 'BUY' ? 'cost' : 'proceeds'">
          {{ (data.stock.currentPrice * form.value.quantity) | currency:'USD' }}
        </strong>
      </div>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button [color]="data.tradeType === 'BUY' ? 'primary' : 'warn'" [mat-dialog-close]="form.value.quantity" [disabled]="form.invalid">
        <mat-icon>{{ data.tradeType === 'BUY' ? 'add_shopping_cart' : 'sell' }}</mat-icon>
        Confirm {{ data.tradeType }}
      </button>
    </div>
  `,
  // --- Inline CSS Styles ---
  styles: [`
    .full-width {
      width: 100%;
      margin-top: 20px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 1rem;
    }
    .price {
      font-weight: 500;
      font-size: 1.1rem;
    }
    .total-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2rem;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
    .cost {
      color: #d32f2f; /* Red */
      font-weight: bold;
    }
    .proceeds {
      color: #388e3c; /* Green */
      font-weight: bold;
    }
    button mat-icon {
        margin-right: 8px;
    }
  `]
})
export class TradeModalComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TradeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TradeModalData,
    private fb: FormBuilder
  ) {
    // Dynamically add a 'max' validator only if it's a 'SELL' order
    const maxValidator = this.data.tradeType === 'SELL'
      ? Validators.max(this.data.maxSellQuantity || 0)
      : null;

    this.form = this.fb.group({
      // Use an array of validators, filtering out the null one
      quantity: [null, [Validators.required, Validators.min(0.00000001)].filter(v => v !== null)]
    });
    
    // Add the max validator conditionally
    if (maxValidator) {
      this.form.get('quantity')?.addValidators(maxValidator);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}