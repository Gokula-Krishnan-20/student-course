export interface Progress {
  courseId: string;
  completedModules: string[];
  lastAccessed: string;
}

export interface Student {
  _id?: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  phone: string;
  enrolledCourses: string[]; // Array of course codes
  progress: Progress[];
}
