import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ RouterModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  studentNameFirstLetter = 'J'; // Replace this with real data
  isDropdownOpen = false;
roles:any;
  constructor(private router: Router) {
      this.roles = localStorage.getItem('role');
  console.log('User Role:', this.roles);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() {
    sessionStorage.removeItem('token');
    this.closeDropdown();
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.closeDropdown();
    this.router.navigate(['student/student-detail']);
  }
}

