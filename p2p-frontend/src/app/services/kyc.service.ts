import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

interface KycUserSummary {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface KycStatus {
  kycId: number;
  userId: string; // <-- ADD THIS PROPERTY
  status: 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  documentType: string | null;
  documentUrl: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewerNotes: string | null;
  user: KycUserSummary;
}

@Injectable({
  providedIn: 'root'
})
export class KycService {
  private apiUrl = `${environment.apiUrl}/kyc`;

  constructor(private http: HttpClient) { }

  getStatus(): Observable<KycStatus> {
    return this.http.get<KycStatus>(`${this.apiUrl}/status`);
  }

  submitDocuments(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, formData);
  }
}