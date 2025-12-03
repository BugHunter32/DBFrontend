import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Import for icons
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule // Add to imports
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'p2p-frontend';

  // We make authService public so the template can access it
  constructor(public authService: AuthService, private router: Router) {}

  // Helper getter to make the template cleaner
  get userRole(): string | null {
    return this.authService.getRole();
  }

  logout() {
    this.authService.logout();
  }
}