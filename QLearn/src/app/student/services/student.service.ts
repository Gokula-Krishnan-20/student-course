import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Student } from '../model/student.model';
import { Course } from '../model/course.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private studentSubject = new BehaviorSubject<Student | null>(null);
  private apiUrl = 'http://localhost:3000/api/students';

  constructor(private http: HttpClient) {}

  // Load a student by ID and update BehaviorSubject
  loadStudent(studentId: string): void {
    this.http.get<Student>(`${this.apiUrl}/${studentId}`)
      .subscribe(student => this.studentSubject.next(student));
  }

  // Observable for student data
  getStudent(): Observable<Student> {
  return this.http.get<Student>(`http://localhost:3000/api/students/STU001`);
}

  // Current student value snapshot
  getStudentValue(): Student | null {
    return this.studentSubject.value;
  }

  // Get enrolled courses with full details
  // Backend returns: { enrolledCourses: Course[] }
  getEnrolledCourses(studentId: string): Observable<Course[]> {
    // Need to extract 'enrolledCourses' from response
    return this.http.get<{ enrolledCourses: Course[] }>(`${this.apiUrl}/${studentId}/enrolled-courses`)
      .pipe(
        map((response: { enrolledCourses: Course[] }) => response.enrolledCourses)
      );
  }

  // Get progress info for a course with course info
  getProgress(studentId: string, courseId: string): Observable<{ progress: any; course: Course }> {
    return this.http.get<{ progress: any; course: Course }>(`${this.apiUrl}/${studentId}/progress/${courseId}`);
  }

  // Update progress for a course
  updateProgress(studentId: string, courseId: string, completedModules: string[]): Observable<any> {
    const lastAccessed = new Date().toISOString();
    return this.http.put(`${this.apiUrl}/${studentId}/progress`, { courseId, completedModules, lastAccessed });
  }

  // Enroll student in a course
  enrollCourse(studentId: string, courseId: string): Observable<{ enrolledCourses: string[] }> {
    return this.http.put<{ enrolledCourses: string[] }>(`${this.apiUrl}/${studentId}/enroll`, { courseId });
  }

  // Mark a module as completed (PATCH)
  updateModuleCompletion(studentId: string, courseId: string, moduleId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${studentId}/courses/${courseId}/modules/${moduleId}/completion`, {}
    );
  }

  // Update student profile/details
  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${student.studentId}`, student);
  }

  // Get enrolled course full details (array of courses)
  getEnrolledCourseDetails(studentId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/${studentId}/enrolled-courses/details`);
  }

  // Get progress only for a course (returns progress object)
  getProgressByCourse(studentId: string, courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${studentId}/progress/${courseId}`);
  }

  // Get all modules of a specific enrolled course
  getEnrolledCourseModulesByCourse(studentId: string, courseId: string): Observable<{ courseId: string; courseName: string; modules: any[] }> {
    return this.http.get<{ courseId: string; courseName: string; modules: any[] }>(`${this.apiUrl}/${studentId}/enrolled-courses/${courseId}/modules`);
  }

  // Update the local studentSubject's enrolledCourses array
  updateStudentEnrolledCourses(updatedCourseIds: string[]): void {
    const student = this.studentSubject.value;
    if (student) {
      const updatedStudent = { ...student, enrolledCourses: updatedCourseIds };
      this.studentSubject.next(updatedStudent);
    }
  }

  // Clear student data on logout
  logout(): void {
    this.studentSubject.next(null);
  }

  // Observable for current student
  getCurrentStudent(): Observable<Student> {
    return this.studentSubject.asObservable() as Observable<Student>;
  }

  // Calculate course completion percentage from modules
  getCourseCompletionPercentage(course: Course): number {
    if (!course.modules || course.modules.length === 0) return 0;
    const completedModules = course.modules.filter(m => (m as any).completed).length;
    return Math.round((completedModules / course.modules.length) * 100);
  }
}
