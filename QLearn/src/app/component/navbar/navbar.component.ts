import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ProfileComponent } from "../profile/profile.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterLinkActive, CommonModule, ProfileComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  roles:any;
ngOnInit(){
   this.roles = localStorage.getItem('role');
  console.log('User Role:', this.roles);
  
}
  
  dropdownOpen = false;
  studentNameFirstLetter = 'J'; // Replace with actual first letter of logged-in student

  constructor(private router: Router) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu')) {
      this.dropdownOpen = false;
    }
  }

  logout() {
    // Add your logout logic here
    this.router.navigate(['/login']);
  }



  
}
