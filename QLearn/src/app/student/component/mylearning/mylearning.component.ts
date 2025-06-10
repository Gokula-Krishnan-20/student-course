import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Course } from '../../model/course.model';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/courses.service';

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
  private courseService = inject(CourseService);
  private router = inject(Router);

  ngOnInit(): void {
    const studentId = 'STU001'; // 🔒 Replace with dynamic value later

    this.studentService.getEnrolledCourses(studentId).subscribe({
      next: (courseCodes) => {
        courseCodes.forEach(code => {
          this.courseService.getCourseByCode(code).subscribe({
            next: (course) => this.enrolledCourses.push(course),
            error: (err) => console.error(`Error fetching course ${code}`, err)
          });
        });
      },
      error: (err) => {
        console.error('Error loading enrolled courses', err);
      }
    });
  }

  viewModules(courseCode: string): void {
    this.router.navigate(['student/my-learning', courseCode]);
  }

  goToCourses(): void {
    this.router.navigate(['student/courses']);
  }
}
