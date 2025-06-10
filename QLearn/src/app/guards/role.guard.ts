import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role']; // 'student' or 'principal'
    const actualRole = localStorage.getItem('role'); // fetched from login token

    if (expectedRole === actualRole) {
      return true;
    }

    // Not authorized → redirect to landing
    this.router.navigate(['/main-page']);
    return false;
  }
}
