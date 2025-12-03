import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../enviroment';

// -----------------------

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  // Public observable that components can subscribe to
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  // --- PUBLIC API METHODS ---

  public login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.storeToken(response.token);
        }
      }),
      catchError(this.handleError<any>('login'))
    );
  }

  public register(userInfo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userInfo).pipe(
       catchError((error: HttpErrorResponse) => {
        // Log the error and then re-throw it so the component's error block can handle it
        console.error("Registration failed in service:", error);
        return throwError(() => error); 
      })
    );
  }
  public getRole(): 'BORROWER' | 'LENDER' | 'ADMIN' | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      // Decode the payload part of the JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (e) {
      console.error("Failed to decode JWT:", e);
      return null;
    }
  }
  // Inside the AuthService class

public getUserId(): string | null {
  const token = this.getToken();
  if (!token) {
    return null;
  }
  try {
    // Decode the payload part of the JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || null;
  } catch (e) {
    console.error("Failed to decode user ID from JWT:", e);
    return null;
  }
}

  public logout(): void {
    localStorage.removeItem('jwt_token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  public isLoggedIn(): boolean {
    return this.hasToken();
  }

  // --- PRIVATE HELPER METHODS ---

  private hasToken(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  private storeToken(token: string): void {
    localStorage.setItem('jwt_token', token);
    this.loggedIn.next(true);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}