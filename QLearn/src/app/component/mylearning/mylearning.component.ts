import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Course } from '../../model/course.model';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/courses.service';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [CommonModule, NavbarComponent,RouterLink],
  templateUrl: './mylearning.component.html',
  styleUrls: ['./mylearning.component.css']
})
export class MyLearningComponent implements OnInit {
  enrolledCourses: Course[] = [];

  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  ngOnInit(): void {
  const studentId = this.studentService.getStudentIdFromLocalStorage();

  if (!studentId) {
    console.error('No student ID found in localStorage.');
    return;
  }

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
    this.router.navigate(['/my-learning', courseCode]);
  }

  goToCourses(): void {
    this.router.navigate(['/courses']);
  }
}
