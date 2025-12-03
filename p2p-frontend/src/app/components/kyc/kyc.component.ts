import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { KycService, KycStatus } from '../../services/kyc.service'; // Import service and interface

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: 'kyc.component.html',
  styleUrls: ['kyc.component.scss']
})
export class KycComponent implements OnInit {
  kycStatus?: KycStatus;
  selectedFile: File | null = null;
  isLoading = true;
  isSubmitting = false;

  constructor(private kycService: KycService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus(): void {
    this.isLoading = true;
    this.kycService.getStatus().subscribe({
      next: (data: KycStatus) => {
        this.kycStatus = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.snackBar.open('Failed to load KYC status.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.snackBar.open('Please select a file to upload.', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    // In a real app, you might have a dropdown for the user to select the document type
    formData.append('documentType', 'Passport'); 
    formData.append('file', this.selectedFile);

    this.kycService.submitDocuments(formData).subscribe({
      next: () => {
        this.snackBar.open('Documents submitted successfully!', 'Close', { duration: 3000 });
        this.isSubmitting = false;
        this.selectedFile = null; // Reset the file input
        this.loadStatus(); // Refresh the status to show the 'PENDING' view
      },
      error: (err: any) => {
        this.snackBar.open('Submission failed. Please try again.', 'Close', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  }
}