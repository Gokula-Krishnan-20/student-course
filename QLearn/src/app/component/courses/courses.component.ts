import { Component, OnInit, HostListener } from '@angular/core';
import { Course } from '../../model/course.model';
import { CourseService } from '../../services/courses.service';
import { Router, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, NavbarComponent],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  selectedDepartment: string = 'All';
  enrolledCourseCodes: string[] = [];
  departments: string[] = ['All'];

  // 🔄 Infinite Scroll
  page: number = 1;
  limit: number = 6;
  loadingMore: boolean = false;
  allLoaded: boolean = false;

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentService.loadStudent();

    this.studentService.getCurrentStudent().subscribe({
      next: (student) => {
        this.enrolledCourseCodes = student?.enrolledCourses || [];
      },
      error: (err) => {
        console.error('Error fetching student:', err);
      },
    });

    this.loadMoreCourses();
  }

  search(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter((course) => {
      const matchesSearch =
        course.courseName.toLowerCase().includes(search) ||
        course.department.toLowerCase().includes(search);
      const matchesDepartment =
        this.selectedDepartment === 'All' ||
        course.department === this.selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }

  isEnrolled(courseCode: string): boolean {
    return this.enrolledCourseCodes.includes(courseCode);
  }

  confirmEnroll(courseCode: string): void {
    if (this.isEnrolled(courseCode)) return;

    const confirmed = window.confirm(
      'Are you sure you want to enroll in this course?'
    );
    if (!confirmed) return;

    this.studentService.enrollCourse(courseCode).subscribe({
      next: (res) => {
        if (res?.enrolledCourses) {
          this.enrolledCourseCodes = [
            ...this.enrolledCourseCodes,
            courseCode,
          ];
          this.studentService.updateStudentEnrolledCourses(
            this.enrolledCourseCodes
          );
          this.refreshCourses();
          alert('✅ Enrolled successfully!');
        } else {
          alert('⚠️ Enrollment response invalid.');
        }
      },
      error: (err) => {
        console.error('Enrollment failed:', err);
        const backendMessage =
          err?.error?.error || 'Something went wrong during enrollment.';
        let message = '⚠️ Enrollment failed.';
        switch (backendMessage) {
          case 'Enrollment limit reached. You can enroll in a maximum of 6 courses.':
            message = '🚫 You have reached the limit of 6 courses.';
            break;
          case 'Enrollment period closed':
            message = '📅 Enrollment period is closed.';
            break;
          case 'No seats available':
            message = '🚫 No seats left in this course.';
            break;
          case 'Already enrolled in this course':
            message = '✅ Already enrolled in this course.';
            break;
          case 'Student or Course not found':
            message = '❌ Student or course not found.';
            break;
          default:
            message = `⚠️ ${backendMessage}`;
        }
        alert(message);
      },
    });
  }

  confirmUnenroll(courseCode: string): void {
    const confirmed = window.confirm(
      'Are you sure you want to unenroll from this course?'
    );
    if (!confirmed) return;

    this.studentService.unenrollCourse(courseCode).subscribe({
      next: () => {
        this.enrolledCourseCodes = this.enrolledCourseCodes.filter(
          (code) => code !== courseCode
        );
        this.studentService.updateStudentEnrolledCourses(
          this.enrolledCourseCodes
        );
        this.refreshCourses();
        alert('Unenrolled successfully!');
      },
      error: (err) => {
        console.error('Unenrollment failed:', err);
        alert('Something went wrong while unenrolling.');
      },
    });
  }

  refreshCourses(): void {
    this.page = 1;
    this.courses = [];
    this.allLoaded = false;
    this.loadMoreCourses();
  }

  loadMoreCourses(): void {
    if (this.loadingMore || this.allLoaded) return;

    this.loadingMore = true;
    this.courseService
      .getPaginatedCourses(this.page, this.limit)
      .subscribe({
        next: (newCourses) => {
          if (newCourses.length === 0) {
            this.allLoaded = true;
          } else {
            this.courses = [...this.courses, ...newCourses];
            const deptSet = new Set(
              this.courses.map((c) => c.department)
            );
            this.departments = ['All', ...Array.from(deptSet).sort()];
            this.applyFilters();
            this.page++;
          }
          this.loadingMore = false;
        },
        error: (err) => {
          console.error('Error loading courses:', err);
          this.loadingMore = false;
        },
      });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      this.loadMoreCourses();
    }
  }

  viewCourse(courseCode: string): void {
    this.router.navigate(['/courses', courseCode]);
  }
}
