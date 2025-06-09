import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/courses.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { CourseModule } from '../../model/module.model';

@Component({
  selector: 'app-course-module',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, CommonModule],
  templateUrl: './coursemodule.component.html',
  styleUrls: ['./coursemodule.component.css']
})
export class CourseModuleComponent implements OnInit {
  courseId!: string;
  currentIndex = 0;
  pdfsrc = '/assets/dummy.pdf';
  studentId:string="STU001";
  modules: CourseModule[] = [];
currentModule!: CourseModule;
completed: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.courseId = this.route.snapshot.paramMap.get('id')!;
  const studentId = this.studentId;

  this.studentService.getEnrolledCourseModulesByCourse(studentId, this.courseId)
    .subscribe(response => {
      this.modules = response.modules || [];
      if (this.modules.length > 0) {
        this.setCurrentModule(0);
      }
    }, error => {
      console.error('Failed to load modules:', error);
    });
}


  setCurrentModule(index: number) {
  this.currentIndex = index;
  this.currentModule = this.modules[index];
  this.pdfsrc = '/assets/dummy.pdf';  // always dummy PDF, no dynamic PDF URL
}

  onNext() {
  if (this.currentIndex < this.modules.length - 1) {
    this.setCurrentModule(this.currentIndex + 1);
  } else {
    this.completed = true; // Show congrats message
    setTimeout(() => {
      this.router.navigate(['student/mylearning']);
    }, 3000); // Navigate after 3 seconds
  }
}


  isLastModule(): boolean {
    return this.currentIndex === this.modules.length - 1;
  }
}
