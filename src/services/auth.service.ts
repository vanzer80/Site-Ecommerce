import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

const AUTH_KEY = 'is_authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = signal<boolean>(false);
  public isAuthenticated = this._isAuthenticated.asReadonly();
  // FIX: Explicitly cast injected Router to its type to resolve a potential type inference issue where it is treated as 'unknown'.
  private router = inject(Router) as Router;

  constructor() {
    // Check session storage on initialization
    const storedAuth = sessionStorage.getItem(AUTH_KEY);
    this._isAuthenticated.set(storedAuth === 'true');
  }

  login(email: string, password: string): boolean {
    // Hardcoded credentials for demonstration
    if (email === 'admin@example.com' && password === 'password') {
      sessionStorage.setItem(AUTH_KEY, 'true');
      this._isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem(AUTH_KEY);
    this._isAuthenticated.set(false);
    this.router.navigate(['/admin/login']);
  }
}
