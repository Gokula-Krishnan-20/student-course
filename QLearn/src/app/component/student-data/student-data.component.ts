import { Component } from '@angular/core';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
  import * as AOS from 'aos';
import { NavAdminComponent } from "../nav-admin/nav-admin.component";
import { Student } from '../../model/student.model';
@Component({
  selector: 'app-student-data',
  imports: [CommonModule, FormsModule, NavAdminComponent, ReactiveFormsModule],
  templateUrl: './student-data.component.html',
  styleUrl: './student-data.component.css'
})
export class StudentDataComponent {
  totalStudents: any[] = [];
  filterOption: string = 'all';
  studentForm!: FormGroup;
  showForm = false;
  constructor(private service: PrincipalServiceService, private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      studentId: ['', Validators.required],
      department: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

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
onSubmit(): void {
  if (this.studentForm.invalid) {
    this.studentForm.markAllAsTouched();
    return;
  }

  const newStudent: Student = this.studentForm.value;

  this.service.addStudent(newStudent).subscribe({
    next: () => {
      alert('Student added successfully');
      this.studentForm.reset();
      this.showForm = false;
    },
    error: () => {
      alert('Failed to add student');
    }
  });
}
}