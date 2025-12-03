import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

// --- INTERFACES for Type Safety ---

/**
 * Represents a single tradable stock on the market.
 */
export interface Stock {
  stockId: string;
  symbol: string;
  companyName: string;
  currentPrice: number;
 isListed: boolean;
  createdAt: string;
}

/**
 * Represents a single point in a stock's price history.
 */
export interface StockPriceHistory {
  priceHistoryId: string;
  price: number;
  timestamp: string;
}


@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private apiUrl = `${environment.apiUrl}/market`;

  constructor(private http: HttpClient) { }


  getListedStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stocks`);
  }

  getStockHistory(stockId: string): Observable<StockPriceHistory[]> {
    return this.http.get<StockPriceHistory[]>(`${this.apiUrl}/stocks/${stockId}/history`);
  }


  executeBuyOrder(stockId: string, quantity: number): Observable<any> {
    const tradeRequest = { stockId, quantity };
    return this.http.post(`${this.apiUrl}/orders/buy`, tradeRequest);
  }
  

  executeSellOrder(stockId: string, quantity: number): Observable<any> {
    const tradeRequest = { stockId, quantity };
    return this.http.post(`${this.apiUrl}/orders/sell`, tradeRequest);
  }
}