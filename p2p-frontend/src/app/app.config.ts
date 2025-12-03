import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    // --- Routing ---
    provideRouter(routes),

    // --- HTTP Client & Interceptor ---
    provideHttpClient(withInterceptorsFromDi()), // Provides HttpClient
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // --- Angular Material ---
    provideAnimations(), // Required for Material animations
    importProvidersFrom(
      MatSnackBarModule,
      MatDialogModule,
      MatProgressBarModule
    ) 
  ]
};