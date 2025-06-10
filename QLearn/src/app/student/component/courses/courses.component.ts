import { Component, OnInit } from '@angular/core';
import { Course } from '../../model/course.model';
import { CourseService } from '../../services/courses.service';
import { Router, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [CourseService, StudentService],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  selectedDepartment: string = 'All';
  enrolledCourseCodes: string[] = [];

  departments: string[] = ['All', 'Computer Science', 'Business', 'Engineering'];

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.studentService.getStudent().subscribe(student => {
    this.enrolledCourseCodes = student.enrolledCourses || [];
  });

  this.courseService.getAllCourses().subscribe({
    next: (courses) => {
      this.courses = courses;
      this.applyFilters();
    },
    error: (err) => {
      console.error('Error loading courses:', err);
      this.courses = [];
      this.filteredCourses = [];
    }
  });
}

  search(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course => {
      const search = this.searchTerm.toLowerCase();
      const matchesSearch =
        course.courseName.toLowerCase().includes(search) ||
        course.department.toLowerCase().includes(search);

      const matchesDepartment =
        this.selectedDepartment === 'All' || course.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }

  isEnrolled(courseCode: string): boolean {
    return this.enrolledCourseCodes.includes(courseCode);
  }

  confirmEnroll(courseCode: string): void {
  if (this.isEnrolled(courseCode)) return;

  const confirmed = window.confirm('Are you sure you want to enroll in this course?');
  if (confirmed) {
    const studentId = 'STU001';

    this.studentService.enrollCourse(studentId, courseCode).subscribe({
      next: (res) => {
        if (res && res.message === 'Enrollment successful') {
          // Immutable update so Angular detects change
          this.enrolledCourseCodes = [...this.enrolledCourseCodes, courseCode];
          this.studentService.updateStudentEnrolledCourses(this.enrolledCourseCodes);
          alert('Enrolled successfully!');
        } else {
          alert('Enrollment response invalid.');
        }
      },
      error: (err) => {
        console.error('Enrollment failed:', err);
        alert('Something went wrong while enrolling.');
      }
    });
  }
}


confirmUnenroll(courseCode: string): void {
  const confirmed = window.confirm('Are you sure you want to unenroll from this course?');
  if (confirmed) {
    const studentId = 'STU001';

    this.studentService.unenrollCourse(studentId, courseCode).subscribe({
      next: (res) => {
        // Immutable update
        this.enrolledCourseCodes = this.enrolledCourseCodes.filter(code => code !== courseCode);
        this.studentService.updateStudentEnrolledCourses(this.enrolledCourseCodes);
        alert('Unenrolled successfully!');
      },
      error: (err) => {
        console.error('Unenrollment failed:', err);
        alert('Something went wrong while unenrolling.');
      }
    });
  }
}



  viewCourse(courseCode: string): void {
    this.router.navigate(['/courses', courseCode]);
  }
}
