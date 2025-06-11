export interface Student {
  name: string;
  studentId: string;
  department: string;
  email: string;
  enrolledCourses?: string[]; // Optional field
}
