import { Routes } from '@angular/router';

export const principalRoutes: Routes = [
  {
    path: 'principal-dashboard',
    loadComponent: () =>
      import('../component/principal-dashboard/principal-dashboard.component').then((m) => m.PrincipalDashboardComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../component/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'trainers',
    loadComponent: () =>
      import('../component/trainers/trainers.component').then((m) => m.TrainersComponent),
  },
  {
    path: 'list/:id',
    loadComponent: () =>
      import('../component/list/list.component').then((m) => m.ListComponent),
  },
  {
    path: 'approval-list',
    loadComponent: () =>
      import('../component/approval-list/approval-list.component').then((m) => m.ApprovalListComponent),
  },
  {
    path: 'edit-instructor/:id',
    loadComponent: () =>
      import('../component/edit-instructor/edit-instructor.component').then((m) => m.EditInstructorComponent),
  },
  {
    path: 'student-data',
    loadComponent: () =>
      import('../component/student-data/student-data.component').then((m) => m.StudentDataComponent),
  },
  {
    path: 'course',
    loadComponent: () =>
      import('../component/course/course.component').then((m) => m.CourseComponent),
  },
];
