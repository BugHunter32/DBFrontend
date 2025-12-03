import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms'; // <-- Import FormGroup

import { AdminService, MessageResponse } from '../../services/admin.service';
// Correct the relative path to go up two directories from 'admin/components' to 'app'
import { KycStatus } from '../../../services/kyc.service'; 

@Component({
  selector: 'app-kyc-review',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './kyc-review.component.html',
  styleUrls: ['./kyc-review.component.scss']
})

export class KycReviewComponent implements OnInit {
  pendingSubmissions: KycStatus[] = [];
  selectedSubmission: KycStatus | null = null;
  isLoading = true;
  isProcessing = false;

  // --- THIS IS THE FIX ---
  // 1. DECLARE the form property here with the non-null assertion operator (!)
  rejectionNotesForm!: FormGroup;
  // -----------------------

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    // 2. INITIALIZE the form inside the constructor
    this.rejectionNotesForm = this.fb.group({
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadPendingSubmissions();
  }

  loadPendingSubmissions(): void {
    this.isLoading = true;
    this.adminService.getPendingKyc().subscribe({
      next: (data: KycStatus[]) => {
        this.pendingSubmissions = data;
        
        if (this.selectedSubmission && !data.some(s => s.kycId === this.selectedSubmission!.kycId)) {
            this.selectedSubmission = null;
        }

        this.isLoading = false;
      },
      error: (err: any) => {
        this.snackBar.open('Failed to load KYC submissions.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  selectSubmission(submission: KycStatus): void {
    this.selectedSubmission = submission;
    this.rejectionNotesForm.reset();
  }

  reviewSubmission(decision: 'APPROVED' | 'REJECTED'): void {
    if (!this.selectedSubmission) return;


    this.isProcessing = true;
    const notes = this.rejectionNotesForm.get('notes')?.value?.trim() || 'Document approved.';

    this.adminService.reviewKyc(this.selectedSubmission.kycId.toString(), decision, notes).subscribe({
      // This line will now work correctly because MessageResponse is imported
      next: (response: MessageResponse) => { 
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
        this.isProcessing = false;
        this.loadPendingSubmissions(); // Refresh the queue
      },
      error: (err: any) => {
        this.snackBar.open('Failed to process review. Please try again.', 'Close', { duration: 3000 });
        this.isProcessing = false;
      }
    });
  }
}