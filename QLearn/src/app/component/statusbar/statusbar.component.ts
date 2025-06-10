import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/courses.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './statusbar.component.html',
  styleUrls: ['./statusbar.component.css'],
  standalone: true
})
export class StatusBarComponent implements OnChanges {
  @Input() courseId!: string;
  @Input() totalModules: number = 1;

  completedModules: number = 0;

  constructor(
    private studentService: StudentService,
    private courseService: CourseService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseId'] && this.courseId) {
      this.loadProgress();
    }
  }

  private loadProgress() {
    // Assuming you have some way to get current logged-in studentId
    const student = this.studentService.getStudentValue();
    if (!student) {
      this.completedModules = 0;
      return;
    }

    this.studentService.getProgress(student.studentId, this.courseId).subscribe({
      next: (progress: any) => {
        this.completedModules = progress.completedModules.length || 0;
      },
      error: () => {
        this.completedModules = 0;
      }
    });
  }

  get completionPercent(): number {
    return this.totalModules === 0
      ? 0
      : Math.round((this.completedModules / this.totalModules) * 100);
  }

  get statusText(): string {
    return this.completionPercent === 100
      ? 'Completed'
      : `${this.completionPercent}% Completed`;
  }
}
