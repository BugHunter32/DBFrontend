import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { WalletTransaction } from '../../services/wallet.service';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe, // For formatting numbers as currency
    DatePipe,     // For formatting dates
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent {
  // Use @Input setters to react to data changes if needed,
  // but for now, we'll just bind directly.
  @Input() transactions: WalletTransaction[] = [];
  @Input() isLoading: boolean = false;

  constructor() { }

  /**
   * Helper method to get display properties for a transaction type.
   * This keeps the logic out of the template.
   * @param txType The transaction type string from the backend.
   * @returns An object with an icon name and a color class.
   */
  getTransactionDisplay(txType: string): { icon: string; colorClass: string } {
    const isCredit = [
      'DEPOSIT', 'LOAN_DISBURSEMENT', 'STOCK_SALE', 'REPAYMENT_DISTRIBUTION'
    ].includes(txType);

    const isDebit = [
      'WITHDRAWAL', 'LOAN_REPAYMENT', 'STOCK_PURCHASE', 'LOAN_INVESTMENT_PLEDGE'
    ].includes(txType);
    
    let icon = 'receipt_long'; // Default icon
    let colorClass = isCredit ? 'credit' : (isDebit ? 'debit' : 'neutral');

    // Assign specific icons based on type
    switch (txType) {
      case 'DEPOSIT':
        icon = 'add_circle';
        break;
      case 'WITHDRAWAL':
        icon = 'remove_circle';
        break;
      case 'STOCK_PURCHASE':
        icon = 'shopping_cart';
        break;
      case 'STOCK_SALE':
        icon = 'sell';
        break;
      case 'LOAN_INVESTMENT_PLEDGE':
        icon = 'lock_clock';
        break;
      case 'LOAN_DISBURSEMENT':
        icon = 'paid';
        break;
      case 'LOAN_REPAYMENT':
        icon = 'payment';
        break;
      case 'REPAYMENT_DISTRIBUTION':
        icon = 'savings';
        break;
    }

    return { icon, colorClass };
  }
}