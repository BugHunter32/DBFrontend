import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// --- Material Imports ---
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Loan, LoanService, RepaymentSchedule } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, CurrencyPipe, DatePipe, PercentPipe, MatCardModule, MatButtonModule,
    MatProgressSpinnerModule, MatIconModule, MatDividerModule, MatTableModule, MatChipsModule
  ],
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss']
})
export class LoanDetailComponent implements OnInit {
  loan?: Loan;
  isLoading = true;
  userRole: string | null;
  userId: string | null;
  
  displayedColumns: string[] = ['dueDate', 'principalDue', 'interestDue', 'amountDue', 'status'];
  
  nextInstallment?: RepaymentSchedule;
  lenderShare = { principal: 0, interest: 0, total: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.userRole = this.authService.getRole();
    this.userId = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const loanId = params.get('id');
        if (!loanId) {
          this.router.navigate(['/my-loans']);
          return of(null);
        }
        return this.loanService.getLoanById(loanId);
      })
    ).subscribe({
      next: (loan) => {
        if (loan) {
          this.loan = loan;
          this.processLoanDetails(loan);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load loan details.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  processLoanDetails(loan: Loan): void {
    const activeStatuses = ['ACTIVE', 'REPAID', 'DEFAULTED', 'OVERDUE'];
    if (activeStatuses.includes(loan.status) && loan.repaymentSchedules) {
      this.nextInstallment = [...loan.repaymentSchedules]
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .find(rs => rs.status === 'PENDING');

      // --- THIS IS THE FIX ---
      if (this.userRole === 'LENDER' && this.nextInstallment) {
        // 1. Find ALL investments by the current user and sum them up.
        const myTotalInvestment = loan.investments
          .filter(inv => inv.lender.userId === this.userId)
          .reduce((total, inv) => total + inv.amountInvested, 0);

        // 2. Calculate the proportion based on the total investment.
        if (myTotalInvestment > 0 && loan.amountFunded > 0) {
          const proportion = myTotalInvestment / loan.amountFunded;
          this.lenderShare.principal = this.nextInstallment.principalDue * proportion;
          this.lenderShare.interest = this.nextInstallment.interestDue * proportion;
          this.lenderShare.total = this.nextInstallment.amountDue * proportion;
        }
      }
      // -----------------------
    }
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': case 'REPAID': return 'primary';
      case 'FUNDING': case 'LISTED': return 'accent';
      case 'REJECTED': case 'DEFAULTED': case 'OVERDUE': return 'warn';
      default: return 'basic';
    }
  }
}