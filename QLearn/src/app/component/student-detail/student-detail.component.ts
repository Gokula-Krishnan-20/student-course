import { Component, OnInit } from '@angular/core';
import { Student } from '../../model/student.model';
import { StudentService } from '../../services/student.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student: Student | null = null;
  editableStudent: Student | null = null;
  isEditing = false;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.loadStudent();

    this.studentService.getCurrentStudent().subscribe({
      next: (data) => {
        this.student = data;
      },
      error: (err) => console.error('Error fetching student:', err)
    });
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.editableStudent = null;
    } else if (this.student) {
      this.editableStudent = {
        ...this.student,
        studentId: this.student.studentId,
        email: this.student.email,
        enrolledCourses: [...this.student.enrolledCourses]
      };
    }
    this.isEditing = !this.isEditing;
  }

  hasChanges(): boolean {
    if (!this.student || !this.editableStudent) return false;
    return this.student.name !== this.editableStudent.name ||
           this.student.department !== this.editableStudent.department;
  }

  saveChanges(): void {
    if (!this.editableStudent || !this.hasChanges()) return;

    this.studentService.updateStudent(this.editableStudent).subscribe({
      next: (updated) => {
        this.student = updated;
        this.studentService.loadStudent(); // Refresh state
        this.editableStudent = null;
        this.isEditing = false;
      },
      error: (err) => console.error('Error saving student:', err)
    });
  }
}
