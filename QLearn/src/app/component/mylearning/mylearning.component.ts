import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Course } from '../../model/course.model';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/courses.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, FormsModule],
  templateUrl: './mylearning.component.html',
  styleUrls: ['./mylearning.component.css']
})
export class MyLearningComponent implements OnInit {
  // 📦 Enrolled course objects to be displayed
  enrolledCourses: Course[] = [];

  // 📦 All courses fetched (not used in current filtering logic)
  courses: Course[] = [];

  // 🔎 Search term from input
  searchTerm: string = '';

  // 🎯 Selected department for filtering
  selectedDepartment: string = 'All';

  // 🎓 List of enrolled course codes
  enrolledCourseCodes: string[] = [];

  // 📚 Available department options
  departments: string[] = ['All'];

  // 🚀 Dependency injections using Angular's inject() function
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  ngOnInit(): void {
    // 🔄 Fetch all enrolled course codes of the student
    this.studentService.getEnrolledCourses().subscribe({
      next: (courseCodes) => {
        if (!courseCodes || courseCodes.length === 0) return;

        this.enrolledCourseCodes = courseCodes;

        // 🧠 For each course code, get course details
        courseCodes.forEach(code => {
          this.courseService.getCourseByCode(code).subscribe({
            next: (course) => {
              this.enrolledCourses.push(course);

              // 📌 Track departments for filtering
              if (!this.departments.includes(course.department)) {
                this.departments.push(course.department);
              }
            },
            error: (err) => {
              console.error(`❌ Error fetching course (${code}):`, err);
            }
          });
        });
      },
      error: (err) => {
        console.error('❌ Error loading enrolled courses:', err);
      }
    });
  }

  // 🧹 Filter course list based on search & department
  search(): void {
    // 🔁 Not used directly in template due to `*ngFor="let course of enrolledCourses"`
    // But can be adapted if you move filtering logic to show only `filteredCourses`
    // For now, this function triggers change detection on bound variables
  }

  // 🔓 Unenroll from a course with confirmation
  confirmUnenroll(courseCode: string): void {
    const confirmed = window.confirm('Are you sure you want to unenroll from this course?');
    if (!confirmed) return;

    this.studentService.unenrollCourse(courseCode).subscribe({
      next: () => {
        // 🗑️ Remove from local arrays
        this.enrolledCourses = this.enrolledCourses.filter(course => course.courseCode !== courseCode);
        this.enrolledCourseCodes = this.enrolledCourseCodes.filter(code => code !== courseCode);

        // 🔄 Update backend-stored enrolled courses (optional, for consistency)
        this.studentService.updateStudentEnrolledCourses(this.enrolledCourseCodes);

        alert('✅ Unenrolled successfully!');
      },
      error: (err) => {
        console.error('❌ Unenrollment failed:', err);
        alert('Something went wrong while unenrolling.');
      }
    });
  }

  // ⏪ Navigate back to the main course catalog
  goToCourses(): void {
    this.router.navigate(['/courses']);
  }

  // 🧠 Apply local filtering — not used right now
  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();

    this.enrolledCourses = this.enrolledCourses.filter(course => {
      const matchesSearch = course.courseName.toLowerCase().includes(search) ||
        course.department.toLowerCase().includes(search);
      const matchesDepartment = this.selectedDepartment === 'All' ||
        course.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }
}
