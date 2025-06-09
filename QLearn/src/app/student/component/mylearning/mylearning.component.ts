import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Course } from '../../model/course.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mylearning.component.html',
  styleUrls: ['./mylearning.component.css']
})
export class MyLearningComponent implements OnInit {
  enrolledCourses: Course[] = [];

  private studentService = inject(StudentService);
  private router = inject(Router);

  ngOnInit(): void {
    const studentId = 'STU001'; // Temporary hardcoded
    this.studentService.getEnrolledCourseDetails(studentId).subscribe({
      next: (courses) => {
        this.enrolledCourses = courses;
      },
      error: (err) => {
        console.error('Error loading enrolled courses', err);
        this.enrolledCourses = [];
      }
    });
  }

  viewModules(courseId: string): void {
    this.router.navigate(['student/my-learning', courseId]);
  }

  getCompletedPercentage(course: Course): number {
    return this.studentService.getCourseCompletionPercentage(course);
  }

  goToCourses(): void {
    this.router.navigate(['student/courses']);
  }
}
