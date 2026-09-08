import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';

export interface CurrentUser {
  username: string;
  role: string;
  region?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUser = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password });
  }

  setSession(username: string, token: string, role: string, region?: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    if (region) {
      localStorage.setItem('region', region);
    }
    this.currentUser.next({ username, role, region });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('region');
    this.currentUser.next(null);
  }

  private loadUser(): void {
    const token = this.getToken();
    const role = this.getRole();
    const username = this.getUsername();
    const region = localStorage.getItem('region') || undefined;
    if (token && role && username) {
      this.currentUser.next({ username, role, region });
    }
  }
}
