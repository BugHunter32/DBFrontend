
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon'; // <-- Import MatIconModule
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { MessageResponse } from '../../admin/services/admin.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule // <-- Add MatIconModule here
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true; // Property for password visibility
  errorMessage: string | null = null; // Property for the inline error message

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['BORROWER', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null; // Clear previous errors

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Show validation errors
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (response: MessageResponse) => {
        this.snackBar.open(response.message, 'Close', {
          duration: 3000,
          verticalPosition: 'top' // More visible position
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Use the inline error message for specific feedback
        this.errorMessage = err.error?.message || 'Registration failed. The email may already be in use.';
        console.error(err);
      }
    });
  }
}