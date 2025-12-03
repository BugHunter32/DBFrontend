import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// --- Required Angular Material Modules ---
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { PortfolioHolding, PortfolioService } from '../../services/portfolio.service';
import { MarketService } from '../../services/market.service'; // Needed to find stockId for navigation
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './stock-portfolio.component.html',
  styleUrls: ['./stock-portfolio.component.scss']
})
export class StockPortfolioComponent implements OnInit, AfterViewInit {
  // Columns to display in the table
  displayedColumns: string[] = ['companyName', 'quantity', 'averageBuyPrice', 'currentPrice', 'currentValue', 'profitOrLoss'];
  dataSource: MatTableDataSource<PortfolioHolding>;
  isLoading = true;

  // Calculated totals
  totalPortfolioValue = 0;
  totalProfitOrLoss = 0;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private portfolioService: PortfolioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<PortfolioHolding>([]);
  }

  ngOnInit(): void {
    this.portfolioService.getPortfolio().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.calculateTotals(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load portfolio data.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  /**
   * Calculates the total value and P/L for the entire portfolio.
   */
  calculateTotals(holdings: PortfolioHolding[]): void {
    this.totalPortfolioValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    this.totalProfitOrLoss = holdings.reduce((sum, h) => sum + h.profitOrLoss, 0);
  }

  /**
   * Navigates to the detailed view for a specific stock.
   * This requires a lookup to get the stockId from the symbol.
   */
  async viewStockDetails(holding: PortfolioHolding): Promise<void> {
    
    this.router.navigate(['/stock-market']); // Placeholder navigation
    this.snackBar.open(`Navigation to detail page for ${holding.symbol} would be implemented here.`, 'OK', { duration: 3000 });
  }

  /**
   * Helper to get a color class based on profit or loss.
   */
  getProfitLossColor(value: number): string {
    if (value > 0) return 'profit';
    if (value < 0) return 'loss';
    return 'neutral';
  }
}