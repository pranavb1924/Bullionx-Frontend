import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Set this to your backend authentication endpoint.
  // For example: 'http://localhost:8080/api/auth'
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Sends a login request to the backend.
   * @param credentials An object with email and password.
   * @returns An observable of the login response.
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }
}
