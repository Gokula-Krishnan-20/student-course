import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Course } from '../../model/course.model';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/courses.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, FormsModule],
  templateUrl: './mylearning.component.html',
  styleUrls: ['./mylearning.component.css']
})
export class MyLearningComponent implements OnInit {
  enrolledCourses: Course[] = [];
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  selectedDepartment: string = 'All';
  enrolledCourseCodes: string[] = [];
  departments: string[] = ['All'];

  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  ngOnInit(): void {
    this.studentService.getEnrolledCourses().subscribe({
      next: (courseCodes) => {
        if (!courseCodes || courseCodes.length === 0) return;

        // Fetch each course by courseCode
        courseCodes.forEach(code => {
          this.courseService.getCourseByCode(code).subscribe({
            next: (course) => {
              this.enrolledCourses.push(course);
            },
            error: (err) => {
              console.error(`Error fetching course ${code}`, err);
            }
          });
        });
      },
      error: (err) => {
        console.error('Error loading enrolled courses', err);
      }
    });
  }

  confirmUnenroll(courseCode: string): void {
  const confirmed = window.confirm('Are you sure you want to unenroll from this course?');
  if (!confirmed) return;

  this.studentService.unenrollCourse(courseCode).subscribe({
    next: (res) => {
      // Remove from local enrolledCourses array
      this.enrolledCourses = this.enrolledCourses.filter(course => course.courseCode !== courseCode);

      // Also update the enrolledCourseCodes array
      this.enrolledCourseCodes = this.enrolledCourseCodes.filter(code => code !== courseCode);
      this.studentService.updateStudentEnrolledCourses(this.enrolledCourseCodes);

      alert('✅ Unenrolled successfully!');
    },
    error: (err) => {
      console.error('Unenrollment failed:', err);
      alert('Something went wrong while unenrolling.');
    }
  });
}


search(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = course.courseName.toLowerCase().includes(search) || course.department.toLowerCase().includes(search);
      const matchesDepartment = this.selectedDepartment === 'All' || course.department === this.selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }


  goToCourses(): void {
    this.router.navigate(['/courses']);
  }
}
