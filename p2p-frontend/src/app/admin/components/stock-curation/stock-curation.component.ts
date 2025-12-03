import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'; // <-- STEP 1: YEH NAYI LINE IMPORT KAREIN

import { AdminService } from '../../services/admin.service';
import { Stock } from '../../../services/market.service';

@Component({
  selector: 'app-stock-curation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTooltipModule // <-- STEP 2: ISKO IMPORTS ARRAY MEIN ADD KAREIN
  ],
  templateUrl: './stock-curation.component.html',
  styleUrls: ['./stock-curation.component.scss']
})
export class StockCurationComponent implements OnInit, AfterViewInit {
  // For the 'Create Stock' form
  stockForm: FormGroup;
  isSubmitting = false;

  // For the 'All Stocks' table
  displayedColumns: string[] = ['company', 'currentPrice', 'isListed'];
  dataSource: MatTableDataSource<Stock>;
  isLoading = true;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Stock>([]);
    
    this.stockForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.maxLength(10)]],
      companyName: ['', [Validators.required, Validators.maxLength(100)]],
      initialPrice: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadAllStocks();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'company': return item.companyName;
        default: return (item as any)[property];
      }
    };

    this.dataSource.filterPredicate = (data: Stock, filter: string) => {
      const dataStr = `${data.companyName} ${data.symbol}`.toLowerCase();
      return dataStr.includes(filter);
    };
  }

  loadAllStocks(): void {
    this.isLoading = true;
    this.adminService.getAllStocks().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load stocks.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onCreateStock(): void {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const { symbol, companyName, initialPrice } = this.stockForm.value;

    this.adminService.createStock(symbol!, companyName!, initialPrice!).subscribe({
      next: (newStock) => {
        this.snackBar.open(`Stock '${newStock.symbol}' created successfully!`, 'Close', { duration: 3000 });
        this.isSubmitting = false;
        this.stockForm.reset();
        Object.keys(this.stockForm.controls).forEach(key => {
          this.stockForm.get(key)?.setErrors(null) ;
        });
        this.loadAllStocks();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to create stock.', 'Close', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  }

  onListingToggle(event: MatSlideToggleChange, stock: Stock): void {
    const newStatus = event.checked;
    this.adminService.toggleStockListing(stock.stockId, newStatus).subscribe({
      next: () => {
        this.snackBar.open(`Stock '${stock.symbol}' is now ${newStatus ? 'listed' : 'unlisted'}.`, 'Close', { duration: 2000 });
        stock.isListed = newStatus;
      },
      error: (err) => {
        this.snackBar.open('Failed to update status. Please try again.', 'Close', { duration: 3000 });
        event.source.toggle();
      }
    });
  }
}