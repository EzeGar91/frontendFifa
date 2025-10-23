import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, LoginRequest, RegisterRequest, AuthResponse, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'fifa_token';
  private readonly USER_KEY = 'fifa_user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth() {
    // Verificar si estamos en el navegador
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authStateSubject.next({
          isAuthenticated: true,
          user,
          token
        });
      } catch (error) {
        this.logout();
      }
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setAuthData(response.data.user, response.data.token);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setAuthData(response.data.user, response.data.token);
          }
        }),
        catchError(error => {
          console.error('Register error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  private setAuthData(user: User, token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    this.authStateSubject.next({
      isAuthenticated: true,
      user,
      token
    });
  }

  verifyToken(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.API_URL}/verify`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Token verification error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  getProfile(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.API_URL}/profile`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Profile error:', error);
        return throwError(() => error);
      })
    );
  }
}
