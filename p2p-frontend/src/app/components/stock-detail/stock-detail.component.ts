import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { forkJoin } from 'rxjs';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// --- Services and Modal ---
import { Stock, MarketService, StockPriceHistory } from '../../services/market.service';
import { PortfolioService, PortfolioHolding } from '../../services/portfolio.service';
import { TradeModalComponent, TradeModalData } from '../trade-modal/trade-modal.component';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    // PercentPipe,
    BaseChartDirective, // For the chart
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  stock?: Stock;
  userHolding?: PortfolioHolding;
  isLoading = true;

  // --- Chart.js Configuration ---
  public lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public lineChartLegend = false;

  constructor(
    private route: ActivatedRoute,
    private marketService: MarketService,
    private portfolioService: PortfolioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    const stockId = this.route.snapshot.paramMap.get('id');
    if (!stockId) {
      this.snackBar.open('Stock ID not found!', 'Close', { duration: 3000 });
      this.router.navigate(['/stock-market']);
      return;
    }

    forkJoin({
      stocks: this.marketService.getListedStocks(),
      history: this.marketService.getStockHistory(stockId),
      portfolio: this.portfolioService.getPortfolio()
    }).subscribe({
      next: (data) => {
        this.stock = data.stocks.find(s => s.stockId === stockId);
        if (!this.stock) {
          throw new Error('Stock not found in market list.');
        }
        this.userHolding = data.portfolio.find(h => h.symbol === this.stock?.symbol);
        this.prepareChartData(data.history);
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load stock details.', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/stock-market']);
      }
    });
  }

  prepareChartData(history: StockPriceHistory[]): void {
    if (!history || history.length === 0) return;
    
    const reversedHistory = history.slice().reverse(); // Chart from past to present
    this.lineChartData = {
      labels: reversedHistory.map(h => new Date(h.timestamp).toLocaleTimeString()),
      datasets: [
        {
          data: reversedHistory.map(h => h.price),
          label: 'Price (USD)',
          fill: true,
          borderColor: '#3f51b5', // Primary color
          backgroundColor: 'rgba(63, 81, 181, 0.1)',
          pointBackgroundColor: '#3f51b5',
          tension: 0.1
        }
      ]
    };
  }

  openTradeDialog(tradeType: 'BUY' | 'SELL'): void {
    if (!this.stock) return;

    const dialogData: TradeModalData = {
      tradeType,
      stock: this.stock,
      maxSellQuantity: this.userHolding?.quantity
    };
    
    const dialogRef = this.dialog.open(TradeModalComponent, { width: '400px', data: dialogData });

    dialogRef.afterClosed().subscribe(quantity => {
      if (quantity && quantity > 0) {
        const tradeObservable = tradeType === 'BUY' 
          ? this.marketService.executeBuyOrder(this.stock!.stockId, quantity)
          : this.marketService.executeSellOrder(this.stock!.stockId, quantity);
        
        tradeObservable.subscribe({
          next: () => {
            this.snackBar.open(`${tradeType} order executed successfully!`, 'Close', { duration: 3000 });
            this.loadData(); // Refresh all data on the page
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Trade failed. Please try again.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}