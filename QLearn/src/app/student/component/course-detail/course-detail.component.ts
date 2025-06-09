import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/courses.service';
import { CommonModule } from '@angular/common';
import { Course } from '../../model/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  courseCode!: string;
  course: Course | null = null;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseCode = this.route.snapshot.paramMap.get('id')!; // assuming route param is named 'id'
    this.courseService.getCourseByCode(this.courseCode).subscribe({
      next: (course) => {
        this.course = course;
      },
      error: (err) => {
        console.error('Error fetching course:', err);
        this.course = null;
      }
    });
  }

  goToCoursePage(): void {
    this.router.navigate(['/student/courses']); // or '/courses' based on your routing setup
  }
}
