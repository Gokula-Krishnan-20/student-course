import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../model/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/courses'; // updated to match backend routes

  constructor(private http: HttpClient) {}

  // ✅ Get all courses
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseByCode(code: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/code/${code}`);
  }
  
  getPaginatedCourses(page: number, limit: number = 10): Observable<Course[]> {
  return this.http.get<Course[]>(`${this.apiUrl}/paginated?page=${page}&limit=${limit}`);
  }

  // ✅ Get modules by course code
  getCourseModules(code: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/code/${code}/modules`);
  }
}
