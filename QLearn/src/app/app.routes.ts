import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { PrincipalDashboardComponent } from './component/principal-dashboard/principal-dashboard.component';
import { ProfileComponent } from './component/profile/profile.component';
import { TrainersComponent } from './component/trainers/trainers.component';

import { ListComponent } from './component/list/list.component';
import { ApprovalListComponent } from './component/approval-list/approval-list.component';
import { MainPageComponent } from './component/main-page/main-page.component';
import { CoursesComponent } from './component/courses/courses.component';
import { CourseDetailComponent } from './component/course-detail/course-detail.component';
import { MyLearningComponent } from './component/mylearning/mylearning.component';
import { StudentDetailComponent } from './component/student-detail/student-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'main-page', component: MainPageComponent },
  { path: '', redirectTo: 'main-page', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'principal-dashboard',
    component: PrincipalDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
  data: { role: 'principal' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
  data: { role: 'principal' }
  },
  {
    path: 'trainers',
    component: TrainersComponent,
    canActivate: [AuthGuard, RoleGuard],
  data: { role: 'principal' }
  },
  {
    path: 'course',
    loadComponent: () =>
      import ('./component/course/course.component').then((c)=> 
      c.CourseComponent), 
    canActivate: [AuthGuard, RoleGuard],
  data: { role: 'principal' }
  },
  {
    path: 'list/:id',
    component: ListComponent,
    canActivate: [AuthGuard, RoleGuard],
  data: { role: 'principal' }
  },
  {
    path: 'approval-list',
    component: ApprovalListComponent,
    canActivate: [AuthGuard, RoleGuard],
  data: { role: 'principal' }
  },
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [AuthGuard, RoleGuard],
   data: { role: 'student' }
  },
  {
    path: 'courses/:id',
    component: CourseDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
  data: { role: 'student' }
  },
  {
    path: 'mylearning',
    component: MyLearningComponent,
    canActivate: [AuthGuard, RoleGuard],
  data: { role: 'student' }
  },
  {
    path: 'student-detail',
    component: StudentDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
  data: { role: 'student' }
  }
];
