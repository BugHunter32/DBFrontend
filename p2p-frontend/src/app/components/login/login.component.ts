import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// --- Required Angular Material Modules ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Use the non-null assertion operator for forms initialized in ngOnInit
  loginForm!: FormGroup; 
  hidePassword = true;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Show validation errors on all fields
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // --- THIS IS THE FIX ---
        // The service's tap() operator has already handled the token.
        // We now verify if the login was truly successful by checking the token's presence.
        if (this.authService.isLoggedIn()) {
          this.snackBar.open('Login successful! Redirecting...', 'OK', { duration: 2000 });
          this.router.navigate(['/profile']);
        } else {
          // This handles cases where the API returns an error (like 401)
          // and our service's catchError returns an empty/undefined response.
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      },
      error: (err) => {
        // This handles unexpected network or client-side errors.
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
        console.error(err);
      }
    });
  }
}