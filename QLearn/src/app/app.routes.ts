import { Routes } from '@angular/router';
import { CoursesComponent } from './student/component/courses/courses.component';
import { CourseDetailComponent } from './student/component/course-detail/course-detail.component';
import { MyLearningComponent } from './student/component/mylearning/mylearning.component';
import { CourseModuleComponent } from './student/component/coursemodule/coursemodule.component';
import { DashboardComponent } from './student/component/dashboard/dashboard.component';
import { StudentDetailComponent } from './student/component/student-detail/student-detail.component';


export const routes: Routes = [
  { path: 'student/courses', component: CoursesComponent },
  { path: 'student/courses/:id', component: CourseDetailComponent },
  { path: 'student/mylearning', component: MyLearningComponent },
  { path: 'student/my-learning/:id', component: CourseModuleComponent},
  { path: 'student/dashboard', component: DashboardComponent},
  { path: 'student/student-detail', component: StudentDetailComponent},
  {path:'',component: DashboardComponent}
];
