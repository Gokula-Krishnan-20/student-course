/* import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalListComponent } from '../approval-list/approval-list.component';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, RouterOutlet, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent {
  courseForm!: FormGroup;
  isEditMode = false;
  courseId: string | null = null;
  courses: any;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private service: PrincipalServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
roles:any
  ngOnInit(): void {

     this.roles = localStorage.getItem('role');
  console.log('User Role:', this.roles);
  
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      department: ['', Validators.required],
      instructor: ['', Validators.required],
      modules: this.fb.array([]),  // Replace material with modules
      category: [''],
      duration: [''],
      rating: ['']
    });

    this.loadCourses();

    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.isEditMode = true;
      this.service.getCourse(this.courseId).subscribe(data => {
        this.courseForm.patchValue(data);
        if (data.modules && Array.isArray(data.modules)) {
          this.setModules(data.modules);
        }
      }, err => {
        console.error('Error loading course:', err);
      });
    }
  }

  get modules(): FormArray {
    return this.courseForm.get('modules') as FormArray;
  }

  setModules(modules: any[]) {
    const moduleFGs = modules.map(module => this.fb.group({
      title: [module.title, Validators.required],
      description: [module.description, Validators.required]
    }));
    const moduleFormArray = this.fb.array(moduleFGs);
    this.courseForm.setControl('modules', moduleFormArray);
  }

  addModule() {
    this.modules.push(this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    }));
  }

  removeModule(index: number) {
    this.modules.removeAt(index);
  }

  loadCourses(): void {
    this.service.getCourses().subscribe(data => {
      this.courses = data;
    }, err => {
      console.error('Error fetching courses:', err);
    });
  }

  onSubmit(): void {
    if (this.isEditMode && this.courseId) {
      this.service.updateCourse(this.courseId, this.courseForm.value).subscribe(() => {
        alert('Course updated successfully');
        this.loadCourses();
      }, err => {
        console.error('Error updating course:', err);
      });
    } else {
      this.service.addCourse(this.courseForm.value).subscribe(() => {
        alert('Course added successfully');
        this.loadCourses();
        this.courseForm.reset();
        this.modules.clear();  // reset modules as well
      }, err => {
        console.error('Error adding course:', err);
      });
    }
  }

  deleteCourse(id: string): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.service.deleteCourse(id).subscribe(() => {
        alert('Course deleted successfully');
        this.loadCourses();
      }, err => {
        console.error('Error deleting course:', err);
      });
    }
  }

  openDialog() {
    this.dialog.open(ApprovalListComponent, {
      width: '570px',
      height: '630px',
         position: { top: '100px' },
    });
  }
  
}
 */import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NavAdminComponent } from "../nav-admin/nav-admin.component";

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

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    CommonModule,
    NavAdminComponent
],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  displayedColumns: string[] = [
    'courseName',
    'courseCode',
    'department',
    'instructorId',
    'enrollStart',
    'enrollEnd',
    'actions'
  ];

  dataSource = new MatTableDataSource<Course>([]);
  filterValue = '';
  minDate: string = new Date().toISOString().split('T')[0];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private svc: PrincipalServiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
roles:any;
  ngOnInit() {
      this.roles = localStorage.getItem('role');
  console.log('User Role:', this.roles);
    this.loadCourses();
  }

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

  applyFilter() {
    const filter = this.filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (d, f) =>
      d.courseName.toLowerCase().includes(f) ||
      d.department.toLowerCase().includes(f) ||
      d.instructorId.toLowerCase().includes(f);

    this.dataSource.filter = filter;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

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

  startEdit(row: Course) {
    row._editing = true;
  }

  cancelEdit(row: Course) {
    if (row._new) {
      this.dataSource.data = this.dataSource.data.filter(r => r !== row);
    } else {
      this.loadCourses();
    }
  }

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
}
