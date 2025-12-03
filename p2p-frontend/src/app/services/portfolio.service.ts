import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

// --- INTERFACE for Type Safety ---

/**
 * Represents a detailed view of a single stock holding in the user's portfolio.
 * This matches the DTO from the backend.
 */
export interface PortfolioHolding {
  symbol: string;
  companyName: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  profitOrLoss: number;
}


@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = `${environment.apiUrl}/portfolio`;

  constructor(private http: HttpClient) { }

  /**
   * Fetches a detailed list of the current user's stock holdings.
   * @returns An Observable array of PortfolioHolding objects.
   */
  getPortfolio(): Observable<PortfolioHolding[]> {
    return this.http.get<PortfolioHolding[]>(`${this.apiUrl}/`);
  }

  /**
   * Fetches just the total current market value of the user's entire portfolio.
   * @returns An Observable with a totalValue property.
   */
  getPortfolioValue(): Observable<{ totalValue: number }> {
    return this.http.get<{ totalValue: number }>(`${this.apiUrl}/value`);
  }
}