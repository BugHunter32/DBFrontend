import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


import { SecondaryMarketListing, SecondaryMarketService } from '../../services/secondary-market.service';

@Component({
  selector: 'app-secondary-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    PercentPipe,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './secondary-marketplace.component.html',
  styleUrls: ['./secondary-marketplace.component.scss']
})
export class SecondaryMarketplaceComponent implements OnInit {
  listings: SecondaryMarketListing[] = [];
  isLoading = true;

  constructor(
    private marketService: SecondaryMarketService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.isLoading = true;
    this.marketService.getActiveListings().subscribe({
      next: (data) => {
        // Default sort by price ascending
        this.listings = data.sort((a, b) => a.listingPrice - b.listingPrice);
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load marketplace listings.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
  
  // New method for sorting
  sortListings(sortBy: string): void {
    if (sortBy === 'price-asc') {
      this.listings.sort((a, b) => a.listingPrice - b.listingPrice);
    } else if (sortBy === 'price-desc') {
      this.listings.sort((a, b) => b.listingPrice - a.listingPrice);
    } else if (sortBy === 'risk-asc') {
      // Assuming risk scores are 'A', 'B', 'C'
      this.listings.sort((a, b) => a.investment.loan.riskScore.localeCompare(b.investment.loan.riskScore));
    }
  }

  buyListing(listingId: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent card click-through
    
    // Potentially add a confirmation dialog here in a real app
    this.marketService.purchaseInvestment(listingId).subscribe({
      next: () => {
        this.snackBar.open('Purchase successful!', 'Close', { duration: 3000 });
        this.loadListings(); // Refresh the marketplace to remove the purchased item
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Purchase failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  // Navigate to a detailed view of the underlying loan
  viewLoanDetails(loanId: string): void {
    this.router.navigate(['/loan-detail', loanId]);
  }
}