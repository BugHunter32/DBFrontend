import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

// Interface defining the structure of the Robo-Advisor strategy object
export interface RoboAdvisorStrategy {
  strategyId: string;
  active: boolean;
  maxInvestmentPerLoan: number;
  riskScores: ('A' | 'B' | 'C')[];
  minInterestRate: number | null;
  maxLoanTerm: number | null;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoboAdvisorService {
  private apiUrl = `${environment.apiUrl}/robo-advisor`;

  constructor(private http: HttpClient) { }

  /**
   * Fetches the current user's robo-advisor strategy.
   */
  getStrategy(): Observable<RoboAdvisorStrategy> {
    return this.http.get<RoboAdvisorStrategy>(`${this.apiUrl}/strategy`);
  }

  /**
   * Creates or updates the current user's robo-advisor strategy.
   * @param strategy The strategy data to save.
   */
  saveStrategy(strategy: Partial<RoboAdvisorStrategy>): Observable<RoboAdvisorStrategy> {
    return this.http.post<RoboAdvisorStrategy>(`${this.apiUrl}/strategy`, strategy);
  }
}