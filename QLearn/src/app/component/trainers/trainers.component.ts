import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
  import * as AOS from 'aos';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { FormsModule } from '@angular/forms';
import { NavAdminComponent } from "../nav-admin/nav-admin.component";
// Import Bootstrap types if you want typing support (optional)
declare var bootstrap: any;
@Component({
  selector: 'app-trainers',
  imports: [CommonModule, FormsModule, NavAdminComponent],
  templateUrl: './trainers.component.html',
  styleUrl: './trainers.component.css'
})
export class TrainersComponent {
  selectedInstructor: any;

  constructor(private service:PrincipalServiceService){}
/* instructors = [
    {
          imageUrl: 'assets/images/kids.jpg',
      name: 'Alice Kumar',
      email: 'alice@example.com',
      skills: 'Angular, TypeScript',
      experience: '3 years',
      courses: 5,
      rating: 4.5
    },
    {
      name: 'Rajesh Sharma',
      email: 'rajesh@example.com',
      skills: 'Python, Django',
      experience: '5 years',
      courses: 8,
      rating: 4.8
    },
    {
      name: 'Meena Thomas',
      email: 'meena@example.com',
      skills: 'Java, Spring Boot',
      experience: '4 years',
      courses: 6,
      rating: 4.2
    },
    {
      name: 'John David',
      email: 'john@example.com',
      skills: 'React, Node.js',
      experience: '2 years',
      courses: 4,
      rating: 4.0
    },
    {
      name: 'Kavitha Elango',
      email: 'kavitha@example.com',
      skills: 'HTML, CSS, Bootstrap',
      experience: '1.5 years',
      courses: 3,
      rating: 3.9
    },
    {
      name: 'Sanjay Patel',
      email: 'sanjay@example.com',
      skills: 'MongoDB, Express.js',
      experience: '3 years',
      courses: 5,
      rating: 4.3
    }
  ];
 */
name:any;
email:any;
department:any;
role:any;
education:any;
instructors: any[] = [];
roles: string | null = null;
ngOnInit() {
  AOS.init();
  this.roles = localStorage.getItem('role');
  console.log('User Role:', this.roles);
  
this.service.getInstructor().subscribe((data:any)=>{
  this.instructors = data;
    console.log(this.instructors);
})

}

/*   selectedInstructor: any = null;

  viewProfile(instructor: any) {
    this.selectedInstructor = instructor;
    const modalElement = document.getElementById('profileModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
 */


searchTerm: string = '';

filteredInstructors() {
  const term = this.searchTerm.toLowerCase();
  return this.instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(term) ||
    instructor.email.toLowerCase().includes(term) ||
    instructor.department.toLowerCase().includes(term) ||
    instructor.instructorId.toLowerCase().includes(term)
  );
}

viewProfile(instructor: any) {
  this.selectedInstructor = instructor;
  const modal = new bootstrap.Modal(document.getElementById('profileModal')!);
  modal.show();
}

}
