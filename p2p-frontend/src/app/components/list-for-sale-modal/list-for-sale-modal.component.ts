import { Component, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// --- Required Angular Material Modules ---
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Interface to define the data passed into this modal
export interface ListForSaleModalData {
  investmentId: string;
  amountInvested: number;
}

@Component({
  selector: 'app-list-for-sale-modal',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  // The HTML template is defined directly here for simplicity
  template: `
    <h1 mat-dialog-title>List Investment for Sale</h1>

    <div mat-dialog-content [formGroup]="form">
      <p>
        You are listing your investment of <strong>{{ data.amountInvested | currency:'USD' }}</strong> for sale on the secondary market.
      </p>
      <p>
        Set your desired asking price. You can list it at a premium (a higher price to make a profit now) or at a discount (a lower price to sell it faster).
      </p>
      
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Asking Price</mat-label>
        <span matPrefix>$ &nbsp;</span>
        <input matInput type="number" formControlName="price" placeholder="e.g., 95.50" required>
        <mat-error *ngIf="form.get('price')?.hasError('required')">
          Price is required.
        </mat-error>
        <mat-error *ngIf="form.get('price')?.hasError('min')">
          Price must be greater than zero.
        </mat-error>
      </mat-form-field>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="form.value.price" [disabled]="form.invalid">
        <mat-icon>storefront</mat-icon>
        Confirm Listing
      </button>
    </div>
  `,
  // The CSS styles are defined directly here
  styles: [`
    .full-width {
      width: 100%;
      margin-top: 16px;
    }

    p {
      line-height: 1.5;
    }

    button mat-icon {
        margin-right: 8px;
    }
  `]
})
export class ListForSaleModalComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ListForSaleModalComponent>,
    // Injects the data passed from the parent component (MyLoansComponent)
    @Inject(MAT_DIALOG_DATA) public data: ListForSaleModalData,
    private fb: FormBuilder
  ) {
       const initialPrice = data?.amountInvested || null;

    // Initialize the form inside the constructor
    this.form = this.fb.group({
      // The initial value is being set here
      price: [data.amountInvested, [Validators.required, Validators.min(0.01)]]
    });
  }

  /**
   * Closes the dialog without returning any data.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}