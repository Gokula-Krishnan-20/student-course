import { Routes } from '@angular/router';
import { CoursesComponent } from './student/component/courses/courses.component';
import { CourseDetailComponent } from './student/component/course-detail/course-detail.component';
import { MyLearningComponent } from './student/component/mylearning/mylearning.component';
import { StudentDetailComponent } from './student/component/student-detail/student-detail.component';


export const routes: Routes = [
  { path: 'student/courses', component: CoursesComponent },
  { path: 'student/courses/:id', component: CourseDetailComponent },
  { path: 'student/mylearning', component: MyLearningComponent },
  { path: 'student/student-detail', component: StudentDetailComponent}
];
