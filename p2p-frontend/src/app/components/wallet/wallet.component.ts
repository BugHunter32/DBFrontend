import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { Wallet, WalletTransaction, WithdrawableBalance, WalletService } from '../../services/wallet.service';
import { DepositModalComponent } from '../deposit-modal/deposit-modal.component';
import { WithdrawModalComponent } from '../withdraw-modal/withdraw-modal.component';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TransactionHistoryComponent,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  wallet?: Wallet;
  withdrawableBalance?: WithdrawableBalance;
  transactions: WalletTransaction[] = [];
  isLoading = true;

  constructor(
    private walletService: WalletService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadWalletData();
  }

  loadWalletData(): void {
    this.isLoading = true;
    forkJoin({
      wallet: this.walletService.getWallet(),
      withdrawable: this.walletService.getWithdrawableBalance(),
      transactions: this.walletService.getTransactions()
    }).subscribe({
      next: (data) => {
        this.wallet = data.wallet;
        this.withdrawableBalance = data.withdrawable;
        this.transactions = data.transactions;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load wallet data.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  openDepositDialog(): void {
    const dialogRef = this.dialog.open(DepositModalComponent);
    dialogRef.afterClosed().subscribe(amount => {
      if (amount) {
        this.walletService.deposit(amount).subscribe(() => this.handleSuccess('Deposit successful!'));
      }
    });
  }

  openWithdrawDialog(): void {
    const dialogRef = this.dialog.open(WithdrawModalComponent, {
      data: { maxAmount: this.withdrawableBalance?.withdrawableAmount }
    });
    dialogRef.afterClosed().subscribe(amount => {
      if (amount) {
        this.walletService.withdraw(amount).subscribe(() => this.handleSuccess('Withdrawal successful!'));
      }
    });
  }

  private handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 2000 });
    this.loadWalletData();
  }
}