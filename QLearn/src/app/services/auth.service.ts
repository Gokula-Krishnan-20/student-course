import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:3002/api/auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>(this.authUrl, { username, password });
  }

  storeToken(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('token', token);
    localStorage.setItem('role', payload.role);
    localStorage.setItem('username', payload.username);
    return payload;
  }

  getRole() {
    return localStorage.getItem('role');
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
