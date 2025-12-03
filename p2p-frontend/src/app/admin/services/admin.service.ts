import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment'; // Corrected path from the admin sub-directory

// --- Import shared DTOs/Interfaces from other services ---
import { UserProfile } from '../../../app/services/user.service';
import { KycStatus } from '../../../app/services/kyc.service';
import { Loan } from '../../../app/services/loan.service';
import { Stock } from '../../../app/services/market.service';

// --- Interfaces for Admin-specific data structures ---

export interface DashboardMetrics {
  totalUsers: number;
  pendingKyc: number;
  activeLoans: number;
  totalLoanVolume: number;
  platformRevenue: number;
  tradableStocks: number;
}

export interface AuditLog {
  logId: number;
  eventId: string;
  eventType: string;
  actorUserId: string | null;
  targetEntityId: string | null;
  eventDetails: any; // JSONB will be deserialized into an 'any' object
  ipAddress: string | null;
  createdAt: string;
}
export interface MessageResponse {
  message: string;
}
// Interface for paginated responses from the backend
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // The current page number
}


@Injectable({
  // This service is provided within the lazy-loaded AdminModule
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  // =======================================
  // Dashboard
  // =======================================
  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/dashboard/metrics`);
  }

  // =======================================
  // User Management
  // =======================================
  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/users`);
  }

  getPendingKyc(): Observable<KycStatus[]> {
    return this.http.get<KycStatus[]>(`${this.apiUrl}/users/kyc-submissions`);
  }
  
  reviewKyc(kycId: string, newStatus: string, notes: string): Observable<MessageResponse> { // <-- CHANGE return type
    const body = { kycId, newStatus, notes };
    return this.http.post<MessageResponse>(`${this.apiUrl}/users/review-kyc`, body); // <-- Strongly type the post request
  }

 toggleUserActivation(userId: string): Observable<any> {
    // The endpoint now handles the toggle logic, so we send an empty POST request.
    return this.http.post(`${this.apiUrl}/users/${userId}/toggle-activation`, {});
  }

  // =======================================
  // Loan Management
  // =======================================
  getPendingLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans/pending-review`);
  }
  
  getDelinquentLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans/delinquent`);
  }

  reviewLoan(loanId: string, approved: boolean): Observable<any> {
    const body = { approved };
    return this.http.post(`${this.apiUrl}/loans/${loanId}/review`, body);
  }

  // =======================================
  // Stock Market Management
  // =======================================
  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stock-market/stocks`);
  }
  
  createStock(symbol: string, companyName: string, initialPrice: number): Observable<Stock> {
    const body = { symbol, companyName, initialPrice };
    return this.http.post<Stock>(`${this.apiUrl}/stock-market/stocks`, body);
  }

 toggleStockListing(stockId: string, isListed: boolean): Observable<any> {
    // --- THIS IS THE FIX ---
    // Create the body object with the 'isListed' property
    const body = { isListed }; 
    // Send the body with the POST request
    return this.http.post(`${this.apiUrl}/stock-market/stocks/${stockId}/toggle-listing`, body);
    // -----------------------
  }

  // =======================================
  // Audit Log Viewer
  // =======================================
  /**
   * Searches audit logs with dynamic filter and pagination parameters.
   * @param filter An object containing filter criteria (e.g., { actorUserId: '...' }).
   * @param page The page number to retrieve.
   * @param size The number of items per page.
   * @returns A paginated response of AuditLog objects.
   */
  searchAuditLogs(filter: any, page: number, size: number): Observable<Page<AuditLog>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Dynamically add filter criteria to the HttpParams
    Object.keys(filter).forEach(key => {
      const value = filter[key];
      if (value) { // Only add the parameter if it has a value
        params = params.append(key, value);
      }
    });

    return this.http.get<Page<AuditLog>>(`${this.apiUrl}/audit-logs/search`, { params });
  }
}