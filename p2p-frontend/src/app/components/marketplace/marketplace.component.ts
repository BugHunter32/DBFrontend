import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Loan, LoanService } from '../../services/loan.service';
import { WalletService } from '../../services/wallet.service';
import { InvestModalComponent, InvestModalData } from '../invest-modal/invest-modal.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe,
    PercentPipe,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit {
  loans: Loan[] = [];
  isLoading = true;
  userWalletBalance = 0;

  constructor(
    private loanService: LoanService,
    private walletService: WalletService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMarketplaceData();
  }

  loadMarketplaceData(): void {
    this.isLoading = true;
    // Fetch both marketplace loans and the user's wallet balance in parallel
    forkJoin({
      loans: this.loanService.getMarketplace(),
      wallet: this.walletService.getWallet()
    }).subscribe({
      next: (data) => {
        this.loans = data.loans;
        this.userWalletBalance = data.wallet.balance;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load marketplace data.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  calculateFundingProgress(loan: Loan): number {
    if (!loan.amountRequested || loan.amountRequested === 0) {
      return 0;
    }
    return (loan.amountFunded / loan.amountRequested) * 100;
  }

  openInvestDialog(loan: Loan, event: MouseEvent): void {
    event.stopPropagation(); // Prevent card click-through

    const amountNeeded = loan.amountRequested - loan.amountFunded;
    const maxInvestment = Math.min(this.userWalletBalance, amountNeeded);

    const dialogData: InvestModalData = {
      maxAmount: maxInvestment,
      currentFunding: loan.amountFunded,
      amountRequested: loan.amountRequested
    };

    const dialogRef = this.dialog.open(InvestModalComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(amountToInvest => {
      if (amountToInvest && amountToInvest > 0) {
        this.loanService.investInLoan(loan.loanId, amountToInvest).subscribe({
          next: () => {
            this.snackBar.open('Investment successful!', 'Close', { duration: 3000 });
            this.loadMarketplaceData(); // Refresh data to show updated funding
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Investment failed.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
  
  // Navigate to a detailed view of the loan
  viewLoanDetails(loanId: string): void {
    this.router.navigate(['/loan-detail', loanId]);
  }
}