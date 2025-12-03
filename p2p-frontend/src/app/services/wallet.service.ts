import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

// --- Interfaces for Type Safety ---
export interface Wallet {
  walletId: string;
  balance: number;
}

export interface WalletTransaction {
  transactionId: string;
  transactionType: string;
  amount: number;
  balanceAfter: number;
  description: string;
  relatedEntityId: string | null;
  createdAt: string;
}

export interface WithdrawableBalance {
  withdrawableAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/wallet`;

  constructor(private http: HttpClient) { }

  getWallet(): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.apiUrl}/`);
  }

  getTransactions(): Observable<WalletTransaction[]> {
    return this.http.get<WalletTransaction[]>(`${this.apiUrl}/transactions`);
  }

  deposit(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/deposit`, { amount });
  }

  withdraw(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/withdraw`, { amount });
  }

  getWithdrawableBalance(): Observable<WithdrawableBalance> {
    return this.http.get<WithdrawableBalance>(`${this.apiUrl}/withdrawable-balance`);
  }
}