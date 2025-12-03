import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

// It's good practice to define an interface for your data structures
export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;      // <-- Must exist
  phoneNumber: string;
  role: string;       // <-- Must exist
  createdAt: string;  // <-- Must exist
  isActive: boolean;  // <-- Must exist
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // The profile endpoints are under /api/auth as per the backend design
  private apiUrl = `${environment.apiUrl}/auth/profile`;

  constructor(private http: HttpClient) { }

  /**
   * Fetches the profile information for the currently authenticated user.
   * @returns An Observable of the user's profile.
   */
  public getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl);
  }

  /**
   * Updates the profile information for the currently authenticated user.
   * @param profileData The partial profile data to update.
   * @returns An Observable of the updated user profile.
   */
  public updateProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, profileData);
  }
}