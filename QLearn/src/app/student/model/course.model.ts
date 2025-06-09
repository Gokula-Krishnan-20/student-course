import { CourseModule } from './module.model';
import { Instructor } from './instructor.model';

export interface Course {
  _id?: string;
  title: string;
  code: string;
  description: string;
  department: string;
  semester: string;
  credits: number;
  level: string;
  prerequisites: string;
  instructor: Instructor;
  createdAt: string;
  modules: CourseModule[];
}
