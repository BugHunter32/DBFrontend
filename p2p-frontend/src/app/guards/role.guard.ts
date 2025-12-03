import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * A functional routing guard that checks if the currently logged-in user has the 'ADMIN' role.
 * 
 * This guard uses 'canMatch' which is more efficient for lazy-loading. It prevents the
 * admin module's code from even being downloaded by the browser if the user is not an admin.
 *
 * @param route The route that the user is trying to access.
 * @param segments The URL segments of the route.
 * @returns `true` if the user is an admin, `false` otherwise.
 */
export const roleGuard: CanMatchFn = (route, segments) => {
  // Use `inject()` to get instances of required services
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const expectedRole = 'ADMIN';
  const userRole = authService.getRole();

  // Check if the user is logged in and their role matches the expected role
  if (authService.isLoggedIn() && userRole === expectedRole) {
    return true; // Yes, the user is an admin, allow the route to be matched and loaded.
  }

  // --- If the check fails ---

  // 1. Inform the user why access is denied (good UX)
  snackBar.open('Access Denied: Administrator privileges are required.', 'Close', { 
    duration: 5000,
    panelClass: ['warn-snackbar'] // Optional: for custom styling
  });

  // 2. Redirect the user to a safe, default page (e.g., their profile or dashboard)
  router.navigate(['/profile']);

  // 3. Block the current navigation
  return false;
};