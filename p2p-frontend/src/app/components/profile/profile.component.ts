import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider'; // <-- Import MatDividerModule

import { UserService, UserProfile } from '../../services/user.service'; // Adjust path if needed

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule // <-- Add MatDividerModule here
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile?: UserProfile;
  isEditMode = false;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (data: UserProfile) => {
        this.userProfile = data;
        // Set the form's value with the loaded data
        this.profileForm.patchValue(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load profile. Please try again later.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    // If canceling edit mode, reset the form to its original state
    if (!this.isEditMode && this.userProfile) {
      this.profileForm.reset(this.userProfile);
    }
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: (updatedProfile: UserProfile) => {
        this.userProfile = updatedProfile;
        this.isEditMode = false;
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 2000, verticalPosition: 'top' });
      },
      error: (err) => {
        this.snackBar.open('Failed to update profile. Please try again.', 'Close', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }
}