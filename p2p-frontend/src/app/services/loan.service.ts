import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

// --- Interfaces for Type Safety ---

export interface UserSummary {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface LoanInvestment {
  investmentId: string;
  amountInvested: number;
  investmentDate: string;
  lender: UserSummary;
}

export interface RepaymentSchedule {
    repaymentId: string;
    dueDate: string;
    amountDue: number;
    principalDue: number;
    interestDue: number;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    paidDate: string | null;
}

export interface Loan {
  loanId: string;
  amountRequested: number;
  amountFunded: number;
  termMonths: number;
  status: string;
  interestRate: number;
  riskScore: string;
  applicationDate: string;
  borrower: UserSummary;
  investments: LoanInvestment[];
  repaymentSchedules: RepaymentSchedule[];
}


@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) { }

  applyForLoan(amount: number, term: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/apply`, { amount, term });
  }

  getMyLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/my-loans`);
  }

 getLoanById(loanId: string): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${loanId}`);
  }


  getMarketplace(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/marketplace`);
  }

  investInLoan(loanId: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${loanId}/invest`, { amount });
  }
}