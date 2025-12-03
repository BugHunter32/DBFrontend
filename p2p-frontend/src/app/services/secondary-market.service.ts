import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';
import { Loan } from './loan.service'; // We need the Loan interface for context

// Interface for a single investment being sold
export interface ListingInvestment {
  investmentId: string;
  amountInvested: number;
  loan: Loan; // Include the full loan details for display
}

// Interface for a listing on the secondary market
export interface SecondaryMarketListing {
  listingId: string;
  listingPrice: number;
  remainingPrincipal: number;
  listedAt: string;
  investment: ListingInvestment;
}

@Injectable({
  providedIn: 'root'
})
export class SecondaryMarketService {
  private apiUrl = `${environment.apiUrl}/secondary-market`;

  constructor(private http: HttpClient) { }

  getActiveListings(): Observable<SecondaryMarketListing[]> {
    return this.http.get<SecondaryMarketListing[]>(`${this.apiUrl}/listings`);
  }

  listInvestment(investmentId: string, price: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/list`, { investmentId, price });
  }

  purchaseInvestment(listingId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${listingId}/purchase`, {});
  }
}