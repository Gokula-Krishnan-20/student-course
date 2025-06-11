import { Component } from '@angular/core';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
  import * as AOS from 'aos';
import { NavAdminComponent } from "../nav-admin/nav-admin.component";
@Component({
  selector: 'app-student-data',
  imports: [CommonModule, FormsModule, NavAdminComponent],
  templateUrl: './student-data.component.html',
  styleUrl: './student-data.component.css'
})
export class StudentDataComponent {
  totalStudents: any[] = [];
  filterOption: string = 'all';

  constructor(private service: PrincipalServiceService) {}

roles:any;
  
  ngOnInit() {
      AOS.init();
  this.roles = localStorage.getItem('role');


    this.service.getStudents().subscribe((data: any) => {
      this.totalStudents = data;
    });
  }

  filteredStudents() {
    if (this.filterOption === 'enrolled') {
      return this.totalStudents.filter(student => student.enrolledCourses.length > 0);
    }
    return this.totalStudents;
  }
}