import { Routes } from '@angular/router';

export const studentRoutes: Routes = [
  {
    path: 'courses',
    loadComponent: () =>
      import('../component/courses/courses.component').then((m) => m.CoursesComponent),
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('../component/course-detail/course-detail.component').then((m) => m.CourseDetailComponent),
  },
  {
    path: 'mylearning',
    loadComponent: () =>
      import('../component/mylearning/mylearning.component').then((m) => m.MyLearningComponent),
  },
  {
    path: 'student-detail',
    loadComponent: () =>
      import('../component/student-detail/student-detail.component').then((m) => m.StudentDetailComponent),
  },
];
