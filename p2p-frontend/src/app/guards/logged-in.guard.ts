import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // If the user is already logged in, redirect them away from the login/register page
    // to their main profile page.
    router.navigate(['/profile']);
    return false; // Prevent access to the requested route (e.g., /login)
  }

  // If the user is not logged in, allow them to access the route
  return true;
};