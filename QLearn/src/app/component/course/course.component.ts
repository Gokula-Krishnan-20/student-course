
 
// Angular and Material imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
 
import { FormsModule } from '@angular/forms';
import { NavAdminComponent } from "../nav-admin/nav-admin.component";
 
 
// Interface for a Course object
interface Course {
  _id?: string;
  courseName: string;
  courseCode: string;
  courseDescription: string;
  department: string;
  instructorId: string;
  numberOfSeats: number;
  modules: { title: string; description: string }[];
  enrollStart?: Date | null;
  enrollEnd?: Date | null;
  _new?: boolean;
  _editing?: boolean;
}
 
// Component Declaration
@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    CommonModule,
    MatSelectModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NavAdminComponent
],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  // Columns displayed in the course table
  displayedColumns: string[] = [
    'courseName',
    'courseCode',
    'department',
    'instructorId',
    'enrollStart',
    'enrollEnd',
    'actions'
  ];
 
  // Data source for the Material table
  dataSource = new MatTableDataSource<Course>([]);
 
  // Value used for filtering the course list
  filterValue = '';
 
  // Minimum selectable date (used to restrict past dates in datepicker)
  minDate: string = new Date().toISOString().split('T')[0];
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(
    private svc: PrincipalServiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }
 
  roles: any;
  instructors: any[] = [];
 
  // 🔹 Called when component initializes — loads user role, instructors, and course data
  ngOnInit() {
    this.roles = localStorage.getItem('role');
    console.log('User Role:', this.roles);
    this.loadCourses();
    this.svc.getInstructor().subscribe((data: any) => {
      this.instructors = data;
      console.log(this.instructors);
    });
  }
 
  // 🔹 Fetch all courses from the server and initialize the table data
  loadCourses() {
    this.svc.getCourses().subscribe(data => {
      this.dataSource.data = data.map(c => ({
        ...c,
        enrollStart: c.enrollPeriod?.startDate ? new Date(c.enrollPeriod.startDate) : null,
        enrollEnd: c.enrollPeriod?.endDate ? new Date(c.enrollPeriod.endDate) : null
      }));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
 
  // 🔹 Apply text filter to the course list based on name, department, or instructor
  applyFilter() {
    const filter = this.filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (d, f) =>
      d.courseName.toLowerCase().includes(f) ||
      d.department.toLowerCase().includes(f) ||
      d.instructorId.toLowerCase().includes(f);
 
    this.dataSource.filter = filter;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
 
  // 🔹 Create a new blank course row for user to fill in
  createNew() {
    const empty: Course = {
      courseName: '',
      courseCode: '',
      courseDescription: '',
      department: '',
      instructorId: '',
      numberOfSeats: 0,
      modules: [],
      enrollStart: null,
      enrollEnd: null,
      _new: true,
      _editing: true
    };
    this.dataSource.data = [empty, ...this.dataSource.data];
  }
 
  // 🔹 Enable edit mode for a specific course row
  startEdit(row: Course) {
    row._editing = true;
  }
 
  // 🔹 Cancel the edit operation — either remove or reload data
  cancelEdit(row: Course) {
    if (row._new) {
      this.dataSource.data = this.dataSource.data.filter(r => r !== row);
    } else {
      this.loadCourses();
    }
  }
 
  // 🔹 Validate that the enrollment dates are logical and follow required rules
  validateEnrollmentDates(start: Date | null, end: Date | null): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
 
    if (!start || !end) {
      this.snackBar.open('Both start and end dates are required.', 'Close', { duration: 3000 });
      return false;
    }
 
    const startDate = new Date(start);
    const endDate = new Date(end);
 
    if (startDate < today) {
      this.snackBar.open('Start date cannot be in the past.', 'Close', { duration: 3000 });
      return false;
    }
 
    if (endDate <= startDate) {
      this.snackBar.open('End date must be after the start date.', 'Close', { duration: 3000 });
      return false;
    }
 
    const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    if (diffInDays < 4) {
      this.snackBar.open('Gap between start and end must be at least 4 days.', 'Close', { duration: 3000 });
      return false;
    }
 
    return true;
  }
 
  // 🔹 Save changes to a course (new or edited)
  saveEdit(row: Course) {
    if (!this.validateEnrollmentDates(row.enrollStart ?? null, row.enrollEnd ?? null)) return;
 
    const payload = {
      ...row,
      enrollPeriod: { startDate: row.enrollStart, endDate: row.enrollEnd }
    };
 
    if (row._new) {
      this.svc.addCourse(payload).subscribe({
        next: () => {
          this.loadCourses();
          this.snackBar.open('Course added successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
        error: () => {
          this.snackBar.open('Failed to add course.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      this.svc.updateCourse(row._id!, payload).subscribe(() => {
        this.loadCourses();
        this.snackBar.open('Course updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      });
    }
  }
 
  // 🔹 Open dialog to add modules for a course before saving
  addNewRow(row: Course) {
    if (!this.validateEnrollmentDates(row.enrollStart ?? null, row.enrollEnd ?? null)) return;
 
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { type: 'modules', modules: [], viewOnly: false },
      width: '600px'
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const payload = {
          ...row,
          modules: result,
          enrollPeriod: {
            startDate: row.enrollStart,
            endDate: row.enrollEnd
          }
        };
        this.svc.addCourse(payload).subscribe({
          next: () => {
            this.loadCourses();
            this.snackBar.open('Course added successfully!', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          },
          error: () => {
            this.snackBar.open('Failed to add course.', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    });
  }
 
  // 🔹 Confirm and delete a course after user confirmation
  confirmDelete(row: Course) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { type: 'delete', course: row },
      width: '300px'
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.svc.deleteCourse(row._id!).subscribe(() => {
          this.loadCourses();
          this.snackBar.open('Course deleted successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        });
      }
    });
  }
 
  // 🔹 View the list of modules associated with a course (read-only)
  viewModules(row: Course) {
    this.dialog.open(DialogComponent, {
      data: {
        type: 'modules',
        modules: row.modules,
        viewOnly: true
      },
      width: '600px'
    });
  }
 
  // 🔹 Display instructor name alongside instructor ID in the UI
  getInstructorName(course: Course): string {
    const instructor = this.instructors.find(i => i.instructorId === course.instructorId);
    return instructor ? `${instructor.instructorId} - ${instructor.name}` : '';
  }
 
  // 🔹 Utility to check if a field has only symbols or numbers (used for validation)
  hasOnlySymbolsOrNumbers(value: string): boolean {
    return !/[a-zA-Z]/.test(value);
  }
}