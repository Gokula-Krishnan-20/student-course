import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../model/student.model';
import { Course } from '../model/course.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private studentSubject = new BehaviorSubject<Student | null>(null);
  private apiUrl = 'http://localhost:3000/api/students';

  constructor(private http: HttpClient) {}

  // 🔹 Load a student and store in BehaviorSubject
  loadStudent(studentId: string): void {
    this.http.get<Student>(`${this.apiUrl}/${studentId}`)
      .subscribe(student => this.studentSubject.next(student));
  }

  // 🔹 Get student as observable (optional static STU001 fallback)
  getStudent(): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/STU001`);
  }

  // 🔹 Get current student snapshot
  getStudentValue(): Student | null {
    return this.studentSubject.value;
  }

  // 🔹 Get enrolled courses
  getEnrolledCourses(studentId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${studentId}/enrolled-courses`);
  }

  // 🔹 Enroll in a course
 enrollCourse(studentId: string, courseCode: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/${studentId}/enroll/${courseCode}`, {});
}


  // 🔹 Unenroll from a course
  unenrollCourse(studentId: string, courseCode: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${studentId}/unenroll/${courseCode}`);
  }

  // 🔹 Update student details
  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${student.studentId}`, student);
  }

  // 🔹 Reactive student observable
  getCurrentStudent(): Observable<Student> {
    return this.studentSubject.asObservable() as Observable<Student>;
  }

  // 🔹 Clear student on logout
  logout(): void {
    this.studentSubject.next(null);
  }

  // 🔹 Update local enrolled courses (for frontend only)
  updateStudentEnrolledCourses(updatedCourseIds: string[]): void {
    const student = this.studentSubject.value;
    if (student) {
      const updatedStudent = { ...student, enrolledCourses: updatedCourseIds };
      this.studentSubject.next(updatedStudent);
    }
  }
  getStudentIdFromLocalStorage(): string | null {
  return localStorage.getItem('username');
}
}
