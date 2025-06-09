import { Component, OnInit } from '@angular/core';
import { Course } from '../../model/course.model';
import { CourseService } from '../../services/courses.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  standalone:true,
  imports: [FormsModule, RouterLink,RouterModule,CommonModule],
  providers: [CourseService, StudentService],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';
  selectedDepartment: string = 'All';
  minRating: number = 0;  // optional, use if rating data available
  enrolledCourseIds: string[] = [];

  departments: string[] = ['All', 'Computer Science', 'Business', 'Engineering'];

  constructor(
    private courseService: CourseService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load student enrolled courses first
    const student = this.studentService.getStudentValue();
    if (student) {
      this.enrolledCourseIds = student.enrolledCourses || [];
    }
    // Load all courses from service
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
      const matchesSearch =
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.department.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDepartment =
        this.selectedDepartment === 'All' || course.department === this.selectedDepartment;
      // If rating exists on course, use this line; else remove it
      // const matchesRating = this.minRating === 0 || (course.rating && course.rating >= this.minRating);
      return matchesSearch && matchesDepartment 
    });
  }

  isEnrolled(courseId: string): boolean {
    return this.enrolledCourseIds.includes(courseId);
  }

  confirmEnroll(courseId: string): void {
  if (this.isEnrolled(courseId)) return;

  const confirmed = window.confirm("Are you sure you want to enroll in this course?");
  console.log('User confirmed?', confirmed);
  if (confirmed) {
    // const student = this.studentService.getStudentValue();
    // if (student) {
      this.studentService.enrollCourse('STU001', courseId).subscribe({
        next: (res) => {
  console.log('Enrollment response:', res);  // ✅ Add this
  if (res && res.enrolledCourses) {
    this.studentService.updateStudentEnrolledCourses(res.enrolledCourses);
    this.enrolledCourseIds = res.enrolledCourses;
    alert('Enrolled successfully!');
  } else {
    alert('Enrollment response is invalid.');
  }
},
        error: (err) => {
          console.error('Enrollment failed:', err);
          alert('Something went wrong while enrolling.');
        }
      });
    // }
    // else{
      // console.log("no student")
    // }
  }
  
}

  viewCourse(courseId: string): void {
    this.router.navigate(['/courses', courseId]);
  }
}
