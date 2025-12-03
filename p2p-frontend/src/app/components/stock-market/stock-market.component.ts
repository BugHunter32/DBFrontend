import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// --- Required Angular Material Modules ---
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { Stock, MarketService } from '../../services/market.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-market',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './stock-market.component.html',
  styleUrls: ['./stock-market.component.scss']
})
export class StockMarketComponent implements OnInit, AfterViewInit {
  // Columns to display in the table
  displayedColumns: string[] = ['companyName', 'symbol', 'currentPrice'];
  dataSource: MatTableDataSource<Stock>;
  isLoading = true;

  // For sorting the table
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private marketService: MarketService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Stock>([]);
  }

  ngOnInit(): void {
    this.marketService.getListedStocks().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load stock market data.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Connect the MatSort instance to the data source
    this.dataSource.sort = this.sort;
  }

  /**
   * Applies a filter to the table data source.
   * @param event The input event from the filter field.
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Navigates to the detailed view for a specific stock.
   * @param stock The stock object from the selected row.
   */
  viewStockDetails(stock: Stock): void {
    this.router.navigate(['/stock-detail', stock.stockId]);
  }
}