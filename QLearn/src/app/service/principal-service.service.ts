import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrincipalServiceService {

  constructor(private http:HttpClient) { }

/*   ApiUrl = 'http://localhost:3700/api/dashboard/metrics'; */
ApiUrl = 'https://backend-0x10.onrender.com/api/dashboard/metrics'; 

loginUrl = 'http://localhost:3700/api/login';  /* https://backend-0x10.onrender.com/ */

loginGetUrl = 'http://localhost:3700/api/users';   /* http://localhost:3700/api/users */
insUrl = 'http://localhost:3700/api/instructors';
 private baseUrl = 'http://localhost:3700/api/courses';
  private studentUrl = 'http://localhost:3700/api/students'

  getAll(){
    return this.http.get(this.ApiUrl);
  }
   
  login(data:any){
    return this.http.post(this.loginUrl, data);
  }
  getLoginData(){
    return this.http.get(this.loginGetUrl);
  }
  getInstructor(){
    return this.http.get(this.insUrl)
  }
  /* all course */
    getCourses() {
    return this.http.get<any[]>(this.baseUrl);
  }

  getCourse(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addCourse(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  updateCourse(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteCourse(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  /* student details */
  getStudents(){
    return this.http.get(this.studentUrl);
  }
  getInstructorById(id: string): Observable<any> {
  return this.http.get(`http://localhost:3700/api/instructors/${id}`);
}
  /* instructor */
 // instructor.service.ts
updateInstructor(id: string, data: any): Observable<any> {
  return this.http.put(`http://localhost:3700/api/instructors/${id}`, data);
}

deleteInstructor(id: string): Observable<any> {
  return this.http.delete(`http://localhost:3700/api/instructors/${id}`);
}

createInstructor(instructor: any) {
  return this.http.post('/api/instructors', instructor);
}


}