import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AdminService } from '../../services/admin.service';
import { Loan } from '../../../services/loan.service';

@Component({
  selector: 'app-admin-loan-management',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, DatePipe, MatCardModule, MatTabsModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './admin-loan-management.component.html',
  styleUrls: ['./admin-loan-management.component.scss']
})
export class AdminLoanManagementComponent implements OnInit {
  // Data sources for the two tables
  pendingDataSource: MatTableDataSource<Loan>;
  delinquentDataSource: MatTableDataSource<Loan>;

  // Columns for the pending table
  pendingColumns: string[] = ['borrower', 'amountRequested', 'termMonths', 'applicationDate', 'actions'];
  // Columns for the delinquent table
  delinquentColumns: string[] = ['borrower', 'amountRequested', 'status', 'interestRate', 'actions'];

  isLoadingPending = true;
  isLoadingDelinquent = true;

  @ViewChild('pendingSort') pendingSort!: MatSort;
  @ViewChild('delinquentSort') delinquentSort!: MatSort;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    this.pendingDataSource = new MatTableDataSource<Loan>([]);
    this.delinquentDataSource = new MatTableDataSource<Loan>([]);
  }

  ngOnInit(): void {
    this.loadPendingLoans();
    this.loadDelinquentLoans();
  }

  loadPendingLoans(): void {
    this.isLoadingPending = true;
    this.adminService.getPendingLoans().subscribe({
      next: (data) => {
        this.pendingDataSource.data = data;
        this.pendingDataSource.sort = this.pendingSort;
        this.isLoadingPending = false;
      },
      error: () => {
        this.snackBar.open('Failed to load pending loan applications.', 'Close', { duration: 3000 });
        this.isLoadingPending = false;
      }
    });
  }

  loadDelinquentLoans(): void {
    this.isLoadingDelinquent = true;
    this.adminService.getDelinquentLoans().subscribe({
      next: (data) => {
        this.delinquentDataSource.data = data;
        this.delinquentDataSource.sort = this.delinquentSort;
        this.isLoadingDelinquent = false;
      },
      error: () => {
        this.snackBar.open('Failed to load delinquent loans.', 'Close', { duration: 3000 });
        this.isLoadingDelinquent = false;
      }
    });
  }

  reviewLoan(loanId: string, isApproved: boolean): void {
    this.adminService.reviewLoan(loanId, isApproved).subscribe({
      next: () => {
        const action = isApproved ? 'approved' : 'rejected';
        this.snackBar.open(`Loan application has been ${action}.`, 'Close', { duration: 3000 });
        this.loadPendingLoans(); // Refresh the list
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to review application.', 'Close', { duration: 3000 });
      }
    });
  }
}