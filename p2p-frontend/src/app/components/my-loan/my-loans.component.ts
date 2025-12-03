import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// --- Service and Component Imports ---
import { Loan, LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { SecondaryMarketService } from '../../services/secondary-market.service';
import { ListForSaleModalComponent } from '../list-for-sale-modal/list-for-sale-modal.component';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe,
    DatePipe,
    PercentPipe,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule // Provides the MatDialog service
  ],
  templateUrl: './my-loans.component.html',
  styleUrls: ['./my-loans.component.scss']
})
export class MyLoansComponent implements OnInit {
  loans: Loan[] = [];
  isLoading = true;
  userRole: string | null;
  userId: string | null;
  pageTitle = 'My Portfolio';

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private router: Router,
    // --- Injected services for new functionality ---
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private secondaryMarketService: SecondaryMarketService
  ) {
    this.userRole = this.authService.getRole();
    this.userId = this.authService.getUserId();
  }

  ngOnInit(): void {
    if (this.userRole === 'BORROWER') {
      this.pageTitle = 'My Loan Applications';
    } else if (this.userRole === 'LENDER') {
      this.pageTitle = 'My Investments';
    }
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.loanService.getMyLoans().subscribe(data => {
      this.loans = data.sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
      this.isLoading = false;
    });
  }

  /**
   * For Lenders: Finds the amount they personally invested in a specific loan.
   */
 getLenderTotalInvestment(loan: Loan): number {
    if (!this.userId || !loan.investments) {
      return 0;
    }
    // --- THIS IS THE FIX ---
    // 1. Filter to get ALL investments by the current user.
    // 2. Use 'reduce' to sum up the 'amountInvested' for each of them.
    return loan.investments
      .filter(inv => inv.lender.userId === this.userId)
      .reduce((total, inv) => total + inv.amountInvested, 0);
  }


  /**
   * For Lenders: Opens a modal to list their investment for sale.
   */
  sellInvestment(loan: Loan, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the main list item click event

    const myInvestment = loan.investments.find(inv => inv.lender.userId === this.userId);
    if (!myInvestment) {
      this.snackBar.open('Could not find your investment record.', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ListForSaleModalComponent, {
      width: '400px',
      data: { investmentId: myInvestment.investmentId, amountInvested: myInvestment.amountInvested }
    });

    dialogRef.afterClosed().subscribe((price: number) => {
      if (price && price > 0) {
        this.secondaryMarketService.listInvestment(myInvestment.investmentId, price).subscribe({
          next: () => {
            this.snackBar.open('Investment listed for sale successfully!', 'Close', { duration: 3000 });
            this.loadData(); // Refresh to show any status changes
          },
          error: (err: any) => this.snackBar.open(err.error?.message || 'Failed to list investment.', 'Close', { duration: 3000 })
        });
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
      case 'REPAID':
        return 'primary';
      case 'FUNDING':
      case 'LISTED':
        return 'accent';
      case 'REJECTED':
      case 'DEFAULTED':
        return 'warn';
      default:
        return 'basic';
    }
  }

  viewLoanDetails(loanId: string): void {
    this.router.navigate(['/loan-detail', loanId]);
  }
}